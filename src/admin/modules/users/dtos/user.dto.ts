import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { UserRole } from '../../../../orm/modules/users/interfaces/user-role.enum';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
} from '../../../../shared/class-validator';
import { IsPassword } from '../../../../shared/decorators/is-password.decorator';
import { IsUsername } from '../../../../shared/decorators/is-username.decorator';
import { PagesDto } from '../../../../shared/dtos/page.dto';
import { apiSetLength } from '../../../../shared/helpers/api-set-length.helper';
import { UserType } from '../interfaces/user-type.enum';

class UserBaseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty({ enum: UserRole })
  role!: UserRole;

  @ApiProperty()
  name!: string;

  @ApiPropertyOptional()
  phone?: string;

  @ApiPropertyOptional()
  email?: string;

  @ApiPropertyOptional()
  username?: string;
}

export class UserForListDto extends UserBaseDto {}

export class UsersForListDto extends PagesDto {
  @ApiPropertyOptional()
  disclaimer?: string;

  @ApiProperty({ type: [UserForListDto] })
  users!: UserForListDto[];
}

export class UserDetailedDto extends UserBaseDto {
  @ApiPropertyOptional()
  disclaimer?: string;
}

export class UsersReqDto {
  @ApiPropertyOptional({
    description: 'Тип пользователя',
    enum: UserType,
  })
  @IsOptional()
  @IsEnum(UserType)
  type?: UserType;

  @ApiPropertyOptional({
    description: 'Роль пользователя. Если указано, то *type* игнорируется',
    enum: UserRole,
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  id?: number;

  @ApiPropertyOptional({
    ...apiSetLength(3, 200),
  })
  @IsOptional()
  @IsString()
  @Length(3, 200)
  name?: string;
}

export class UserCreateReqDto {
  @ApiProperty({
    description: 'Роль пользователя',
    enum: Object.values(UserRole).filter((value) => value.startsWith('web')),
  })
  @IsNotEmpty()
  @IsEnum(Object.values(UserRole).filter((value) => value.startsWith('web')))
  role!: UserRole;

  @ApiProperty({
    example: 'admin',
    ...apiSetLength(3, 20, 'Может содержать англ. буквы, цифры, дефисы и подчёркивания'),
  })
  @IsNotEmpty()
  @IsUsername({ min: 3, max: 20 })
  @Transform(({ value }) => value.toLowerCase())
  username!: string;

  @ApiProperty({
    example: '12345',
    ...apiSetLength(5, 30, 'Может содержать англ. буквы, цифры, спец символы (без пробелов)'),
  })
  @IsNotEmpty()
  @IsPassword({ min: 5, max: 30 })
  password!: string;

  @ApiProperty({
    example: 'Аноним',
    ...apiSetLength(3, 200, 'Допустимы пробелы'),
  })
  @IsNotEmpty()
  @IsString()
  @Length(3, 200)
  name!: string;
}

export class UserEditReqDto {
  @ApiProperty({
    example: 'admin',
    ...apiSetLength(3, 20, 'Может содержать англ. буквы, цифры, дефисы и подчёркивания'),
  })
  @IsNotEmpty()
  @IsUsername({ min: 3, max: 20 })
  @Transform(({ value }) => value.toLowerCase())
  username!: string;

  @ApiProperty({
    example: 'Аноним',
    ...apiSetLength(3, 200, 'Допустимы пробелы'),
  })
  @IsNotEmpty()
  @IsString()
  @Length(3, 200)
  name!: string;

  @ApiPropertyOptional({
    example: '12345',
    ...apiSetLength(
      5,
      30,
      'Может содержать англ. буквы, цифры, спец символы (без пробелов). Если присутствует, то обязательно поле oldPassword',
    ),
  })
  @IsOptional()
  @IsNotEmpty()
  @IsPassword({ min: 5, max: 30 })
  newPassword?: string;

  @ApiPropertyOptional({
    example: '12345',
    ...apiSetLength(5, 30, 'Может содержать англ. буквы, цифры, спец символы (без пробелов)'),
  })
  @IsOptional()
  @IsNotEmpty()
  @IsPassword({ min: 5, max: 30 })
  oldPassword?: string;
}

export class UserProfileReqDto {
  @ApiPropertyOptional({
    description: 'ID пользователя. Если не указан, то используется id авторизованного профиля',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  id?: number;
}
