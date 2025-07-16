import { NestFactory } from '@nestjs/core';
import { LogServerModule } from './log-server.module';

async function bootstrap() {
  const app = await NestFactory.create(LogServerModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
