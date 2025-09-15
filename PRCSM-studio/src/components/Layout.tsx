import type { ReactNode } from "react";
import { Link } from "react-router-dom";

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-10">
        <nav className="container mx-auto flex justify-between items-center p-4">
          <Link to="/" className="text-xl font-bold">
            PRCSM-Studio
          </Link>
          <div className="flex gap-6">
            <Link to="/" className="hover:underline">
              Accueil
            </Link>
            <Link to="/catalogue" className="hover:underline">
              Catalogue
            </Link>
            <Link to="/panier" className="hover:underline">
              Panier
            </Link>
          </div>
        </nav>
      </header>

      {/* Main */}
      <main className="flex-1 container mx-auto px-6 py-8">{children}</main>

      {/* Footer */}
      <footer className="bg-black text-white py-4 text-center">
        <p className="text-sm">© 2025 PRCSM-Studio - Tous droits réservés</p>
      </footer>
    </div>
  );
}
