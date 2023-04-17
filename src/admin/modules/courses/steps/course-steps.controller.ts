import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { I18n, I18nContext } from 'nestjs-i18n';
import { UserRole } from '../../../../orm/modules/users/interfaces/user-role.enum';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import { SkipAuth } from '../../../../shared/decorators/skip-auth.decorator';
import { ParamIndexReqDto } from '../../../../shared/dtos/param.dto';
import {
  ErrorDto,
  ForbiddenDto,
  OkDto,
  UnauthorizedDto,
} from '../../../../shared/dtos/responses.dto';
import {
  CourseStepsForListDto,
  CourseStepCreateReqDto,
  CourseStepDetailedDto,
  CourseStepEditReqDto,
  ParamCourseIdReqDto,
} from './dtos/course-step.dto';
import { CourseStepsService } from './course-steps.service';

@ApiTags('courses/:courseId/steps')
@Controller(':courseId/steps')
@SkipAuth(false)
@ApiBearerAuth()
export class CourseStepsController {
  constructor(private courseSteps: CourseStepsService) {}

  @Get('/')
  @ApiOperation({
    summary: '[all] Получение всех шагов курса',
  })
  @ApiOkResponse({ type: CourseStepsForListDto })
  @ApiBadRequestResponse({ type: ErrorDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  async getAll(
    @I18n() i18n: I18nContext,
    @Param() { courseId }: ParamCourseIdReqDto,
  ): Promise<CourseStepsForListDto> {
    return this.courseSteps.getAll(i18n, courseId);
  }

  @Post('/')
  @Roles(UserRole.webAdmin, UserRole.webEditor)
  @ApiOperation({
    summary: '[webAdmin, webEditor] Добавление шага курса',
  })
  @ApiCreatedResponse({ type: OkDto })
  @ApiBadRequestResponse({ type: ErrorDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  @ApiForbiddenResponse({ type: ForbiddenDto })
  async create(
    @I18n() i18n: I18nContext,
    @Param() { courseId }: ParamCourseIdReqDto,
    @Body() dto: CourseStepCreateReqDto,
  ): Promise<OkDto> {
    return this.courseSteps.create(i18n, courseId, dto);
  }

  @Get('/:index')
  @ApiOperation({
    summary: '[all] Получение шага курса по индексу',
  })
  @ApiOkResponse({ type: CourseStepDetailedDto })
  @ApiBadRequestResponse({ type: ErrorDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  async getOne(
    @I18n() i18n: I18nContext,
    @Param() { courseId }: ParamCourseIdReqDto,
    @Param() { index }: ParamIndexReqDto,
  ): Promise<CourseStepDetailedDto> {
    return this.courseSteps.getOne(i18n, courseId, index);
  }

  @Put('/:index')
  @Roles(UserRole.webAdmin, UserRole.webEditor)
  @ApiOperation({
    summary: '[webAdmin, webEditor] Изменение шага курса по индексу',
  })
  @ApiOkResponse({ type: OkDto })
  @ApiBadRequestResponse({ type: ErrorDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  @ApiForbiddenResponse({ type: ForbiddenDto })
  async edit(
    @I18n() i18n: I18nContext,
    @Param() { courseId }: ParamCourseIdReqDto,
    @Param() { index }: ParamIndexReqDto,
    @Body() dto: CourseStepEditReqDto,
  ): Promise<OkDto> {
    return this.courseSteps.edit(i18n, courseId, index, dto);
  }

  @Delete('/:index')
  @Roles(UserRole.webAdmin)
  @ApiOperation({
    summary: '[webAdmin] Удаление шага курса по индексу',
  })
  @ApiOkResponse({ type: OkDto })
  @ApiBadRequestResponse({ type: ErrorDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  @ApiForbiddenResponse({ type: ForbiddenDto })
  async delete(
    @I18n() i18n: I18nContext,
    @Param() { courseId }: ParamCourseIdReqDto,
    @Param() { index }: ParamIndexReqDto,
  ): Promise<OkDto> {
    return this.courseSteps.delete(i18n, courseId, index);
  }
}
