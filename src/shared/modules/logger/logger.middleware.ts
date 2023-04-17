import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response } from 'express';
import { LogOrmService } from '../../../orm/modules/logs/log-orm.service';
import { logClassName } from '../../helpers/log-classname.helper';
import { RequestExt } from '../../interfaces/request.interface';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private logs: LogOrmService) {
    logClassName(this.constructor.name, __filename);
  }

  async use(req: RequestExt, res: Response, next: () => void) {
    res.on('finish', async () => {
      const getBody = () => {
        try {
          if (req.get('content-type')?.includes('application/json')) {
            const length = +(req.get('content-length') || '') || null;
            if (length && length < 300) {
              if (req.body.refreshToken) {
                delete req.body.refreshToken;
              }
              if (req.body.password) {
                delete req.body.password;
              }
              return JSON.stringify(req.body);
            }
          }
        } catch (e) {}
        return null;
      };

      const ipAddr = req.ip.startsWith('::ffff:') ? req.ip.slice(7) : req.ip || null;

      const method = req.method || null;

      const url = req.originalUrl || req.url || null;

      const userId = req?.user?.userId || null;
      const username = req?.user?.name || null;
      const role = req?.user?.role || null;

      const reqLength = +(req.get('content-length') || '') || null;

      const resLength = +res.get('content-length') || null;

      const resStatus = +res.statusCode || null;

      const resStatusMessage = res.statusMessage || null;

      const resTime = +res.get('X-Response-Time') || null;

      const _errors = +res.statusCode >= 400 ? req.errors : [];
      const errors = _errors && _errors.length ? _errors : null;

      const serverError = req.serverError || null;

      const reqType = req.get('content-type') || null;

      const reqBody = getBody();

      let extra = '';
      extra += req.headers['accept-language'] || '';

      // const authToken =
      //   req.get('authorization') && req.get('authorization').split('Bearer ')[1]
      //     ? req.get('authorization').split('Bearer ')[1]
      //     : null;

      await this.logs.create({
        ipAddr,
        method,
        url,
        userId,
        username,
        role,
        reqLength,
        resLength,
        resStatus,
        resStatusMessage,
        resTime,
        reqType,
        reqBody,
        extra,
        errors,
        serverError,
      });
    });
    next();
  }
}
