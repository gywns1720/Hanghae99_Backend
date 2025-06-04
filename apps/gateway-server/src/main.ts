import { NestFactory } from '@nestjs/core';
import { GatewayRootModule } from './gateway-root.module';

async function bootstrap() {
  const app = await NestFactory.create(GatewayRootModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
