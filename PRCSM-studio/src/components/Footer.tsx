import { NavLink } from "react-router-dom";
import logoUrl from "@/assets/logo.svg"; // ✅ Vite bundling-safe

const legal = [
  { to: "/mentions-legales", label: "Mentions légales" },
  { to: "/confidentialite", label: "Confidentialité" },
  { to: "/cgu", label: "CGU" },
  { to: "/shipping", label: "Livraison" },
  { to: "/contact", label: "Contact" },
];

const socials = [
  { href: "https://instagram.com", label: "Instagram" },
  { href: "https://twitter.com", label: "X" },
  { href: "https://tiktok.com", label: "TikTok" },
  { href: "https://youtube.com", label: "YouTube" },
];

export default function Footer() {
  return (
    <footer className="w-full bg-prcsm-black text-prcsm-white border-t-2 border-prcsm-violet">
      {/* Desktop: 3 zones in one row; Mobile: stacked. No fixed heights, natural content height. */}
      <div className="mx-auto max-w-6xl px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Brand - Fluid scaling to match Legal section proportionally */}
        <div className="flex items-center justify-center md:justify-start gap-[clamp(8px,1vw,16px)]">
          <img
            src={logoUrl}
            alt="PRCSM"
            className="h-[clamp(24px,2.5vw,48px)] w-[clamp(24px,2.5vw,48px)] select-none"
            draggable={false}
          />
          <div className="text-[clamp(12px,1.2vw,16px)] leading-tight">
            <div className="font-semibold">© 2025 PRCSM Studio.</div>
            <div className="opacity-70">Tous droits réservés.</div>
          </div>
        </div>

        {/* Legal: wrapping row, no horizontal scroll; adequate padding to prevent focus ring clipping */}
        <div className="min-w-0">
          <div className="font-orbitron text-sm mb-3 text-center md:text-left">Légal</div>
          <div className="overflow-visible py-2">
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              {legal.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  className={({ isActive }) =>
                    [
                      "px-3 py-2 border-2 rounded-none", // adequate padding to avoid clipping
                      "border-white text-prcsm-white visited:text-prcsm-white bg-prcsm-black",
                      "transition-colors hover:border-prcsm-violet",
                      "focus-visible:outline-none focus-visible:border-prcsm-violet focus-visible:shadow-[4px_4px_0_0_#A488EF]",
                      isActive
                        ? "border-prcsm-violet shadow-[4px_4px_0_0_#A488EF]"
                        : "",
                    ].join(" ")
                  }
                >
                  {l.label}
                </NavLink>
              ))}
            </div>
          </div>
        </div>

        {/* Socials */}
        <div className="">
          <div className="font-orbitron text-sm mb-3 text-center md:text-right">Suivez-nous</div>
          <div className="flex justify-center md:justify-end gap-3">
            {socials.map((s) => (
              <a
                key={s.href}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={`Suivez-nous sur ${s.label}`}
                className="inline-flex items-center justify-center w-9 h-9 border-2 border-white rounded-none bg-prcsm-black text-prcsm-white visited:text-prcsm-white transition-colors hover:border-prcsm-violet focus-visible:outline-none focus-visible:border-prcsm-violet focus-visible:shadow-[4px_4px_0_0_#A488EF]"
              >
                {s.label === "Instagram" && (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                )}
                {s.label === "TikTok" && (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                  </svg>
                )}
                {s.label === "X" && (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                )}
                {s.label === "YouTube" && (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                )}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
