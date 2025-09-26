import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { 
  register as apiRegister, 
  login as apiLogin, 
  logout as apiLogout, 
  getMe as apiGetMe
} from '../auth/customer';
import { cartBuyerIdentityUpdate } from '../api/shopify';
import type {
  Customer,
  CustomerRegisterInput,
  CustomerUserError
} from '../auth/customer';

interface AuthContextType {
  token: string | null;
  me: Customer | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; errors: CustomerUserError[] }>;
  register: (payload: CustomerRegisterInput) => Promise<{ success: boolean; errors: CustomerUserError[] }>;
  logout: () => Promise<void>;
  refreshMe: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'customerAccessToken';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(null);
  const [me, setMe] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      if (storedToken) {
        setToken(storedToken);
        await fetchMe(storedToken);
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  // Fetch current user data
  const fetchMe = async (accessToken: string) => {
    console.log('👤 Fetching user data with token...');
    try {
      const result = await apiGetMe(accessToken);
      console.log('👤 API getMe result:', result);
      if (result.customer) {
        console.log('👤 Setting user data:', result.customer);
        setMe(result.customer);
      } else {
        console.log('👤 No customer data, clearing token');
        // Token is invalid, clear it
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
        setMe(null);
      }
    } catch (error) {
      console.error('👤 Failed to fetch user:', error);
      // Clear invalid token
      localStorage.removeItem(TOKEN_KEY);
      setToken(null);
      setMe(null);
    }
  };

  // Login function
  const login = async (email: string, password: string): Promise<{ success: boolean; errors: CustomerUserError[] }> => {
    console.log('🔐 Login attempt started for:', email);
    try {
      const result = await apiLogin(email, password);
      console.log('🔐 API login result:', result);
      
      if (result.customerAccessToken) {
        const accessToken = result.customerAccessToken.accessToken;
        console.log('🔐 Access token received, storing...');
        localStorage.setItem(TOKEN_KEY, accessToken);
        setToken(accessToken);
        
        console.log('🔐 Fetching user data...');
        await fetchMe(accessToken);
        console.log('🔐 User data fetched successfully');
        
        // Update cart buyer identity if cart exists
        const cartId = localStorage.getItem('shopify_cart_id');
        if (cartId) {
          console.log('🛒 Updating cart buyer identity...');
          try {
            await cartBuyerIdentityUpdate(cartId, {
              customerAccessToken: accessToken,
              email: email
            });
            console.log('🛒 Cart buyer identity updated successfully');
          } catch (error) {
            console.warn('🛒 Failed to update cart buyer identity after login:', error);
          }
        }
        
        console.log('🔐 Login completed successfully');
        return { success: true, errors: [] };
      } else {
        console.log('🔐 Login failed - no access token:', result.customerUserErrors);
        
        // Transform "Unidentified customer" error to a more user-friendly message
        const transformedErrors = result.customerUserErrors.map(error => {
          if (error.message === 'Unidentified customer') {
            return {
              field: Array.isArray(error.field) ? error.field : [],
              message: 'Email ou mot de passe incorrect. Veuillez vérifier vos informations.'
            };
          }
          return {
            ...error,
            field: Array.isArray(error.field) ? error.field : []
          };
        });
        
        return { success: false, errors: transformedErrors };
      }
    } catch (error) {
      console.error('🔐 Login failed with exception:', error);
      return { 
        success: false, 
        errors: [{ field: [], message: 'Erreur de connexion. Veuillez réessayer.' }] 
      };
    }
  };

  // Register function
  const register = async (payload: CustomerRegisterInput): Promise<{ success: boolean; errors: CustomerUserError[] }> => {
    try {
      const result = await apiRegister(payload);
      
      if (result.customer && result.customerUserErrors.length === 0) {
        // Auto-login after successful registration
        const loginResult = await login(payload.email, payload.password);
        return loginResult;
      } else {
        // Normalize errors to ensure field is always an array
        const normalizedErrors = result.customerUserErrors.map(error => ({
          ...error,
          field: Array.isArray(error.field) ? error.field : []
        }));
        return { success: false, errors: normalizedErrors };
      }
    } catch (error) {
      console.error('Registration failed:', error);
      return { 
        success: false, 
        errors: [{ field: [], message: 'Registration failed. Please try again.' }] 
      };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      if (token) {
        await apiLogout(token);
      }
      
      // Clear cart buyer identity on logout
      const cartId = localStorage.getItem('shopify_cart_id');
      if (cartId) {
        try {
          await cartBuyerIdentityUpdate(cartId, {
            customerAccessToken: null
          });
        } catch (error) {
          console.warn('Failed to clear cart buyer identity on logout:', error);
        }
      }
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      // Always clear local state regardless of API call success
      localStorage.removeItem(TOKEN_KEY);
      setToken(null);
      setMe(null);
    }
  };

  // Refresh user data
  const refreshMe = async () => {
    if (token) {
      await fetchMe(token);
    }
  };

  const value: AuthContextType = {
    token,
    me,
    loading,
    login,
    register,
    logout,
    refreshMe,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}