import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import type { ProductSort, ProductFilters } from "@/api/shopify";

interface ActiveFilter {
  type: keyof ProductFilters;
  value: string;
  label: string;
}

interface CatalogueToolbarProps {
  totalCount: number;
  isLoading: boolean;
  sortBy: ProductSort;
  onSortChange: (sort: ProductSort) => void;
  activeFilters: ActiveFilter[];
  onRemoveFilter: (type: keyof ProductFilters, value: string) => void;
  onClearAllFilters: () => void;
  onToggleFilters: () => void;
}

export default function CatalogueToolbar({
  totalCount,
  isLoading,
  sortBy,
  onSortChange,
  activeFilters,
  onRemoveFilter,
  onClearAllFilters,
  onToggleFilters,
}: CatalogueToolbarProps) {
  return (
    <div className="border-b-2 border-white bg-prcsm-black">
      {/* Top Row - Title and Results */}
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-orbitron font-bold text-white uppercase">
            Catalogue
          </h1>
          <div 
            className="text-gray-400 text-sm"
            aria-live="polite"
            aria-atomic="true"
          >
            {isLoading ? 'Chargement...' : `${totalCount} produits`}
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Mobile Filter Toggle */}
          <Button
            variant="outline"
            onClick={onToggleFilters}
            className="lg:hidden border-2 border-white bg-transparent text-white hover:bg-white hover:text-black"
          >
            Filtres
          </Button>
          
          {/* Sort Dropdown */}
          <Select value={sortBy} onValueChange={(value: ProductSort) => onSortChange(value)}>
            <SelectTrigger className="w-48 border-2 border-white bg-transparent text-white">
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent className="bg-prcsm-black border-2 border-white">
              <SelectItem value="CREATED_AT" className="text-white hover:bg-white hover:text-black">
                Plus récent
              </SelectItem>
              <SelectItem value="PRICE" className="text-white hover:bg-white hover:text-black">
                Prix croissant
              </SelectItem>
              <SelectItem value="TITLE" className="text-white hover:bg-white hover:text-black">
                Nom A-Z
              </SelectItem>
              <SelectItem value="BEST_SELLING" className="text-white hover:bg-white hover:text-black">
                Meilleures ventes
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Active Filters Row */}
      {activeFilters.length > 0 && (
        <div className="px-6 pb-4 flex items-center gap-3 flex-wrap">
          <span className="text-sm text-gray-400 font-bold">Filtres actifs:</span>
          
          {activeFilters.map((filter, index) => (
            <button
              key={`${filter.type}-${filter.value}-${index}`}
              onClick={() => onRemoveFilter(filter.type, filter.value)}
              className="inline-flex items-center gap-2 px-3 py-1 border-2 border-[#A488EF] bg-[#A488EF] text-black text-sm font-bold hover:bg-transparent hover:text-[#A488EF] transition-colors"
            >
              {filter.label}
              <X className="w-3 h-3" />
            </button>
          ))}
          
          <Button
            variant="outline"
            size="sm"
            onClick={onClearAllFilters}
            className="border-2 border-gray-400 text-gray-400 hover:border-white hover:text-white bg-transparent"
          >
            Tout effacer
          </Button>
        </div>
      )}
    </div>
  );
}