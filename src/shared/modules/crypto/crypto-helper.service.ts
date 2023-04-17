import { Injectable } from '@nestjs/common';
import { randomBytes, scrypt as _scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { logClassName } from '../../helpers/log-classname.helper';

@Injectable()
export class CryptoHelperService {
  scrypt = promisify(_scrypt);

  constructor() {
    logClassName(this.constructor.name, __filename);
  }

  /**
   * @throws {Error}
   */
  async hash(password: string): Promise<string> {
    const salt = randomBytes(16).toString('hex');
    const derivedKey = <Buffer>await this.scrypt(password, salt, 64);
    return `${salt}:${derivedKey.toString('hex')}`;
  }

  /**
   * @throws {Error}
   */
  async verify(password: string, hash: string): Promise<boolean> {
    const [salt, key] = hash.split(':');
    if (!salt || !key) {
      return false;
    }
    const keyBuffer = Buffer.from(key, 'hex');
    const derivedKey = <Buffer>await this.scrypt(password, salt, 64);
    return timingSafeEqual(keyBuffer, derivedKey);
  }
}
