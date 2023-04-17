import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AppleService } from './socials/apple/apple.service';
import { LoggerModule } from '../../../shared/modules/logger/logger.module';
import { CryptoHelperModule } from '../../../shared/modules/crypto/crypto-helper.module';
import { logClassName } from '../../../shared/helpers/log-classname.helper';
import { AuthTokensService } from './tokens/auth-tokens.service';
import { AuthTokensController } from './tokens/auth-tokens.controller';

@Module({
  imports: [CryptoHelperModule, LoggerModule],
  controllers: [AuthTokensController, AuthController],
  providers: [AuthService, AppleService, AuthTokensService],
  exports: [AuthService],
})
export class AuthModule {
  constructor() {
    logClassName(this.constructor.name, __filename);
  }
}
