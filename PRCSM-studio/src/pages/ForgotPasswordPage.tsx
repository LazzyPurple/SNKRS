import { useState } from 'react';
import { Link } from 'react-router-dom';
import { requestPasswordReset } from '../auth/customer';
import type { CustomerUserError } from '../auth/customer';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<CustomerUserError[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors([]);

    const result = await requestPasswordReset(email);
    
    if (result.success) {
      setIsSuccess(true);
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
             fields.includes('email');
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
            <h1 className="text-3xl font-bold mb-8 text-center">EMAIL ENVOYÉ</h1>
            
            <div className="mb-6 p-4 border-2 border-green-500 bg-green-500/10">
              <p className="text-green-400 text-center">
                Un email de réinitialisation a été envoyé à <strong>{email}</strong>. 
                Vérifiez votre boîte de réception et suivez les instructions pour réinitialiser votre mot de passe.
              </p>
            </div>

            <div className="text-center">
              <Link 
                to="/login" 
                className="inline-block p-3 bg-black border-2 border-white text-white font-bold hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[8px_8px_0_0_#A488EF] transition-all"
              >
                RETOUR À LA CONNEXION
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
          <h1 className="text-3xl font-bold mb-8 text-center">MOT DE PASSE OUBLIÉ</h1>
          
          <p className="text-sm mb-6 text-center text-gray-300">
            Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
          </p>

          {getGeneralError() && (
            <div className="mb-6 p-4 border-2 border-red-500 bg-red-500/10">
              <p className="text-red-400">{getGeneralError()}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-bold mb-2">
                EMAIL
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-3 bg-black border-2 border-white text-white focus-visible:outline-none focus-visible:shadow-[8px_8px_0_0_#A488EF] transition-shadow"
                placeholder="votre@email.com"
              />
              {getFieldError('email') && (
                <p className="text-red-400 text-sm mt-1">{getFieldError('email')}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full p-3 bg-black border-2 border-white text-white font-bold hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[8px_8px_0_0_#A488EF] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-none"
            >
              {isLoading ? 'ENVOI EN COURS...' : 'ENVOYER LE LIEN'}
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