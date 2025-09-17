import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        background: `
          radial-gradient(circle at 30% 70%, rgba(255, 121, 198, 0.15) 0%, transparent 50%),
          radial-gradient(circle at 70% 30%, rgba(255, 165, 0, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
          linear-gradient(135deg, #0a0a0a 0%, #1a0a0a 25%, #2a1a1a 50%, #1a0a1a 75%, #0a0a0a 100%)
        `,
      }}
    >
      {/* Artistic Background Elements */}
      <div className="absolute inset-0">
        {/* Mountain-like shapes */}
        <div className="absolute bottom-0 left-0 w-full h-2/3">
          <svg viewBox="0 0 1200 400" className="w-full h-full opacity-20">
            <defs>
              <linearGradient id="mountain1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff79c6" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#bd93f9" stopOpacity="0.1" />
              </linearGradient>
              <linearGradient id="mountain2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffb86c" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#ff79c6" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            <path d="M0,400 L200,150 L400,200 L600,100 L800,180 L1000,120 L1200,200 L1200,400 Z" fill="url(#mountain1)" />
            <path d="M0,400 L150,250 L350,280 L550,200 L750,260 L950,220 L1200,280 L1200,400 Z" fill="url(#mountain2)" />
          </svg>
        </div>
        
        {/* Floating geometric shapes */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-purple-500/10 rounded-full blur-xl animate-pulse" />
        <div className="absolute top-40 right-32 w-24 h-24 bg-pink-500/10 rounded-full blur-lg animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-40 left-1/4 w-20 h-20 bg-orange-500/10 rounded-full blur-lg animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Grid Overlay */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(139, 92, 246, 0.2) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139, 92, 246, 0.2) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Auth Content */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-black border-2 border-white shadow-brutal hover:shadow-brutal-hover hover:translate-x-[-4px] hover:translate-y-[-4px] transition-all duration-200 p-8 md:p-12">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;