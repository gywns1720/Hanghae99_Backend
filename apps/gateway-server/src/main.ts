import { NestFactory, Reflector } from '@nestjs/core';
import { GatewayRootModule } from './gateway-root.module';
import { DateUtils } from '@lib/common/utils';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from '@lib/common/interceptor/response.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CustomErrorFilter } from '@lib/common/filter/custom-error.filter';
import { BadRequestFilter } from '@lib/common/filter/bad-request.filter';
import { InternalServerErrorFilter } from '@lib/common/filter/internal-server-error.filter';

DateUtils.pluginSetting();
declare const module: any;

async function bootstrap() {
  const app =
    await NestFactory.create<NestExpressApplication>(GatewayRootModule);

  /**
   * @Note BodyParse + CookieParser 설정
   */
  app.use(
    express.json({
      limit: '40mb',
    }),
    express.urlencoded({ extended: true, limit: '40mb' }),
    express.text({ limit: '40mb' }),
    // Online UUID Generator 이용하여 생성 (운영환경에서는 env)
    cookieParser(
      '9aee6d34-1051-4e52-b95f-17156daf87774371be29-ab39-4da3-84f2-5f952481db95',
    ),
  );

  app.enableCors({
    credentials: true,
    origin: ['http://localhost:3000', 'http://localhost:8000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  });

  app.setGlobalPrefix('/api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(
    new CustomErrorFilter(),
    new BadRequestFilter(),
    new InternalServerErrorFilter(),
  );
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(Reflector),
    new ResponseInterceptor(),
  );
  const port =
    typeof process.env.port === 'undefined' || process.env.port === null
      ? 3000
      : isNaN(+process.env.port)
        ? 3000
        : +process.env.port;
  const config = new DocumentBuilder()
    .setTitle('BackendLITE1')
    .setDescription('REST API')
    .setVersion('1.0')
    .setLicense('UNKNOWN', `http://localhost:${port}`)
    .setBasePath('/api')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.port ?? port);
  // Hot Module (Hot Reload)
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap().catch((err) => {
  console.error(err);
});
