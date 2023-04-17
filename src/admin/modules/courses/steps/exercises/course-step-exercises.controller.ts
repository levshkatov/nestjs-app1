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
import { UserRole } from '../../../../../orm/modules/users/interfaces/user-role.enum';
import { Roles } from '../../../../../shared/decorators/roles.decorator';
import { SkipAuth } from '../../../../../shared/decorators/skip-auth.decorator';
import { ParamIndexReqDto } from '../../../../../shared/dtos/param.dto';
import {
  ErrorDto,
  ForbiddenDto,
  OkDto,
  UnauthorizedDto,
} from '../../../../../shared/dtos/responses.dto';
import {
  CourseStepExercisesForListDto,
  CourseStepExerciseCreateReqDto,
  CourseStepExerciseDetailedDto,
  CourseStepExerciseEditReqDto,
  ParamCourseStepIndexReqDto,
} from './dtos/course-step-exercise.dto';
import { CourseStepExercisesService } from './course-step-exercises.service';
import { ParamCourseIdReqDto } from '../dtos/course-step.dto';

@ApiTags('courses/:courseId/steps/:stepIndex/exercises')
@Controller(':courseId/steps/:stepIndex/exercises')
@SkipAuth(false)
@ApiBearerAuth()
export class CourseStepExercisesController {
  constructor(private courseStepExercises: CourseStepExercisesService) {}

  @Get('/')
  @ApiOperation({
    summary: '[all] Получение всех упражнений шага курса',
  })
  @ApiOkResponse({ type: CourseStepExercisesForListDto })
  @ApiBadRequestResponse({ type: ErrorDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  async getAll(
    @I18n() i18n: I18nContext,
    @Param() { courseId }: ParamCourseIdReqDto,
    @Param() { stepIndex }: ParamCourseStepIndexReqDto,
  ): Promise<CourseStepExercisesForListDto> {
    return this.courseStepExercises.getAll(i18n, courseId, stepIndex);
  }

  @Post('/')
  @Roles(UserRole.webAdmin, UserRole.webEditor)
  @ApiOperation({
    summary: '[webAdmin, webEditor] Добавление упражнения шага курса',
  })
  @ApiCreatedResponse({ type: OkDto })
  @ApiBadRequestResponse({ type: ErrorDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  @ApiForbiddenResponse({ type: ForbiddenDto })
  async create(
    @I18n() i18n: I18nContext,
    @Param() { courseId }: ParamCourseIdReqDto,
    @Param() { stepIndex }: ParamCourseStepIndexReqDto,
    @Body() dto: CourseStepExerciseCreateReqDto,
  ): Promise<OkDto> {
    return this.courseStepExercises.create(i18n, courseId, stepIndex, dto);
  }

  @Get('/:index')
  @ApiOperation({
    summary: '[all] Получение упражнения шага курса по индексу',
  })
  @ApiOkResponse({ type: CourseStepExerciseDetailedDto })
  @ApiBadRequestResponse({ type: ErrorDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  async getOne(
    @I18n() i18n: I18nContext,
    @Param() { courseId }: ParamCourseIdReqDto,
    @Param() { stepIndex }: ParamCourseStepIndexReqDto,
    @Param() { index }: ParamIndexReqDto,
  ): Promise<CourseStepExerciseDetailedDto> {
    return this.courseStepExercises.getOne(i18n, courseId, stepIndex, index);
  }

  @Put('/:index')
  @Roles(UserRole.webAdmin, UserRole.webEditor)
  @ApiOperation({
    summary: '[webAdmin, webEditor] Изменение упражнения шага курса по индексу',
  })
  @ApiOkResponse({ type: OkDto })
  @ApiBadRequestResponse({ type: ErrorDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  @ApiForbiddenResponse({ type: ForbiddenDto })
  async edit(
    @I18n() i18n: I18nContext,
    @Param() { courseId }: ParamCourseIdReqDto,
    @Param() { stepIndex }: ParamCourseStepIndexReqDto,
    @Param() { index }: ParamIndexReqDto,
    @Body() dto: CourseStepExerciseEditReqDto,
  ): Promise<OkDto> {
    return this.courseStepExercises.edit(i18n, courseId, stepIndex, index, dto);
  }

  @Delete('/:index')
  @Roles(UserRole.webAdmin)
  @ApiOperation({
    summary: '[webAdmin] Удаление упражнения шага курса по индексу',
  })
  @ApiOkResponse({ type: OkDto })
  @ApiBadRequestResponse({ type: ErrorDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  @ApiForbiddenResponse({ type: ForbiddenDto })
  async delete(
    @I18n() i18n: I18nContext,
    @Param() { courseId }: ParamCourseIdReqDto,
    @Param() { stepIndex }: ParamCourseStepIndexReqDto,
    @Param() { index }: ParamIndexReqDto,
  ): Promise<OkDto> {
    return this.courseStepExercises.delete(i18n, courseId, stepIndex, index);
  }
}
