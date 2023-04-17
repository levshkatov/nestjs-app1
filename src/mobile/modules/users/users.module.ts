import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { UserHabitsController } from './habits/user-habits.controller';
import { UserHabitsService } from './habits/user-habits.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserWaterBalanceController } from './water-balance/user-water-balance.controller';
import { UserWaterBalanceService } from './water-balance/user-water-balance.service';
import { UserCoursesController } from './courses/user-courses.controller';
import { UserCoursesService } from './courses/user-courses.service';
import { UserBalancesController } from './balances/user-balances.controller';
import { UserBalancesService } from './balances/user-balances.service';
import { UserClaimsController } from './claims/user-claims.controller';
import { UserClaimsService } from './claims/user-claims.service';
import { logClassName } from '../../../shared/helpers/log-classname.helper';
import { UserLettersController } from './letters/user-letters.controller';
import { UserLettersService } from './letters/user-letters.service';
import { LevelsModule } from '../levels/levels.module';
import { TreesModule } from '../trees/trees.module';
import { TelegramHelperModule } from '../../../shared/modules/telegram/telegram-helper.module';

@Module({
  imports: [AuthModule, TreesModule, LevelsModule, TelegramHelperModule],
  controllers: [
    UserHabitsController,
    UserWaterBalanceController,
    UserCoursesController,
    UserBalancesController,
    UserClaimsController,
    UserLettersController,
    UsersController,
  ],
  providers: [
    UsersService,
    UserHabitsService,
    UserWaterBalanceService,
    UserCoursesService,
    UserBalancesService,
    UserClaimsService,
    UserLettersService,
  ],
})
export class UsersModule {
  constructor() {
    logClassName(this.constructor.name, __filename);
  }
}
