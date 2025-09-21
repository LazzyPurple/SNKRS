import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '@/context/CartContext';

export default function ThankYouPage() {
  const { resetAfterCheckout } = useCart();
  const [returnPath, setReturnPath] = useState<string | null>(null);


  useEffect(() => {
    // Unconditionally reset cart on mount (no query checks)
    resetAfterCheckout();
    

    
    // Clean URL to /merci (remove any query parameters)
    window.history.replaceState({}, '', '/merci');

    // Get return path from localStorage
    const storedReturnPath = localStorage.getItem('prcsm:returnPath');
    if (storedReturnPath) {
      setReturnPath(storedReturnPath);
      // Clean up return path after use
      localStorage.removeItem('prcsm:returnPath');
    }
  }, [resetAfterCheckout]);

  return (
    <div className="min-h-screen bg-prcsm-black text-white flex items-center justify-center p-8">
      <div className="text-center max-w-2xl">
        {/* Big title */}
        <h1 className="text-6xl md:text-8xl font-orbitron font-black mb-8 tracking-wider">
          Merci 🙌
        </h1>
        
        {/* Guidance text */}
        <p className="text-xl md:text-2xl font-mono mb-12 text-gray-300 leading-relaxed">
          Ta commande a été confirmée.<br />
          Tu recevras un email de confirmation sous peu.
        </p>
        
        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          {/* Home CTA */}
          <Link
            to="/"
            className="px-8 py-4 border-2 border-white bg-prcsm-black text-white font-orbitron font-bold uppercase tracking-wider transition-all duration-200 hover:bg-white hover:text-prcsm-black focus-visible:outline-none focus-visible:shadow-[4px_4px_0px_0px_#a488ef] active:shadow-[4px_4px_0px_0px_#a488ef] active:translate-x-[2px] active:translate-y-[2px]"
          >
            Accueil
          </Link>
          
          {/* Return path or Catalogue CTA */}
          {returnPath ? (
            <Link
              to={returnPath}
              className="px-8 py-4 border-2 border-white bg-prcsm-black text-white font-orbitron font-bold uppercase tracking-wider transition-all duration-200 hover:bg-white hover:text-prcsm-black focus-visible:outline-none focus-visible:shadow-[4px_4px_0px_0px_#a488ef] active:shadow-[4px_4px_0px_0px_#a488ef] active:translate-x-[2px] active:translate-y-[2px]"
            >
              Retourner là où tu étais
            </Link>
          ) : (
            <Link
              to="/catalogue"
              className="px-8 py-4 border-2 border-white bg-prcsm-black text-white font-orbitron font-bold uppercase tracking-wider transition-all duration-200 hover:bg-white hover:text-prcsm-black focus-visible:outline-none focus-visible:shadow-[4px_4px_0px_0px_#a488ef] active:shadow-[4px_4px_0px_0px_#a488ef] active:translate-x-[2px] active:translate-y-[2px]"
            >
              Catalogue
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}