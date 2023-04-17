import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { readFile } from 'node:fs/promises';
import { AxiosRequestConfig } from 'axios';
import * as FormData from 'form-data';
import { ConfigService } from '@nestjs/config';
import { logClassName } from '../../helpers/log-classname.helper';
import { CommonConfig } from '../../../config/interfaces/common';

@Injectable()
export class TelegramHelperService {
  private readonly tgURL: string =
    'https://api.telegram.org/bot1353286198:AAHjQd676tq_Ox-7EhsCJrhe7dx8XXCk4pM';
  private readonly chatId: number = 272366593;
  private commonConfig = this.config.get<CommonConfig>('common')!;

  constructor(private config: ConfigService, private http: HttpService) {
    logClassName(this.constructor.name, __filename);
  }

  async sendMessage(text: string, parseMode?: string): Promise<boolean> {
    if (!this.commonConfig.tgDebug) {
      return false;
    }

    const body = {
      chat_id: this.chatId,
      text,
      parse_mode: parseMode,
    };

    try {
      const res = await firstValueFrom(this.http.post(`${this.tgURL}/sendMessage`, body));
      if (res && res.data && res.data.ok) {
        return true;
      }
    } catch (e) {
      console.log(e.message);
    }

    return false;
  }

  async log(title: string, logs: string[] | string = 'Unknown'): Promise<boolean> {
    if (!this.commonConfig.tgDebug) {
      return false;
    }

    let text = '';
    text += `<b>${title}</b>\n`;
    text += `<pre>${typeof logs === 'string' ? logs : logs.join('\n')}</pre>`;
    return await this.sendMessage(text, 'HTML');
  }

  async sendData(data?: object | null, name?: string): Promise<boolean> {
    if (!this.commonConfig.tgDebug || !data) {
      return false;
    }

    const filename = `${Math.round(Date.now() / 1000)}${name ? `-${name}` : ''}`;

    let file = null;

    try {
      const str = JSON.stringify(data, null, 2);
      file = Buffer.from(str);
    } catch (e) {
      await this.log('tg sendData', e.message);
    }

    if (!file) {
      return false;
    }

    return await this.sendDocument(file, filename);
  }

  async sendFile(path: string, filename: string): Promise<boolean> {
    if (!this.commonConfig.tgDebug) {
      return false;
    }

    const file = await readFile(path);
    return await this.sendDocument(file, filename);
  }

  private async sendDocument(file: Buffer, filename: string): Promise<boolean> {
    const body = new FormData();
    body.append('chat_id', this.chatId.toString());
    body.append('document', file, { filename });

    const config: AxiosRequestConfig = {
      headers: { 'Content-Type': `multipart/form-data; boundary=${body.getBoundary()}` },
    };

    try {
      const res = await firstValueFrom(this.http.post(`${this.tgURL}/sendDocument`, body, config));
      if (res && res.data && res.data.ok) {
        return true;
      } else {
        throw new Error('Unknown error');
      }
    } catch (e) {
      await this.log('tg sendDocument', e.message);
    }

    return false;
  }
}
