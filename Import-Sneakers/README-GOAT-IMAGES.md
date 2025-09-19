# GOAT Images Integration Guide

## Overview
This guide explains how the `importSneakers.js` script has been updated to include GOAT images from the Sneaks API when importing products to Shopify.

## Changes Made

### 1. Enhanced Image Extraction (`buildImages` function)
The `buildImages` function now extracts GOAT images from multiple possible locations in the Sneaks API response:

```javascript
// Extract GOAT images from Sneaks API response
if (product.goat && product.goat.imageLinks && Array.isArray(product.goat.imageLinks)) {
  for (const u of product.goat.imageLinks) if (u) urls.add(u);
}

// Alternative: if GOAT images are in a different structure
if (product.resellLinks && product.resellLinks.goat && product.resellLinks.goat.imageLinks) {
  if (Array.isArray(product.resellLinks.goat.imageLinks)) {
    for (const u of product.resellLinks.goat.imageLinks) if (u) urls.add(u);
  }
}

// Check for GOAT images in the main product object
if (product.image && typeof product.image === 'string') {
  urls.add(product.image);
}
```

### 2. Enhanced Product Data Fetching (`importSneakers` function)
The import process now uses `getProductPrices()` to fetch detailed product information including GOAT images:

```javascript
// Get detailed product info including GOAT images using getProductPrices
if (p.styleID) {
  sneaks.getProductPrices(p.styleID, async (priceErr, detailedProduct) => {
    if (priceErr) {
      console.warn(`⚠️ Could not get detailed info for ${p.shoeName}: ${priceErr}`);
      // Fallback to basic product data
      const payload = buildProductPayloadFromSneaks(p, genders);
      await postProductToShopify(payload);
    } else {
      // Merge basic product data with detailed data (including GOAT images)
      const mergedProduct = { ...p, ...detailedProduct };
      const payload = buildProductPayloadFromSneaks(mergedProduct, genders);
      await postProductToShopify(payload);
    }
    await new Promise((r) => setTimeout(r, 500)); // petit throttle
  });
}
```

## How It Works

1. **Initial Product Search**: The script uses `sneaks.getProducts()` to search for sneakers
2. **Detailed Data Fetch**: For each product with a `styleID`, it calls `sneaks.getProductPrices()` to get detailed information
3. **Image Extraction**: The enhanced `buildImages()` function extracts images from multiple sources including GOAT
4. **Shopify Upload**: All images (including GOAT images) are included in the Shopify product creation

## Benefits

- **More Images**: Products now include additional high-quality images from GOAT
- **Better Product Presentation**: More images improve the visual appeal of products in your Shopify store
- **Fallback Handling**: If detailed data isn't available, the script falls back to basic product data
- **Error Resilience**: The script continues importing even if some products fail to fetch detailed data

## Usage

The script usage remains the same:

```javascript
importSneakers('Air Force 1', 4, ['Men','Women']);
importSneakers('Dunk Low', 4, ['Men','Women']);
```

## Notes

- The script includes throttling (500ms delay) between requests to avoid rate limiting
- GOAT images are automatically deduplicated with existing images
- The script handles various data structures where GOAT images might be located in the API response