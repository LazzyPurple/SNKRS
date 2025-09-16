// 🛍️ Types produits
export type ShopifyImage = {
  url: string;
};

export type ShopifyVariant = {
  id: string;
  title: string;
  availableForSale?: boolean;
  price: {
    amount: string;
    currencyCode: string;
  };
  product?: {
    id?: string;
    title: string;
  };
};

export type ShopifyProduct = {
  id: string;
  title: string;
  description?: string;
  images: {
    edges: { node: ShopifyImage }[];
  };
  variants: {
    edges: { node: ShopifyVariant }[];
  };
};

// 🛒 Types panier
export type ShopifyCartLine = {
  id: string;
  quantity: number;
  merchandise: ShopifyVariant;
};

export type ShopifyCart = {
  id: string;
  checkoutUrl: string;
  lines?: {
    edges: { node: ShopifyCartLine }[];
  };
};
