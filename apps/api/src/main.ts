import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security
  app.use(helmet());
  app.use(cookieParser());
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  });

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // API prefix
  app.setGlobalPrefix('api/v1');

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('PriceLens Nigeria API')
    .setDescription('Smart Retail Price Intelligence Platform — REST API Documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Authentication & authorization')
    .addTag('users', 'User management')
    .addTag('locations', 'States, cities & geographic data')
    .addTag('products', 'Product catalog')
    .addTag('stores', 'Store directory')
    .addTag('prices', 'Price data & comparisons')
    .addTag('shopping-lists', 'Shopping list management')
    .addTag('expenses', 'Expense tracking')
    .addTag('subscriptions', 'Payment & subscriptions')
    .addTag('receipts', 'Receipt scanning')
    .addTag('admin', 'Admin panel')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.API_PORT || 3001;
  await app.listen(port);
  console.log(`\n🚀 PriceLens API running on http://localhost:${port}`);
  console.log(`📚 Swagger docs at http://localhost:${port}/api/docs\n`);
}

bootstrap();
