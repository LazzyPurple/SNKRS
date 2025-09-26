import type { ShopifyVariant, NormalizedVariant } from '@/types/shopify.types';
import { MEN_SIZES, WOMEN_SIZES, KIDS_SIZES } from '@/types/shopify.types';

/**
 * Normalizes Shopify variants to extract gender and size information
 * Filters to only include valid sizes for each gender category
 */
export function normalizeVariants(variants: ShopifyVariant[]): NormalizedVariant[] {
  console.log('🔍 Normalizing variants:', variants.length);
  console.log('🔍 Raw variants data:', variants.map(v => ({
    id: v.id,
    title: v.title,
    availableForSale: v.availableForSale,
    selectedOptions: v.selectedOptions
  })));

  const normalized = variants
    .map((variant) => {
      const genderAndSize = extractGenderAndSize(variant);
      
      if (!genderAndSize) {
        console.log('🔍 Skipping variant (no gender/size):', variant.title);
        return null;
      }

      const { gender, size } = genderAndSize;
      
      if (!isValidSizeForGender(size, gender)) {
        console.log('🔍 Skipping variant (invalid size):', variant.title, { gender, size });
        return null;
      }

      const available = variant.availableForSale ?? false;
      console.log('🔍 Normalized variant:', {
        title: variant.title,
        gender,
        size,
        available,
        originalAvailable: variant.availableForSale
      });

      return {
        id: variant.id,
        gender,
        size,
        available,
        originalVariant: variant,
      };
    })
    .filter((variant): variant is NormalizedVariant => variant !== null);

  console.log('🔍 Final normalized variants:', normalized.length);
  console.log('🔍 Available normalized variants:', normalized.filter(v => v.available).length);
  
  return normalized;
}

/**
 * Extract gender and size from a variant's selectedOptions or title
 */
function extractGenderAndSize(variant: ShopifyVariant): { gender: 'men' | 'women' | 'kids'; size: string } | null {
  // First try to extract from selectedOptions
  if (variant.selectedOptions) {
    let gender: 'men' | 'women' | 'kids' | null = null;
    let size: string | null = null;

    for (const option of variant.selectedOptions) {
      const name = option.name.toLowerCase();
      const value = option.value.toLowerCase();

      // Gender detection
      if (name.includes('gender') || name.includes('category')) {
        if (value.includes('men') || value.includes('male')) gender = 'men';
        else if (value.includes('women') || value.includes('female')) gender = 'women';
        else if (value.includes('kids') || value.includes('child')) gender = 'kids';
      }

      // Size detection
      if (name.includes('size')) {
        size = option.value;
      }
    }

    if (gender && size) {
      return { gender, size };
    }
  }

  // Fallback: try to extract from title
  const title = variant.title.toLowerCase();
  
  // Gender from title
  let gender: 'men' | 'women' | 'kids' | null = null;
  if (title.includes('men') || title.includes('male')) gender = 'men';
  else if (title.includes('women') || title.includes('female')) gender = 'women';
  else if (title.includes('kids') || title.includes('child') || title.includes('youth')) gender = 'kids';

  // Size from title (look for patterns like "Size 10", "10", "3Y", etc.)
  const sizeMatch = title.match(/(?:size\s+)?(\d+(?:\.\d+)?y?|\d+(?:\.\d+)?)/i);
  const size = sizeMatch ? sizeMatch[1] : null;

  if (gender && size) {
    return { gender, size };
  }

  return null;
}

/**
 * Checks if a size is valid for the given gender category
 */
function isValidSizeForGender(size: string, gender: 'men' | 'women' | 'kids'): boolean {
  switch (gender) {
    case 'men':
      return MEN_SIZES.includes(parseInt(size));
    case 'women':
      return WOMEN_SIZES.includes(parseInt(size));
    case 'kids':
      return KIDS_SIZES.includes(size);
    default:
      return false;
  }
}

/**
 * Infers default gender from product tags
 * Priority: men > women > kids if multiple tags are present
 * Fallback: 'men' if no tag found
 */
export function inferGenderFromTags(tags: string[]): 'men' | 'women' | 'kids' {
  const lowerTags = tags.map(tag => tag.toLowerCase());
  
  // Check for explicit gender tags
  if (lowerTags.some(tag => tag.includes('gender:men') || tag === 'men')) {
    return 'men';
  }
  
  if (lowerTags.some(tag => tag.includes('gender:women') || tag === 'women')) {
    return 'women';
  }
  
  if (lowerTags.some(tag => tag.includes('gender:kids') || tag === 'kids' || tag === 'youth')) {
    return 'kids';
  }
  
  // Fallback logic based on common keywords
  if (lowerTags.some(tag => tag.includes('wmns') || tag.includes('women'))) {
    return 'women';
  }
  
  if (lowerTags.some(tag => tag.includes('kids') || tag.includes('youth') || tag.includes('gs') || tag.includes('ps'))) {
    return 'kids';
  }
  
  // Default fallback
  return 'men';
}