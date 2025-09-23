/**
 * OAuth Callback Page
 * Handles the OAuth callback from Shopify and redirects to profile
 */

import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function CallbackPage(): React.ReactElement {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { handleOAuthCallback } = useAuth();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const processCallback = async () => {
      try {
        // Check for OAuth errors in URL params
        const error = searchParams.get('error');
        if (error) {
          const errorDescription = searchParams.get('error_description') || 'Authentication failed';
          setErrorMessage(errorDescription);
          setStatus('error');
          return;
        }

        // Handle the OAuth callback
        const success = await handleOAuthCallback(searchParams);
        
        if (success) {
          setStatus('success');
          // Redirect to profile after a short delay
          setTimeout(() => {
            navigate('/profile', { replace: true });
          }, 1500);
        } else {
          setErrorMessage('Failed to complete authentication');
          setStatus('error');
        }
      } catch (error) {
        console.error('Callback processing error:', error);
        setErrorMessage('An unexpected error occurred during authentication');
        setStatus('error');
      }
    };

    processCallback();
  }, [searchParams, handleOAuthCallback, navigate]);

  const handleRetry = () => {
    navigate('/login', { replace: true });
  };

  const handleGoHome = () => {
    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">PRCSM</h1>
          <p className="text-white/70 text-lg">Studio</p>
        </div>

        {/* Status Card */}
        <div className="bg-white border-2 border-white p-8">
          {status === 'processing' && (
            <div className="text-center">
              <div className="mb-6">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-black border-t-transparent"></div>
              </div>
              <h2 className="text-2xl font-bold text-black mb-2">Connexion en cours...</h2>
              <p className="text-black/70">
                Nous finalisons votre authentification
              </p>
            </div>
          )}

          {status === 'success' && (
            <div className="text-center">
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-500 text-white rounded-full">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-black mb-2">Connexion réussie !</h2>
              <p className="text-black/70">
                Redirection vers votre profil...
              </p>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center">
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-red-500 text-white rounded-full">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-black mb-2">Erreur de connexion</h2>
              <p className="text-black/70 mb-6">
                {errorMessage}
              </p>
              
              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleRetry}
                  className="w-full bg-violet-500 text-white font-bold py-3 px-6 border-2 border-violet-500 
                           hover:bg-violet-600 hover:border-violet-600 
                           focus-visible:outline-none focus-visible:shadow-[4px_4px_0px_0px_rgb(139,69,19)]
                           active:shadow-[4px_4px_0px_0px_rgb(139,69,19)]
                           transition-all duration-150"
                  aria-label="Réessayer la connexion"
                >
                  Réessayer
                </button>
                
                <button
                  onClick={handleGoHome}
                  className="w-full bg-white text-black font-bold py-3 px-6 border-2 border-black 
                           hover:bg-black hover:text-white 
                           focus-visible:outline-none focus-visible:shadow-[4px_4px_0px_0px_rgb(139,69,19)]
                           active:shadow-[4px_4px_0px_0px_rgb(139,69,19)]
                           transition-all duration-150"
                  aria-label="Retourner à l'accueil"
                >
                  Retour à l'accueil
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}