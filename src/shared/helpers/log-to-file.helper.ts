import { createWriteStream, existsSync, mkdirSync, WriteStream } from 'node:fs';
import { join } from 'node:path';
import { nowFormatted } from './now-formatted.helper';

export class LogToFile {
  private logStream: WriteStream;

  constructor(filename: string) {
    if (!process.env['NODE_ENV']) {
      throw Error('ENV error: no NODE_ENV');
    }

    if (!existsSync(join(process.cwd(), 'logs'))) {
      mkdirSync(join(process.cwd(), 'logs'));
    }
    if (!existsSync(join(process.cwd(), 'logs', process.env['NODE_ENV']))) {
      mkdirSync(join(process.cwd(), 'logs', process.env['NODE_ENV']));
    }

    this.logStream = createWriteStream(
      join(process.cwd(), 'logs', process.env['NODE_ENV'], filename),
    );
  }

  writeSql = (sql: string) => {
    if (/"Logs"|information_schema|pg_class/gm.test(sql)) {
      return;
    }

    sql = sql.replace(/Executing\s\(default\):\s/gm, '\n');
    sql = sql.endsWith(';') ? sql : `${sql};`;

    sql = `\n--${nowFormatted({ onlyTime: true, timeWithColon: true })}${sql}`;
    this.logStream.write(sql);
  };
}
