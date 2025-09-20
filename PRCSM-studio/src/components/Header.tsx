import { NavLink, Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import logoUrl from "@/assets/logo.svg";

function cx(...c: Array<string | false | undefined>) {
  return c.filter(Boolean).join(" ");
}

export default function Header() {
  const { getTotalQuantity } = useCart?.() ?? { getTotalQuantity: () => 0 };
  const cartCount = getTotalQuantity();

  const nav = [
    { to: "/", label: "Accueil" },
    { to: "/catalogue", label: "Catalogue" },
    { to: "/lookbook", label: "Lookbook" },
    { to: "/profile", label: "Profile" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-prcsm-black text-prcsm-white border-b-2 border-prcsm-violet">
      <div className="mx-auto max-w-6xl px-6 py-3 grid grid-cols-3 items-center">
        {/* Brand - left */}
        <Link to="/" className="flex items-center gap-3 justify-self-start text-prcsm-white visited:text-prcsm-white">
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

        {/* Nav - centered */}
        <nav aria-label="Primary" className="flex items-center gap-3 justify-self-center">
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

        {/* Cart - right */}
        <div className="justify-self-end">
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
      </div>
    </header>
  );
}
