import { useEffect, useState } from 'react';
import { useCart } from '@/context/CartContext';
import { buildCheckoutUrl } from '@/utils/checkout';

export default function CheckoutPage() {
  const { cart } = useCart();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!cart?.checkoutUrl) {
      setError('Aucun panier trouvé');
      return;
    }

    // Show overlay for 300ms then redirect
    const timer = setTimeout(() => {
      const checkoutUrl = buildCheckoutUrl(cart.checkoutUrl!);
      window.location.assign(checkoutUrl);
    }, 300);

    return () => clearTimeout(timer);
  }, [cart]);

  if (error) {
    return (
      <div className="min-h-screen bg-prcsm-black text-white flex items-center justify-center p-8">
        <div className="text-center">
          <h1 className="text-4xl font-orbitron font-black mb-4 text-red-400">
            Erreur
          </h1>
          <p className="text-xl font-mono mb-8">{error}</p>
          <a
            href="/panier"
            className="px-8 py-4 border-2 border-white bg-prcsm-black text-white font-orbitron font-bold uppercase tracking-wider transition-all duration-200 hover:bg-white hover:text-prcsm-black focus-visible:outline-none focus-visible:shadow-[4px_4px_0px_0px_#a488ef] active:shadow-[4px_4px_0px_0px_#a488ef] active:translate-x-[2px] active:translate-y-[2px]"
          >
            Retour au panier
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-prcsm-black text-white flex items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-6xl font-orbitron font-black mb-8 tracking-wider animate-pulse">
          Redirection...
        </h1>
        <p className="text-xl font-mono text-gray-300">
          Tu vas être redirigé vers Shopify
        </p>
        <div className="mt-8 w-16 h-1 bg-[#A488EF] mx-auto animate-pulse"></div>
      </div>
    </div>
  );
}