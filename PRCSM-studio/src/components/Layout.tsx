export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="dark min-h-screen flex flex-col bg-background text-foreground">
      {/* Header */}
      <header className=" border-b border-border">
        <nav className="container mx-auto flex justify-between items-center p-4">
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

      {/* Main content pousse le footer */}
      <main className="flex-1 container mx-auto px-6 py-8">{children}</main>

      {/* Footer stick en bas */}
      <footer className="bg-prcsm-black border-t border-prcsm-gray py-4 text-center">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-zinc-400">
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
