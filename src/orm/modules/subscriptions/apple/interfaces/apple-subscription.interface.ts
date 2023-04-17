import {
  AppleSubscriptionEnvironment,
  AppStoreReceiptResponse,
  PendingRenewalInfo,
} from './app-store-connect';

export interface IAppleSubscription {
  id: number;
  userId: number;
  originalTransactionId: string;
  environment: AppleSubscriptionEnvironment;
  productId: string | null;
  isActive: boolean;
  originalPurchaseDate: Date | null;
  purchaseDate: Date | null;
  expiresDate: Date | null;
  data: AppStoreReceiptResponse;
  renewalInfo: PendingRenewalInfo[] | null;
  receipt: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export type AppleSubscriptionScopesMap = Record<string, never>;
