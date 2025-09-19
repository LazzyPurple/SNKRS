import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { ProductFilters } from "@/api/shopify";

interface FilterGroup {
  id: keyof ProductFilters;
  label: string;
  options: { value: string; label: string }[];
}

interface FilterSidebarProps {
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const filterGroups: FilterGroup[] = [
  {
    id: 'gender',
    label: 'Genre',
    options: [
      { value: 'Men', label: 'Homme' },
      { value: 'Women', label: 'Femme' },
      { value: 'Kids', label: 'Enfant' },
    ],
  },
  {
    id: 'brand',
    label: 'Marque',
    options: [
      { value: 'Nike', label: 'Nike' },
      { value: 'Adidas', label: 'Adidas' },
      { value: 'Jordan', label: 'Jordan' },
      { value: 'Converse', label: 'Converse' },
      { value: 'Vans', label: 'Vans' },
    ],
  },
  {
    id: 'color',
    label: 'Couleur',
    options: [
      { value: 'Black', label: 'Noir' },
      { value: 'White', label: 'Blanc' },
      { value: 'Red', label: 'Rouge' },
      { value: 'Blue', label: 'Bleu' },
      { value: 'Green', label: 'Vert' },
      { value: 'Yellow', label: 'Jaune' },
      { value: 'Pink', label: 'Rose' },
      { value: 'Gray', label: 'Gris' },
    ],
  },
  {
    id: 'height',
    label: 'Hauteur',
    options: [
      { value: 'Low', label: 'Basse' },
      { value: 'Mid', label: 'Moyenne' },
      { value: 'High', label: 'Haute' },
    ],
  },
  {
    id: 'silhouette',
    label: 'Silhouette',
    options: [
      { value: 'Basketball', label: 'Basketball' },
      { value: 'Running', label: 'Running' },
      { value: 'Lifestyle', label: 'Lifestyle' },
      { value: 'Skateboarding', label: 'Skateboard' },
      { value: 'Training', label: 'Training' },
    ],
  },
];

export default function FilterSidebar({ filters, onFiltersChange, isOpen, onClose }: FilterSidebarProps) {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    new Set(filterGroups.map(g => g.id))
  );

  const toggleGroup = (groupId: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId);
    } else {
      newExpanded.add(groupId);
    }
    setExpandedGroups(newExpanded);
  };

  const handleFilterToggle = (groupId: keyof ProductFilters, value: string) => {
    const currentValues = filters[groupId] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    
    onFiltersChange({
      ...filters,
      [groupId]: newValues,
    });
  };

  const sidebarContent = (
    <div className="h-full bg-prcsm-black border-r-2 border-white overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-orbitron font-bold text-white uppercase">
            Filtres
          </h2>
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden text-white hover:text-gray-300"
            >
              ✕
            </button>
          )}
        </div>

        <div className="space-y-6">
          {filterGroups.map((group) => {
            const isExpanded = expandedGroups.has(group.id);
            const selectedValues = filters[group.id] || [];

            return (
              <div key={group.id} className="border-b border-gray-700 pb-4">
                <button
                  onClick={() => toggleGroup(group.id)}
                  className="w-full flex items-center justify-between text-left mb-3 text-white hover:text-gray-300"
                  aria-expanded={isExpanded}
                >
                  <span className="font-bold text-sm uppercase tracking-wide">
                    {group.label}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>

                {isExpanded && (
                  <div className="space-y-2">
                    {group.options.map((option) => {
                      const isSelected = selectedValues.includes(option.value);
                      
                      return (
                        <button
                          key={option.value}
                          onClick={() => handleFilterToggle(group.id, option.value)}
                          className={`
                            w-full text-left px-3 py-2 text-sm font-bold border-2 transition-all
                            ${isSelected
                              ? 'border-[#A488EF] bg-[#A488EF] text-black shadow-[4px_4px_0px_0px_#A488EF]'
                              : 'border-white bg-transparent text-white hover:border-[#A488EF] hover:text-[#A488EF]'
                            }
                            focus-visible:border-[#A488EF] focus-visible:shadow-[4px_4px_0px_0px_#A488EF] focus-visible:outline-none
                          `}
                        >
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  // Mobile off-canvas
  if (typeof isOpen === 'boolean') {
    return (
      <>
        {/* Overlay */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={onClose}
          />
        )}
        
        {/* Off-canvas sidebar */}
        <div
          className={`
            fixed top-0 left-0 h-full w-80 z-50 transform transition-transform duration-300 lg:hidden
            ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
        >
          {sidebarContent}
        </div>
      </>
    );
  }

  // Desktop sidebar
  return (
    <div className="hidden lg:block w-80 flex-shrink-0">
      {sidebarContent}
    </div>
  );
}