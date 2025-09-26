// Customer authentication API using Shopify Storefront GraphQL
// No OAuth/PKCE - direct customerAccessToken management

const endpoint = `/api/shopify/graphql.json`;

async function shopifyFetch<T>(
  query: string,
  variables: Record<string, unknown> = {}
): Promise<T> {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors) {
    console.error("Shopify GraphQL Error:", json.errors);
    throw new Error("Shopify API error");
  }
  return json.data as T;
}

// Types
export interface CustomerRegisterInput {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface CustomerAccessToken {
  accessToken: string;
  expiresAt: string;
}

export interface CustomerUserError {
  field: string[];
  message: string;
}

export interface CustomerAddressInput {
  firstName?: string;
  lastName?: string;
  company?: string;
  address1?: string;
  address2?: string;
  city?: string;
  province?: string;
  country?: string;
  zip?: string;
  phone?: string;
}

export interface Customer {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  defaultAddress?: {
    id: string;
    firstName?: string;
    lastName?: string;
    company?: string;
    address1?: string;
    address2?: string;
    city?: string;
    province?: string;
    country?: string;
    zip?: string;
    phone?: string;
  };
  addresses: {
    nodes: Array<{
      id: string;
      firstName?: string;
      lastName?: string;
      company?: string;
      address1?: string;
      address2?: string;
      city?: string;
      province?: string;
      country?: string;
      zip?: string;
      phone?: string;
    }>;
  };
  orders: {
    nodes: Array<{
      id: string;
      orderNumber: number;
      processedAt: string;
      totalPrice: {
        amount: string;
        currencyCode: string;
      };
      fulfillmentStatus: string;
      financialStatus: string;
      lineItems: {
        nodes: Array<{
          title: string;
          quantity: number;
          variant?: {
            title: string;
            product: {
              title: string;
            };
          };
        }>;
      };
    }>;
  };
}

// Register a new customer
export async function register(input: CustomerRegisterInput): Promise<{
  customer?: Customer;
  customerUserErrors: CustomerUserError[];
}> {
  const query = `
    mutation customerCreate($input: CustomerCreateInput!) {
      customerCreate(input: $input) {
        customer {
          id
          email
          firstName
          lastName
        }
        customerUserErrors {
          field
          message
        }
      }
    }
  `;

  const data = await shopifyFetch<{
    customerCreate: {
      customer?: Customer;
      customerUserErrors: CustomerUserError[];
    };
  }>(query, { input });

  return data.customerCreate;
}

// Login customer and get access token
export async function login(email: string, password: string): Promise<{
  customerAccessToken?: CustomerAccessToken;
  customerUserErrors: CustomerUserError[];
}> {
  const query = `
    mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
      customerAccessTokenCreate(input: $input) {
        customerAccessToken {
          accessToken
          expiresAt
        }
        customerUserErrors {
          field
          message
        }
      }
    }
  `;

  const data = await shopifyFetch<{
    customerAccessTokenCreate: {
      customerAccessToken?: CustomerAccessToken;
      customerUserErrors: CustomerUserError[];
    };
  }>(query, { input: { email, password } });

  return data.customerAccessTokenCreate;
}

// Logout customer by deleting access token
export async function logout(token: string): Promise<{
  deletedAccessToken?: string;
  customerUserErrors: CustomerUserError[];
}> {
  const query = `
    mutation customerAccessTokenDelete($customerAccessToken: String!) {
      customerAccessTokenDelete(customerAccessToken: $customerAccessToken) {
        deletedAccessToken
        customerUserErrors {
          field
          message
        }
      }
    }
  `;

  const data = await shopifyFetch<{
    customerAccessTokenDelete: {
      deletedAccessToken?: string;
      customerUserErrors: CustomerUserError[];
    };
  }>(query, { customerAccessToken: token });

  return data.customerAccessTokenDelete;
}

// Get customer information using access token
export async function getMe(token: string): Promise<{
  customer?: Customer;
  customerUserErrors: CustomerUserError[];
}> {
  const query = `
    query customer($customerAccessToken: String!) {
      customer(customerAccessToken: $customerAccessToken) {
        id
        email
        firstName
        lastName
        defaultAddress {
          id
          firstName
          lastName
          company
          address1
          address2
          city
          province
          country
          zip
          phone
        }
        addresses(first: 20) {
          nodes {
            id
            firstName
            lastName
            company
            address1
            address2
            city
            province
            country
            zip
            phone
          }
        }
        orders(first: 10, sortKey: PROCESSED_AT, reverse: true) {
          nodes {
            id
            orderNumber
            processedAt
            totalPrice {
              amount
              currencyCode
            }
            fulfillmentStatus
            financialStatus
            lineItems(first: 10) {
              nodes {
                title
                quantity
                variant {
                  title
                  product {
                    title
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const data = await shopifyFetch<{
      customer?: Customer;
    }>(query, { customerAccessToken: token });

    return {
      customer: data.customer,
      customerUserErrors: []
    };
  } catch (_error) {
    return {
      customer: undefined,
      customerUserErrors: [{ field: ['token'], message: 'Invalid or expired access token' }]
    };
  }
}

// Add a new address to customer
export async function addAddress(token: string, address: CustomerAddressInput): Promise<string> {
  const query = `
    mutation customerAddressCreate($customerAccessToken: String!, $address: MailingAddressInput!) {
      customerAddressCreate(customerAccessToken: $customerAccessToken, address: $address) {
        customerAddress {
          id
        }
        customerUserErrors {
          field
          message
        }
      }
    }
  `;

  const data = await shopifyFetch<{
    customerAddressCreate: {
      customerAddress?: { id: string };
      customerUserErrors: CustomerUserError[];
    };
  }>(query, { customerAccessToken: token, address });

  const result = data.customerAddressCreate;
  
  if (result.customerUserErrors.length > 0) {
    throw new Error(result.customerUserErrors[0].message);
  }

  if (!result.customerAddress) {
    throw new Error('Failed to create address');
  }

  return result.customerAddress.id;
}

// Update an existing address
export async function updateAddress(token: string, id: string, address: CustomerAddressInput): Promise<{
  data?: { id: string };
  errorsNormalized: CustomerUserError[];
}> {
  const query = `
    mutation customerAddressUpdate($customerAccessToken: String!, $id: ID!, $address: MailingAddressInput!) {
      customerAddressUpdate(customerAccessToken: $customerAccessToken, id: $id, address: $address) {
        customerAddress {
          id
        }
        customerUserErrors {
          field
          message
        }
      }
    }
  `;

  try {
    const data = await shopifyFetch<{
      customerAddressUpdate: {
        customerAddress?: { id: string };
        customerUserErrors: CustomerUserError[];
      };
    }>(query, { customerAccessToken: token, id, address });

    const result = data.customerAddressUpdate;
    
    // Normalize errors to ensure field is always an array
    const errorsNormalized = result.customerUserErrors.map(error => ({
      ...error,
      field: Array.isArray(error.field) ? error.field : []
    }));

    return {
      data: result.customerAddress,
      errorsNormalized
    };
  } catch (error) {
    console.error('Address update failed:', error);
    return {
      data: undefined,
      errorsNormalized: [{ field: [], message: 'Erreur lors de la mise à jour de l\'adresse. Veuillez réessayer.' }]
    };
  }
}

// Delete an address
export async function deleteAddress(token: string, id: string): Promise<{
  data?: { deletedCustomerAddressId: string };
  errorsNormalized: CustomerUserError[];
}> {
  const query = `
    mutation customerAddressDelete($customerAccessToken: String!, $id: ID!) {
      customerAddressDelete(customerAccessToken: $customerAccessToken, id: $id) {
        deletedCustomerAddressId
        customerUserErrors {
          field
          message
        }
      }
    }
  `;

  try {
    const data = await shopifyFetch<{
      customerAddressDelete: {
        deletedCustomerAddressId?: string;
        customerUserErrors: CustomerUserError[];
      };
    }>(query, { customerAccessToken: token, id });

    const result = data.customerAddressDelete;
    
    // Normalize errors to ensure field is always an array
    const errorsNormalized = result.customerUserErrors.map(error => ({
      ...error,
      field: Array.isArray(error.field) ? error.field : []
    }));

    return {
      data: result.deletedCustomerAddressId ? { deletedCustomerAddressId: result.deletedCustomerAddressId } : undefined,
      errorsNormalized
    };
  } catch (error) {
    console.error('Address deletion failed:', error);
    return {
      data: undefined,
      errorsNormalized: [{ field: [], message: 'Erreur lors de la suppression de l\'adresse. Veuillez réessayer.' }]
    };
  }
}

// Request password reset email
export async function requestPasswordReset(email: string): Promise<{
  success: boolean;
  customerUserErrors: CustomerUserError[];
}> {
  const query = `
    mutation customerRecover($email: String!) {
      customerRecover(email: $email) {
        customerUserErrors {
          field
          message
        }
      }
    }
  `;

  try {
    const data = await shopifyFetch<{
      customerRecover: {
        customerUserErrors: CustomerUserError[];
      };
    }>(query, { email });

    const result = data.customerRecover;
    
    return {
      success: result.customerUserErrors.length === 0,
      customerUserErrors: result.customerUserErrors
    };
  } catch (error) {
    console.error('Password reset request failed:', error);
    return {
      success: false,
      customerUserErrors: [{ field: ['email'], message: 'Erreur lors de la demande de réinitialisation. Veuillez réessayer.' }]
    };
  }
}

// Reset password with token
export async function resetPassword(resetToken: string, password: string): Promise<{
  customerAccessToken?: CustomerAccessToken;
  customerUserErrors: CustomerUserError[];
}> {
  const query = `
    mutation customerReset($id: ID!, $input: CustomerResetInput!) {
      customerReset(id: $id, input: $input) {
        customerAccessToken {
          accessToken
          expiresAt
        }
        customerUserErrors {
          field
          message
        }
      }
    }
  `;

  try {
    const data = await shopifyFetch<{
      customerReset: {
        customerAccessToken?: CustomerAccessToken;
        customerUserErrors: CustomerUserError[];
      };
    }>(query, { 
      id: resetToken, 
      input: { password } 
    });

    return data.customerReset;
  } catch (error) {
    console.error('Password reset failed:', error);
    return {
      customerAccessToken: undefined,
      customerUserErrors: [{ field: ['password'], message: 'Erreur lors de la réinitialisation. Veuillez réessayer.' }]
    };
  }
}