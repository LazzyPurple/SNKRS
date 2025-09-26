import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { resetPassword } from '../auth/customer';
import { useAuth } from '../context/AuthContext';
import type { CustomerUserError } from '../auth/customer';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<CustomerUserError[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  
  const resetToken = searchParams.get('token');
  const customerId = searchParams.get('id');

  // Redirect if already logged in
  useEffect(() => {
    if (token) {
      navigate('/profile');
    }
  }, [token, navigate]);

  // Check if we have the required parameters
  if (!resetToken || !customerId) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="border-2 border-white p-8">
            <h1 className="text-3xl font-bold mb-8 text-center">LIEN INVALIDE</h1>
            
            <div className="mb-6 p-4 border-2 border-red-500 bg-red-500/10">
              <p className="text-red-400 text-center">
                Le lien de réinitialisation est invalide ou a expiré. 
                Veuillez demander un nouveau lien de réinitialisation.
              </p>
            </div>

            <div className="text-center">
              <Link 
                to="/forgot-password" 
                className="inline-block p-3 bg-black border-2 border-white text-white font-bold hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[8px_8px_0_0_#A488EF] transition-all"
              >
                DEMANDER UN NOUVEAU LIEN
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);

    // Validate password confirmation
    if (password !== confirmPassword) {
      setErrors([{ field: ['password'], message: 'Les mots de passe ne correspondent pas.' }]);
      return;
    }

    if (password.length < 6) {
      setErrors([{ field: ['password'], message: 'Le mot de passe doit contenir au moins 6 caractères.' }]);
      return;
    }

    setIsLoading(true);

    // Construct the reset token ID as expected by Shopify
    const resetTokenId = `gid://shopify/CustomerPasswordResetToken/${resetToken}`;

    const result = await resetPassword(resetTokenId, password);
    
    if (result.customerAccessToken) {
      setIsSuccess(true);
      // Optionally auto-login the user here
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } else {
      setErrors(result.customerUserErrors);
    }
    
    setIsLoading(false);
  };

  const fieldsOf = (e: any) => Array.isArray(e?.field) ? e.field : [];

  const getFieldError = (field: string) => {
    return errors?.find(error => {
      const fields = fieldsOf(error);
      return fields.includes(field) || 
             fields.includes('password');
    })?.message;
  };

  const getGeneralError = () => {
    return errors?.find(error => {
      const fields = fieldsOf(error);
      return fields.includes('general') || 
             fields.length === 0;
    })?.message;
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="border-2 border-white p-8">
            <h1 className="text-3xl font-bold mb-8 text-center">MOT DE PASSE RÉINITIALISÉ</h1>
            
            <div className="mb-6 p-4 border-2 border-green-500 bg-green-500/10">
              <p className="text-green-400 text-center">
                Votre mot de passe a été réinitialisé avec succès. 
                Vous allez être redirigé vers la page de connexion dans quelques secondes.
              </p>
            </div>

            <div className="text-center">
              <Link 
                to="/login" 
                className="inline-block p-3 bg-black border-2 border-white text-white font-bold hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[8px_8px_0_0_#A488EF] transition-all"
              >
                SE CONNECTER MAINTENANT
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="border-2 border-white p-8">
          <h1 className="text-3xl font-bold mb-8 text-center">NOUVEAU MOT DE PASSE</h1>
          
          <p className="text-sm mb-6 text-center text-gray-300">
            Entrez votre nouveau mot de passe ci-dessous.
          </p>

          {getGeneralError() && (
            <div className="mb-6 p-4 border-2 border-red-500 bg-red-500/10">
              <p className="text-red-400">{getGeneralError()}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-bold mb-2">
                NOUVEAU MOT DE PASSE
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full p-3 bg-black border-2 border-white text-white focus-visible:outline-none focus-visible:shadow-[8px_8px_0_0_#A488EF] transition-shadow"
                placeholder="••••••••"
              />
              {getFieldError('password') && (
                <p className="text-red-400 text-sm mt-1">{getFieldError('password')}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-bold mb-2">
                CONFIRMER LE MOT DE PASSE
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="w-full p-3 bg-black border-2 border-white text-white focus-visible:outline-none focus-visible:shadow-[8px_8px_0_0_#A488EF] transition-shadow"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full p-3 bg-black border-2 border-white text-white font-bold hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[8px_8px_0_0_#A488EF] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-none"
            >
              {isLoading ? 'RÉINITIALISATION...' : 'RÉINITIALISER LE MOT DE PASSE'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm">
              Vous vous souvenez de votre mot de passe ?{' '}
              <Link 
                to="/login" 
                className="underline hover:text-[#A488EF] transition-colors"
              >
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}