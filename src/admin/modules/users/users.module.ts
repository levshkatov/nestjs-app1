import { Module } from '@nestjs/common';
import { logClassName } from '../../../shared/helpers/log-classname.helper';
import { CryptoHelperModule } from '../../../shared/modules/crypto/crypto-helper.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [CryptoHelperModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {
  constructor() {
    logClassName(this.constructor.name, __filename);
  }
}
