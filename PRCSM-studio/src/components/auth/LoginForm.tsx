import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

interface LoginFormProps {
  onSuccess?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await login(email, password);
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl md:text-3xl font-orbitron font-black mb-8 text-center text-white tracking-tight">Sign In</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2 font-mono uppercase tracking-wider">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
            className="w-full bg-transparent border-2 border-white text-white placeholder:text-gray-400 px-4 py-3 font-mono text-sm focus:outline-none focus:border-violet-500 hover:border-violet-300 transition-colors duration-200"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-2 font-mono uppercase tracking-wider">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
            className="w-full bg-transparent border-2 border-white text-white placeholder:text-gray-400 px-4 py-3 font-mono text-sm focus:outline-none focus:border-violet-500 hover:border-violet-300 transition-colors duration-200"
          />
        </div>

        {error && (
          <div className="bg-red-900/50 border-2 border-red-500 text-red-300 px-4 py-3 font-mono text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-transparent border-2 border-violet-500 text-white py-3 px-4 font-medium hover:bg-violet-600 hover:border-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-prcsm-black disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-brutal hover:shadow-brutal-hover hover:translate-x-[-4px] hover:translate-y-[-4px] font-mono text-xs uppercase tracking-wider"
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-gray-400 font-mono">
        Don't have an account?{' '}
        <a href="/signup" className="text-violet-400 hover:text-violet-300 font-medium transition-colors uppercase tracking-wider">
          Create one
        </a>
      </p>
    </div>
  );
};