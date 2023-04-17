import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Response } from 'express';
import { I18nService } from 'nestjs-i18n';
import { PopUpDto } from '../../mobile/modules/pop-up/dtos/pop-up.dto';
import { PopUpI18n } from '../../mobile/modules/pop-up/interfaces/pop-up-i18n.interface';
import { PopUpType } from '../../mobile/modules/pop-up/interfaces/pop-up-type.enum';
import { PopUpService } from '../../mobile/modules/pop-up/pop-up.service';
import { ErrorDto } from '../dtos/responses.dto';
import { logClassName } from '../helpers/log-classname.helper';
import { RequestExt } from '../interfaces/request.interface';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private popup: PopUpService, private i18n: I18nService) {
    logClassName(this.constructor.name, __filename);
  }

  async catch(e: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<RequestExt>();
    const status = e.getStatus();
    const r: any = e.getResponse();

    // Not found
    if (status === 404) {
      return res.status(status).send(r);
    }

    // Not authorized
    if (status === 401) {
      return res.status(status).send({
        statusCode: 401,
        errors: [this.i18n.translate(`errors.e.auth`)],
      });
    }

    // No subscription
    if (status === 402) {
      return res.status(status).send({
        statusCode: 402,
        errors: [this.i18n.translate(`errors.e.noSubscription`)],
      });
    }

    // Wrong roles
    if (status === 403) {
      return res.status(status).send({
        statusCode: 403,
        errors: [this.i18n.translate(`errors.e.wrongRoles`)],
      });
    }

    // admin errors
    if (status === 1000) {
      req.serverError = JSON.stringify({
        title: r.title,
      });
      req.errors = r.errors;
      return res.status(400).send(r);
    }

    // Unknown error from interceptor
    if (status === 500) {
      return res.status(400).send(r);
    }

    // Sequelize error
    if (status === 600) {
      req.serverError = JSON.stringify(e, Object.getOwnPropertyNames(e));
      const title = this.i18n.translate(`errors.e.database`);
      const errors = this.isAdmin(req)
        ? e.message
          ? [e.message]
          : ['Подробнее в логах']
        : ['Ошибка в БД'];
      const error = this.isAdmin(req) ? new ErrorDto({ title, errors }) : new PopUpDto({ errors });
      return res.status(400).send(error);
    }

    // PopUp
    if (status === 800) {
      if (r.type) {
        req.serverError = JSON.stringify({
          type: r.type,
          title: r.title,
          description: r.description,
        });
        req.errors = r.errors;
      }
      return res.status(400).send(r);
    }

    // Validation errors
    if (r.message && Array.isArray(r.message) && r.message.length) {
      const fields: Set<string> = new Set();
      const errors: string[] = [];
      r.message.forEach((msg: string) => {
        const [name, message] = msg.split('\\');
        if (name && message) {
          fields.add(name);
          errors.push(message);
        } else {
          errors.push(msg);
        }
      });

      const description = await this.translateValidation(Array.from(fields));
      req.errors = errors;

      if (this.isAdmin(req)) {
        req.serverError = JSON.stringify({
          title: this.i18n.t(`errors.e.validation`),
          description: description,
        });

        return res.status(400).send(
          new ErrorDto({
            title: description,
            errors,
          }),
        );
      }

      const popup = this.popup.create(
        PopUpType.error,
        { ...this.i18n.t<PopUpI18n>(`pop-ups.e.validationError`), description },
        errors,
      );

      req.serverError = JSON.stringify({
        type: popup.type,
        title: popup.title,
        description: popup.description,
      });

      return res.status(400).send(popup);
    }

    req.serverError = JSON.stringify(e, Object.getOwnPropertyNames(e));
    if (this.isAdmin(req)) {
      return res.status(400).send(
        new ErrorDto({
          errors:
            e?.message && typeof e.message === 'string' ? [e.message] : ['Неизвестное исключение'],
        }),
      );
    }

    return res.status(400).send(
      new PopUpDto({
        errors:
          e && e.message && typeof e.message === 'string'
            ? [e.message]
            : ['Неизвестное исключение'],
      }),
    );
  }

  isAdmin(req: RequestExt) {
    return (
      req.baseUrl.includes('admin') || (req.hostname === 'localhost' && req.url.includes('/admin'))
    );
  }

  async translateValidation(fields: string[]): Promise<string> {
    const fieldsStr = (
      await Promise.all<string>(
        fields.map((name) => this.i18n.translate(`validation.fields.${name}`)),
      )
    ).join(', ');
    const prefix = await this.i18n.translate('validation.errors.common');
    return `${prefix}: ${fieldsStr}`;
  }
}
