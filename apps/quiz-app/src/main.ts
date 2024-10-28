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
    origin: /https?:\/\/(.+\.)?docquizz\.top$/, // Allow all subdomains of example.com
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // If you need to allow credentials (cookies, authorization headers)
  });



  app.enableCors(
    {
      origin: 'http://105.235.139.127:5173',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
    }
  )





  await app.listen(3000);
}
bootstrap();
