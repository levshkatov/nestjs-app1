import { Lang } from '../../shared/interfaces/lang.enum';

export interface CommonConfig {
  port: number;
  fallbackLang: Lang;
  jwt: {
    secret: string;
    /** expressed in a string describing a time span https://github.com/zeit/ms.js Eg: "2 days", "10h", "7d" */
    expiresIn: string;
    ignoreExpiration: boolean;
    /** number of days */
    refreshTokenExpiresIn: number;
  };
  auth: {
    maxSessions: number;
    defaultName: string;
  };
  users?: {
    swagger?: {
      admin?: {
        username?: string;
        password?: string;
      };
      mobile?: {
        username?: string;
        password?: string;
      };
    };
    logs?: {
      username?: string;
      password?: string;
    };
  };
  s3: {
    endpoint: string;
    bucketName: string;
  };
  tgDebug: boolean;
}
