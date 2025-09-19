// 🛍️ Types produits
export type ShopifyImage = {
  url: string;
  altText?: string;
};

export type SelectedOption = {
  name: string;
  value: string;
};

export type ShopifyVariant = {
  id: string;
  title: string;
  availableForSale?: boolean;
  price: {
    amount: string;
    currencyCode: string;
  };
  selectedOptions: SelectedOption[];
  product?: {
    id?: string;
    title: string;
  };
};

export type ShopifyProduct = {
  id: string;
  handle: string;
  title: string;
  description?: string;
  productType?: string;
  tags: string[];
  images: {
    nodes: ShopifyImage[];
  };
  variants: {
    nodes: ShopifyVariant[];
  };
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
    maxVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  availableForSale: boolean;
};

export type NormalizedVariant = {
  id: string;
  gender: 'men' | 'women' | 'kids';
  size: string; // '7'...'12' or '3Y'...'7Y'
  available: boolean;
  originalVariant: ShopifyVariant;
};

// Size constants
export const MEN_SIZES = [7, 8, 9, 10, 11, 12];
export const WOMEN_SIZES = [7, 8, 9, 10, 11, 12];
export const KIDS_SIZES = ['3Y', '4Y', '5Y', '6Y', '7Y'];

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
