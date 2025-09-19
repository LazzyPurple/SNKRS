import { NavLink } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import logoSvg from '@/assets/logo.svg';

const navItems = [
  { to: '/', label: 'Accueil' },
  { to: '/catalogue', label: 'Shop' },
  { to: '/lookbook', label: 'Lookbook' },
  { to: '/profile', label: 'Profile' },
  { to: '/panier', label: 'Panier', hasCartBadge: true },
];

function getNavLinkClassName({ isActive }: { isActive: boolean }) {
  return `px-3 py-2 border-2 font-bold text-xs uppercase tracking-wide transition-all duration-200 relative ${
    isActive
      ? 'bg-prcsm-violet text-prcsm-black border-prcsm-violet'
      : 'bg-prcsm-black text-prcsm-white border-prcsm-white hover:bg-prcsm-violet hover:text-prcsm-black hover:border-prcsm-violet'
  } focus:outline-none focus:ring-2 focus:ring-prcsm-violet focus:ring-offset-2 focus:ring-offset-prcsm-black`;
}

export default function Header() {
  const { cart, localLines } = useCart();
  
  // Calculate total cart items from both Shopify cart and local optimistic updates
  const cartItemCount = (() => {
    let total = 0;
    
    // Add items from Shopify cart
    if (cart?.lines?.edges) {
      total += cart.lines.edges.reduce((sum, edge) => sum + edge.node.quantity, 0);
    }
    
    // Add items from local optimistic updates
    total += localLines.reduce((sum, line) => sum + line.quantity, 0);
    
    return total;
  })();

  return (
    <header className="w-full border-b-2 border-prcsm-white sticky top-0 z-50 bg-prcsm-black">
      <nav 
        className="w-full flex justify-between items-center px-6 py-4"
        aria-label="Primary navigation"
      >
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          {/* PRCSM Studio Logo */}
          <img 
            src={logoSvg}
            alt="PRCSM Studio Logo"
            width="24" 
            height="24" 
            className="text-prcsm-violet"
          />
          
          <span className="text-lg font-bold text-prcsm-white font-orbitron">
            PRCSM studio
          </span>
        </div>

        {/* Navigation Chips */}
        <div className="flex gap-2">
          {navItems.map((item) => (
            <div key={item.to} className="relative">
              <NavLink
                to={item.to}
                className={getNavLinkClassName}
                aria-label={item.hasCartBadge ? `${item.label} (${cartItemCount} items)` : item.label}
              >
                {item.label}
              </NavLink>
              
              {/* Cart Badge */}
              {item.hasCartBadge && cartItemCount > 0 && (
                <div 
                  className="absolute -top-1 -right-1 bg-prcsm-violet text-prcsm-black text-xs font-bold w-5 h-5 flex items-center justify-center border border-prcsm-white text-center leading-none"
                  aria-label={`${cartItemCount} items in cart`}
                >
                  {cartItemCount > 9 ? '9+' : cartItemCount}
                </div>
              )}
            </div>
          ))}
        </div>
      </nav>
    </header>
  );
}