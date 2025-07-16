import { NestFactory } from '@nestjs/core';
import { UserServerModule } from './user-server.module';

async function bootstrap() {
  const app = await NestFactory.create(UserServerModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
