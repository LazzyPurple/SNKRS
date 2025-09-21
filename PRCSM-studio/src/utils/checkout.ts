/**
 * Helper function to build checkout URLs with UTM parameters
 * Appends utm_source=headless&utm_medium=checkout while preserving existing query parameters
 */
export function buildCheckoutUrl(url: string, options: { utm?: boolean } = { utm: true }): string {
  if (!url) return url;
  
  // If UTM is disabled, return original URL
  if (!options.utm) return url;
  
  try {
    const urlObj = new URL(url);
    
    // Add UTM parameters
    urlObj.searchParams.set('utm_source', 'headless');
    urlObj.searchParams.set('utm_medium', 'checkout');
    
    return urlObj.toString();
  } catch (error) {
    // If URL parsing fails, return original URL
    console.warn('Failed to parse checkout URL:', error);
    return url;
  }
}