import { CookieOptions, Response } from 'express';
import { AdminConfig } from '../../../config/interfaces/admin';

type TokenType = 'accessToken' | 'refreshToken';

const createOptions = (type: TokenType, config: AdminConfig): CookieOptions => {
  const path =
    type === 'accessToken' ? config.auth.cookie.accessPath : config.auth.cookie.refreshPath;

  return {
    domain: config.auth.cookie.domain,
    path,
    httpOnly: true,
    signed: true,
    secure: true,
    sameSite: config.auth.cookie.sameSite as 'lax' | 'strict' | 'none',
  };
};

export const setToken = (
  type: TokenType,
  res: Response,
  config: AdminConfig,
  token: string,
): void => {
  res.cookie(type, token, createOptions(type, config));
};

export const clearToken = (type: TokenType, res: Response, config: AdminConfig): void => {
  res.clearCookie(type, createOptions(type, config));
};
