import { Controller, Get, Param, Put } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
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
import { UnauthorizedDto, UnsubscribedDto } from '../../../../shared/dtos/responses.dto';
import { IJWTUser } from '../../../../shared/modules/auth/interfaces/jwt-user.interface';
import { TaskFinishDto } from '../../../shared/dtos/task-finish.dto';
import { PopUpDto } from '../../pop-up/dtos/pop-up.dto';
import {
  UserCourseExerciseFullDto,
  UserCourseExercisesDto,
} from './dtos/user-course-exercises.dto';
import { UserCourseStepsDto } from './dtos/user-course-steps.dto';
import { UserCourseDto } from './dtos/user-course-structure.dto';
import { UserCourseSimpleDto } from './dtos/user-course.dto';
import { UserCoursesService } from './user-courses.service';

@ApiTags('users/courses')
@Controller('courses')
@SkipAuth(false)
@ApiBearerAuth()
@Roles(UserRole.mobileSubscribed)
export class UserCoursesController {
  constructor(private userCourses: UserCoursesService) {}

  @Get('/')
  @ApiOperation({
    summary: '[subscribed] Получение полной структуры текущего курса',
  })
  @ApiOkResponse({ type: UserCourseDto })
  @ApiBadRequestResponse({ type: PopUpDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  @ApiResponse({ status: 402, type: UnsubscribedDto })
  getStructure(@I18n() i18n: I18nContext, @GetUser() user: IJWTUser): Promise<UserCourseDto> {
    return this.userCourses.getStructure(i18n, user);
  }

  @Get('/current')
  @ApiOperation({
    summary: '[subscribed] Получение текущего курса в виде упрощенной модели',
  })
  @ApiOkResponse({ type: UserCourseSimpleDto })
  @ApiBadRequestResponse({ type: PopUpDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  @ApiResponse({ status: 402, type: UnsubscribedDto })
  getSimple(@I18n() i18n: I18nContext, @GetUser() user: IJWTUser): Promise<UserCourseSimpleDto> {
    return this.userCourses.getSimple(i18n, user);
  }

  @Get('/exercises')
  @ApiOperation({
    summary: '[subscribed] Получение упражнений (Для блока "Твоя цель")',
  })
  @ApiOkResponse({ type: UserCourseExercisesDto })
  @ApiBadRequestResponse({ type: PopUpDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  @ApiResponse({ status: 402, type: UnsubscribedDto })
  getExercises(
    @I18n() i18n: I18nContext,
    @GetUser() user: IJWTUser,
  ): Promise<UserCourseExercisesDto> {
    return this.userCourses.getExercises(i18n, user);
  }

  @Put('/exercises/:id/action/start')
  @ApiOperation({
    summary: '[subscribed] Начать выполнение упражнения',
  })
  @ApiOkResponse({ type: UserCourseExerciseFullDto })
  @ApiBadRequestResponse({ type: PopUpDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  @ApiResponse({ status: 402, type: UnsubscribedDto })
  startExercise(
    @I18n() i18n: I18nContext,
    @Param() { id }: ParamIdReqDto,
    @GetUser() user: IJWTUser,
  ): Promise<UserCourseExerciseFullDto> {
    return this.userCourses.startExercise(i18n, id, user);
  }

  @Put('/exercises/:id/action/finish')
  @ApiOperation({
    summary: '[subscribed] Завершить выполнение упражнения',
  })
  @ApiOkResponse({ type: TaskFinishDto })
  @ApiBadRequestResponse({ type: PopUpDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  @ApiResponse({ status: 402, type: UnsubscribedDto })
  finishExercise(
    @I18n() i18n: I18nContext,
    @Param() { id }: ParamIdReqDto,
    @GetUser() user: IJWTUser,
  ): Promise<TaskFinishDto> {
    return this.userCourses.finishExercise(i18n, id, user);
  }

  @Get('/steps')
  @ApiOperation({
    summary: '[subscribed] Получение шагов (Для блока "Карта восхождения")',
  })
  @ApiOkResponse({ type: UserCourseStepsDto })
  @ApiBadRequestResponse({ type: PopUpDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  @ApiResponse({ status: 402, type: UnsubscribedDto })
  getSteps(@I18n() i18n: I18nContext, @GetUser() user: IJWTUser): Promise<UserCourseStepsDto> {
    return this.userCourses.getSteps(i18n, user);
  }
}
