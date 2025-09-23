/**
 * Login Page with brutalist styling
 * Single CTA to initiate Shopify Customer Account OAuth flow
 */

import { useAuth } from '../context/AuthContext';

export default function LoginPage(): React.ReactElement {
  const { signIn, loading } = useAuth();

  const handleSignIn = async () => {
    try {
      await signIn();
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">PRCSM</h1>
          <p className="text-white/70 text-lg">Studio</p>
        </div>

        {/* Login Card */}
        <div className="bg-white border-2 border-white p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-black mb-2">Se connecter</h2>
            <p className="text-black/70">
              Accédez à votre compte pour gérer vos commandes et informations personnelles
            </p>
          </div>

          {/* Sign In Button */}
          <button
            onClick={handleSignIn}
            disabled={loading}
            className="w-full bg-violet-500 text-white font-bold py-4 px-6 border-2 border-violet-500 
                     hover:bg-violet-600 hover:border-violet-600 
                     focus-visible:outline-none focus-visible:shadow-[4px_4px_0px_0px_rgb(139,69,19)]
                     active:shadow-[4px_4px_0px_0px_rgb(139,69,19)]
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-150"
            aria-label="Se connecter avec votre compte Shopify"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>

          {/* Info Text */}
          <div className="mt-6 text-center">
            <p className="text-sm text-black/60">
              Vous serez redirigé vers une page sécurisée pour vous connecter
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-white/50 text-sm">
            Pas encore de compte ?{' '}
            <button
              onClick={handleSignIn}
              className="text-white underline hover:text-white/80 focus-visible:outline-none focus-visible:text-white/80"
            >
              Créer un compte
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}