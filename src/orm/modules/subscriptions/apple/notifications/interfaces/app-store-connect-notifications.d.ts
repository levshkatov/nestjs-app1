/** https://developer.apple.com/documentation/appstoreservernotifications/jwsdecodedheader */
export interface AppStoreNotificationHeader {
  /** The algorithm used for signing the JSON Web Signature (JWS).*/
  alg: string;

  /** The public key certificate chain that corresponds to the key that the App Store used to secure the JWS.*/
  x5c: string[];
}

/** https://developer.apple.com/documentation/appstoreservernotifications/responsebodyv2decodedpayload */
export interface AppStoreNotificationPayload {
  /** The in-app purchase event for which the App Store sent this version 2 notification.*/
  notificationType: NotificationType;

  /** Additional information that identifies the notification event, or an empty string. The subtype applies only to select version 2 notifications.*/
  subtype?: Subtype;

  /** A unique identifier for the notification. Use this value to identify a duplicate notification.*/
  notificationUUID: NotificationUUID;

  /** The version number of the notification.*/
  notificationVersion?: NotificationVersion;

  /** The version number of the notification.*/
  version?: NotificationVersion;

  /** The object that contains the app metadata and signed renewal and transaction information.*/
  data: Data;
}

/** https://developer.apple.com/documentation/appstoreservernotifications/notificationtype */
type NotificationType =
  | 'CONSUMPTION_REQUEST' /** Indicates that the customer initiated a refund request for a consumable in-app purchase, and the App Store is requesting that you provide consumption data. For more information, see Send Consumption Information. */
  | 'DID_CHANGE_RENEWAL_PREF' /** A notification type that along with its subtype indicates that the user made a change to their subscription plan. If the subtype is UPGRADE, the user upgraded their subscription. The upgrade goes into effect immediately, starting a new billing period, and the user receives a prorated refund for the unused portion of the previous period. If the subtype is DOWNGRADE, the user downgraded or cross-graded their subscription. Downgrades take effect at the next renewal. The currently active plan isn’t affected.If the subtype is empty, the user changed their renewal preference back to the current subscription, effectively canceling a downgrade. */
  | 'DID_CHANGE_RENEWAL_STATUS' /** A notification type that along with its subtype indicates that the user made a change to the subscription renewal status. If the subtype is AUTO_RENEW_ENABLED, the user re-enabled subscription auto-renewal. If the subtype is AUTO_RENEW_DISABLED, the user disabled subscription auto-renewal, or the App Store disabled subscription auto-renewal after the user requested a refund. */
  | 'DID_FAIL_TO_RENEW' /** A notification type that along with its subtype indicates that the subscription failed to renew due to a billing issue. The subscription enters the billing retry period. If the subtype is GRACE_PERIOD, continue to provide service through the grace period. If the subtype is empty, the subscription isn’t in a grace period and you can stop providing the subscription service. Inform the user that there may be an issue with their billing information. The App Store continues to retry billing for 60 days, or until the user resolves their billing issue or cancels their subscription, whichever comes first. For more information, see Reducing Involuntary Subscriber Churn. */
  | 'DID_RENEW' /** A notification type that along with its subtype indicates that the subscription successfully renewed. If the subtype is BILLING_RECOVERY, the expired subscription that previously failed to renew now successfully renewed. If the substate is empty, the active subscription has successfully auto-renewed for a new transaction period. Provide the customer with access to the subscription’s content or service. */
  | 'EXPIRED' /** A notification type that along with its subtype indicates that a subscription expired. If the subtype is VOLUNTARY, the subscription expired after the user disabled subscription renewal. If the subtype is BILLING_RETRY, the subscription expired because the billing retry period ended without a successful billing transaction. If the subtype is PRICE_INCREASE, the subscription expired because the user didn’t consent to a price increase. */
  | 'GRACE_PERIOD_EXPIRED' /** Indicates that the billing grace period has ended without renewing the subscription, so you can turn off access to service or content. Inform the user that there may be an issue with their billing information. The App Store continues to retry billing for 60 days, or until the user resolves their billing issue or cancels their subscription, whichever comes first. For more information, see Reducing Involuntary Subscriber Churn. */
  | 'OFFER_REDEEMED' /** A notification type that along with its subtype indicates that the user redeemed a promotional offer or offer code. If the subtype is INITIAL_BUY, the user redeemed the offer for a first-time purchase. If the subtype is RESUBSCRIBE, the user redeemed an offer to resubscribe to an inactive subscription. If the subtype is UPGRADE, the user redeemed an offer to upgrade their active subscription that goes into effect immediately. If the subtype is DOWNGRADE, the user redeemed an offer to downgrade their active subscription that goes into effect at the next renewal date. If the user redeemed an offer for their active subscription, you receive an OFFER_REDEEMED notification type without a subtype.For more information about promotional offers, see Implementing Promotional Offers in Your App. For more information about offer codes, see Implementing Offer Codes in Your App. */
  | 'PRICE_INCREASE' /** A notification type that along with its subtype indicates that the system has informed the customer of a subscription price increase. If the subtype is PENDING, the customer hasn’t yet responded to the price increase. If the subtype is ACCEPTED, the customer has accepted the price increase.For information about how the system informs customers of a price increase while the app is running, see paymentQueueShouldShowPriceConsent(_:). */
  | 'REFUND' /** Indicates that the App Store successfully refunded a transaction for a consumable in-app purchase, a non-consumable in-app purchase, an auto-renewable subscription, or a non-renewing subscription.The revocationDate contains the timestamp of the refunded transaction. The originalTransactionId and productId identify the original transaction and product. The revocationReason contains the reason.To request a list of all refunded transactions for a user, see Get Refund History in the App Store Server API. */
  | 'REFUND_DECLINED' /** Indicates that the App Store declined a refund request initiated by the app developer. */
  | 'RENEWAL_EXTENDED' /** Indicates that the App Store extended the subscription renewal date that the developer requested. */
  | 'REVOKE' /** Indicates that an in-app purchase the user was entitled to through Family Sharing is no longer available through sharing. The App Store sends this notification when a purchaser disabled Family Sharing for a product, the purchaser (or family member) left the family group, or the purchaser asked for and received a refund. Your app also receives a paymentQueue(_:didRevokeEntitlementsForProductIdentifiers:) call. Family Sharing applies to non-consumable in-app purchases and auto-renewable subscriptions. For more information about Family Sharing, see Supporting Family Sharing in Your App. */
  | 'SUBSCRIBED' /** A notification type that along with its subtype indicates that the user subscribed to a product. If the subtype is INITIAL_BUY, the user either purchased or received access through Family Sharing to the subscription for the first time. If the subtype is RESUBSCRIBE, the user resubscribed or received access through Family Sharing to the same subscription or to another subscription within the same subscription group. */;

/** https://developer.apple.com/documentation/appstoreservernotifications/subtype */
type Subtype =
  | 'INITIAL_BUY' /** Applies to the SUBSCRIBED notificationType. A notification with this subtype indicates that the user purchased the subscription for the first time or that the user received access to the subscription through Family Sharing for the first time. */
  | 'RESUBSCRIBE' /** Applies to the SUBSCRIBED notificationType. A notification with this subtype indicates that the user resubscribed or received access through Family Sharing to the same subscription or to another subscription within the same subscription group. */
  | 'DOWNGRADE' /** Applies to the DID_CHANGE_RENEWAL_PREF notificationType. A notification with this subtype indicates that the user downgraded their subscription. Downgrades take effect at the next renewal. */
  | 'UPGRADE' /** Applies to the DID_CHANGE_RENEWAL_PREF notificationType. A notification with this subtype indicates that the user upgraded their subscription. Upgrades take effect immediately. */
  | 'AUTO_RENEW_ENABLED' /** Applies to the DID_CHANGE_RENEWAL_STATUS notificationType. A notification with this subtype indicates that the user enabled subscription auto-renewal. */
  | 'AUTO_RENEW_DISABLED' /** Applies to the DID_CHANGE_RENEWAL_STATUS notificationType. A notification with this subtype indicates that the user disabled subscription auto-renewal, or the App Store disabled subscription auto-renewal after the user requested a refund. */
  | 'VOLUNTARY' /** Applies to the EXPIRED notificationType. A notification with this subtype indicates that the subscription expired after the user disabled subscription auto-renewal. */
  | 'BILLING_RETRY' /** Applies to the EXPIRED notificationType. A notification with this subtype indicates that the subscription expired because the subscription failed to renew before the billing retry period ended. */
  | 'PRICE_INCREASE' /** Applies to the EXPIRED notificationType. A notification with this subtype indicates that the subscription expired because the user didn’t consent to a price increase. */
  | 'GRACE_PERIOD' /** Applies to the DID_FAIL_TO_RENEW notificationType. A notification with this subtype indicates that the subscription failed to renew due to a billing issue; continue to provide access to the subscription during the grace period. */
  | 'BILLING_RECOVERY' /** Applies to the DID_RENEW notificationType. A notification with this subtype indicates that the expired subscription which previously failed to renew now successfully renewed. */
  | 'PENDING' /** Applies to the PRICE_INCREASE notificationType. A notification with this subtype indicates that the system informed the user of the subscription price increase, but the user hasn’t yet accepted it. */
  | 'ACCEPTED' /** Applies to the PRICE_INCREASE notificationType. A notification with this subtype indicates that the user accepted the subscription price increase. */;

/** https://developer.apple.com/documentation/appstoreservernotifications/notificationuuid */
type NotificationUUID = string;

/** https://developer.apple.com/documentation/appstoreservernotifications/notificationversion */
type NotificationVersion = string;

/** https://developer.apple.com/documentation/appstoreservernotifications/data */
interface Data {
  /** The unique identifier of the app that the notification applies to. This property is available for apps that are downloaded from the App Store; it’s not available in the sandbox environment.*/
  appAppleId?: AppAppleId;

  /** The bundle identifier of the app.*/
  bundleId?: BundleId;

  /** The version of the build that identifies an iteration of the bundle.*/
  bundleVersion?: BundleVersion;

  /** The server environment that the notification applies to, either sandbox or production.*/
  environment?: Environment;

  /** Subscription renewal information signed by the App Store, in JSON Web Signature format.*/
  signedRenewalInfo?: SignedRenewalInfo;

  /** Transaction information signed by the App Store, in JSON Web Signature format.*/
  signedTransactionInfo?: SignedTransactionInfo;

  renewalInfo?: AppStoreNotificationRenewalInfo;

  transactionInfo?: AppStoreNotificationTransactionInfo;
}

/** https://developer.apple.com/documentation/appstoreservernotifications/appappleid */
type AppAppleId = number;

/** https://developer.apple.com/documentation/appstoreservernotifications/bundleid */
type BundleId = string;

/** https://developer.apple.com/documentation/appstoreservernotifications/bundleversion */
type BundleVersion = string;

/** https://developer.apple.com/documentation/appstoreservernotifications/environment */
type Environment =
  | 'Sandbox' /** Indicates that the notification applies to testing in the sandbox environment. */
  | 'Production' /** Indicates that the notification applies to the production environment. */;

/** https://developer.apple.com/documentation/appstoreservernotifications/jwsrenewalinfo */
type SignedRenewalInfo = string;

/** https://developer.apple.com/documentation/appstoreservernotifications/jwstransaction */
type SignedTransactionInfo = string;

/** https://developer.apple.com/documentation/appstoreservernotifications/jwsrenewalinfodecodedpayload */
interface AppStoreNotificationRenewalInfo {
  /** The product identifier of the product that renews at the next billing period.*/
  autoRenewProductId?: AutoRenewProductId;

  /** The renewal status for an auto-renewable subscription.*/
  autoRenewStatus?: AutoRenewStatus;

  /** The server environment, either sandbox or production.*/
  environment?: Environment;

  /** The reason a subscription expired.*/
  expirationIntent?: ExpirationIntent;

  /** The time when the billing grace period for subscription renewals expires.*/
  gracePeriodExpiresDate?: GracePeriodExpiresDate;

  /** A Boolean value that indicates whether the App Store is attempting to automatically renew an expired subscription.*/
  isInBillingRetryPeriod?: IsInBillingRetryPeriod;

  /** The identifier that contains the offer code or the promotional offer identifier.*/
  offerIdentifier?: OfferIdentifier;

  /** The type of subscription offer.*/
  offerType?: OfferType;

  /** The original transaction identifier of a purchase.*/
  originalTransactionId?: OriginalTransactionId;

  /** The status indicating whether a customer has approved a subscription price increase.*/
  priceIncreaseStatus?: PriceIncreaseStatus;

  /** The product identifier of the in-app purchase.*/
  productId?: ProductId;

  /** The UNIX time, in milliseconds, that the App Store signed the JSON Web Signature data.*/
  signedDate?: SignedDate;
}

/** https://developer.apple.com/documentation/appstoreservernotifications/autorenewproductid */
type AutoRenewProductId = string;

/** https://developer.apple.com/documentation/appstoreservernotifications/autorenewstatus */
type AutoRenewStatus =
  | 0 /** Automatic renewal is off. The customer has turned off automatic renewal for the subscription, and it won’t renew at the end of the current subscription period. */
  | 1 /** Automatic renewal is on. The subscription renews at the end of the current subscription period. */;

/** https://developer.apple.com/documentation/appstoreservernotifications/environment */
type Environment =
  | 'Sandbox' /** Indicates that the notification applies to testing in the sandbox environment. */
  | 'Production' /** Indicates that the notification applies to the production environment. */;

/** https://developer.apple.com/documentation/appstoreservernotifications/expirationintent */
type ExpirationIntent =
  | 1 /** The customer canceled their subscription. */
  | 2 /** A billing error occurred; for example, the customer’s payment information was no longer valid. */
  | 3 /** The customer didn’t consent to a recent price increase. */
  | 4 /** The product wasn’t available for purchase at the time of renewal. */;

/** https://developer.apple.com/documentation/appstoreservernotifications/graceperiodexpiresdate */
type GracePeriodExpiresDate = timestamp;

/** https://developer.apple.com/documentation/appstoreservernotifications/isinbillingretryperiod */
type IsInBillingRetryPeriod = boolean;

/** https://developer.apple.com/documentation/appstoreservernotifications/offeridentifier */
type OfferIdentifier = string;

/** https://developer.apple.com/documentation/appstoreservernotifications/offertype */
type OfferType =
  | 1 /** An introductory offer. */
  | 2 /** A promotional offer. */
  | 3 /** An offer with a subscription offer code. */;

/** https://developer.apple.com/documentation/appstoreservernotifications/originaltransactionid */
type OriginalTransactionId = string;

/** https://developer.apple.com/documentation/appstoreservernotifications/priceincreasestatus */
type PriceIncreaseStatus =
  | 0 /** The customer hasn’t responded to the subscription price increase. */
  | 1 /** The customer consented to the subscription price increase. */;

/** https://developer.apple.com/documentation/appstoreservernotifications/productid */
type ProductId = string;

/** https://developer.apple.com/documentation/appstoreservernotifications/signeddate */
type SignedDate = timestamp;

/** https://developer.apple.com/documentation/appstoreservernotifications/jwstransactiondecodedpayload */
interface AppStoreNotificationTransactionInfo {
  /** A UUID that associates the transaction with a user on your own service. If your app doesn’t provide an appAccountToken, this string is empty. For more information, see appAccountToken(_:).*/
  appAccountToken?: AppAccountToken;

  /** The bundle identifier of the app.*/
  bundleId?: BundleId;

  /** The server environment, either sandbox or production.*/
  environment?: Environment;

  /** The UNIX time, in milliseconds, the subscription expires or renews.*/
  expiresDate?: ExpiresDate;

  /** A string that describes whether the transaction was purchased by the user, or is available to them through Family Sharing.*/
  inAppOwnershipType?: InAppOwnershipType;

  /** A Boolean value that indicates whether the user upgraded to another subscription.*/
  isUpgraded?: IsUpgraded;

  /** The identifier that contains the promo code or the promotional offer identifier.*/
  offerIdentifier?: OfferIdentifier;

  /** A value that represents the promotional offer type.*/
  offerType?: OfferType;

  /** The UNIX time, in milliseconds, that represents the purchase date of the original transaction identifier.*/
  originalPurchaseDate?: OriginalPurchaseDate;

  /** The transaction identifier of the original purchase.*/
  originalTransactionId?: OriginalTransactionId;

  /** The product identifier of the in-app purchase.*/
  productId?: ProductId;

  /** The UNIX time, in milliseconds, that the App Store charged the user’s account for a purchase, restored product, subscription, or subscription renewal after a lapse.*/
  purchaseDate?: PurchaseDate;

  /** The number of consumable products the user purchased.*/
  quantity?: Quantity;

  /** The UNIX time, in milliseconds, that the App Store refunded the transaction or revoked it from Family Sharing.*/
  revocationDate?: RevocationDate;

  /** The reason that the App Store refunded the transaction or revoked it from Family Sharing.*/
  revocationReason?: RevocationReason;

  /** The UNIX time, in milliseconds, that the App Store signed the JSON Web Signature (JWS) data.*/
  signedDate?: SignedDate;

  /** The identifier of the subscription group the subscription belongs to.*/
  subscriptionGroupIdentifier?: SubscriptionGroupIdentifier;

  /** The unique identifier of the transaction.*/
  transactionId?: TransactionId;

  /** The type of the in-app purchase.*/
  type?: Type;

  /** The unique identifier of subscription purchase events across devices, including subscription renewals.*/
  webOrderLineItemId?: WebOrderLineItemId;
}

/** https://developer.apple.com/documentation/appstoreservernotifications/appaccounttoken */
type AppAccountToken = string /** uuid */;

/** https://developer.apple.com/documentation/appstoreservernotifications/bundleid */
type BundleId = string;

/** https://developer.apple.com/documentation/appstoreservernotifications/environment */
type Environment =
  | 'Sandbox' /** Indicates that the notification applies to testing in the sandbox environment. */
  | 'Production' /** Indicates that the notification applies to the production environment. */;

/** https://developer.apple.com/documentation/appstoreservernotifications/expiresdate */
type ExpiresDate = number;

/** https://developer.apple.com/documentation/appstoreservernotifications/inappownershiptype */
type InAppOwnershipType =
  | 'FAMILY_SHARED' /** The transaction belongs to a family member who benefits from the service. */
  | 'PURCHASED' /** The transaction belongs to the purchaser. */;

/** https://developer.apple.com/documentation/appstoreservernotifications/isupgraded */
type IsUpgraded = boolean;

/** https://developer.apple.com/documentation/appstoreservernotifications/offeridentifier */
type OfferIdentifier = string;

/** https://developer.apple.com/documentation/appstoreservernotifications/offertype */
type OfferType =
  | 1 /** An introductory offer. */
  | 2 /** A promotional offer. */
  | 3 /** An offer with a subscription offer code. */;

/** https://developer.apple.com/documentation/appstoreservernotifications/originalpurchasedate */
type OriginalPurchaseDate = timestamp;

/** https://developer.apple.com/documentation/appstoreservernotifications/originaltransactionid */
type OriginalTransactionId = string;

/** https://developer.apple.com/documentation/appstoreservernotifications/productid */
type ProductId = string;

/** https://developer.apple.com/documentation/appstoreservernotifications/purchasedate */
type PurchaseDate = timestamp;

/** https://developer.apple.com/documentation/appstoreservernotifications/quantity */
type Quantity = number;

/** https://developer.apple.com/documentation/appstoreservernotifications/revocationdate */
type RevocationDate = timestamp;

/** https://developer.apple.com/documentation/appstoreservernotifications/revocationreason */
type RevocationReason =
  | 1 /** Apple Support refunded the transaction on behalf of the customer due to an actual or perceived issue within your app. */
  | 0 /** Apple Support refunded the transaction on behalf of the customer for other reasons; for example, an accidental purchase. */;

/** https://developer.apple.com/documentation/appstoreservernotifications/signeddate */
type SignedDate = timestamp;

/** https://developer.apple.com/documentation/appstoreservernotifications/subscriptiongroupidentifier */
type SubscriptionGroupIdentifier = string;

/** https://developer.apple.com/documentation/appstoreservernotifications/transactionid */
type TransactionId = string;

/** https://developer.apple.com/documentation/appstoreservernotifications/type */
type Type =
  | 'Auto-Renewable Subscription' /** An auto-renewable subscription. */
  | 'Non-Consumable' /** A non-consumable in-app purchase. */
  | 'Consumable' /** A consumable in-app purchase. */
  | 'Non-Renewing Subscription' /** A non-renewing subcription. */;

/** https://developer.apple.com/documentation/appstoreservernotifications/weborderlineitemid */
type WebOrderLineItemId = string;
