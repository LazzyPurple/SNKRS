const endpoint = `https://${
  import.meta.env.VITE_SHOPIFY_DOMAIN
}/api/2023-07/graphql.json`;

async function shopifyFetch<T>(
  query: string,
  variables: Record<string, any> = {}
): Promise<T> {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": import.meta.env
        .VITE_SHOPIFY_STOREFRONT_TOKEN!,
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

//Récupérer des produits (Product List)
export async function fetchProducts() {
  const query = `
    {
      products(first: 8) {
        edges {
          node {
            id
            title
            images(first: 1) {
              edges { node { url } }
            }
            variants(first: 1) {
              edges {
                node {
                  price {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const data = await shopifyFetch<{ products: { edges: { node: any }[] } }>(
    query
  );
  return data.products.edges.map((e) => e.node);
}

//Récupérer des produits (Product page)
export async function fetchProductById(id: string) {
  const query = `
    query getProduct($id: ID!) {
      product(id: $id) {
        id
        title
        description
        images(first: 3) {
          edges { node { url } }
        }
        variants(first: 5) {
          edges {
            node {
              id
              title
              availableForSale
              price { amount currencyCode }
            }
          }
        }
      }
    }
  `;

  const data = await shopifyFetch<{ product: any }>(query, { id });
  return data.product;
}

// Créer un panier
export async function createCart(
  lines: { merchandiseId: string; quantity?: number }[] = []
) {
  const query = `
    mutation CreateCart($lines: [CartLineInput!]) {
      cartCreate(input: { lines: $lines }) {
        cart {
          id
          checkoutUrl
          lines(first: 50) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    product { 
                      title
                      images(first: 1) {
                        edges { node { url } }
                      }
                    }
                    price { amount currencyCode }
                  }
                }
              }
            }
          }
        }
      }
    }
  `;
  const variables = { lines };
  const data = await shopifyFetch<{ cartCreate: { cart: any } }>(
    query,
    variables
  );
  return data.cartCreate.cart;
}

// Ajouter un produit au panier
export async function addToCart(
  cartId: string,
  lines: { merchandiseId: string; quantity?: number }[]
) {
  const query = `
    mutation AddToCart($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          id
          checkoutUrl
          lines(first: 50) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    product { 
                      title
                      images(first: 1) {
                        edges { node { url } }
                      }
                    }
                    price { amount currencyCode }
                  }
                }
              }
            }
          }
        }
      }
    }
  `;
  const variables = { cartId, lines };
  const data = await shopifyFetch<{ cartLinesAdd: { cart: any } }>(
    query,
    variables
  );
  return data.cartLinesAdd.cart;
}

// Customer Authentication Functions

// Create a new customer account
export async function customerCreate(
  email: string,
  password: string,
  firstName?: string,
  lastName?: string
) {
  const query = `
    mutation CustomerCreate($input: CustomerCreateInput!) {
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
  
  const variables = {
    input: {
      email,
      password,
      firstName,
      lastName,
    },
  };
  
  const data = await shopifyFetch<{ customerCreate: any }>(query, variables);
  return data.customerCreate;
}

// Create customer access token (login)
export async function customerAccessTokenCreate(email: string, password: string) {
  const query = `
    mutation CustomerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
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
  
  const variables = {
    input: {
      email,
      password,
    },
  };
  
  const data = await shopifyFetch<{ customerAccessTokenCreate: any }>(query, variables);
  return data.customerAccessTokenCreate;
}

// Delete customer access token (logout)
export async function customerAccessTokenDelete(customerAccessToken: string) {
  const query = `
    mutation CustomerAccessTokenDelete($customerAccessToken: String!) {
      customerAccessTokenDelete(customerAccessToken: $customerAccessToken) {
        deletedAccessToken
        deletedCustomerAccessTokenId
        userErrors {
          field
          message
        }
      }
    }
  `;
  
  const variables = { customerAccessToken };
  
  const data = await shopifyFetch<{ customerAccessTokenDelete: any }>(query, variables);
  return data.customerAccessTokenDelete;
}

// Get customer information
export async function getCustomer(customerAccessToken: string) {
  const query = `
    query GetCustomer($customerAccessToken: String!) {
      customer(customerAccessToken: $customerAccessToken) {
        id
        email
        firstName
        lastName
        phone
        createdAt
        updatedAt
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
      }
    }
  `;
  
  const variables = { customerAccessToken };
  
  const data = await shopifyFetch<{ customer: any }>(query, variables);
  return data.customer;
}
