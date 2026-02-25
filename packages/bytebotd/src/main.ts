import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createProxyMiddleware } from 'http-proxy-middleware';
import * as express from 'express';
import { json, urlencoded } from 'express';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { LoggingService } from './common/logging/logging.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configure global exception filter
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Configure body parser with increased payload size limit (50MB)
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ limit: '50mb', extended: true }));

  // Enable CORS with more restrictive settings for production
  app.enableCors({
    origin: process.env.NODE_ENV === 'production' ? 'https://bytebot.ai' : '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  });

  const wsProxy = createProxyMiddleware({
    target: 'http://localhost:6080',
    ws: true,
    changeOrigin: true,
    pathRewrite: { '^/websockify': '/' },
  });
  app.use('/websockify', express.raw({ type: '*/*' }), wsProxy);
  const server = await app.listen(process.env.PORT || 9990);

  // Selective upgrade routing
  server.on('upgrade', (req, socket, head) => {
    if (req.url?.startsWith('/websockify')) {
      wsProxy.upgrade(req, socket, head);
    }
    // else let Socket.IO/Nest handle it by not hijacking the socket
  });

  // Log application startup
  const logger = new LoggingService();
  logger.log(`Bytebot daemon started on port ${process.env.PORT || 9990}`);
}
bootstrap();
