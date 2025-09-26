import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { CustomerUserError } from '../auth/customer';

export default function RegisterPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<CustomerUserError[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const { register, token } = useAuth();
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

    // Client-side validation
    if (password !== confirmPassword) {
      setErrors([{ field: ['password'], message: 'Les mots de passe ne correspondent pas' }]);
      setIsLoading(false);
      return;
    }

    if (password.length < 5) {
      setErrors([{ field: ['password'], message: 'Le mot de passe doit contenir au moins 5 caractères' }]);
      setIsLoading(false);
      return;
    }

    const result = await register({
      firstName: firstName.trim() || undefined,
      lastName: lastName.trim() || undefined,
      email: email.trim(),
      password
    });
    
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
      (field === 'firstName' && error.field.includes('first_name')) ||
      (field === 'lastName' && error.field.includes('last_name'))
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
          <h1 className="text-3xl font-bold mb-8 text-center">S'INSCRIRE</h1>
          
          {getGeneralError() && (
            <div className="mb-6 p-4 border-2 border-red-500 bg-red-500/10">
              <p className="text-red-400">{getGeneralError()}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-bold mb-2">
                  PRÉNOM
                </label>
                <input
                  type="text"
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full p-3 bg-black border-2 border-white text-white focus-visible:outline-none focus-visible:shadow-[8px_8px_0_0_#A488EF] transition-shadow"
                  placeholder="Jean"
                />
                {getFieldError('firstName') && (
                  <p className="text-red-400 text-sm mt-1">{getFieldError('firstName')}</p>
                )}
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-bold mb-2">
                  NOM
                </label>
                <input
                  type="text"
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full p-3 bg-black border-2 border-white text-white focus-visible:outline-none focus-visible:shadow-[8px_8px_0_0_#A488EF] transition-shadow"
                  placeholder="Dupont"
                />
                {getFieldError('lastName') && (
                  <p className="text-red-400 text-sm mt-1">{getFieldError('lastName')}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-bold mb-2">
                EMAIL *
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
                MOT DE PASSE *
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

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-bold mb-2">
                CONFIRMER LE MOT DE PASSE *
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full p-3 bg-black border-2 border-white text-white focus-visible:outline-none focus-visible:shadow-[8px_8px_0_0_#A488EF] transition-shadow"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full p-3 bg-black border-2 border-white text-white font-bold hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[8px_8px_0_0_#A488EF] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-none"
            >
              {isLoading ? 'INSCRIPTION...' : 'S\'INSCRIRE'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm">
              Déjà un compte ?{' '}
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