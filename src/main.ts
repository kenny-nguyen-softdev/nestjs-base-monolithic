import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './core/helpers';
import * as dotenv from 'dotenv';
/**
 * Bootstraps the NestJS application.
 *
 * Creates a NestJS application instance and applies global
 * pipes and filters. Finally, it starts the server listening
 * on port 3000.
 */
async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.enableCors();
  await app.listen(process.env.PORT || 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
void bootstrap();
