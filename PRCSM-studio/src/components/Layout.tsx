import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isHomepage = location.pathname === '/';

  return (
    <div className="h-screen w-screen flex flex-col bg-prcsm-black text-prcsm-white overflow-hidden">
      {/* Header - Hidden on homepage */}
      {!isHomepage && <Header />}

      {/* Main content - Takes remaining space */}
      <main className="flex-1 w-screen flex flex-col min-h-0 overflow-y-auto">
        {children}
      </main>

      {/* Footer - Hidden on homepage */}
      {!isHomepage && <Footer />}
    </div>
  );
}
