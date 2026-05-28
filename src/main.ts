import 'dotenv/config';
import {
  BadRequestException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

function getFirstValidationMessage(errors: ValidationError[]): string {
  for (const error of errors) {
    if (error.constraints) {
      const [message] = Object.values(error.constraints);
      return message;
    }

    if (error.children?.length) {
      return getFirstValidationMessage(error.children);
    }
  }

  return 'Validation failed';
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      stopAtFirstError: true,
      exceptionFactory: (errors: ValidationError[]) =>
        new BadRequestException(getFirstValidationMessage(errors)),
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('NestJS API')
    .setDescription('API Documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
