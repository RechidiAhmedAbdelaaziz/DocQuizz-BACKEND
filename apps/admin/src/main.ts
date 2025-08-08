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
    origin: [
      /https?:\/\/(.+\.)?docquizz\.top$/, // Allow all subdomains of docquizz.top
       /https?:\/\/(.+\.)?fenneqcm\.top$/, // Allow all subdomains of fenneqcm.top
      /^http?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/ // Allow all localhost and 127.0.0.1 with any port
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });


  await app.listen(3000);
}
bootstrap();
