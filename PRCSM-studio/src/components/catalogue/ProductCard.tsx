import { useState } from "react";
import { Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { fetchProductByHandle } from "@/api/shopify";
import type { ProductCard as ProductCardType } from "@/api/shopify";
import { extractAvailableSizes, formatSizesForDisplay, detectGenderFromTags } from "@/utils/sizeHelpers";

interface ProductCardProps {
  product: ProductCardType;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const queryClient = useQueryClient();

  const handlePrefetch = () => {
    // Prefetch product data on hover/focus for instant navigation
    queryClient.prefetchQuery({
      queryKey: ['product', product.handle],
      queryFn: () => fetchProductByHandle(product.handle),
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };

  const imageUrl = product.images?.nodes?.[0]?.url;
  const imageAlt = product.images?.nodes?.[0]?.altText || product.title;

  // Extract available sizes
  const detectedGender = detectGenderFromTags(product.tags);
  const availableSizes = extractAvailableSizes(product, detectedGender || undefined);
  const sizesDisplay = formatSizesForDisplay(availableSizes, 8);

  return (
    <Link
      to={`/produit/${product.handle}`}
      onMouseEnter={handlePrefetch}
      onFocus={handlePrefetch}
      className="group block bg-black border-2 border-white hover:border-white focus-visible:border-[#A488EF] focus-visible:shadow-[8px_8px_0px_0px_#A488EF] focus-visible:outline-none transition-all"
    >
      {/* Image Container - Fixed 1:1 ratio */}
      <div className="relative aspect-square bg-black overflow-hidden">
        {imageUrl && !imageError ? (
          <img
            src={imageUrl}
            alt={imageAlt}
            className={`w-full h-full object-contain transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-2 border-2 border-gray-500 flex items-center justify-center">
                <span className="text-2xl">👟</span>
              </div>
              <p className="text-xs">Image non disponible</p>
            </div>
          </div>
        )}
        
        {/* Loading placeholder */}
        {!imageLoaded && !imageError && imageUrl && (
          <div className="absolute inset-0 bg-gray-800 animate-pulse" />
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-3">
        {/* Vendor */}
        {product.vendor && (
          <p className="text-xs text-gray-400 uppercase tracking-wide font-bold">
            {product.vendor}
          </p>
        )}

        {/* Title - Max 2 lines */}
        <h3 className="text-white font-bold text-sm leading-tight line-clamp-2 min-h-[2.5rem]">
          {product.title}
        </h3>

        {/* Sizes - Only show if sizes are available */}
        {sizesDisplay && (
          <p className="text-white text-xs font-normal leading-relaxed">
            {sizesDisplay}
          </p>
        )}

        {/* Price */}
        <p className="text-white font-bold text-lg">
          {product.priceRange.minVariantPrice.amount}€
        </p>
      </div>
    </Link>
  );
}