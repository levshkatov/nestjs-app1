import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
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
import { UserRole } from '../../../orm/modules/users/interfaces/user-role.enum';
import { Roles } from '../../../shared/decorators/roles.decorator';
import { SkipAuth } from '../../../shared/decorators/skip-auth.decorator';
import { PageReqDto } from '../../../shared/dtos/page.dto';
import { ParamIdReqDto } from '../../../shared/dtos/param.dto';
import { ErrorDto, ForbiddenDto, OkDto, UnauthorizedDto } from '../../../shared/dtos/responses.dto';
import { paginate } from '../../../shared/helpers/paginate.helper';
import {
  LettersForListDto,
  LetterCreateReqDto,
  LetterDetailedDto,
  LetterEditReqDto,
  LettersReqDto,
} from './dtos/letter.dto';
import { LettersService } from './letters.service';

@ApiTags('letters')
@Controller('')
@SkipAuth(false)
@ApiBearerAuth()
export class LettersController {
  constructor(private letters: LettersService) {}

  @Get('/')
  @ApiOperation({
    summary: '[all] Получение всех писем',
  })
  @ApiOkResponse({ type: LettersForListDto })
  @ApiBadRequestResponse({ type: ErrorDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  async getAll(
    @I18n() i18n: I18nContext,
    @Query() { page }: PageReqDto,
    @Query() dto: LettersReqDto,
  ): Promise<LettersForListDto> {
    return this.letters.getAll(i18n, paginate(page), dto);
  }

  @Post('/')
  @Roles(UserRole.webAdmin, UserRole.webEditor)
  @ApiOperation({
    summary: '[webAdmin, webEditor] Добавление письма',
  })
  @ApiCreatedResponse({ type: OkDto })
  @ApiBadRequestResponse({ type: ErrorDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  @ApiForbiddenResponse({ type: ForbiddenDto })
  async create(@I18n() i18n: I18nContext, @Body() dto: LetterCreateReqDto): Promise<OkDto> {
    return this.letters.create(i18n, dto);
  }

  @Get('/:id')
  @ApiOperation({
    summary: '[all] Получение письма по id',
  })
  @ApiOkResponse({ type: LetterDetailedDto })
  @ApiBadRequestResponse({ type: ErrorDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  async getOne(
    @I18n() i18n: I18nContext,
    @Param() { id }: ParamIdReqDto,
  ): Promise<LetterDetailedDto> {
    return this.letters.getOne(i18n, id);
  }

  @Put('/:id')
  @Roles(UserRole.webAdmin, UserRole.webEditor)
  @ApiOperation({
    summary: '[webAdmin, webEditor] Изменение письма по id',
  })
  @ApiOkResponse({ type: OkDto })
  @ApiBadRequestResponse({ type: ErrorDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  @ApiForbiddenResponse({ type: ForbiddenDto })
  async edit(
    @I18n() i18n: I18nContext,
    @Param() { id }: ParamIdReqDto,
    @Body() dto: LetterEditReqDto,
  ): Promise<OkDto> {
    return this.letters.edit(i18n, id, dto);
  }

  @Delete('/:id')
  @Roles(UserRole.webAdmin)
  @ApiOperation({
    summary: '[webAdmin] Удаление письма по id',
  })
  @ApiOkResponse({ type: OkDto })
  @ApiBadRequestResponse({ type: ErrorDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  @ApiForbiddenResponse({ type: ForbiddenDto })
  async delete(@I18n() i18n: I18nContext, @Param() { id }: ParamIdReqDto): Promise<OkDto> {
    return this.letters.delete(i18n, id);
  }
}
