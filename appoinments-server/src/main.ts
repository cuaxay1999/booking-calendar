import { NestFactory } from '@nestjs/core';
import { HttpStatus, ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';

declare const module: any;
const PORT = 9001;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // validation
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY, // 422
    })
  );

  app.enableCors();

  await app.listen(PORT);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
