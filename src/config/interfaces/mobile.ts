export interface MobileConfig {
  auth: {
    /** 0 to use random */
    defaultSmsCode: number;
    /** in minutes */
    smsCodeLifetime: number;
    /** in seconds, 0 to disable */
    smsCodeFrequency: number;
  };
  socials: {
    apple: {
      clientId: string;
      teamId: string;
      keyIdentifier: string;
      subscription: {
        bundleId: string;
        issuerId: string;
        keyId: string;
      };
    };
  };
}
