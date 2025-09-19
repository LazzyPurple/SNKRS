import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SpriteLogo from '@/components/brand/SpriteLogo';

interface HeroProps {
  className?: string;
}

export default function Hero({ className = '' }: HeroProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  const logoVariants = {
    hidden: { opacity: 0, scale: 0.8, rotate: -5 },
    visible: { opacity: 1, scale: 1, rotate: 0 },
  };

  return (
    <section
      className={`relative w-full h-full flex flex-col justify-between min-h-screen overflow-hidden ${className}`}
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

      {/* Hero Content - Central Container */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-20">
        <motion.div
          className="w-full max-w-md mx-auto bg-black border-2 border-white shadow-[8px_8px_0px_0px_rgba(139,92,246,1)] hover:shadow-[12px_12px_0px_0px_rgba(139,92,246,1)] hover:translate-x-[-4px] hover:translate-y-[-4px] transition-all duration-200 p-8 md:p-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          transition={{
            duration: 1.2,
            staggerChildren: 0.3,
          }}
        >
          {/* Stack 3 blocks vertically */}
          <div className="flex flex-col gap-12">
            
            {/* Block 1: SpriteLogo + Title */}
            <motion.div
              variants={itemVariants}
              className="text-center"
              transition={{
                duration: 0.8,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              <motion.div
                variants={logoVariants}
                className="mb-6 flex justify-center"
                whileHover={{ 
                  scale: 1.1,
                  transition: { duration: 0.2 }
                }}
                transition={{
                  duration: 1,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
              >
                <SpriteLogo
                  src="/src/assets/spritesheet_24fps.svg"
                  frameCount={48}
                  frameWidth={64}
                  frameHeight={64}
                  fps={4}
                  scale={3}
                  className="drop-shadow-2xl"
                />
              </motion.div>

              <motion.h1
                variants={itemVariants}
                className="text-2xl md:text-3xl lg:text-4xl font-orbitron font-black text-white tracking-tight"
                transition={{
                  duration: 0.8,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
              >
                PRCSM Studio
              </motion.h1>
            </motion.div>

            {/* Block 2: Subscribe Form */}
            <motion.div
              variants={itemVariants}
              className="w-full"
              transition={{
                duration: 0.8,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 bg-transparent border-2 border-white text-white placeholder:text-gray-400 px-4 py-3 font-mono text-sm focus:outline-none focus:border-violet-500 hover:border-violet-300 transition-colors duration-200"
                />
                <button
                  className="border-2 border-violet-500 text-white bg-transparent hover:bg-violet-500 px-6 py-3 font-mono text-xs uppercase tracking-wider transition-all duration-200 hover:shadow-[4px_4px_0px_0px_rgba(139,92,246,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] whitespace-nowrap"
                >
                  Subscribe
                </button>
              </div>
            </motion.div>

            {/* Block 3: Menu Links + Social Icons */}
            <motion.div
              variants={itemVariants}
              className="text-center"
              transition={{
                duration: 0.8,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              {/* Navigation Menu - Vertical Stack */}
              <nav className="mb-8">
                <ul className="flex flex-col gap-4">
                  <li>
                    <Link 
                      to="/catalogue" 
                      className="text-gray-400 font-orbitron font-bold text-sm uppercase tracking-wider hover:text-white hover:text-violet-400 transition-all duration-200 block"
                    >
                      SHOP
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/lookbook" 
                      className="text-gray-400 font-orbitron font-bold text-sm uppercase tracking-wider hover:text-white hover:text-violet-400 transition-all duration-200 block"
                    >
                      LOOKBOOK
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/archive" 
                      className="text-gray-400 font-orbitron font-bold text-sm uppercase tracking-wider hover:text-white hover:text-violet-400 transition-all duration-200 block"
                    >
                      ARCHIVE
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/shipping" 
                      className="text-gray-400 font-orbitron font-bold text-sm uppercase tracking-wider hover:text-white hover:text-violet-400 transition-all duration-200 block"
                    >
                      SHIPPING
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/contact" 
                      className="text-gray-400 font-orbitron font-bold text-sm uppercase tracking-wider hover:text-white hover:text-violet-400 transition-all duration-200 block"
                    >
                      CONTACT
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/stores" 
                      className="text-gray-400 font-orbitron font-bold text-sm uppercase tracking-wider hover:text-white hover:text-violet-400 transition-all duration-200 block"
                    >
                      STORES
                    </Link>
                  </li>
                </ul>
              </nav>

              {/* Social Icons - Centered, smaller, with hover effects */}
              <div className="flex justify-center space-x-6">
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-gray-500 opacity-70 hover:text-white hover:opacity-100 hover:scale-125 transition-all duration-200">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a href="https://tiktok.com" target="_blank" rel="noreferrer" className="text-gray-500 opacity-70 hover:text-white hover:opacity-100 hover:scale-125 transition-all duration-200">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                </a>
                <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-gray-500 opacity-70 hover:text-white hover:opacity-100 hover:scale-125 transition-all duration-200">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a href="https://youtube.com" target="_blank" rel="noreferrer" className="text-gray-500 opacity-70 hover:text-white hover:opacity-100 hover:scale-125 transition-all duration-200">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              </div>
            </motion.div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}