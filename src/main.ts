import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CommonConfig } from './config/interfaces/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as responseTime from 'response-time';
import { ErrorInterceptor } from './shared/interceptors/error.interceptor';
import { mobileRoutes } from './mobile/mobile.routes';
import { adminRoutes } from './admin/admin.routes';
import * as basicAuth from 'express-basic-auth';
import * as cookieParser from 'cookie-parser';
import { AdminConfig } from './config/interfaces/admin';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import * as serviceAccount from '../secrets/firebase.json';
import { cert, initializeApp, ServiceAccount } from 'firebase-admin/app';

// for ubuntu 22 need:
// openssl version -d
// comment in this file line: providers = provider_sect
const fbCert: ServiceAccount = {
  projectId: serviceAccount.project_id,
  clientEmail: serviceAccount.client_email,
  privateKey: serviceAccount.private_key,
};

// NODE_ENV=local для локального создания приложения. Без докера, но должна быть запущена бд
// NODE_ENV=prod для prod окружения на сервере, нужен докер

async function bootstrap() {
  const server = express();

  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(server),
  );
  const config = app.get(ConfigService);

  checkEnvVars();

  app.set('trust proxy', true);

  app.use(responseTime({ digits: 0, suffix: false }));

  addAuth(app, config);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidUnknownValues: true,
    }),
  );
  app.useGlobalInterceptors(new ErrorInterceptor());

  app.enableCors({ credentials: true, origin: true });
  app.use(cookieParser(config.get<AdminConfig>('admin')!.auth.cookie.secret));

  setupMobileSwagger(app);
  setupAdminSwagger(app);

  initializeApp({
    credential: cert(fbCert),
  });

  await app.init();

  const port = config.get<CommonConfig>('common')!.port;
  await app.listen(port);
}

function checkEnvVars() {
  const excludedVars = [
    'APP_COMMON_USER_SWAGGER_ADMIN_NAME',
    'APP_COMMON_USER_SWAGGER_ADMIN_PASS',
    'APP_COMMON_USER_SWAGGER_MOBILE_NAME',
    'APP_COMMON_USER_SWAGGER_MOBILE_PASS',
    'APP_COMMON_USER_LOGS_NAME',
    'APP_COMMON_USER_LOGS_PASS',
    'APP_ADMIN_COOKIE_DOMAIN',
    'APP_ADMIN_COOKIE_SAME_SITE',
  ];

  const envExampleFile = readFileSync(join(process.cwd(), '.env.example'), { encoding: 'utf-8' });
  const envVars: string[] = envExampleFile
    .replace(/^#.*$/gm, '\n')
    .split('=')
    .map((el) => el.trim())
    .filter((el) => el);

  const missingEnvVars = envVars.filter(
    (envVar) => !excludedVars.includes(envVar) && !process.env[envVar],
  );
  if (missingEnvVars.length) {
    throw Error(`Some env vars are missing, check .env.example\n${missingEnvVars.join('\n')}`);
  }
}

function addAuth(app: NestExpressApplication, config: ConfigService) {
  const swaggerAuth = config.get<CommonConfig>('common')!.users?.swagger;
  if (swaggerAuth) {
    if (swaggerAuth.admin?.username && swaggerAuth.admin.password) {
      app.use(
        ['/api/admin', '/api/admin-json'],
        basicAuth({
          challenge: true,
          users: {
            [swaggerAuth.admin.username]: swaggerAuth.admin.password,
          },
        }),
      );
    }

    if (swaggerAuth.mobile?.username && swaggerAuth.mobile.password) {
      app.use(
        ['/api/mobile', '/api/mobile-json'],
        basicAuth({
          challenge: true,
          users: {
            [swaggerAuth.mobile.username]: swaggerAuth.mobile.password,
          },
        }),
      );
    }
  }

  const logsAuth = config.get<CommonConfig>('common')!.users?.logs;
  if (logsAuth?.username && logsAuth.password) {
    app.use(
      ['/logs'],
      basicAuth({
        challenge: true,
        users: {
          [logsAuth.username]: logsAuth.password,
        },
      }),
    );
  }
}

function setupMobileSwagger(app: INestApplication) {
  const options = new DocumentBuilder()
    .setVersion('2.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options, {
    include: mobileRoutes.map(({ module }) => module as new (...args: any[]) => typeof module),
  });

  SwaggerModule.setup('api/mobile', app, document, {
    swaggerOptions: {
      docExpansion: 'none',
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });
}

function setupAdminSwagger(app: INestApplication) {
  const options = new DocumentBuilder()
    .setVersion('2.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options, {
    include: adminRoutes.map(({ module }) => module as new (...args: any[]) => typeof module),
  });

  SwaggerModule.setup('api/admin', app, document, {
    swaggerOptions: {
      docExpansion: 'none',
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });
}

bootstrap();
