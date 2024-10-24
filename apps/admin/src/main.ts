import { NestFactory } from '@nestjs/core';
import { AdminModule } from './admin.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AdminModule);


  app.useGlobalPipes(new ValidationPipe(
    {
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true
      }
    }
  ));

  app.enableCors({
    origin: /https?:\/\/(.+\.)?docquizz\.top$/, // Allow all subdomains of example.com
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // If you need to allow credentials (cookies, authorization headers)
  });


  await app.listen(3000);
}
bootstrap();
