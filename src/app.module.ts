import {
  MiddlewareConsumer,
  Module,
  NestModule,
  OnApplicationBootstrap,
  RequestMethod,
} from '@nestjs/common';
import { ConfigFactory, ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { DBConfig } from './config/interfaces/db';
import * as envConfigs from './config';
import { AcceptLanguageResolver, I18nJsonLoader, I18nModule } from 'nestjs-i18n';
import { join } from 'node:path';
import { CommonConfig } from './config/interfaces/common';
import { LoggerModule } from './shared/modules/logger/logger.module';
import { LoggerMiddleware } from './shared/modules/logger/logger.middleware';
import { APP_FILTER, APP_GUARD, RouterModule } from '@nestjs/core';
import { HttpExceptionFilter } from './shared/interceptors/http-exception.filter';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MobileModule } from './mobile/mobile.module';
import { AdminModule } from './admin/admin.module';
import { appRoutes } from './app.routes';
import { AuthGlobalModule } from './shared/modules/auth/auth-global.module';
import { PopUpModule } from './mobile/modules/pop-up/pop-up.module';
import { initInfo, logClassName } from './shared/helpers/log-classname.helper';
import { JwtAuthGuard } from './shared/guards/jwt.guard';
import { RolesGuard } from './shared/guards/roles.guard';
import { MainOrmModule } from './orm/modules/main-orm.module';
import { I18nHelperModule } from './shared/modules/i18n/i18n-helper.module';
import { NotificationsModule } from './shared/modules/notifications/notifications.module';

const configs: ConfigFactory[] = [];

chooseConfig(configs);

@Module({
  imports: [
    // GLOBAL
    ConfigModule.forRoot({
      isGlobal: true,
      load: configs,
      envFilePath: process.env['ENV_PATH'] || join(process.cwd(), '.env'),
    }),
    SequelizeModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => config.get<DBConfig>('db')!,
    }),
    ServeStaticModule.forRoot({
      serveRoot: '/logs',
      rootPath: join(__dirname, 'assets', 'logger'),
    }),
    I18nModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        fallbackLanguage: config.get<CommonConfig>('common')!.fallbackLang,
        loaderOptions: {
          path: join(__dirname, 'assets', 'i18n'),
          watch: true,
        },
      }),
      loader: I18nJsonLoader,
      resolvers: [AcceptLanguageResolver],
    }),
    PopUpModule, // GLOBAL
    AuthGlobalModule, // GLOBAL
    MainOrmModule, // GLOBAL
    I18nHelperModule, // GLOBAL
    NotificationsModule, // GLOBAL
    LoggerModule,
    AdminModule,
    MobileModule,
    RouterModule.register(appRoutes),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule implements NestModule, OnApplicationBootstrap {
  constructor() {
    logClassName(this.constructor.name, __filename);
  }

  async onApplicationBootstrap() {
    if (process.env['NODE_ENV'] === 'local') {
      console.log(initInfo);
      console.log(`Memory usage: ${(process.memoryUsage.rss() / (1024 * 1024)).toFixed(2)}Mb`);
    }
  }

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .exclude(
        { path: 'logs', method: RequestMethod.ALL },
        { path: 'logs/(.*)', method: RequestMethod.ALL },
        { path: 'api', method: RequestMethod.ALL },
        { path: 'api/(.*)', method: RequestMethod.ALL },
      )
      .forRoutes('*');
  }
}

function chooseConfig(configs: ConfigFactory[]) {
  type EnvType = 'local' | 'prod' | 'dev';
  type ConfigType = 'admin' | 'common' | 'db' | 'mobile';

  try {
    const env = process.env['NODE_ENV'] as EnvType;
    if (!env) {
      throw Error('No config with this NODE_ENV');
    }
    if (!['local', 'prod', 'dev'].includes(env)) {
      throw Error('NODE_ENV must be one of: local, prod, dev');
    }

    const config = envConfigs[env];

    if (!config) {
      throw Error('No config with this NODE_ENV');
    }
    if (!config.admin) {
      throw Error('No admin config');
    }
    if (!config.common) {
      throw Error('No common config');
    }
    if (!config.db) {
      throw Error('No db config');
    }
    if (!config.mobile) {
      throw Error('No mobile config');
    }

    Object.keys(config).map((key) => configs.push(envConfigs[env][key as ConfigType]));
  } catch (e) {
    console.error(`Wrong NODE_ENV=${process.env['NODE_ENV']};`, e.message);
    process.exit(0);
  }
}
