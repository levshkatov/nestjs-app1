import { Controller, Get, Query } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { I18n, I18nContext } from 'nestjs-i18n';
import { SkipAuth } from '../../../shared/decorators/skip-auth.decorator';
import { PopUpDto } from '../pop-up/dtos/pop-up.dto';
import { MediaDto, MediaReqDto } from './dtos/media.dto';
import { MediaService } from './media.service';

@ApiTags('media')
@Controller('')
@SkipAuth()
export class MediaController {
  constructor(private media: MediaService) {}

  @Get('/')
  @ApiOperation({
    summary: 'Получение файла по id или тегу',
  })
  @ApiOkResponse({ type: MediaDto })
  @ApiBadRequestResponse({ type: PopUpDto })
  getOne(@I18n() i18n: I18nContext, @Query() dto: MediaReqDto): Promise<MediaDto> {
    return this.media.getOne(i18n, dto);
  }
}
