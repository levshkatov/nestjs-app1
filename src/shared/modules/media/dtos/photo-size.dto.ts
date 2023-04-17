import { ApiPropertyOptional } from '@nestjs/swagger';

export class PhotoSizeDto {
  @ApiPropertyOptional()
  src100?: string;

  @ApiPropertyOptional()
  src300?: string;

  @ApiPropertyOptional()
  src800?: string;

  @ApiPropertyOptional()
  src1200?: string;

  @ApiPropertyOptional()
  src2800?: string;
}
