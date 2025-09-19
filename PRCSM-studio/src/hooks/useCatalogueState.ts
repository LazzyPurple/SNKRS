import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { ProductFilters, ProductSort } from '@/api/shopify';

interface CatalogueState {
  filters: ProductFilters;
  sortBy: ProductSort;
  page: number;
}

export function useCatalogueState() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Parse initial state from URL
  const getInitialState = useCallback((): CatalogueState => {
    const filters: ProductFilters = {};
    
    // Parse filters from URL
    const gender = searchParams.getAll('gender');
    const brand = searchParams.getAll('brand');
    const color = searchParams.getAll('color');
    const height = searchParams.getAll('height');
    const silhouette = searchParams.getAll('silhouette');
    
    if (gender.length) filters.gender = gender;
    if (brand.length) filters.brand = brand;
    if (color.length) filters.color = color;
    if (height.length) filters.height = height;
    if (silhouette.length) filters.silhouette = silhouette;
    
    const sortBy = (searchParams.get('sort') as ProductSort) || 'CREATED_AT';
    const page = parseInt(searchParams.get('page') || '1', 10);
    
    return { filters, sortBy, page };
  }, [searchParams]);

  const [state, setState] = useState<CatalogueState>(getInitialState);

  // Update URL when state changes
  const updateURL = useCallback((newState: CatalogueState) => {
    const params = new URLSearchParams();
    
    // Add filters to URL
    Object.entries(newState.filters).forEach(([key, values]) => {
      if (values && values.length > 0) {
        values.forEach(value => params.append(key, value));
      }
    });
    
    // Add sort and page
    if (newState.sortBy !== 'CREATED_AT') {
      params.set('sort', newState.sortBy);
    }
    if (newState.page > 1) {
      params.set('page', newState.page.toString());
    }
    
    setSearchParams(params, { replace: true });
  }, [setSearchParams]);

  // Update filters
  const updateFilters = useCallback((newFilters: ProductFilters) => {
    const newState = { ...state, filters: newFilters, page: 1 };
    setState(newState);
    updateURL(newState);
  }, [state, updateURL]);

  // Update sort
  const updateSort = useCallback((sortBy: ProductSort) => {
    const newState = { ...state, sortBy, page: 1 };
    setState(newState);
    updateURL(newState);
  }, [state, updateURL]);

  // Update page
  const updatePage = useCallback((page: number) => {
    const newState = { ...state, page };
    setState(newState);
    updateURL(newState);
  }, [state, updateURL]);

  // Clear all filters
  const clearFilters = useCallback(() => {
    const newState = { ...state, filters: {}, page: 1 };
    setState(newState);
    updateURL(newState);
  }, [state, updateURL]);

  // Remove specific filter
  const removeFilter = useCallback((type: keyof ProductFilters, value: string) => {
    const currentValues = state.filters[type] || [];
    const newValues = currentValues.filter(v => v !== value);
    const newFilters = {
      ...state.filters,
      [type]: newValues.length > 0 ? newValues : undefined,
    };
    
    // Clean up undefined values
    Object.keys(newFilters).forEach(key => {
      if (!newFilters[key as keyof ProductFilters]?.length) {
        delete newFilters[key as keyof ProductFilters];
      }
    });
    
    updateFilters(newFilters);
  }, [state.filters, updateFilters]);

  // Get active filters for display
  const getActiveFilters = useCallback(() => {
    const active: Array<{ type: keyof ProductFilters; value: string; label: string }> = [];
    
    const filterLabels: Record<string, Record<string, string>> = {
      gender: { Men: 'Homme', Women: 'Femme', Kids: 'Enfant' },
      brand: { Nike: 'Nike', Adidas: 'Adidas', Jordan: 'Jordan', Converse: 'Converse', Vans: 'Vans' },
      color: { Black: 'Noir', White: 'Blanc', Red: 'Rouge', Blue: 'Bleu', Green: 'Vert', Yellow: 'Jaune', Pink: 'Rose', Gray: 'Gris' },
      height: { Low: 'Basse', Mid: 'Moyenne', High: 'Haute' },
      silhouette: { Basketball: 'Basketball', Running: 'Running', Lifestyle: 'Lifestyle', Skateboarding: 'Skateboard', Training: 'Training' },
    };
    
    Object.entries(state.filters).forEach(([type, values]) => {
      if (values && values.length > 0) {
        values.forEach(value => {
          active.push({
            type: type as keyof ProductFilters,
            value,
            label: filterLabels[type]?.[value] || value,
          });
        });
      }
    });
    
    return active;
  }, [state.filters]);

  // Sync state with URL changes (browser back/forward)
  useEffect(() => {
    const newState = getInitialState();
    setState(newState);
  }, [getInitialState]);

  return {
    filters: state.filters,
    sortBy: state.sortBy,
    page: state.page,
    updateFilters,
    updateSort,
    updatePage,
    clearFilters,
    removeFilter,
    getActiveFilters,
    hasActiveFilters: Object.keys(state.filters).length > 0,
  };
}