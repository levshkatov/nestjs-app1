import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { I18n, I18nContext } from 'nestjs-i18n';
import { UserRole } from '../../../../orm/modules/users/interfaces/user-role.enum';
import { GetUser } from '../../../../shared/decorators/get-user.decorator';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import { SkipAuth } from '../../../../shared/decorators/skip-auth.decorator';
import { ParamIdReqDto } from '../../../../shared/dtos/param.dto';
import { OkDto, UnauthorizedDto, UnsubscribedDto } from '../../../../shared/dtos/responses.dto';
import { IJWTUser } from '../../../../shared/modules/auth/interfaces/jwt-user.interface';
import { PopUpDto } from '../../pop-up/dtos/pop-up.dto';
import { TaskWithHabitIdDto } from '../../tasks/dtos/task.dto';
import { UserHabitDataReqDto, UserHabitDto } from './dtos/user-habit.dto';
import { HABITS_SAVE_DATA_TYPES } from './interfaces/user-habits.constants';
import { UserHabitsService } from './user-habits.service';

@ApiTags('users/habits')
@Controller('habits')
@SkipAuth(false)
@ApiBearerAuth()
@Roles(UserRole.mobileSubscribed)
export class UserHabitsController {
  constructor(private userHabits: UserHabitsService) {}

  @Get('/')
  @ApiOperation({
    summary: '[subscribed] Получение привычек пользователя',
  })
  @ApiOkResponse({ type: [UserHabitDto] })
  @ApiBadRequestResponse({ type: PopUpDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  @ApiResponse({ status: 402, type: UnsubscribedDto })
  getAll(@I18n() i18n: I18nContext, @GetUser() user: IJWTUser): Promise<UserHabitDto[]> {
    return this.userHabits.getAll(i18n, user);
  }

  @Get('/:notesId')
  @ApiOperation({
    summary: '[subscribed] Получение сохраненных данных привычки с типом notes',
    description: 'notesId можно получить только по /lotus/calendar',
  })
  @ApiOkResponse({ type: TaskWithHabitIdDto })
  @ApiBadRequestResponse({ type: PopUpDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  @ApiResponse({ status: 402, type: UnsubscribedDto })
  getSavedData(
    @I18n() i18n: I18nContext,
    @Param() { id: notesId }: ParamIdReqDto,
    @GetUser() user: IJWTUser,
  ): Promise<TaskWithHabitIdDto> {
    return this.userHabits.getSavedData(i18n, notesId, user);
  }

  @Post('/:id')
  @ApiOperation({
    summary: '[subscribed] Добавление пользовательских данных для привычки',
    description: `Только для ${HABITS_SAVE_DATA_TYPES.join(', ')}`,
  })
  @ApiCreatedResponse({ type: OkDto })
  @ApiBadRequestResponse({ type: PopUpDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  @ApiResponse({ status: 402, type: UnsubscribedDto })
  saveData(
    @I18n() i18n: I18nContext,
    @Param() { id }: ParamIdReqDto,
    @Body() dto: UserHabitDataReqDto,
    @GetUser() user: IJWTUser,
  ): Promise<OkDto> {
    return this.userHabits.saveData(i18n, id, dto, user);
  }
}
