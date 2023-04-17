import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, Length, NotContains, ValidateIf } from '../../../../shared/class-validator';
import { apiSetLength } from '../../../../shared/helpers/api-set-length.helper';
import { MediaBaseDto, MediaReqBaseDto } from '../../../../shared/modules/media/dtos/media.dto';
import { UserDto } from '../../../shared/dtos/user.dto';

export class MediaDto extends MediaBaseDto {
  @ApiPropertyOptional({ description: 'Автор, загрузивший файл', type: UserDto })
  author?: UserDto;
}

export class MediaCreateReqDto {
  @ApiProperty({ type: 'file' })
  file!: unknown;

  @ApiPropertyOptional({
    ...apiSetLength(3, 200, 'Уникальный тег файла без пробелов'),
  })
  @ValidateIf((obj, value) => value !== null && value !== undefined && value !== '')
  @IsString()
  @Length(3, 200)
  @NotContains(' ')
  tag?: string;
}

export class MediaReqDto extends MediaReqBaseDto {}
