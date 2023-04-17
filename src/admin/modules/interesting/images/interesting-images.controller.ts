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
import { UserRole } from '../../../../orm/modules/users/interfaces/user-role.enum';
import { GetUser } from '../../../../shared/decorators/get-user.decorator';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import { SkipAuth } from '../../../../shared/decorators/skip-auth.decorator';
import { PageReqDto } from '../../../../shared/dtos/page.dto';
import { ParamIdReqDto } from '../../../../shared/dtos/param.dto';
import {
  ErrorDto,
  ForbiddenDto,
  OkDto,
  UnauthorizedDto,
} from '../../../../shared/dtos/responses.dto';
import { paginate } from '../../../../shared/helpers/paginate.helper';
import { IJWTUser } from '../../../../shared/modules/auth/interfaces/jwt-user.interface';
import {
  InterestingImagesForListDto,
  InterestingImageCreateReqDto,
  InterestingImageDetailedDto,
  InterestingImageEditReqDto,
  InterestingImagesReqDto,
} from './dtos/interesting-image.dto';
import { InterestingImagesService } from './interesting-images.service';

@ApiTags('interesting/images')
@Controller('')
@SkipAuth(false)
@ApiBearerAuth()
export class InterestingImagesController {
  constructor(private interestingImages: InterestingImagesService) {}

  @Get('/')
  @ApiOperation({
    summary: '[all] Получение всех объектов блока "Инфографика"',
  })
  @ApiOkResponse({ type: InterestingImagesForListDto })
  @ApiBadRequestResponse({ type: ErrorDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  async getAll(
    @I18n() i18n: I18nContext,
    @Query() { page }: PageReqDto,
  ): Promise<InterestingImagesForListDto> {
    return this.interestingImages.getAll(i18n, paginate(page));
  }

  @Post('/')
  @Roles(UserRole.webAdmin, UserRole.webEditor)
  @ApiOperation({
    summary: '[webAdmin, webEditor] Добавление объекта блока "Инфографика"',
  })
  @ApiCreatedResponse({ type: OkDto })
  @ApiBadRequestResponse({ type: ErrorDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  @ApiForbiddenResponse({ type: ForbiddenDto })
  async create(
    @I18n() i18n: I18nContext,
    @Body() dto: InterestingImageCreateReqDto,
  ): Promise<OkDto> {
    return this.interestingImages.create(i18n, dto);
  }

  @Get('/:id')
  @ApiOperation({
    summary: '[all] Получение объекта блока "Инфографика" по id',
  })
  @ApiOkResponse({ type: InterestingImageDetailedDto })
  @ApiBadRequestResponse({ type: ErrorDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  async getOne(
    @I18n() i18n: I18nContext,
    @Param() { id }: ParamIdReqDto,
  ): Promise<InterestingImageDetailedDto> {
    return this.interestingImages.getOne(i18n, id);
  }

  @Put('/:id')
  @Roles(UserRole.webAdmin, UserRole.webEditor)
  @ApiOperation({
    summary: '[webAdmin, webEditor] Изменение объекта блока "Инфографика" по id',
    description: 'webEditor может изменить все поля, кроме *disabled*',
  })
  @ApiOkResponse({ type: OkDto })
  @ApiBadRequestResponse({ type: ErrorDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  @ApiForbiddenResponse({ type: ForbiddenDto })
  async edit(
    @I18n() i18n: I18nContext,
    @Param() { id }: ParamIdReqDto,
    @Body() dto: InterestingImageEditReqDto,
    @GetUser() user: IJWTUser,
  ): Promise<OkDto> {
    return this.interestingImages.edit(i18n, id, dto, user);
  }

  @Delete('/:id')
  @Roles(UserRole.webAdmin)
  @ApiOperation({
    summary: '[webAdmin] Удаление объекта блока "Инфографика" по id',
  })
  @ApiOkResponse({ type: OkDto })
  @ApiBadRequestResponse({ type: ErrorDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  @ApiForbiddenResponse({ type: ForbiddenDto })
  async delete(@I18n() i18n: I18nContext, @Param() { id }: ParamIdReqDto): Promise<OkDto> {
    return this.interestingImages.delete(i18n, id);
  }
}
