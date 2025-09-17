import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getCustomer } from '../api/shopify';
import { LogoutButton } from '../components/auth/LogoutButton';

interface Customer {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
  defaultAddress?: {
    id: string;
    firstName?: string;
    lastName?: string;
    company?: string;
    address1?: string;
    address2?: string;
    city?: string;
    province?: string;
    country?: string;
    zip?: string;
    phone?: string;
  };
}

export const Account: React.FC = () => {
  const { token } = useAuth();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomerData = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const customerData = await getCustomer(token);
        setCustomer(customerData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load customer data');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your account...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
              {error}
            </div>
            <LogoutButton />
          </div>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
          <div className="text-center">
            <p className="text-gray-600 mb-4">No customer data found</p>
            <LogoutButton />
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">My Account</h1>
            <LogoutButton />
          </div>

          {/* Customer Information */}
          <div className="px-6 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h2>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1 text-sm text-gray-900">{customer.email}</p>
                  </div>
                  
                  {(customer.firstName || customer.lastName) && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Name</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {[customer.firstName, customer.lastName].filter(Boolean).join(' ')}
                      </p>
                    </div>
                  )}
                  
                  {customer.phone && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone</label>
                      <p className="mt-1 text-sm text-gray-900">{customer.phone}</p>
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Member Since</label>
                    <p className="mt-1 text-sm text-gray-900">{formatDate(customer.createdAt)}</p>
                  </div>
                </div>
              </div>

              {/* Default Address */}
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Default Address</h2>
                {customer.defaultAddress ? (
                  <div className="space-y-3">
                    {(customer.defaultAddress.firstName || customer.defaultAddress.lastName) && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <p className="mt-1 text-sm text-gray-900">
                          {[customer.defaultAddress.firstName, customer.defaultAddress.lastName]
                            .filter(Boolean).join(' ')}
                        </p>
                      </div>
                    )}
                    
                    {customer.defaultAddress.company && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Company</label>
                        <p className="mt-1 text-sm text-gray-900">{customer.defaultAddress.company}</p>
                      </div>
                    )}
                    
                    {customer.defaultAddress.address1 && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Address</label>
                        <p className="mt-1 text-sm text-gray-900">
                          {customer.defaultAddress.address1}
                          {customer.defaultAddress.address2 && (
                            <><br />{customer.defaultAddress.address2}</>
                          )}
                        </p>
                      </div>
                    )}
                    
                    {(customer.defaultAddress.city || customer.defaultAddress.province || customer.defaultAddress.zip) && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">City, State ZIP</label>
                        <p className="mt-1 text-sm text-gray-900">
                          {[
                            customer.defaultAddress.city,
                            customer.defaultAddress.province,
                            customer.defaultAddress.zip
                          ].filter(Boolean).join(', ')}
                        </p>
                      </div>
                    )}
                    
                    {customer.defaultAddress.country && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Country</label>
                        <p className="mt-1 text-sm text-gray-900">{customer.defaultAddress.country}</p>
                      </div>
                    )}
                    
                    {customer.defaultAddress.phone && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                        <p className="mt-1 text-sm text-gray-900">{customer.defaultAddress.phone}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No default address set</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};