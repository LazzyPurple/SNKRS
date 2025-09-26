import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchProductByHandle } from "../api/shopify";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCart } from "@/context/CartContext";
import { useState, useMemo, useEffect } from "react";
import type { ShopifyProduct, NormalizedVariant } from "@/types/shopify.types";
import { MEN_SIZES, WOMEN_SIZES, KIDS_SIZES } from "@/types/shopify.types";
import { normalizeVariants, inferGenderFromTags } from "@/utils/variants";

export default function ProductPage() {
  const { handle } = useParams<{ handle: string }>();
  const { addItem } = useCart();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<NormalizedVariant | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  
  const {
    data: product,
    isLoading,
    error,
  } = useQuery<ShopifyProduct>({
    queryKey: ["product", handle],
    queryFn: () => fetchProductByHandle(handle!),
    enabled: !!handle,
  });

  // Infer default gender from product tags and set up state
  const defaultGender = useMemo(() => {
    return product ? inferGenderFromTags(product.tags) : 'men';
  }, [product?.tags]);

  const [selectedGender, setSelectedGender] = useState<'men' | 'women' | 'kids'>(defaultGender);

  // Update selectedGender when product loads
  useEffect(() => {
    if (product) {
      setSelectedGender(inferGenderFromTags(product.tags));
    }
  }, [product]);

  // Normalize all variants
  const normalizedVariants = useMemo(() => {
    if (!product?.variants?.nodes) return [];
    return normalizeVariants(product.variants.nodes);
  }, [product?.variants?.nodes]);

  // Filter variants by selected gender
  const genderFilteredVariants = useMemo(() => {
    return normalizedVariants.filter(variant => variant.gender === selectedGender);
  }, [normalizedVariants, selectedGender]);

  // Get target sizes for current gender
  const targetSizes = useMemo(() => {
    switch (selectedGender) {
      case 'men': return MEN_SIZES.map(String);
      case 'women': return WOMEN_SIZES.map(String);
      case 'kids': return KIDS_SIZES;
      default: return [];
    }
  }, [selectedGender]);

  if (isLoading) return (
    <div className="flex-1 w-full flex items-center justify-center bg-prcsm-black text-prcsm-white">
      <div className="text-xl">Loading...</div>
    </div>
  );
  
  if (error) return (
    <div className="flex-1 w-full flex items-center justify-center bg-prcsm-black text-prcsm-white">
      <div className="text-xl text-red-400">Error loading product</div>
    </div>
  );
  
  if (!product) return (
    <div className="flex-1 w-full flex items-center justify-center bg-prcsm-black text-prcsm-white">
      <div className="text-xl">Product not found</div>
    </div>
  );

  const handleAddToCart = async () => {
    if (selectedVariant) {
      try {
        await addItem(selectedVariant.originalVariant.id);
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 2000);
      } catch (error) {
        console.error("Failed to add item to cart:", error);
      }
    }
  };

  const handleSizeSelect = (size: string) => {
    const variant = genderFilteredVariants.find(v => v.size === size && v.available);
    setSelectedVariant(variant || null);
  };

  const isOutOfStock = genderFilteredVariants.length === 0 || genderFilteredVariants.every(v => !v.available);

  return (
    <div className="flex-1 w-full bg-prcsm-black text-prcsm-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Breadcrumb - Brutalist style */}
        <div className="mb-8 border-2 border-white inline-block px-4 py-2 shadow-[4px_4px_0px_0px_#A488EF]">
          <span className="font-bold text-lg">NIKE / {product.productType} / {product.title}</span>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Left Column - Image Gallery */}
          <div className="flex gap-6">
            {/* Vertical Thumbnails */}
            {product.images.nodes.length > 1 && (
              <div className="flex flex-col gap-4 max-h-[600px] overflow-y-auto">
                {product.images.nodes.map((img, index) => (
                  <div 
                    key={index}
                    className={`cursor-pointer border-4 border-white transition-all w-20 h-20 flex-shrink-0 ${
                      selectedImageIndex === index 
                        ? 'outline outline-4 outline-[#A488EF] shadow-[6px_6px_0px_0px_#A488EF]' 
                        : 'hover:shadow-[4px_4px_0px_0px_#A488EF]'
                    }`}
                    onClick={() => setSelectedImageIndex(index)}
                  >
                    <img
                      src={img.url}
                      alt={img.altText || `${product.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
            
            {/* Main Image */}
            <div className="flex-1">
              <div className="border-4 border-white shadow-[12px_12px_0px_0px_#A488EF] bg-prcsm-black">
                <img
                  src={product.images.nodes[selectedImageIndex]?.url || product.images.nodes[0]?.url || '/placeholder-image.jpg'}
                  alt={product.images.nodes[selectedImageIndex]?.altText || product.title}
                  className="w-full h-[500px] object-contain bg-white"
                />
              </div>
            </div>
          </div>

          {/* Right Column - Product Info */}
          <div className="space-y-8 border-4 border-white p-6 shadow-[8px_8px_0px_0px_#A488EF]">
            {/* Product Title & Price */}
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-5xl font-bold uppercase">{product.title}</h1>
              <div className="text-3xl font-bold text-white bg-[#A488EF] inline-block px-4 py-1 border-2 border-white">
                {product.priceRange.minVariantPrice.amount} {product.priceRange.minVariantPrice.currencyCode}
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <div className="space-y-2 border-t-4 border-white pt-4">
                <h3 className="text-xl font-bold uppercase">Description</h3>
                <p className="text-white leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Gender Selection */}
            <div className="space-y-3 border-t-4 border-white pt-4">
              <h3 className="text-xl font-bold uppercase">Gender</h3>
              <Select value={selectedGender} onValueChange={(value: 'men' | 'women' | 'kids') => setSelectedGender(value)}>
                <SelectTrigger className="w-full border-2 border-white bg-prcsm-black text-white hover:bg-gray-900 transition-colors shadow-[6px_6px_0_0_#A488EF]">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent className="border-2 border-white bg-prcsm-black text-white [&_*]:bg-prcsm-black">
                  <SelectItem value="men" className="bg-prcsm-black hover:bg-gray-800 focus:bg-[#A488EF] focus:text-black">Men</SelectItem>
                  <SelectItem value="women" className="bg-prcsm-black hover:bg-gray-800 focus:bg-[#A488EF] focus:text-black">Women</SelectItem>
                  <SelectItem value="kids" className="bg-prcsm-black hover:bg-gray-800 focus:bg-[#A488EF] focus:text-black">Kids</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Size Selection - Chip Grid */}
            <div className="space-y-3 border-t-4 border-white pt-4">
              <h3 className="text-xl font-bold uppercase">Size</h3>
              {isOutOfStock ? (
                <div className="text-red-400 font-bold border-2 border-red-400 p-2 inline-block">OUT OF STOCK</div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {targetSizes.map((size) => {
                    const variant = genderFilteredVariants.find(v => v.size === size);
                    const isAvailable = variant?.available || false;
                    const isSelected = selectedVariant?.size === size;
                    
                    return (
                      <button
                        key={size}
                        onClick={() => isAvailable && handleSizeSelect(size)}
                        disabled={!isAvailable}
                        className={`px-3 py-3 border-2 text-base font-bold ${
                          isSelected
                            ? 'border-white bg-[#A488EF] text-black shadow-[4px_4px_0px_0px_white]'
                            : isAvailable
                            ? 'border-white bg-prcsm-black text-white hover:bg-gray-900 hover:shadow-[4px_4px_0px_0px_#A488EF]'
                            : 'border-gray-600 bg-gray-800 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Add to Cart Button */}
            <div className="pt-6 border-t-4 border-white">
              <Button
                onClick={handleAddToCart}
                disabled={!selectedVariant || isOutOfStock}
                className={`w-full py-6 text-xl font-bold border-2 ${
                  selectedVariant && !isOutOfStock
                    ? 'border-white bg-white text-black hover:bg-[#A488EF] shadow-[8px_8px_0_0_#A488EF]'
                    : 'border-gray-600 bg-gray-800 text-gray-500 cursor-not-allowed'
                }`}
              >
                {!selectedVariant ? 'SELECT A SIZE' : isOutOfStock ? 'OUT OF STOCK' : 'ADD TO CART'}
              </Button>
            </div>

            {/* Success Toast */}
            {showSuccessToast && (
              <div className="fixed top-8 right-8 bg-[#A488EF] text-black px-8 py-4 border-2 border-white shadow-[8px_8px_0_0_white] font-bold z-50 uppercase">
                Added to cart!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
