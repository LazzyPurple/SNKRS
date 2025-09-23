/**
 * GraphQL client for Shopify Customer Account API
 * Handles authentication, token refresh, and error handling
 */

import { getStoredTokens, refreshToken, logout } from './oidc';
import type { 
  Customer, 
  Order, 
  Address, 
  CustomerUpdateInput, 
  AddressInput,
  CustomerUpdateResponse,
  AddressCreateResponse,
  AddressUpdateResponse,
  AddressDeleteResponse
} from '../types/customer';

interface GraphQLResponse<T = any> {
  data?: T;
  errors?: Array<{
    message: string;
    extensions?: {
      code?: string;
    };
  }>;
}

interface GraphQLRequest {
  query: string;
  variables?: Record<string, any>;
}

class CustomerGraphQLClient {
  private baseUrl: string;
  private isRefreshing = false;
  private refreshPromise: Promise<boolean> | null = null;

  constructor() {
    this.baseUrl = import.meta.env.VITE_SHOPIFY_CUSTOMER_GRAPHQL_URL;
  }

  /**
   * Make a GraphQL request with automatic token refresh
   */
  async request<T = any>(query: string, variables?: Record<string, any>): Promise<T> {
    const tokens = getStoredTokens();
    if (!tokens) {
      throw new Error('No authentication token available');
    }

    const response = await this.makeRequest({ query, variables }, tokens.access_token);
    
    // Check for authentication errors
    if (response.errors?.some(error => 
      error.extensions?.code === 'UNAUTHENTICATED' || 
      error.message.includes('Unauthorized')
    )) {
      // Try to refresh token once
      const refreshed = await this.handleTokenRefresh();
      if (refreshed) {
        const newTokens = getStoredTokens();
        if (newTokens) {
          // Retry the request with new token
          const retryResponse = await this.makeRequest({ query, variables }, newTokens.access_token);
          if (retryResponse.errors?.some(error => 
            error.extensions?.code === 'UNAUTHENTICATED' || 
            error.message.includes('Unauthorized')
          )) {
            // Still failing after refresh, logout user
            await logout();
            throw new Error('Authentication failed');
          }
          return retryResponse.data;
        }
      } else {
        // Refresh failed, logout user
        await logout();
        throw new Error('Authentication failed');
      }
    }

    if (response.errors && response.errors.length > 0) {
      throw new Error(response.errors[0].message);
    }

    return response.data;
  }

  /**
   * Make the actual HTTP request
   */
  private async makeRequest(request: GraphQLRequest, accessToken: string): Promise<GraphQLResponse> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Handle token refresh with deduplication
   */
  private async handleTokenRefresh(): Promise<boolean> {
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise;
    }

    this.isRefreshing = true;
    this.refreshPromise = refreshToken();

    try {
      const result = await this.refreshPromise;
      return result;
    } finally {
      this.isRefreshing = false;
      this.refreshPromise = null;
    }
  }
}

// Create singleton instance
const client = new CustomerGraphQLClient();

// GraphQL queries and mutations
const GET_CUSTOMER_QUERY = `
  query getCustomer {
    customer {
      id
      firstName
      lastName
      displayName
      email
      phone
      createdAt
      updatedAt
      acceptsMarketing
      defaultAddress {
        id
        firstName
        lastName
        company
        address1
        address2
        city
        province
        provinceCode
        country
        countryCode
        zip
        phone
        formatted
      }
    }
  }
`;

const UPDATE_CUSTOMER_MUTATION = `
  mutation customerUpdate($customer: CustomerUpdateInput!) {
    customerUpdate(customer: $customer) {
      customer {
        id
        firstName
        lastName
        displayName
        email
        phone
        acceptsMarketing
      }
      customerUserErrors {
        field
        message
        code
      }
    }
  }
`;

const GET_ADDRESSES_QUERY = `
  query getAddresses($first: Int = 10, $after: String) {
    customer {
      addresses(first: $first, after: $after) {
        nodes {
          id
          firstName
          lastName
          company
          address1
          address2
          city
          province
          provinceCode
          country
          countryCode
          zip
          phone
          formatted
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
      }
    }
  }
`;

const CREATE_ADDRESS_MUTATION = `
  mutation customerAddressCreate($address: MailingAddressInput!) {
    customerAddressCreate(address: $address) {
      customerAddress {
        id
        firstName
        lastName
        company
        address1
        address2
        city
        province
        provinceCode
        country
        countryCode
        zip
        phone
        formatted
      }
      customerUserErrors {
        field
        message
        code
      }
    }
  }
`;

const UPDATE_ADDRESS_MUTATION = `
  mutation customerAddressUpdate($id: ID!, $address: MailingAddressInput!) {
    customerAddressUpdate(id: $id, address: $address) {
      customerAddress {
        id
        firstName
        lastName
        company
        address1
        address2
        city
        province
        provinceCode
        country
        countryCode
        zip
        phone
        formatted
      }
      customerUserErrors {
        field
        message
        code
      }
    }
  }
`;

const DELETE_ADDRESS_MUTATION = `
  mutation customerAddressDelete($id: ID!) {
    customerAddressDelete(id: $id) {
      deletedCustomerAddressId
      customerUserErrors {
        field
        message
        code
      }
    }
  }
`;

const SET_DEFAULT_ADDRESS_MUTATION = `
  mutation customerDefaultAddressUpdate($addressId: ID!) {
    customerDefaultAddressUpdate(addressId: $addressId) {
      customer {
        id
        defaultAddress {
          id
        }
      }
      customerUserErrors {
        field
        message
        code
      }
    }
  }
`;

const GET_ORDERS_QUERY = `
  query getOrders($first: Int = 10, $after: String) {
    customer {
      orders(first: $first, after: $after) {
        nodes {
          id
          name
          orderNumber
          processedAt
          fulfillmentStatus
          financialStatus
          currentTotalPrice {
            amount
            currencyCode
          }
          currentSubtotalPrice {
            amount
            currencyCode
          }
          currentTotalTax {
            amount
            currencyCode
          }
          shippingAddress {
            id
            firstName
            lastName
            address1
            address2
            city
            province
            country
            zip
            formatted
          }
          lineItems(first: 10) {
            nodes {
              id
              title
              quantity
              currentQuantity
              discountedTotalPrice {
                amount
                currencyCode
              }
              originalTotalPrice {
                amount
                currencyCode
              }
              variant {
                id
                title
                price {
                  amount
                  currencyCode
                }
                product {
                  id
                  title
                  handle
                }
                image {
                  id
                  url
                  altText
                  width
                  height
                }
              }
              image {
                id
                url
                altText
                width
                height
              }
            }
          }
          fulfillments {
            nodes {
              id
              status
              trackingCompany
              trackingNumber
              trackingUrl
              updatedAt
            }
          }
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
      }
    }
  }
`;

// API functions
export async function getCustomer(): Promise<Customer> {
  const response = await client.request<{ customer: Customer }>(GET_CUSTOMER_QUERY);
  return response.customer;
}

export async function updateCustomer(input: CustomerUpdateInput): Promise<CustomerUpdateResponse> {
  const response = await client.request<{ customerUpdate: CustomerUpdateResponse }>(
    UPDATE_CUSTOMER_MUTATION,
    { customer: input }
  );
  return response.customerUpdate;
}

export async function getAddresses(first = 10, after?: string): Promise<{ nodes: Address[]; pageInfo: any }> {
  const response = await client.request<{ customer: { addresses: { nodes: Address[]; pageInfo: any } } }>(
    GET_ADDRESSES_QUERY,
    { first, after }
  );
  return response.customer.addresses;
}

export async function createAddress(address: AddressInput): Promise<AddressCreateResponse> {
  const response = await client.request<{ customerAddressCreate: AddressCreateResponse }>(
    CREATE_ADDRESS_MUTATION,
    { address }
  );
  return response.customerAddressCreate;
}

export async function updateAddress(id: string, address: AddressInput): Promise<AddressUpdateResponse> {
  const response = await client.request<{ customerAddressUpdate: AddressUpdateResponse }>(
    UPDATE_ADDRESS_MUTATION,
    { id, address }
  );
  return response.customerAddressUpdate;
}

export async function deleteAddress(id: string): Promise<AddressDeleteResponse> {
  const response = await client.request<{ customerAddressDelete: AddressDeleteResponse }>(
    DELETE_ADDRESS_MUTATION,
    { id }
  );
  return response.customerAddressDelete;
}

export async function setDefaultAddress(addressId: string): Promise<{ customer: Customer; customerUserErrors: any[] }> {
  const response = await client.request<{ customerDefaultAddressUpdate: { customer: Customer; customerUserErrors: any[] } }>(
    SET_DEFAULT_ADDRESS_MUTATION,
    { addressId }
  );
  return response.customerDefaultAddressUpdate;
}

export async function getOrders(first = 10, after?: string): Promise<{ nodes: Order[]; pageInfo: any }> {
  const response = await client.request<{ customer: { orders: { nodes: Order[]; pageInfo: any } } }>(
    GET_ORDERS_QUERY,
    { first, after }
  );
  return response.customer.orders;
}