import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { CustomerUserError } from '../auth/customer';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<CustomerUserError[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, token } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (token) {
      navigate('/profile');
    }
  }, [token, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors([]);

    const result = await login(email, password);
    
    if (result.success) {
      navigate('/profile');
    } else {
      setErrors(result.errors);
    }
    
    setIsLoading(false);
  };

  const getFieldError = (field: string) => {
    return errors.find(error => 
      error.field.includes(field) || 
      error.field.includes('email') || 
      error.field.includes('password')
    )?.message;
  };

  const getGeneralError = () => {
    return errors.find(error => 
      error.field.includes('general') || 
      error.field.length === 0
    )?.message;
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="border-2 border-white p-8">
          <h1 className="text-3xl font-bold mb-8 text-center">SE CONNECTER</h1>
          
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

            <div>
              <label htmlFor="password" className="block text-sm font-bold mb-2">
                MOT DE PASSE
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-3 bg-black border-2 border-white text-white focus-visible:outline-none focus-visible:shadow-[8px_8px_0_0_#A488EF] transition-shadow"
                placeholder="••••••••"
              />
              {getFieldError('password') && (
                <p className="text-red-400 text-sm mt-1">{getFieldError('password')}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full p-3 bg-black border-2 border-white text-white font-bold hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[8px_8px_0_0_#A488EF] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-none"
            >
              {isLoading ? 'CONNEXION...' : 'SE CONNECTER'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm">
              Pas encore de compte ?{' '}
              <Link 
                to="/register" 
                className="underline hover:text-[#A488EF] transition-colors"
              >
                S'inscrire
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}