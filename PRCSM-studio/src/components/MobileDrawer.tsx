import { useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

function cx(...c: Array<string | false | undefined>) {
  return c.filter(Boolean).join(" ");
}

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function MobileDrawer({ open, onClose }: MobileDrawerProps) {
  const { getTotalQuantity } = useCart?.() ?? { getTotalQuantity: () => 0 };
  const cartCount = getTotalQuantity();
  const { me } = useAuth();
  const drawerRef = useRef<HTMLDivElement>(null);

  // Focus trap implementation
  useEffect(() => {
    if (!open) return;

    const drawer = drawerRef.current;
    if (!drawer) return;

    // Get all focusable elements
    const focusableElements = drawer.querySelectorAll(
      'a[href], button, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    // Focus first element when drawer opens
    setTimeout(() => {
      firstElement?.focus();
    }, 100);

    // Handle tab key for focus trap
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener("keydown", handleTabKey);
    return () => document.removeEventListener("keydown", handleTabKey);
  }, [open]);

  const navLinks = [
    { to: "/", label: "Accueil" },
    { to: "/catalogue", label: "Catalogue" },
    { to: "/lookbook", label: "Lookbook" },
    { to: "/profile", label: "Mon compte" },
    { to: "/panier", label: "Panier" },
  ];

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/80"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.div
            ref={drawerRef}
            id="mobile-drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ 
              duration: 0.2,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
            className="fixed top-0 right-0 z-50 h-full w-[88vw] max-w-[400px] bg-prcsm-black border-l-2 border-white"
            role="dialog"
            aria-modal="true"
            aria-labelledby="mobile-drawer-title"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b-2 border-white">
              <h2 
                id="mobile-drawer-title" 
                className="font-orbitron text-xl font-bold text-prcsm-white"
              >
                MENU
              </h2>
              <button
                onClick={onClose}
                className={cx(
                  "p-2 border-2 border-white text-prcsm-white bg-prcsm-black",
                  "hover:translate-x-[-1px] hover:translate-y-[-1px]",
                  "focus-visible:outline-none focus-visible:shadow-[4px_4px_0_0_#A488EF]",
                  "transition-all duration-150"
                )}
                aria-label="Fermer le menu"
              >
                <svg 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="flex flex-col p-6 space-y-4" aria-label="Navigation mobile">
              {navLinks.map((item) => {
                // Special handling for Panier link to show cart count
                if (item.to === "/panier") {
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={onClose}
                      className={({ isActive }) =>
                        cx(
                          "flex items-center justify-between px-4 py-3 border-2 text-left font-lato font-bold",
                          "border-white text-prcsm-white visited:text-prcsm-white bg-prcsm-black",
                          "hover:translate-x-[-1px] hover:translate-y-[-1px]",
                          "focus-visible:outline-none focus-visible:shadow-[4px_4px_0_0_#A488EF]",
                          "transition-all duration-150",
                          isActive && "border-prcsm-violet shadow-[4px_4px_0_0_#A488EF]"
                        )
                      }
                    >
                      <span>{item.label}</span>
                      <span className="inline-flex items-center justify-center min-w-[24px] h-6 px-2 text-xs font-bold border-2 border-white bg-prcsm-violet text-prcsm-black">
                        {cartCount}
                      </span>
                    </NavLink>
                  );
                }

                // Skip Mon compte if user is not logged in
                if (item.to === "/profile" && !me) {
                  return null;
                }

                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={onClose}
                    className={({ isActive }) =>
                      cx(
                        "px-4 py-3 border-2 text-left font-lato font-bold",
                        "border-white text-prcsm-white visited:text-prcsm-white bg-prcsm-black",
                        "hover:translate-x-[-1px] hover:translate-y-[-1px]",
                        "focus-visible:outline-none focus-visible:shadow-[4px_4px_0_0_#A488EF]",
                        "transition-all duration-150",
                        isActive && "border-prcsm-violet shadow-[4px_4px_0_0_#A488EF]"
                      )
                    }
                  >
                    {item.label}
                  </NavLink>
                );
              })}

              {/* Login/Logout section */}
              {!me ? (
                <NavLink
                  to="/login"
                  onClick={onClose}
                  className={({ isActive }) =>
                    cx(
                      "px-4 py-3 border-2 text-left font-lato font-bold",
                      "border-white text-prcsm-white visited:text-prcsm-white bg-prcsm-black",
                      "hover:translate-x-[-1px] hover:translate-y-[-1px]",
                      "focus-visible:outline-none focus-visible:shadow-[4px_4px_0_0_#A488EF]",
                      "transition-all duration-150",
                      isActive && "border-prcsm-violet shadow-[4px_4px_0_0_#A488EF]"
                    )
                  }
                >
                  Se connecter
                </NavLink>
              ) : (
                <div className="pt-4 border-t-2 border-white">
                  <p className="px-4 py-2 text-sm text-prcsm-white font-lato">
                    Connecté en tant que <span className="font-bold">{me.firstName || me.email}</span>
                  </p>
                </div>
              )}
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}