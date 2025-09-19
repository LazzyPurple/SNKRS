const endpoint = `/api/shopify/graphql.json`;

// Product type definition for ProductCard
export type ProductCard = {
  id: string;
  title: string;
  handle: string;
  vendor: string;
  tags: string[];
  images: {
    nodes: {
      url: string;
      altText?: string;
    }[];
  };
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  variants: {
    nodes: {
      id: string;
      availableForSale: boolean;
      selectedOptions: {
        name: string;
        value: string;
      }[];
    }[];
  };
};

export type ProductsResponse = {
  nodes: ProductCard[];
  pageInfo: {
    hasNextPage: boolean;
    endCursor: string | null;
  };
};

export type ProductFilters = {
  gender?: string[];
  brand?: string[];
  color?: string[];
  height?: string[];
  silhouette?: string[];
};

export type ProductSort = 'TITLE' | 'PRICE' | 'CREATED_AT' | 'BEST_SELLING';

export type FetchProductsParams = {
  first?: number;
  after?: string;
  sortKey?: ProductSort;
  reverse?: boolean;
  filters?: ProductFilters;
  query?: string;
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
// Helper function to build query string from filters
function buildFilterQuery(filters?: ProductFilters): string {
  if (!filters) return '';
  
  const queryParts: string[] = [];
  
  if (filters.gender?.length) {
    const genderTags = filters.gender.map(g => `tag:'gender:${g}'`).join(' OR ');
    queryParts.push(`(${genderTags})`);
  }
  
  if (filters.brand?.length) {
    const brandTags = filters.brand.map(b => `tag:'brand:${b}'`).join(' OR ');
    queryParts.push(`(${brandTags})`);
  }
  
  if (filters.color?.length) {
    const colorTags = filters.color.map(c => `tag:'color:${c}'`).join(' OR ');
    queryParts.push(`(${colorTags})`);
  }
  
  if (filters.height?.length) {
    const heightTags = filters.height.map(h => `tag:'height:${h}'`).join(' OR ');
    queryParts.push(`(${heightTags})`);
  }
  
  if (filters.silhouette?.length) {
    const silhouetteTags = filters.silhouette.map(s => `tag:'silhouette:${s}'`).join(' OR ');
    queryParts.push(`(${silhouetteTags})`);
  }
  
  return queryParts.join(' AND ');
}

export async function fetchProducts(params: FetchProductsParams = {}): Promise<ProductsResponse> {
  const { 
    first = 24, 
    after, 
    sortKey = 'CREATED_AT', 
    reverse = true, 
    filters,
    query: customQuery 
  } = params;
  
  const filterQuery = buildFilterQuery(filters);
  const finalQuery = customQuery || filterQuery;
  
  const query = `
    query Products($first: Int!, $after: String, $sortKey: ProductSortKeys!, $reverse: Boolean!, $query: String) {
      products(first: $first, after: $after, sortKey: $sortKey, reverse: $reverse, query: $query) {
        nodes {
          id
          title
          handle
          vendor
          tags
          images(first: 5) {
          nodes {
            url
            altText
          }
        }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          variants(first: 50) {
            nodes {
              id
              availableForSale
              selectedOptions {
                name
                value
              }
            }
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  `;
  
  const data = await shopifyFetch<{ products: ProductsResponse }>(query, { 
    first, 
    after, 
    sortKey, 
    reverse, 
    query: finalQuery || null 
  });
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
