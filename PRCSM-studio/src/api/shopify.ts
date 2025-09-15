const endpoint = `https://${
  import.meta.env.VITE_SHOPIFY_DOMAIN
}/api/2023-07/graphql.json`;

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

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": import.meta.env
        .VITE_SHOPIFY_STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query }),
  });

  const json = await res.json();
  console.log("Shopify response:", json);
  return json.data.products.edges.map((e: any) => e.node);
}

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

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables: { id } }),
  });

  const json = await res.json();
  return json.data.product;
}