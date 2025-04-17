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
    origin: (origin, callback) => {
      const allowedOrigins = [/^https?:\/\/(.+\.)?docquizz\.top$/, 'http://localhost:5137'];
      
      if (!origin || allowedOrigins.some(o =>
        typeof o === 'string' ? o === origin : o.test(origin)
      )) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  





  await app.listen(3000);
}
bootstrap();
