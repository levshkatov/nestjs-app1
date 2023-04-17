const files: string[] = [];
// const exceptions: RegExp[] = [/main-orm\.service\.ts$/, /auth-base\.service\.ts$/, /interesting\.mapper\.ts$/];
const exceptions: RegExp[] = [];
export const initInfo = {
  modules: 0,
  services: 0,
  mappers: 0,
  guards: 0,
  middlewares: 0,
  interceptors: 0,
  other: <{ [key: string]: number }>{},
  total: 0,
  exceptions: 0,
  duplicates: <{ [key: string]: number }>{},
};

const log = (command: string, type: string, name: string, path: string) => {
  if (!files.includes(path)) {
    files.push(path);
    const typeNamePlural = `${type.toLowerCase()}s`;
    if (initInfo.hasOwnProperty(typeNamePlural)) {
      initInfo[<keyof typeof initInfo>typeNamePlural]++;
    } else {
      if (!initInfo.other[type.toLowerCase()]) {
        initInfo.other[type.toLowerCase()] = 1;
      } else {
        initInfo.other[type.toLowerCase()]++;
      }
    }
  } else {
    if (!exceptions.some((regex) => regex.test(path))) {
      command = `DUPLICATE ${command}`;
      if (!initInfo.duplicates[path]) {
        initInfo.duplicates[path] = 1;
      } else {
        initInfo.duplicates[path]++;
      }
    } else {
      initInfo.exceptions++;
    }
  }
  initInfo.total++;
  if (process.env['LOG_INIT']) {
    console.log(`[${command}] - ${type} - ${name} - ${path}`);
  }
};

/**
 * Logs service and module initializations for local env
 * */
export const logClassName = (className: string, path: string): void => {
  if (process.env['NODE_ENV'] !== 'local') {
    return;
  }

  let type = path.split('.').at(-2) || 'unknown';
  type = `${type.charAt(0).toUpperCase()}${type.slice(1)}`;

  const prefix = path.includes('/orm/')
    ? 'orm'
    : path.includes('/admin/')
    ? 'admin'
    : path.includes('/mobile/')
    ? 'mobile'
    : path.includes('/shared/')
    ? 'shared'
    : 'root';

  log('Init', type, `${prefix}:${className}`, path.replace('/dist', '').replace('.js', '.ts'));
};
