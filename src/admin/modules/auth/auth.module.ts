import { Module } from '@nestjs/common';
import { logClassName } from '../../../shared/helpers/log-classname.helper';
import { LoggerModule } from '../../../shared/modules/logger/logger.module';
import { CryptoHelperModule } from '../../../shared/modules/crypto/crypto-helper.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [CryptoHelperModule, LoggerModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {
  constructor() {
    logClassName(this.constructor.name, __filename);
  }
}
