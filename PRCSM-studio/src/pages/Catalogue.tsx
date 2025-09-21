import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/api/shopify";
import { useCatalogueState } from "@/hooks/useCatalogueState";
import CatalogueToolbar from "@/components/catalogue/CatalogueToolbar";
import FilterSidebar from "@/components/catalogue/FilterSidebar";
import ProductCard from "@/components/catalogue/ProductCard";
import ProductSkeleton from "@/components/catalogue/ProductSkeleton";
import EmptyState from "@/components/catalogue/EmptyState";
import ErrorState from "@/components/catalogue/ErrorState";
import { Button } from "@/components/ui/button";
import type { ProductCard as ProductCardType } from "@/api/shopify";

export default function Catalogue() {
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [allProducts, setAllProducts] = useState<ProductCardType[]>([]);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [endCursor, setEndCursor] = useState<string | null>(null);
  
  const {
    filters,
    sortBy,
    updateFilters,
    updateSort,
    clearFilters,
    removeFilter,
    getActiveFilters,
    hasActiveFilters,
  } = useCatalogueState();

  // Fetch products with current filters and sort
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['products', filters, sortBy],
    queryFn: () => fetchProducts({
      first: 24,
      sortKey: sortBy,
      reverse: sortBy === 'CREATED_AT',
      filters,
    }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Reset pagination when filters/sort change
  useEffect(() => {
    if (data) {
      setAllProducts(data.nodes);
      setHasNextPage(data.pageInfo.hasNextPage);
      setEndCursor(data.pageInfo.endCursor);
    }
  }, [data]);

  // Load more products
  const loadMore = async () => {
    if (!hasNextPage || !endCursor) return;
    
    try {
      const moreData = await fetchProducts({
        first: 24,
        after: endCursor,
        sortKey: sortBy,
        reverse: sortBy === 'CREATED_AT',
        filters,
      });
      
      setAllProducts(prev => [...prev, ...moreData.nodes]);
      setHasNextPage(moreData.pageInfo.hasNextPage);
      setEndCursor(moreData.pageInfo.endCursor);
    } catch (error) {
      console.error('Error loading more products:', error);
    }
  };

  const activeFilters = getActiveFilters();
  const totalCount = allProducts.length;

  return (
    <div className="min-h-screen bg-prcsm-black">
      {/* Toolbar */}
      <CatalogueToolbar
        totalCount={totalCount}
        isLoading={isLoading}
        sortBy={sortBy}
        onSortChange={updateSort}
        activeFilters={activeFilters}
        onRemoveFilter={removeFilter}
        onClearAllFilters={clearFilters}
        onToggleFilters={() => setIsMobileFiltersOpen(true)}
      />

      <div className="flex">
        {/* Desktop Sidebar */}
        <FilterSidebar
          filters={filters}
          onFiltersChange={updateFilters}
        />

        {/* Mobile Off-canvas */}
        <FilterSidebar
          filters={filters}
          onFiltersChange={updateFilters}
          isOpen={isMobileFiltersOpen}
          onClose={() => setIsMobileFiltersOpen(false)}
        />

        {/* Main Content */}
        <div className="flex-1 p-6">
          {error ? (
            <ErrorState 
              onRetry={() => refetch()} 
              error={error instanceof Error ? error.message : 'Erreur inconnue'}
            />
          ) : (
            <>
              {/* Products Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {isLoading ? (
                  // Show skeletons during initial load
                  Array.from({ length: 12 }).map((_, index) => (
                    <ProductSkeleton key={index} />
                  ))
                ) : allProducts.length > 0 ? (
                  // Show products
                  allProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))
                ) : (
                  // Show empty state
                  <EmptyState 
                    onResetFilters={clearFilters}
                    hasActiveFilters={hasActiveFilters}
                  />
                )}
              </div>

              {/* Load More Button */}
              {!isLoading && allProducts.length > 0 && hasNextPage && (
                <div className="flex justify-center mt-12">
                  <Button
                    onClick={loadMore}
                    className="border-2 border-white bg-white text-black hover:bg-transparent hover:text-white font-bold px-8 py-3"
                  >
                    Charger plus de produits
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
