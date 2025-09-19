const endpoint = `/api/shopify/graphql.json`;

// Product type definition for ProductCard
export type ProductCard = {
  id: string;
  title: string;
  handle: string;
  images: {
    nodes: {
      url: string;
    }[];
  };
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
};

async function shopifyFetch<T>(
  query: string,
  variables: Record<string, any> = {}
): Promise<T> {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Token is now handled by the proxy
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

// ---- Cart fragments
const CART_FIELDS = `
  id
  checkoutUrl
  cost { subtotalAmount { amount currencyCode } totalAmount { amount currencyCode } }
  lines(first: 50) {
    edges {
      node {
        id
        quantity
        merchandise {
          ... on ProductVariant {
            id
            title
            availableForSale
            price { amount currencyCode }
            product {
              id
              title
              images(first: 1) { edges { node { url } } }
            }
          }
        }
      }
    }
  }
`;

// ---- Fetch existing cart by id
export async function fetchCart(cartId: string) {
  const query = `
    query CartQuery($id: ID!) {
      cart(id: $id) {
        ${CART_FIELDS}
      }
    }
  `;
  const data = await shopifyFetch<{ cart: any }>(query, { id: cartId });
  return data.cart;
}

// ---- Create a cart (optionally with first lines)
export async function createCart(
  lines: { merchandiseId: string; quantity?: number }[] = []
) {
  const query = `
    mutation CreateCart($lines: [CartLineInput!]) {
      cartCreate(input: { lines: $lines }) {
        cart { ${CART_FIELDS} }
        userErrors { field message }
      }
    }
  `;
  const data = await shopifyFetch<{
    cartCreate: { cart: any; userErrors: any[] };
  }>(query, { lines });
  if (data.cartCreate.userErrors?.length)
    console.warn("cartCreate errors:", data.cartCreate.userErrors);
  return data.cartCreate.cart;
}

// ---- Add lines to cart
export async function addToCart(
  cartId: string,
  lines: { merchandiseId: string; quantity?: number }[]
) {
  const query = `
    mutation AddToCart($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart { ${CART_FIELDS} }
        userErrors { field message }
      }
    }
  `;
  const data = await shopifyFetch<{
    cartLinesAdd: { cart: any; userErrors: any[] };
  }>(query, { cartId, lines });
  if (data.cartLinesAdd.userErrors?.length)
    console.warn("cartLinesAdd errors:", data.cartLinesAdd.userErrors);
  return data.cartLinesAdd.cart;
}

// ---- Fetch products
export async function fetchProducts({ first = 10 }: { first: number }) {
  const query = `
    query Products($first: Int!) {
      products(first: $first) {
        nodes {
          id
          title
          handle
          images(first: 5) {
            nodes {
              url
            }
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
        }
      }
    }
  `;
  
  const data = await shopifyFetch<{ products: { nodes: ProductCard[] } }>(query, { first });
  return data.products;
}

// ---- Fetch product by handle
export async function fetchProductByHandle(handle: string) {
  const query = `
    query ProductByHandle($handle: String!) {
      productByHandle(handle: $handle) {
        id
        title
        description
        productType
        tags
        images(first: 10) {
          nodes {
            url
            altText
          }
        }
        variants(first: 100) {
          nodes {
            id
            title
            availableForSale
            selectedOptions {
              name
              value
            }
            price {
              amount
              currencyCode
            }
          }
        }
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
      }
    }
  `;
  
  const data = await shopifyFetch<{ productByHandle: any }>(query, { handle });
  return data.productByHandle;
}
