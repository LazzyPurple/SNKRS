import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

interface SignupFormProps {
  onSuccess?: () => void;
}

export const SignupForm: React.FC<SignupFormProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { signup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await signup(email, password, firstName, lastName);
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during signup');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-3xl font-orbitron font-black mb-8 text-center text-white tracking-wider">Create Account</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-mono font-bold text-zinc-300 mb-2 uppercase tracking-wide">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Enter your first name"
              className="w-full px-4 py-3 bg-zinc-900 border-2 border-zinc-700 text-white font-mono placeholder-zinc-500 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all duration-200"
            />
          </div>
          
          <div>
            <label htmlFor="lastName" className="block text-sm font-mono font-bold text-zinc-300 mb-2 uppercase tracking-wide">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Enter your last name"
              className="w-full px-4 py-3 bg-zinc-900 border-2 border-zinc-700 text-white font-mono placeholder-zinc-500 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all duration-200"
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-mono font-bold text-zinc-300 mb-2 uppercase tracking-wide">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
            className="w-full px-4 py-3 bg-zinc-900 border-2 border-zinc-700 text-white font-mono placeholder-zinc-500 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all duration-200"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-mono font-bold text-zinc-300 mb-2 uppercase tracking-wide">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            placeholder="Enter your password (min. 6 characters)"
            className="w-full px-4 py-3 bg-zinc-900 border-2 border-zinc-700 text-white font-mono placeholder-zinc-500 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all duration-200"
          />
        </div>

        {error && (
          <div className="bg-red-900/50 border-2 border-red-500 text-red-300 px-4 py-3 font-mono">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-violet-600 border-2 border-violet-500 text-white py-3 px-6 font-mono font-bold uppercase tracking-wide hover:bg-violet-700 hover:border-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-brutal hover:shadow-brutal-hover hover:translate-x-[-2px] hover:translate-y-[-2px]"
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-zinc-400 font-mono">
        Already have an account?{' '}
        <a href="/login" className="text-violet-400 hover:text-violet-300 font-bold transition-colors uppercase tracking-wide">
          Sign in
        </a>
      </p>
    </div>
  );
};