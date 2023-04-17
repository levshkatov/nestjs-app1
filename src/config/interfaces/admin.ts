export interface AdminConfig {
  auth: {
    cookie: {
      secret: string;
      domain?: string;
      refreshPath: string;
      accessPath: string;
      /** 'lax' | 'strict' | 'none' */
      sameSite?: string;
    };
  };
  media: {
    /** in MB */
    size: number;
    extensions: string[];
  };
}
