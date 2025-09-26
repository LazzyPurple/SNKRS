import { useState, useEffect } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import logoUrl from "@/assets/logo.svg";
import MobileDrawer from "./MobileDrawer";

function cx(...c: Array<string | false | undefined>) {
  return c.filter(Boolean).join(" ");
}

export default function Header() {
  const { getTotalQuantity } = useCart?.() ?? { getTotalQuantity: () => 0 };
  const cartCount = getTotalQuantity();
  const { me } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const nav = [
    { to: "/", label: "Accueil" },
    { to: "/catalogue", label: "Catalogue" },
    { to: "/lookbook", label: "Lookbook" },
  ];

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle escape key to close mobile menu
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [mobileMenuOpen]);

  // Body scroll lock when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-prcsm-black text-prcsm-white border-b-2 border-prcsm-violet">
        <div className="mx-auto max-w-6xl px-6 py-3 flex items-center justify-between">
          {/* Brand - left */}
          <Link to="/" className="flex items-center gap-3 text-prcsm-white visited:text-prcsm-white">
            <img
              src={logoUrl}
              alt="PRCSM"
              className="h-7 w-7 select-none"
              draggable={false}
            />
            <span className="font-orbitron text-lg tracking-wide">
              PRCSM Studio
            </span>
          </Link>

          {/* Desktop Nav - centered, hidden on mobile */}
          <nav aria-label="Primary" className="hidden md:flex items-center gap-3">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cx(
                    "px-3 py-1.5 border-2 rounded-none select-none",
                    "border-white text-prcsm-white visited:text-prcsm-white bg-prcsm-black",
                    "transition-colors hover:border-prcsm-violet",
                    "focus-visible:outline-none focus-visible:border-prcsm-violet focus-visible:shadow-[4px_4px_0_0_#A488EF]",
                    isActive &&
                      "border-prcsm-violet shadow-[4px_4px_0_0_#A488EF]"
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {/* Desktop Auth and Cart - hidden on mobile */}
            <div className="hidden md:flex items-center gap-3">
              {/* Auth section */}
              {me ? (
                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    cx(
                      "px-3 py-1.5 border-2 rounded-none select-none",
                      "border-white text-prcsm-white visited:text-prcsm-white bg-prcsm-black",
                      "transition-colors hover:border-prcsm-violet",
                      "focus-visible:outline-none focus-visible:border-prcsm-violet focus-visible:shadow-[4px_4px_0_0_#A488EF]",
                      isActive &&
                        "border-prcsm-violet shadow-[4px_4px_0_0_#A488EF]"
                    )
                  }
                >
                  Mon compte
                </NavLink>
              ) : (
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    cx(
                      "px-3 py-1.5 border-2 rounded-none select-none",
                      "border-white text-prcsm-white visited:text-prcsm-white bg-prcsm-black",
                      "transition-colors hover:border-prcsm-violet",
                      "focus-visible:outline-none focus-visible:border-prcsm-violet focus-visible:shadow-[4px_4px_0_0_#A488EF]",
                      isActive &&
                        "border-prcsm-violet shadow-[4px_4px_0_0_#A488EF]"
                    )
                  }
                >
                  Se connecter
                </NavLink>
              )}

              {/* Cart */}
              <NavLink
                to="/panier"
                className={({ isActive }) =>
                  cx(
                    "relative px-3 py-1.5 border-2 rounded-none",
                    "border-white text-prcsm-white visited:text-prcsm-white bg-prcsm-black",
                    "transition-colors hover:border-prcsm-violet",
                    "focus-visible:outline-none focus-visible:border-prcsm-violet focus-visible:shadow-[4px_4px_0_0_#A488EF]",
                    isActive &&
                      "border-prcsm-violet shadow-[4px_4px_0_0_#A488EF]"
                  )
                }
              >
                Panier
                <span className="ml-2 inline-flex items-center justify-center min-w-[20px] h-5 px-1 text-xs font-bold border-2 rounded-none border-white bg-prcsm-violet text-prcsm-black">
                  {cartCount}
                </span>
              </NavLink>
            </div>

            {/* Mobile actions - visible only on mobile */}
            <div className="flex md:hidden items-center gap-3">
              {/* Mobile Cart - optional, can be removed if you prefer only in drawer */}
              <NavLink
                to="/panier"
                className={({ isActive }) =>
                  cx(
                    "relative px-2 py-1.5 border-2 rounded-none",
                    "border-white text-prcsm-white visited:text-prcsm-white bg-prcsm-black",
                    "hover:translate-x-[-1px] hover:translate-y-[-1px]",
                    "focus-visible:outline-none focus-visible:shadow-[4px_4px_0_0_#A488EF]",
                    "transition-all duration-150",
                    isActive && "border-prcsm-violet shadow-[4px_4px_0_0_#A488EF]"
                  )
                }
              >
                <span className="inline-flex items-center justify-center min-w-[24px] h-6 px-1 text-xs font-bold border-2 rounded-none border-white bg-prcsm-violet text-prcsm-black">
                  {cartCount}
                </span>
              </NavLink>

              {/* Burger Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className={cx(
                  "p-2 border-2 border-white text-prcsm-white bg-prcsm-black",
                  "hover:translate-x-[-1px] hover:translate-y-[-1px]",
                  "focus-visible:outline-none focus-visible:shadow-[4px_4px_0_0_#A488EF]",
                  "transition-all duration-150"
                )}
                aria-controls="mobile-drawer"
                aria-expanded={mobileMenuOpen}
                aria-label="Ouvrir le menu"
              >
                <svg 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2"
                >
                  <path d="M3 12h18M3 6h18M3 18h18" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <MobileDrawer 
        open={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)} 
      />
    </>
  );
}
