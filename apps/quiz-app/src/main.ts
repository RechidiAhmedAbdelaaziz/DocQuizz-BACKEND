import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true
    }
  }))

  app.enableCors({
    origin: [
      /https?:\/\/(.+\.)?docquizz\.top$/, // Allow all subdomains of docquizz.top
      /^http?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/ // Allow all localhost and 127.0.0.1 with any port
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });






  await app.listen(3000);
}
bootstrap();
