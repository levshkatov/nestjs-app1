import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BaseError } from 'sequelize';
import { PopUpDto } from '../../mobile/modules/pop-up/dtos/pop-up.dto';
import { ErrorDto } from '../dtos/responses.dto';
import { logClassName } from '../helpers/log-classname.helper';
import { RequestExt } from '../interfaces/request.interface';

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  constructor() {
    logClassName(this.constructor.name, __filename);
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest<RequestExt>();
    return next.handle().pipe(
      catchError((e) => {
        if (e instanceof HttpException) {
          throw e;
        }

        if (e instanceof ErrorDto) {
          throw new HttpException(e, 1000);
        }

        if (e instanceof PopUpDto) {
          throw new HttpException(e, 800);
        }

        if (e instanceof BaseError) {
          Object.getOwnPropertyNames(e).forEach((key) =>
            !['name', 'message', 'sql'].includes(key) ? delete e[key as keyof BaseError] : {},
          );
          throw new HttpException(e, 600);
        }

        req.serverError = JSON.stringify(e, Object.getOwnPropertyNames(e));

        if (
          req.baseUrl.includes('admin') ||
          (req.hostname === 'localhost' && req.url.includes('/admin'))
        ) {
          const error = new ErrorDto({});
          if (e.message && typeof e.message === 'string') {
            error.errors.push(e.message);
            req.errors = [e.message];
          }
          throw new HttpException(error, 500);
        }

        const error = new PopUpDto({});
        if (e.message && typeof e.message === 'string') {
          error.errors.push(e.message);
          req.errors = [e.message];
        }
        throw new HttpException(error, 500);
      }),
    );
  }
}
