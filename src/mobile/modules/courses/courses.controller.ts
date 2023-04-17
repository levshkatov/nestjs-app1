import { Controller, Get, Param, Put, Query } from '@nestjs/common';
import {
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
import { PopUpDto } from '../pop-up/dtos/pop-up.dto';
import {
  CourseDetailedDto,
  CourseForListDto,
  CourseRemoveDto,
  CourseReqDto,
  CourseStartDto,
} from './dtos/course.dto';
import { CoursesService } from './courses.service';
import { SkipAuth } from '../../../shared/decorators/skip-auth.decorator';
import { GetUser } from '../../../shared/decorators/get-user.decorator';
import { IJWTUser } from '../../../shared/modules/auth/interfaces/jwt-user.interface';
import { UnauthorizedDto, UnsubscribedDto } from '../../../shared/dtos/responses.dto';
import { Roles } from '../../../shared/decorators/roles.decorator';
import { UserRole } from '../../../orm/modules/users/interfaces/user-role.enum';
import { ParamIdReqDto } from '../../../shared/dtos/param.dto';
import { TagReqDto } from '../../../shared/dtos/tag.dto';

@ApiTags('courses')
@Controller('')
@SkipAuth()
export class CoursesController {
  constructor(private courses: CoursesService) {}

  @Get('/')
  @ApiSecurity('')
  @ApiBearerAuth()
  @ApiOperation({
    summary: '[optional auth] Получение всех курсов',
    description:
      'Если запрос авторизован, то в ответ будут добавлены поля <i>isAdded, isCompleted</i>',
  })
  @ApiOkResponse({ type: [CourseForListDto] })
  @ApiBadRequestResponse({ type: PopUpDto })
  getAll(
    @I18n() i18n: I18nContext,
    @Query() dto: CourseReqDto,
    @GetUser() user?: IJWTUser,
  ): Promise<CourseForListDto[]> {
    return this.courses.getAll(i18n, dto, user);
  }

  @Get('/tag')
  @ApiSecurity('')
  @ApiBearerAuth()
  @ApiOperation({
    summary: '[optional auth] Подробный просмотр курса по тегу',
    description:
      'Если запрос авторизован, то в ответ будут добавлены поля <i>isAdded, isCompleted</i>',
  })
  @ApiOkResponse({ type: CourseDetailedDto })
  @ApiBadRequestResponse({ type: PopUpDto })
  getOneByTag(
    @I18n() i18n: I18nContext,
    @Query() { tag }: TagReqDto,
    @GetUser() user?: IJWTUser,
  ): Promise<CourseDetailedDto> {
    return this.courses.getOne(i18n, { tag }, user);
  }

  @Get('/:id')
  @ApiSecurity('')
  @ApiBearerAuth()
  @ApiOperation({
    summary: '[optional auth] Подробный просмотр курса по id',
    description:
      'Если запрос авторизован, то в ответ будут добавлены поля <i>isAdded, isCompleted</i>',
  })
  @ApiOkResponse({ type: CourseDetailedDto })
  @ApiBadRequestResponse({ type: PopUpDto })
  getOneById(
    @I18n() i18n: I18nContext,
    @Param() { id }: ParamIdReqDto,
    @GetUser() user?: IJWTUser,
  ): Promise<CourseDetailedDto> {
    return this.courses.getOne(i18n, { id }, user);
  }

  @Put('/:id/action/start')
  @SkipAuth(false)
  @Roles(UserRole.mobileSubscribed)
  @ApiBearerAuth()
  @ApiOperation({
    summary: '[subscribed] Начать прохождение курса',
  })
  @ApiBadRequestResponse({ type: PopUpDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  @ApiResponse({ status: 402, type: UnsubscribedDto })
  start(
    @I18n() i18n: I18nContext,
    @Param() { id }: ParamIdReqDto,
    @Query() dto: CourseStartDto,
    @GetUser() user: IJWTUser,
  ): Promise<PopUpDto> {
    return this.courses.start(i18n, id, dto, user);
  }

  @Put('/:id/action/remove')
  @SkipAuth(false)
  @Roles(UserRole.mobileSubscribed)
  @ApiBearerAuth()
  @ApiOperation({
    summary: '[subscribed] Прервать прохождение курса и удалить прогресс',
  })
  @ApiBadRequestResponse({ type: PopUpDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  @ApiResponse({ status: 402, type: UnsubscribedDto })
  remove(
    @I18n() i18n: I18nContext,
    @Param() { id }: ParamIdReqDto,
    @Query() dto: CourseRemoveDto,
    @GetUser() user: IJWTUser,
  ): Promise<PopUpDto> {
    return this.courses.remove(i18n, id, dto, user);
  }
}
