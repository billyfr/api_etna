import { AuthGuard } from './app/guards/authorization.guard';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { HttpExceptionFilter } from './app/filters/error.filter';
import * as dotenv from 'dotenv';

async function bootstrap() {


  dotenv.config();
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  // app.useGlobalGuards(new AuthGuard);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.enableCors();
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
