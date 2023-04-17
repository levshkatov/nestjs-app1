import { Module } from '@nestjs/common';
import { logClassName } from '../../../shared/helpers/log-classname.helper';
import { LettersController } from './letters.controller';
import { LettersService } from './letters.service';

@Module({
  imports: [],
  controllers: [LettersController],
  providers: [LettersService],
})
export class LettersModule {
  constructor() {
    logClassName(this.constructor.name, __filename);
  }
}
