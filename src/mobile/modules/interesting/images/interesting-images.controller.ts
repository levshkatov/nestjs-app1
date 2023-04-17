import { Controller, Get } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { I18n, I18nContext } from 'nestjs-i18n';
import { SkipAuth } from '../../../../shared/decorators/skip-auth.decorator';
import { PopUpDto } from '../../pop-up/dtos/pop-up.dto';
import { InterestingImageForListDto } from './dtos/interesting-image.dto';
import { InterestingImagesService } from './interesting-images.service';

@ApiTags('interesting/images')
@Controller('')
@SkipAuth()
export class InterestingImagesController {
  constructor(private images: InterestingImagesService) {}

  @Get('/')
  @ApiOperation({
    summary: 'Получение списка объектов блока "Инфографика"',
  })
  @ApiOkResponse({ type: [InterestingImageForListDto] })
  @ApiBadRequestResponse({ type: PopUpDto })
  getAll(@I18n() i18n: I18nContext): Promise<InterestingImageForListDto[]> {
    return this.images.getAll(i18n);
  }
}
