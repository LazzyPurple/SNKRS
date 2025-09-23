/**
 * TypeScript types for Shopify Customer Account API
 * Based on the Customer Account API GraphQL schema
 */

export interface Customer {
  id: string;
  firstName?: string;
  lastName?: string;
  displayName: string;
  email: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
  acceptsMarketing: boolean;
  defaultAddress?: Address;
  addresses: {
    nodes: Address[];
    pageInfo: PageInfo;
  };
  orders: {
    nodes: Order[];
    pageInfo: PageInfo;
  };
}

export interface Address {
  id: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  province?: string;
  provinceCode?: string;
  country: string;
  countryCode: string;
  zip: string;
  phone?: string;
  formatted: string[];
}

export interface Order {
  id: string;
  name: string;
  orderNumber: number;
  processedAt: string;
  fulfillmentStatus: FulfillmentStatus;
  financialStatus: FinancialStatus;
  currentTotalPrice: Money;
  currentSubtotalPrice: Money;
  currentTotalTax: Money;
  currentTotalDuties?: Money;
  shippingAddress?: Address;
  billingAddress?: Address;
  lineItems: {
    nodes: LineItem[];
    pageInfo: PageInfo;
  };
  fulfillments: {
    nodes: Fulfillment[];
  };
}

export interface LineItem {
  id: string;
  title: string;
  quantity: number;
  variant?: ProductVariant;
  currentQuantity: number;
  discountedTotalPrice: Money;
  originalTotalPrice: Money;
  image?: Image;
}

export interface ProductVariant {
  id: string;
  title: string;
  price: Money;
  compareAtPrice?: Money;
  availableForSale: boolean;
  selectedOptions: SelectedOption[];
  product: {
    id: string;
    title: string;
    handle: string;
  };
  image?: Image;
}

export interface SelectedOption {
  name: string;
  value: string;
}

export interface Image {
  id: string;
  url: string;
  altText?: string;
  width?: number;
  height?: number;
}

export interface Money {
  amount: string;
  currencyCode: string;
}

export interface Fulfillment {
  id: string;
  status: FulfillmentStatus;
  trackingCompany?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  updatedAt: string;
}

export interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor?: string;
  endCursor?: string;
}

export enum FulfillmentStatus {
  FULFILLED = 'FULFILLED',
  IN_TRANSIT = 'IN_TRANSIT',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  ATTEMPTED_DELIVERY = 'ATTEMPTED_DELIVERY',
  DELIVERED = 'DELIVERED',
  FAILURE = 'FAILURE',
  CANCELED = 'CANCELED',
  ERROR = 'ERROR',
  PENDING = 'PENDING',
  OPEN = 'OPEN',
  SUCCESS = 'SUCCESS',
}

export enum FinancialStatus {
  PENDING = 'PENDING',
  AUTHORIZED = 'AUTHORIZED',
  PARTIALLY_PAID = 'PARTIALLY_PAID',
  PAID = 'PAID',
  PARTIALLY_REFUNDED = 'PARTIALLY_REFUNDED',
  REFUNDED = 'REFUNDED',
  VOIDED = 'VOIDED',
}

// Input types for mutations
export interface CustomerUpdateInput {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  acceptsMarketing?: boolean;
}

export interface AddressInput {
  firstName?: string;
  lastName?: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  province?: string;
  country: string;
  zip: string;
  phone?: string;
}

// Error types
export interface CustomerUserError {
  field?: string[];
  message: string;
  code?: CustomerErrorCode;
}

export enum CustomerErrorCode {
  BLANK = 'BLANK',
  INVALID = 'INVALID',
  TAKEN = 'TAKEN',
  TOO_LONG = 'TOO_LONG',
  TOO_SHORT = 'TOO_SHORT',
  UNIDENTIFIED_CUSTOMER = 'UNIDENTIFIED_CUSTOMER',
  CUSTOMER_DISABLED = 'CUSTOMER_DISABLED',
  PASSWORD_STARTS_OR_ENDS_WITH_WHITESPACE = 'PASSWORD_STARTS_OR_ENDS_WITH_WHITESPACE',
  CONTAINS_HTML_TAGS = 'CONTAINS_HTML_TAGS',
  CONTAINS_URL = 'CONTAINS_URL',
  TOKEN_INVALID = 'TOKEN_INVALID',
  ALREADY_ENABLED = 'ALREADY_ENABLED',
  NOT_FOUND = 'NOT_FOUND',
}

// Response types for mutations
export interface CustomerUpdateResponse {
  customer?: Customer;
  customerUserErrors: CustomerUserError[];
}

export interface AddressCreateResponse {
  customerAddress?: Address;
  customerUserErrors: CustomerUserError[];
}

export interface AddressUpdateResponse {
  customerAddress?: Address;
  customerUserErrors: CustomerUserError[];
}

export interface AddressDeleteResponse {
  deletedCustomerAddressId?: string;
  customerUserErrors: CustomerUserError[];
}