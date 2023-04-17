import { SequelizeModuleOptions } from '@nestjs/sequelize';

export interface DBConfig
  extends Required<
    Pick<
      SequelizeModuleOptions,
      | 'dialect'
      | 'host'
      | 'port'
      | 'username'
      | 'password'
      | 'database'
      | 'autoLoadModels'
      | 'sync'
      | 'logging'
    >
  > {}
