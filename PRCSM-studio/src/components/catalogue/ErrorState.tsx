import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface ErrorStateProps {
  onRetry: () => void;
  error?: string;
}

export default function ErrorState({ onRetry, error }: ErrorStateProps) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-24 h-24 mx-auto mb-6 border-2 border-red-500 flex items-center justify-center">
        <AlertTriangle className="w-12 h-12 text-red-500" />
      </div>
      
      <h3 className="text-xl font-orbitron font-bold text-white mb-2">
        Erreur de chargement
      </h3>
      
      <p className="text-gray-400 mb-6 max-w-md">
        {error || "Une erreur s'est produite lors du chargement des produits. Veuillez réessayer."}
      </p>
      
      <Button
        onClick={onRetry}
        className="border-2 border-white bg-white text-black hover:bg-transparent hover:text-white font-bold"
      >
        Réessayer
      </Button>
    </div>
  );
}