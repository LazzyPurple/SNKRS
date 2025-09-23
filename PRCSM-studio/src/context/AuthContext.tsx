/**
 * Authentication Context for Shopify Customer Account API
 * Manages authentication state and provides customer account operations
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { startLogin, handleCallback, logout, getStoredTokens, isTokenValid, refreshToken } from '../lib/oidc';
import {
  getCustomer,
  updateCustomer,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  getOrders,
} from '../lib/customerGraphql';
import type {
  Customer,
  Order,
  CustomerUpdateInput,
  AddressInput,
  CustomerUpdateResponse,
  AddressCreateResponse,
  AddressUpdateResponse,
  AddressDeleteResponse,
} from '../types/customer';

interface AuthState {
  accessToken: string | null;
  customer: Customer | null;
  loading: boolean;
}

interface AddressOperations {
  create: (address: AddressInput) => Promise<AddressCreateResponse>;
  update: (id: string, address: AddressInput) => Promise<AddressUpdateResponse>;
  remove: (id: string) => Promise<AddressDeleteResponse>;
  setDefault: (addressId: string) => Promise<void>;
}

interface AuthContextType extends AuthState {
  // Authentication methods
  signIn: () => Promise<void>;
  handleOAuthCallback: (searchParams: URLSearchParams) => Promise<boolean>;
  signOut: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
  
  // Customer methods
  getMe: () => Promise<Customer | null>;
  updateMe: (input: CustomerUpdateInput) => Promise<CustomerUpdateResponse>;
  
  // Address operations
  addresses: AddressOperations;
  
  // Order methods
  fetchOrders: (first?: number, after?: string) => Promise<{ nodes: Order[]; pageInfo: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps): React.ReactElement {
  const [state, setState] = useState<AuthState>({
    accessToken: null,
    customer: null,
    loading: true,
  });

  // Initialize authentication state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const tokens = getStoredTokens();
      if (tokens && isTokenValid()) {
        setState(prev => ({ ...prev, accessToken: tokens.access_token }));
        try {
          const customer = await getCustomer();
          setState(prev => ({ ...prev, customer, loading: false }));
        } catch (error) {
          console.error('Failed to fetch customer:', error);
          setState(prev => ({ ...prev, loading: false }));
        }
      } else {
        setState(prev => ({ ...prev, loading: false }));
      }
    };

    initializeAuth();
  }, []);

  // Sign in method
  const signIn = useCallback(async (): Promise<void> => {
    await startLogin();
  }, []);

  // Handle OAuth callback
  const handleOAuthCallback = useCallback(async (searchParams: URLSearchParams): Promise<boolean> => {
    setState(prev => ({ ...prev, loading: true }));
    
    try {
      const success = await handleCallback(searchParams);
      if (success) {
        const tokens = getStoredTokens();
        if (tokens) {
          setState(prev => ({ ...prev, accessToken: tokens.access_token }));
          const customer = await getCustomer();
          setState(prev => ({ ...prev, customer, loading: false }));
          return true;
        }
      }
      setState(prev => ({ ...prev, loading: false }));
      return false;
    } catch (error) {
      console.error('OAuth callback error:', error);
      setState(prev => ({ ...prev, loading: false }));
      return false;
    }
  }, []);

  // Sign out method
  const signOut = useCallback(async (): Promise<void> => {
    setState(prev => ({ ...prev, loading: true }));
    await logout();
    setState({
      accessToken: null,
      customer: null,
      loading: false,
    });
  }, []);

  // Refresh token method
  const refreshTokenMethod = useCallback(async (): Promise<boolean> => {
    try {
      const success = await refreshToken();
      if (success) {
        const tokens = getStoredTokens();
        if (tokens) {
          setState(prev => ({ ...prev, accessToken: tokens.access_token }));
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Token refresh error:', error);
      return false;
    }
  }, []);

  // Get current customer
  const getMe = useCallback(async (): Promise<Customer | null> => {
    if (!state.accessToken) return null;
    
    try {
      const customer = await getCustomer();
      setState(prev => ({ ...prev, customer }));
      return customer;
    } catch (error) {
      console.error('Failed to fetch customer:', error);
      return null;
    }
  }, [state.accessToken]);

  // Update customer
  const updateMe = useCallback(async (input: CustomerUpdateInput): Promise<CustomerUpdateResponse> => {
    if (!state.accessToken) {
      throw new Error('Not authenticated');
    }

    try {
      const response = await updateCustomer(input);
      if (response.customer) {
        setState(prev => ({ ...prev, customer: response.customer! }));
      }
      return response;
    } catch (error) {
      console.error('Failed to update customer:', error);
      throw error;
    }
  }, [state.accessToken]);

  // Address operations
  const addresses: AddressOperations = {
    create: useCallback(async (address: AddressInput): Promise<AddressCreateResponse> => {
      if (!state.accessToken) {
        throw new Error('Not authenticated');
      }
      return createAddress(address);
    }, [state.accessToken]),

    update: useCallback(async (id: string, address: AddressInput): Promise<AddressUpdateResponse> => {
      if (!state.accessToken) {
        throw new Error('Not authenticated');
      }
      return updateAddress(id, address);
    }, [state.accessToken]),

    remove: useCallback(async (id: string): Promise<AddressDeleteResponse> => {
      if (!state.accessToken) {
        throw new Error('Not authenticated');
      }
      return deleteAddress(id);
    }, [state.accessToken]),

    setDefault: useCallback(async (addressId: string): Promise<void> => {
      if (!state.accessToken) {
        throw new Error('Not authenticated');
      }
      
      try {
        const response = await setDefaultAddress(addressId);
        if (response.customer) {
          setState(prev => ({ ...prev, customer: response.customer }));
        }
      } catch (error) {
        console.error('Failed to set default address:', error);
        throw error;
      }
    }, [state.accessToken]),
  };

  // Fetch orders
  const fetchOrders = useCallback(async (first = 10, after?: string): Promise<{ nodes: Order[]; pageInfo: any }> => {
    if (!state.accessToken) {
      throw new Error('Not authenticated');
    }
    return getOrders(first, after);
  }, [state.accessToken]);

  const contextValue: AuthContextType = {
    ...state,
    signIn,
    handleOAuthCallback,
    signOut,
    refreshToken: refreshTokenMethod,
    getMe,
    updateMe,
    addresses,
    fetchOrders,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}