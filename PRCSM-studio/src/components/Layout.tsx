import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isHomepage = location.pathname === '/';

  return (
    <div className="min-h-screen w-screen bg-prcsm-black text-prcsm-white overflow-x-hidden">
      {/* Header - Hidden on homepage, sticky positioning */}
      {!isHomepage && <Header />}

      {/* Main content - Natural height based on content */}
      <main className="w-screen">
        {children}
      </main>

      {/* Footer - Hidden on homepage, appears after content */}
      {!isHomepage && <Footer />}
    </div>
  );
}
