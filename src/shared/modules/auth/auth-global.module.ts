import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { CommonConfig } from '../../../config/interfaces/common';
import { logClassName } from '../../helpers/log-classname.helper';
import { JwtStrategy } from '../../strategies/jwt.strategy';

@Global()
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        secret: config.get<CommonConfig>('common')!.jwt.secret,
        signOptions: {
          expiresIn: config.get<CommonConfig>('common')!.jwt.expiresIn,
        },
      }),
    }),
  ],
  providers: [JwtStrategy],
  exports: [JwtModule, PassportModule],
})
export class AuthGlobalModule {
  constructor() {
    logClassName(this.constructor.name, __filename);
  }
}
