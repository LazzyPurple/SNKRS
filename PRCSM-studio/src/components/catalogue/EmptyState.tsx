import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onResetFilters: () => void;
  hasActiveFilters: boolean;
}

export default function EmptyState({ onResetFilters, hasActiveFilters }: EmptyStateProps) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-24 h-24 mx-auto mb-6 border-2 border-gray-500 flex items-center justify-center">
        <span className="text-4xl">👟</span>
      </div>
      
      <h3 className="text-xl font-orbitron font-bold text-white mb-2">
        Aucun produit trouvé
      </h3>
      
      <p className="text-gray-400 mb-6 max-w-md">
        {hasActiveFilters 
          ? "Aucun produit ne correspond à vos critères de recherche. Essayez de modifier vos filtres."
          : "Il n'y a actuellement aucun produit disponible dans cette catégorie."
        }
      </p>
      
      {hasActiveFilters && (
        <Button
          onClick={onResetFilters}
          className="border-2 border-white bg-white text-black hover:bg-transparent hover:text-white font-bold"
        >
          Réinitialiser les filtres
        </Button>
      )}
    </div>
  );
}