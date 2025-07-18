import { NestFactory } from '@nestjs/core';
import { OrderServerModule } from './order-server.module';

async function bootstrap() {
  const app = await NestFactory.create(OrderServerModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
