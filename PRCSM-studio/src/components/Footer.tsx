import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import logoSvg from '@/assets/logo.svg';

const legalLinks = [
  { to: '/mentions-legales', label: 'Mentions légales' },
  { to: '/confidentialite', label: 'Confidentialité' },
  { to: '/cgv', label: 'CGV' },
  { to: '/livraison', label: 'Livraison' },
  { to: '/contact', label: 'Contact' },
];

const socialLinks = [
  { href: 'https://instagram.com/prcsm.studio', label: 'Instagram', icon: 'IG' },
  { href: 'https://twitter.com/prcsm_studio', label: 'X (Twitter)', icon: 'X' },
  { href: 'https://tiktok.com/@prcsm.studio', label: 'TikTok', icon: 'TT' },
  { href: 'https://youtube.com/@prcsm.studio', label: 'YouTube', icon: 'YT' },
];

function getLegalLinkClassName({ isActive }: { isActive: boolean }) {
  return `px-3 py-2 border-2 font-bold text-xs uppercase tracking-wide transition-all duration-200 ${
    isActive
      ? 'bg-prcsm-violet text-prcsm-black border-prcsm-violet shadow-[2px_2px_0_0_#A488EF]'
      : 'bg-prcsm-black text-prcsm-white border-prcsm-white hover:bg-prcsm-violet hover:text-prcsm-black hover:border-prcsm-violet hover:shadow-[2px_2px_0_0_#A488EF] hover:translate-x-[-1px] hover:translate-y-[-1px]'
  } focus:outline-none focus:ring-2 focus:ring-prcsm-violet focus:ring-offset-2 focus:ring-offset-prcsm-black focus:bg-prcsm-violet focus:text-prcsm-black focus:shadow-[2px_2px_0_0_#A488EF]`;
}

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    
    // Simulate newsletter signup
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage('Subscribed!');
      setEmail('');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error occurred');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="w-full border-t-2 border-prcsm-white bg-prcsm-black shadow-[0_-4px_0_0_#A488EF]">
      <div className="w-full px-4 md:px-8 py-6 md:py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {/* PRCSM Studio Logo */}
              <img 
                src={logoSvg}
                alt="PRCSM Studio Logo"
                width="32" 
                height="32" 
                className="text-prcsm-violet"
              />
              
              <span className="text-lg md:text-xl font-bold text-prcsm-white font-orbitron">
                PRCSM studio
              </span>
            </div>
            
            <p className="text-sm text-prcsm-white leading-relaxed font-lato">
              © 2025 PRCSM Studio.<br />
              Tous droits réservés.
            </p>
          </div>

          {/* Legal Links Column */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-prcsm-violet uppercase tracking-wide font-orbitron">
              Légal
            </h3>
            <div className="flex flex-wrap gap-2">
              {legalLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={getLegalLinkClassName}
                  aria-label={`Accéder à ${link.label}`}
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
          </div>

          {/* Newsletter Column */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-prcsm-violet uppercase tracking-wide font-orbitron">
              Newsletter
            </h3>
            
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                className="w-full px-3 py-2 border-2 border-prcsm-white bg-prcsm-black text-prcsm-white placeholder-gray-400 text-sm font-lato focus:outline-none focus:border-prcsm-violet focus:ring-2 focus:ring-prcsm-violet focus:ring-offset-2 focus:ring-offset-prcsm-black"
                disabled={isSubmitting}
                aria-label="Adresse email pour la newsletter"
              />
              
              <button
                type="submit"
                disabled={isSubmitting || !email.trim()}
                className="w-full px-3 py-2 border-2 border-prcsm-violet bg-prcsm-black text-prcsm-violet font-bold text-sm uppercase tracking-wide font-orbitron hover:bg-prcsm-violet hover:text-prcsm-black hover:shadow-[2px_2px_0_0_#A488EF] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:bg-prcsm-violet focus:text-prcsm-black focus:shadow-[2px_2px_0_0_#A488EF]"
                aria-label={isSubmitting ? 'Envoi en cours' : 'S\'abonner à la newsletter'}
              >
                {isSubmitting ? 'Envoi...' : 'S\'abonner'}
              </button>
              
              {message && (
                <div className="text-xs text-prcsm-violet font-bold font-orbitron" role="status" aria-live="polite">
                  {message}
                </div>
              )}
            </form>
          </div>

          {/* Social Icons Column */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-prcsm-violet uppercase tracking-wide font-orbitron">
              Suivez-nous
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.href}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 border-2 border-prcsm-white bg-prcsm-black text-prcsm-white font-bold text-xs uppercase tracking-wide text-center font-orbitron hover:bg-prcsm-violet hover:text-prcsm-black hover:border-prcsm-violet hover:shadow-[2px_2px_0_0_#A488EF] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all duration-200 focus:outline-none focus:bg-prcsm-violet focus:text-prcsm-black focus:border-prcsm-violet focus:shadow-[2px_2px_0_0_#A488EF] focus:ring-2 focus:ring-prcsm-violet focus:ring-offset-2 focus:ring-offset-prcsm-black"
                  aria-label={`Suivez-nous sur ${social.label}`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}