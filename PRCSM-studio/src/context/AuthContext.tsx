import React, { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { customerCreate, customerAccessTokenCreate, customerAccessTokenDelete, getCustomer } from '../api/shopify';

interface Customer {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthContextType {
  customer: Customer | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, firstName?: string, lastName?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshCustomer: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshCustomer = async () => {
    if (!token) {
      setCustomer(null);
      setIsLoading(false);
      return;
    }

    try {
      const customerData = await getCustomer(token);
      setCustomer(customerData);
    } catch (error) {
      console.error('Failed to refresh customer:', error);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('shopify_access_token');
    if (storedToken) {
      setToken(storedToken);
      refreshCustomer();
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      const result = await customerAccessTokenCreate(email, password);
      
      if (result.customerUserErrors && result.customerUserErrors.length > 0) {
        return { success: false, error: result.customerUserErrors[0].message };
      }

      if (result.customerAccessToken) {
        const accessToken = result.customerAccessToken.accessToken;
        setToken(accessToken);
        localStorage.setItem('shopify_access_token', accessToken);
        
        const customerData = await getCustomer(accessToken);
        setCustomer(customerData);
        
        return { success: true };
      }

      return { success: false, error: 'Login failed' };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Login failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (
    email: string, 
    password: string, 
    firstName?: string, 
    lastName?: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      const result = await customerCreate(email, password, firstName, lastName);
      
      if (result.customerUserErrors && result.customerUserErrors.length > 0) {
        return { success: false, error: result.customerUserErrors[0].message };
      }

      if (result.customer) {
        return await login(email, password);
      }

      return { success: false, error: 'Signup failed' };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Signup failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await customerAccessTokenDelete(token);
      }
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      setToken(null);
      setCustomer(null);
      localStorage.removeItem('shopify_access_token');
    }
  };

  const value: AuthContextType = {
    customer,
    token,
    isLoading,
    login,
    signup,
    logout,
    refreshCustomer,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};