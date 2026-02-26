import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI, { APIUserAbortError } from 'openai';
import {
  ChatCompletionMessageParam,
  ChatCompletionContentPart,
} from 'openai/resources/chat/completions';
import {
  MessageContentBlock,
  MessageContentType,
  TextContentBlock,
  ToolUseContentBlock,
  ToolResultContentBlock,
  ImageContentBlock,
  isUserActionContentBlock,
  isComputerToolUseContentBlock,
  isImageContentBlock,
  ThinkingContentBlock,
} from '@bytebot/shared';
import { Message, Role } from '@prisma/client';
import { proxyTools } from './proxy.tools';
import {
  BytebotAgentService,
  BytebotAgentInterrupt,
  BytebotAgentResponse,
} from '../agent/agent.types';

@Injectable()
export class ProxyService implements BytebotAgentService {
  private readonly openai: OpenAI;
  private readonly logger = new Logger(ProxyService.name);

  constructor(private readonly configService: ConfigService) {
    const proxyUrl = this.configService.get<string>('BYTEBOT_LLM_PROXY_URL');

    if (!proxyUrl) {
      this.logger.warn(
        'BYTEBOT_LLM_PROXY_URL is not set. ProxyService will not work properly.',
      );
    }

    // Initialize OpenAI client with proxy configuration
    // Ensure the baseURL ends with /v1 as expected by LiteLLM and OpenAI SDK
    const baseURL = proxyUrl?.endsWith('/v1')
      ? proxyUrl
      : `${proxyUrl}/v1`;

    this.openai = new OpenAI({
      apiKey: 'dummy-key-for-proxy',
      baseURL,
    });
  }

  /**
   * Main method to generate messages using the Chat Completions API
   */
  async generateMessage(
    systemPrompt: string,
    messages: Message[],
    model: string,
    useTools: boolean = true,
    signal?: AbortSignal,
  ): Promise<BytebotAgentResponse> {
    // Convert messages to Chat Completion format
    const chatMessages = this.formatMessagesForChatCompletion(
      systemPrompt,
      messages,
    );
    try {
      // Prepare the Chat Completion request
      const completionRequest: OpenAI.Chat.ChatCompletionCreateParams = {
        model,
        messages: chatMessages,
        max_tokens: 8192,
        ...(useTools && { tools: proxyTools }),
      };

      // Add reasoning_effort: 'high' ONLY for OpenAI models that are known to support it (o1 models)
      if (model.includes('o1') || model.includes('o3')) {
        completionRequest.reasoning_effort = 'high';
      }

      this.logger.log(`Calling Proxy API for model ${model} with ${chatMessages.length} messages.`);
      this.logger.debug(`Full completion request: ` + JSON.stringify(completionRequest));

      // Make the API call
      const completion = await this.openai.chat.completions.create(
        completionRequest,
        { signal },
      );
      this.logger.log(`Proxy API call successful for model ${model}`);

      // Process the response
      const choice = completion.choices[0];
      if (!choice || !choice.message) {
        throw new Error('No valid response from Chat Completion API');
      }

      this.logger.log(`Formatting response...`);

      // Convert response to MessageContentBlocks
      const contentBlocks = this.formatChatCompletionResponse(choice.message);

      return {
        contentBlocks,
        tokenUsage: {
          inputTokens: completion.usage?.prompt_tokens || 0,
          outputTokens: completion.usage?.completion_tokens || 0,
          totalTokens: completion.usage?.total_tokens || 0,
        },
      };
    } catch (error: any) {
      if (error instanceof APIUserAbortError) {
        this.logger.log('Chat Completion API call aborted');
        throw new BytebotAgentInterrupt();
      }

      this.logger.error(
        `Error sending message to proxy: ${error.message}`,
        JSON.stringify(error, null, 2),
      );
      if (error instanceof OpenAI.APIError) {
        this.logger.error(`API Error details:`, JSON.stringify(error.error, null, 2));
      }
      throw error;
    }
  }

  /**
   * Convert Bytebot messages to Chat Completion format
   */
  private formatMessagesForChatCompletion(
    systemPrompt: string,
    messages: Message[],
  ): ChatCompletionMessageParam[] {
    const chatMessages: ChatCompletionMessageParam[] = [];

    // Add system message
    chatMessages.push({
      role: 'system',
      content: systemPrompt,
    });

    // Process each message
    for (const message of messages) {
      const messageContentBlocks = message.content as MessageContentBlock[];

      // Handle messages with only user actions (computer tool execution from user perspective)
      // This is a special case in Bytebot but we map it to user text for the LLM
      if (
        messageContentBlocks.length > 0 &&
        messageContentBlocks.every((block) => isUserActionContentBlock(block))
      ) {
        const userActionBlocks = messageContentBlocks.flatMap(
          (block) => block.content,
        );

        for (const block of userActionBlocks) {
          if (isComputerToolUseContentBlock(block)) {
            chatMessages.push({
              role: 'user',
              content: `User performed action: ${block.name}\n${JSON.stringify(
                block.input,
                null,
                2,
              )}`,
            });
          } else if (isImageContentBlock(block)) {
            chatMessages.push({
              role: 'user',
              content: [
                {
                  type: 'image_url',
                  image_url: {
                    url: `data:${block.source.media_type};base64,${block.source.data}`,
                    detail: 'auto',
                  },
                },
              ],
            });
          }
        }
      } else {
        // Standard message processing
        // We collect tool results and image completions separately to avoid interleaving roles
        const turnToolMessages: ChatCompletionMessageParam[] = [];
        const turnUserMessages: ChatCompletionMessageParam[] = [];
        const turnOtherMessages: ChatCompletionMessageParam[] = [];

        for (const block of messageContentBlocks) {
          switch (block.type) {
            case MessageContentType.Text: {
              turnOtherMessages.push({
                role: message.role === Role.USER ? 'user' : 'assistant',
                content: block.text,
              });
              break;
            }
            case MessageContentType.Image: {
              const imageBlock = block;
              turnUserMessages.push({
                role: 'user',
                content: [
                  {
                    type: 'image_url',
                    image_url: {
                      url: `data:${imageBlock.source.media_type};base64,${imageBlock.source.data}`,
                      detail: 'auto',
                    },
                  },
                ],
              });
              break;
            }
            case MessageContentType.ToolUse: {
              const toolBlock = block as ToolUseContentBlock;
              chatMessages.push({
                role: 'assistant',
                tool_calls: [
                  {
                    id: toolBlock.id,
                    type: 'function',
                    function: {
                      name: toolBlock.name,
                      arguments: JSON.stringify(toolBlock.input),
                    },
                  },
                ],
              });
              break;
            }
            case MessageContentType.Thinking: {
              const thinkingBlock = block as ThinkingContentBlock;
              const msg: ChatCompletionMessageParam = {
                role: 'assistant',
                content: null,
              };
              msg['reasoning_content'] = thinkingBlock.thinking;
              chatMessages.push(msg);
              break;
            }
            case MessageContentType.ToolResult: {
              const toolResultBlock = block as ToolResultContentBlock;

              const textContent = toolResultBlock.content
                .filter((c) => c.type === MessageContentType.Text)
                .map((c) => (c as TextContentBlock).text)
                .join('\n');

              const imageBlocks = toolResultBlock.content.filter(
                (c) => c.type === MessageContentType.Image,
              ) as ImageContentBlock[];

              turnToolMessages.push({
                role: 'tool',
                tool_call_id: toolResultBlock.tool_use_id,
                content: textContent || (imageBlocks.length > 0 ? 'screenshot' : 'success'),
              });

              if (imageBlocks.length > 0) {
                const userMsgContent: ChatCompletionContentPart[] = [
                  {
                    type: 'text',
                    text: `Screenshot result for tool call ${toolResultBlock.tool_use_id}:`,
                  },
                ];

                imageBlocks.forEach((img) => {
                  userMsgContent.push({
                    type: 'image_url',
                    image_url: {
                      url: `data:${img.source.media_type};base64,${img.source.data}`,
                      detail: 'auto',
                    },
                  });
                });

                turnUserMessages.push({
                  role: 'user',
                  content: userMsgContent,
                });
              }
              break;
            }
          }
        }

        // Add collected messages in stable order: other -> tool -> user
        chatMessages.push(...turnOtherMessages);
        chatMessages.push(...turnToolMessages);
        chatMessages.push(...turnUserMessages);
      }
    }

    return chatMessages;
  }

  /**
   * Convert Chat Completion response to MessageContentBlocks
   */
  private formatChatCompletionResponse(
    message: OpenAI.Chat.ChatCompletionMessage,
  ): MessageContentBlock[] {
    const contentBlocks: MessageContentBlock[] = [];

    // Handle text content
    if (message.content) {
      contentBlocks.push({
        type: MessageContentType.Text,
        text: message.content,
      } as TextContentBlock);
    }

    if (message['reasoning_content']) {
      contentBlocks.push({
        type: MessageContentType.Thinking,
        thinking: message['reasoning_content'],
        signature: message['reasoning_content'],
      } as ThinkingContentBlock);
    }

    // Handle tool calls
    if (message.tool_calls && message.tool_calls.length > 0) {
      for (const toolCall of message.tool_calls) {
        if (toolCall.type === 'function') {
          let parsedInput = {};
          try {
            parsedInput = JSON.parse(toolCall.function.arguments || '{}');
          } catch (e) {
            this.logger.warn(
              `Failed to parse tool call arguments: ${toolCall.function.arguments}`,
            );
            parsedInput = {};
          }

          contentBlocks.push({
            type: MessageContentType.ToolUse,
            id: toolCall.id,
            name: toolCall.function.name,
            input: parsedInput,
          } as ToolUseContentBlock);
        }
      }
    }

    // Handle refusal
    if (message.refusal) {
      contentBlocks.push({
        type: MessageContentType.Text,
        text: `Refusal: ${message.refusal}`,
      } as TextContentBlock);
    }

    return contentBlocks;
  }
}
