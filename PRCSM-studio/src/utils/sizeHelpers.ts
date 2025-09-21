import type { ProductCard } from '@/api/shopify';

export type Gender = 'Men' | 'Women' | 'Kids';

export interface StockLedger {
  [variantId: string]: number;
}

/**
 * Extracts available sizes from a product's variants
 * @param product - The product to extract sizes from
 * @param preferredGender - Optional gender filter (Men, Women, Kids)
 * @param stockLedger - Optional stock ledger to filter by quantity > 0
 * @returns Array of available sizes, sorted numerically
 */
export function extractAvailableSizes(
  product: ProductCard,
  preferredGender?: Gender,
  stockLedger?: StockLedger
): string[] {
  if (!product.variants?.nodes) return [];

  // Filter available variants
  let availableVariants = product.variants.nodes.filter(variant => {
    // Check if variant is available for sale
    if (!variant.availableForSale) return false;
    
    // Check stock ledger if provided
    if (stockLedger && stockLedger[variant.id] <= 0) return false;
    
    return true;
  });

  // Filter by gender if preferred gender is specified
  if (preferredGender) {
    const detectedGender = detectGenderFromTags(product.tags);
    if (detectedGender && detectedGender === preferredGender) {
      // Only filter if the product has a specific gender and it matches preference
      // For now, we assume all variants of a gendered product are for that gender
      availableVariants = availableVariants.filter(() => true);
    }
  }

  // Extract sizes from selectedOptions
  const sizes = availableVariants
    .map(variant => {
      const sizeOption = variant.selectedOptions?.find(option => 
        ['Size', 'Taille', 'Pointure'].includes(option.name)
      );
      return sizeOption?.value;
    })
    .filter((size): size is string => Boolean(size))
    .map(size => normalizeSize(size));

  // Deduplicate and sort
  const uniqueSizes = Array.from(new Set(sizes));
  return sortSizes(uniqueSizes);
}

/**
 * Detects gender from product tags
 * @param tags - Array of product tags
 * @returns Detected gender or null
 */
export function detectGenderFromTags(tags: string[]): Gender | null {
  for (const tag of tags) {
    if (tag.startsWith('gender:')) {
      const gender = tag.replace('gender:', '');
      if (['Men', 'Women', 'Kids'].includes(gender)) {
        return gender as Gender;
      }
    }
  }
  return null;
}

/**
 * Normalizes size labels
 * @param size - Raw size string
 * @returns Normalized size string
 */
function normalizeSize(size: string): string {
  // Remove "US " prefix
  const normalized = size.replace(/^US\s+/, '');
  
  // Keep .5 and Y suffix as is
  // Examples: "10.5" stays "10.5", "3Y" stays "3Y"
  
  return normalized.trim();
}

/**
 * Sorts sizes numerically, handling halves and Y suffix
 * @param sizes - Array of size strings
 * @returns Sorted array of sizes
 */
function sortSizes(sizes: string[]): string[] {
  return sizes.sort((a, b) => {
    const aNum = parseSize(a);
    const bNum = parseSize(b);
    
    // Handle Y suffix (kids sizes) - they should come first
    const aIsKids = a.includes('Y');
    const bIsKids = b.includes('Y');
    
    if (aIsKids && !bIsKids) return -1;
    if (!aIsKids && bIsKids) return 1;
    
    return aNum - bNum;
  });
}

/**
 * Parses size string to number for sorting
 * @param size - Size string
 * @returns Numeric value for sorting
 */
function parseSize(size: string): number {
  // Remove Y suffix for parsing
  const cleanSize = size.replace('Y', '');
  const num = parseFloat(cleanSize);
  return isNaN(num) ? 0 : num;
}

/**
 * Formats sizes for display with +N suffix if needed
 * @param sizes - Array of available sizes
 * @param maxDisplay - Maximum number of sizes to display (default: 8)
 * @returns Formatted string for display
 */
export function formatSizesForDisplay(sizes: string[], maxDisplay: number = 8): string {
  if (sizes.length === 0) return '';
  
  if (sizes.length <= maxDisplay) {
    return sizes.join(' ');
  }
  
  const displaySizes = sizes.slice(0, maxDisplay);
  const remaining = sizes.length - maxDisplay;
  return `${displaySizes.join(' ')} +${remaining}`;
}