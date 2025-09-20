import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

// Stepper component for quantity control
function QuantityStepper({ 
  currentQuantity, 
  isDirty,
  syncStartTime,
  onUpdate
}: {
  currentQuantity: number;
  isDirty?: boolean;
  syncStartTime?: number;
  onUpdate: (quantity: number) => void;
}) {
  const [localQuantity, setLocalQuantity] = useState(currentQuantity);
  const [showSyncIndicator, setShowSyncIndicator] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout>();
  const syncIndicatorRef = useRef<NodeJS.Timeout>();

  // Update local quantity when prop changes
  useEffect(() => {
    setLocalQuantity(currentQuantity);
  }, [currentQuantity]);

  // Handle sync indicator for lines pending >700ms
  useEffect(() => {
    if (syncIndicatorRef.current) {
      clearTimeout(syncIndicatorRef.current);
    }

    if (isDirty && syncStartTime) {
      syncIndicatorRef.current = setTimeout(() => {
        setShowSyncIndicator(true);
      }, 700);
    } else {
      setShowSyncIndicator(false);
    }

    return () => {
      if (syncIndicatorRef.current) {
        clearTimeout(syncIndicatorRef.current);
      }
    };
  }, [isDirty, syncStartTime]);

  // Debounced update function
  const debouncedUpdate = (quantity: number) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      onUpdate(quantity);
    }, 350);
  };

  const handleDecrease = () => {
    const newQuantity = Math.max(1, localQuantity - 1);
    setLocalQuantity(newQuantity);
    debouncedUpdate(newQuantity);
  };

  const handleIncrease = () => {
    const newQuantity = localQuantity + 1;
    setLocalQuantity(newQuantity);
    debouncedUpdate(newQuantity);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 1;
    const sanitizedValue = Math.max(1, value);
    setLocalQuantity(sanitizedValue);
    debouncedUpdate(sanitizedValue);
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (isNaN(value) || value < 1) {
      setLocalQuantity(1);
      debouncedUpdate(1);
    }
  };

  return (
    <div className="flex items-center gap-1 relative">
      {/* Decrease button */}
      <Button
        variant="chip"
        size="chipSquare"
        onClick={handleDecrease}
        disabled={localQuantity <= 1}
        className="w-9 h-9"
        aria-label="Diminuer la quantité"
      >
        −
      </Button>

      {/* Quantity input */}
      <input
        type="number"
        value={localQuantity}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        className="w-12 h-9 border-2 border-prcsm-white bg-prcsm-black text-prcsm-white text-center font-bold text-sm
                   focus-visible:border-prcsm-violet focus-visible:shadow-[4px_4px_0_0_#A488EF] focus-visible:outline-none focus-visible:ring-0
                   transition-all duration-100"
        min="1"
        aria-label="Quantité"
      />

      {/* Increase button */}
      <Button
        variant="chip"
        size="chipSquare"
        onClick={handleIncrease}
        className="w-9 h-9"
        aria-label="Augmenter la quantité"
      >
        +
      </Button>

      {/* Optional tiny sync indicator for lines pending >700ms */}
      {showSyncIndicator && (
        <div 
          className="absolute -top-1 -right-1 w-2 h-2 bg-prcsm-violet rounded-full animate-pulse"
          aria-label="Synchronisation en cours"
          title="Synchronisation en cours"
        />
      )}
    </div>
  );
}

export default function Panier() {
  const { cart, goToCheckout, updateLineQuantity, removeLine, getLineOptimisticState } = useCart();

  const lines = cart?.lines?.edges ?? [];
  const isEmpty = lines.length === 0;

  const handleQuantityUpdate = (lineId: string, quantity: number) => {
    updateLineQuantity(lineId, quantity);
  };

  const handleRemoveLine = (lineId: string) => {
    removeLine(lineId);
  };

  return (
    <div className="flex-1 w-full flex flex-col bg-prcsm-black text-prcsm-white">
      <div className="w-full px-6 py-8 overflow-visible">
          <h1 className="text-4xl font-orbitron text-prcsm-violet mb-6 text-center">Votre panier</h1>

        {/* Aria-live region for announcements */}
        <div aria-live="polite" className="sr-only" id="cart-announcements"></div>

        {isEmpty ? (
          <div className="text-center py-12">
            <div className="border-2 border-prcsm-white bg-prcsm-black p-8 max-w-md mx-auto">
              <h2 className="text-2xl font-orbitron text-prcsm-violet mb-4">Ton panier est vide</h2>
              <p className="text-prcsm-white mb-6">Découvre notre collection de sneakers exclusives</p>
              <Link 
                to="/catalogue"
                className="inline-block px-6 py-3 border-2 border-prcsm-white bg-prcsm-black text-prcsm-white font-bold
                           hover:border-prcsm-violet hover:shadow-[4px_4px_0_0_#A488EF] 
                           focus-visible:border-prcsm-violet focus-visible:shadow-[4px_4px_0_0_#A488EF]
                           active:shadow-[2px_2px_0_0_#A488EF] active:translate-x-[2px] active:translate-y-[2px]
                           transition-all duration-100"
              >
                Voir le catalogue
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-8 overflow-visible">
              {lines.map((edge) => {
                const line = edge.node;
                const variant = line.merchandise;
                const optimisticState = getLineOptimisticState(line.id);
                
                // Get variant options for display
                 const variantOptions = variant.selectedOptions || [];
                 const variantText = variantOptions
                   .map((opt: { name: string; value: string }) => `${opt.name}: ${opt.value}`)
                   .join(" / ");

                return (
                  <div
                    key={line.id}
                    className="border-2 border-prcsm-white bg-prcsm-black p-4 
                               hover:border-prcsm-violet transition-colors duration-200
                               grid grid-cols-[80px_1fr_auto_auto] gap-4 items-center"
                  >
                    {/* Product image */}
                    <img
                      src={variant.product.images?.edges?.[0]?.node?.url}
                      alt={variant.product.title}
                      className="w-20 h-20 object-cover border-2 border-prcsm-white"
                    />

                    {/* Product info */}
                    <div className="min-w-0">
                      <h3 className="font-orbitron text-lg text-prcsm-white font-bold truncate">
                        {variant.product.title}
                      </h3>
                      <p className="text-prcsm-white text-sm mb-1 truncate">
                        {variant.title}
                      </p>
                      {variantText && (
                        <p className="text-prcsm-white text-sm mb-2 truncate">
                          {variantText}
                        </p>
                      )}
                      <p className="text-prcsm-violet font-bold">
                        {variant.price.amount} {variant.price.currencyCode}
                      </p>
                    </div>

                    {/* Quantity stepper */}
                     <QuantityStepper
                       currentQuantity={optimisticState.lastIntendedQuantity || line.quantity}
                       isDirty={optimisticState.isDirty}
                       syncStartTime={optimisticState.syncStartTime}
                       onUpdate={(quantity) => handleQuantityUpdate(line.id, quantity)}
                     />

                    {/* Remove button */}
                    <Button
                      variant="chip"
                      size="chipRect"
                      onClick={() => handleRemoveLine(line.id)}
                      className="h-9 px-3"
                      aria-label="Supprimer l'article"
                    >
                      Supprimer
                    </Button>
                  </div>
                );
              })}
            </div>

            {/* Checkout button */}
            <Button 
              className="w-full h-12 border-2 border-prcsm-white bg-prcsm-black text-prcsm-white font-orbitron font-bold text-lg
                         hover:border-prcsm-violet hover:shadow-[4px_4px_0_0_#A488EF] 
                         focus-visible:border-prcsm-violet focus-visible:shadow-[4px_4px_0_0_#A488EF]
                         active:shadow-[2px_2px_0_0_#A488EF] active:translate-x-[2px] active:translate-y-[2px]
                         disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-100"
              onClick={() => goToCheckout()}
              disabled={isEmpty}
            >
              Passer commande
            </Button>

            <p className="mt-4 text-sm text-center text-prcsm-white">
              Tu seras redirigé vers Shopify pour finaliser le paiement
            </p>
          </>
        )}
      </div>
    </div>
  );
}
