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
