import { Body, Controller, Get, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { I18n, I18nContext } from 'nestjs-i18n';
import { UserRole } from '../../../orm/modules/users/interfaces/user-role.enum';
import { GetUser } from '../../../shared/decorators/get-user.decorator';
import { Roles } from '../../../shared/decorators/roles.decorator';
import { SkipAuth } from '../../../shared/decorators/skip-auth.decorator';
import { ErrorDto, ForbiddenDto, UnauthorizedDto } from '../../../shared/dtos/responses.dto';
import { IJWTUser } from '../../../shared/modules/auth/interfaces/jwt-user.interface';
import { MediaCreateReqDto, MediaDto, MediaReqDto } from './dtos/media.dto';
import { MediaService } from './media.service';

@ApiTags('media')
@Controller('')
@SkipAuth(false)
@ApiBearerAuth()
export class MediaController {
  constructor(private media: MediaService) {}

  // @Get('/all')
  // @Roles(UserRole.webAdmin)
  // @ApiOperation({
  //   summary: '[webAdmin] Получение файла по id или тегу',
  // })
  // @ApiOkResponse({ type: MediaDto })
  // @ApiBadRequestResponse({ type: ErrorDto })
  // @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  // @ApiForbiddenResponse({ type: ForbiddenDto })
  // getAll(@I18n() i18n: I18nContext) {
  //   return;
  // }

  @Get('/')
  @ApiOperation({
    summary: '[all] Получение файла по id или тегу',
  })
  @ApiOkResponse({ type: MediaDto })
  @ApiBadRequestResponse({ type: ErrorDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  async getOne(@I18n() i18n: I18nContext, @Query() dto: MediaReqDto): Promise<MediaDto> {
    return this.media.getOne(i18n, dto);
  }

  @Post('/')
  @Roles(UserRole.webAdmin, UserRole.webEditor)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: '[webAdmin, webEditor] Добавление файла',
    description: `Допустимые форматы файла: jpg, jpeg, png, mp3.<br>Максимальный размер: 150Мб`,
  })
  @ApiCreatedResponse({ type: MediaDto })
  @ApiBadRequestResponse({ type: ErrorDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedDto })
  @ApiForbiddenResponse({ type: ForbiddenDto })
  async uploadFile(
    @I18n() i18n: I18nContext,
    @Body() dto: MediaCreateReqDto,
    @UploadedFile() file: Express.Multer.File,
    @GetUser() user: IJWTUser,
  ): Promise<MediaDto> {
    return this.media.upload(i18n, dto, file, user);
  }
}
