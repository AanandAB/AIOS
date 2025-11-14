import { Module } from '@nestjs/common';
import { AgentProcessor } from './agent.processor';
import { SummariesModule } from '../summaries/summaries.module';
import { TasksModule } from '../tasks/tasks.module';
import { MessagesModule } from '../messages/messages.module';
import { PrismaModule } from '../prisma/prisma.module';
import { AnthropicModule } from '../anthropic/anthropic.module';
import { OpenAIModule } from '../openai/openai.module';
import { GoogleModule } from '../google/google.module';
import { ProxyModule } from '../proxy/proxy.module';
import { InputCaptureService } from './input-capture.service';

@Module({
  imports: [
    TasksModule,
    MessagesModule,
    SummariesModule,
    PrismaModule,
    AnthropicModule,
    OpenAIModule,
    GoogleModule,
    ProxyModule,
  ],
  providers: [AgentProcessor, InputCaptureService],
  exports: [AgentProcessor],
})
export class AgentModule {}
