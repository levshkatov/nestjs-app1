import { Controller, Get, HttpStatus, Param, Put, Query, Res } from '@nestjs/common';
import {
  ApiAcceptedResponse,
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { I18n, I18nContext } from 'nestjs-i18n';
import {
  HabitAddChallengeDto,
  HabitDetailedDto,
  HabitForListDto,
  HabitSetTimeDto,
  HabitsReqDto,
} from './dtos/habit.dto';
import { HabitsService } from './habits.service';
import { TaskWithHabitIdDto } from '../tasks/dtos/task.dto';
import { TaskFinishDto } from '../../shared/dtos/task-finish.dto';
import { Response } from 'express';
import { SkipAuth } from '../../../shared/decorators/skip-auth.decorator';
import { UserRole } from '../../../orm/modules/users/interfaces/user-role.enum';
import { GetUser } from '../../../shared/decorators/get-user.decorator';
import { Roles } from '../../../shared/decorators/roles.decorator';
import { UnauthorizedDto, UnsubscribedDto } from '../../../shared/dtos/responses.dto';
import { IJWTUser } from '../../../shared/modules/auth/interfaces/jwt-user.interface';
import { PopUpDto } from '../pop-up/dtos/pop-up.dto';
import { ParamIdReqDto } from '../../../shared/dtos/param.dto';
import { TagReqDto } from '../../../shared/dtos/tag.dto';

@ApiTags('habits')
@Controller('')
@SkipAuth()
export class HabitsController {
  constructor(private habits: HabitsService) {}

  @Get('/')
  @ApiSecurity('')
  @ApiBearerAuth()
  @ApiOperation({
    summary: '[optional auth] Получение массива привычек',
    description: 'Если запрос авторизован, то в ответ будет добавлено поле <i>isAdded</i>',
  })
  @ApiOkResponse({ type: [HabitForListDto] })
  @ApiAcceptedResponse({ type: [HabitDetailedDto], description: 'Для randomOne=true' })
  @ApiBadRequestResponse({ type: PopUpDto })
  async getAll(
    @I18n() i18n: I18nContext,
    @Query() dto: HabitsReqDto,
    @Res({ passthrough: true }) res: Response,
    @GetUser() user?: IJWTUser,
  ): Promise<HabitForListDto[] | HabitDetailedDto[]> {
    const retDto = await this.habits.getAll(i18n, dto, user);
    if (retDto[0] && retDto[0] instanceof HabitDetailedDto) {
      res.status(HttpStatus.ACCEPTED);
    } else {
      res.status(HttpStatus.OK);
    }
    return retDto;
  }

  @Get('/tag')
  @ApiSecurity('')
  @ApiBearerAuth()
  @ApiOperation({
    summary: '[optional auth] Получение привычки по тегу',
    description: 'Если запрос авторизован, то в ответ будет добавлено поле <i>isAdded</i>',
  })
  @ApiOkResponse({ type: HabitDetailedDto })
  @ApiBadRequestResponse({ type: PopUpDto })
  getOneByTag(
    @I18n() i18n: I18nContext,
    @Query() { tag }: TagReqDto,
    @GetUser() user?: IJWTUser,
  ): Promise<HabitDetailedDto> {
    return this.habits.getOne(i18n, { tag }, user);
  }

  @Get('/:id')
  @ApiSecurity('')
  @ApiBearerAuth()
  @ApiOperation({
    summary: '[optional auth] Получение привычки по id',
    description: 'Если запрос авторизован, то в ответ будет добавлено поле <i>isAdded</i>',
  })
  @ApiOkResponse({ type: HabitDetailedDto })
  @ApiBadRequestResponse({ type: PopUpDto })
  getOneById(
    @I18n() i18n: I18nContext,
    @Param() { id }: ParamIdReqDto,
    @GetUser() user?: IJWTUser,
  ): Promise<HabitDetailedDto> {
    return this.habits.getOne(i18n, { id }, user);
  }

  @Put('/:id/action/add')
  @SkipAuth(false)
  @Roles(UserRole.mobileSubscribed)
  @ApiBearerAuth()
  @ApiOperation({
    summary: '[subscribed] Добавить привычку в распорядок дня',
  })
  @ApiBadRequestResponse({ type: PopUpDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  @ApiResponse({ status: 402, type: UnsubscribedDto })
  addHabit(
    @I18n() i18n: I18nContext,
    @Param() { id }: ParamIdReqDto,
    @GetUser() user: IJWTUser,
  ): Promise<PopUpDto> {
    return this.habits.add(i18n, id, user, { isChallenge: false });
  }

  @Put('/:id/action/addChallenge')
  @SkipAuth(false)
  @Roles(UserRole.mobileSubscribed)
  @ApiBearerAuth()
  @ApiOperation({
    summary: '[subscribed] Добавить привычку как челлендж в распорядок дня',
  })
  @ApiBadRequestResponse({ type: PopUpDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  @ApiResponse({ status: 402, type: UnsubscribedDto })
  addChallenge(
    @I18n() i18n: I18nContext,
    @Param() { id }: ParamIdReqDto,
    @Query() { forceChangeChallenge }: HabitAddChallengeDto,
    @GetUser() user: IJWTUser,
  ): Promise<PopUpDto> {
    return this.habits.add(i18n, id, user, { isChallenge: true, forceChangeChallenge });
  }

  @Put('/:id/action/remove')
  @SkipAuth(false)
  @Roles(UserRole.mobileSubscribed)
  @ApiBearerAuth()
  @ApiOperation({
    summary: '[subscribed] Удалить привычку из распорядка дня',
  })
  @ApiBadRequestResponse({ type: PopUpDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  @ApiResponse({ status: 402, type: UnsubscribedDto })
  remove(
    @I18n() i18n: I18nContext,
    @Param() { id }: ParamIdReqDto,
    @GetUser() user: IJWTUser,
  ): Promise<PopUpDto> {
    return this.habits.remove(i18n, id, user);
  }

  @Put('/:id/action/start')
  @SkipAuth(false)
  @Roles(UserRole.mobileSubscribed)
  @ApiBearerAuth()
  @ApiOperation({
    summary: '[subscribed] Начать выполнение привычки',
  })
  @ApiOkResponse({ type: TaskWithHabitIdDto })
  @ApiBadRequestResponse({ type: PopUpDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  @ApiResponse({ status: 402, type: UnsubscribedDto })
  start(
    @I18n() i18n: I18nContext,
    @Param() { id }: ParamIdReqDto,
    @GetUser() user: IJWTUser,
  ): Promise<TaskWithHabitIdDto> {
    return this.habits.start(i18n, id, user);
  }

  @Put('/:id/action/finish')
  @SkipAuth(false)
  @Roles(UserRole.mobileSubscribed)
  @ApiBearerAuth()
  @ApiOperation({
    summary: '[subscribed] Завершить выполнение привычки',
  })
  @ApiOkResponse({ type: TaskFinishDto })
  @ApiBadRequestResponse({ type: PopUpDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  @ApiResponse({ status: 402, type: UnsubscribedDto })
  finish(
    @I18n() i18n: I18nContext,
    @Param() { id }: ParamIdReqDto,
    @GetUser() user: IJWTUser,
  ): Promise<TaskFinishDto> {
    return this.habits.finish(i18n, id, user);
  }

  @Put('/:id/action/setTime')
  @SkipAuth(false)
  @Roles(UserRole.mobileSubscribed)
  @ApiBearerAuth()
  @ApiOperation({
    summary: '[subscribed] Задать время привычке в формате HH:mm:ss',
  })
  @ApiBadRequestResponse({ type: PopUpDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  @ApiResponse({ status: 402, type: UnsubscribedDto })
  setTime(
    @I18n() i18n: I18nContext,
    @Param() { id }: ParamIdReqDto,
    @Query() query: HabitSetTimeDto,
    @GetUser() user: IJWTUser,
  ): Promise<PopUpDto> {
    return this.habits.setTime(i18n, id, user, query);
  }
}
