export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen w-screen flex flex-col bg-prcsm-black text-prcsm-white overflow-hidden">
      {/* Header - Fixed at top */}
      <header className="w-full border-b border-border sticky top-0 z-50 bg-prcsm-black">
        <nav className="w-full flex justify-between items-center px-6 py-4">
          <a href="/" className="text-xl font-bold text-primary">
            PRCSM-Studio
          </a>
          <div className="flex gap-6">
            <a href="/">Accueil</a>
            <a href="/catalogue">Catalogue</a>
            <a href="/panier">Panier</a>
          </div>
        </nav>
      </header>

      {/* Main content - Takes remaining space */}
      <main className="flex-1 w-screen flex flex-col min-h-0 overflow-y-auto">{children}</main>

      {/* Footer - Fixed at bottom */}
      <footer className="w-full bg-prcsm-black border-t border-prcsm-gray py-4 sticky bottom-0 z-50">
        <div className="w-full flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-zinc-400 px-6">
          {/* Copyright */}
          <p className="text-center md:text-left">
            © 2025{" "}
            <span className="text-primary font-semibold">PRCSM-Studio</span>.
            Tous droits réservés.
          </p>

          {/* Links */}
          <div className="flex gap-6 text-xs uppercase tracking-wide">
            <a
              href="/mentions-legales"
              className="hover:text-primary transition-colors"
            >
              Mentions légales
            </a>
            <a
              href="/confidentialite"
              className="hover:text-primary transition-colors"
            >
              Confidentialité
            </a>
            <a href="/contact" className="hover:text-primary transition-colors">
              Contact
            </a>
          </div>

          {/* Socials */}
          <div className="flex gap-4">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-primary transition-colors"
            >
              IG
            </a>
            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-primary transition-colors"
            >
              TikTok
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-primary transition-colors"
            >
              X
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
