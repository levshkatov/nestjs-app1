import { Controller, Get, Param, Query, Res } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { Response } from 'express';
import { SkipAuth } from '../../decorators/skip-auth.decorator';
import { ParamIdReqDto } from '../../dtos/param.dto';
import { LoggerReqDto } from './dtos/logger.dto';
import { LoggerService } from './logger.service';

@Controller('logs')
@SkipAuth()
export class LoggerController {
  constructor(private logger: LoggerService) {}

  @ApiExcludeEndpoint()
  @Get('/json')
  getLogs(@Query() dto: LoggerReqDto) {
    return this.logger.getAll(dto);
  }

  @ApiExcludeEndpoint()
  @Get('/json/:id')
  getLog(@Param() { id }: ParamIdReqDto) {
    return this.logger.get(id);
  }

  @ApiExcludeEndpoint()
  @Get('/:id')
  async getLogPretty(@Param() { id }: ParamIdReqDto, @Res() res: Response) {
    const data = await this.logger.getPretty(id);
    return res.send(`<pre>${JSON.stringify(data, null, 2)}</pre>`);
  }
}
