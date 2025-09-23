/**
 * Profile Page with Account, Addresses, and Orders sections
 * Uses brutalist styling with proper accessibility and error handling
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import type { Address, Order, CustomerUpdateInput, AddressInput } from '../types/customer';

export default function ProfilePage(): React.ReactElement {
  const { customer, signOut, updateMe, addresses, fetchOrders } = useAuth();
  const [activeTab, setActiveTab] = useState<'account' | 'addresses' | 'orders'>('account');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  // Account form state
  const [accountForm, setAccountForm] = useState<CustomerUpdateInput>({
    firstName: customer?.firstName || '',
    lastName: customer?.lastName || '',
    email: customer?.email || '',
    phone: customer?.phone || '',
    acceptsMarketing: customer?.acceptsMarketing || false,
  });

  // Address form state
  const [addressForm, setAddressForm] = useState<AddressInput>({
    firstName: '',
    lastName: '',
    company: '',
    address1: '',
    address2: '',
    city: '',
    province: '',
    country: 'FR',
    zip: '',
    phone: '',
  });
  const [editingAddress, setEditingAddress] = useState<string | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [customerAddresses, setCustomerAddresses] = useState<Address[]>([]);

  // Orders state
  const [orders, setOrders] = useState<Order[]>([]);

  // Update form when customer data changes
  useEffect(() => {
    if (customer) {
      setAccountForm({
        firstName: customer.firstName || '',
        lastName: customer.lastName || '',
        email: customer.email || '',
        phone: customer.phone || '',
        acceptsMarketing: customer.acceptsMarketing || false,
      });
    }
  }, [customer]);

  // Load addresses and orders
  useEffect(() => {
    if (activeTab === 'addresses') {
      loadAddresses();
    } else if (activeTab === 'orders') {
      loadOrders();
    }
  }, [activeTab]);

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  const loadAddresses = async () => {
    try {
      setLoading(true);
      // This would need to be implemented as a separate getAddresses method
      // For now, we'll use the customer's addresses from context
      if (customer?.addresses?.nodes) {
        setCustomerAddresses(customer.addresses.nodes);
      }
    } catch (err) {
      setError('Erreur lors du chargement des adresses');
    } finally {
      setLoading(false);
    }
  };

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await fetchOrders(10);
      setOrders(response.nodes);
    } catch (err) {
      setError('Erreur lors du chargement des commandes');
    } finally {
      setLoading(false);
    }
  };

  const handleAccountUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    setLoading(true);

    try {
      const response = await updateMe(accountForm);
      if (response.customerUserErrors.length > 0) {
        setError(response.customerUserErrors[0].message);
      } else {
        setSuccess('Profil mis à jour avec succès');
      }
    } catch (err) {
      setError('Erreur lors de la mise à jour du profil');
    } finally {
      setLoading(false);
    }
  };

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    setLoading(true);

    try {
      let response;
      if (editingAddress) {
        response = await addresses.update(editingAddress, addressForm);
      } else {
        response = await addresses.create(addressForm);
      }

      if (response.customerUserErrors.length > 0) {
        setError(response.customerUserErrors[0].message);
      } else {
        setSuccess(editingAddress ? 'Adresse mise à jour' : 'Adresse ajoutée');
        setShowAddressForm(false);
        setEditingAddress(null);
        resetAddressForm();
        loadAddresses();
      }
    } catch (err) {
      setError('Erreur lors de la sauvegarde de l\'adresse');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette adresse ?')) return;

    clearMessages();
    setLoading(true);

    try {
      const response = await addresses.remove(addressId);
      if (response.customerUserErrors.length > 0) {
        setError(response.customerUserErrors[0].message);
      } else {
        setSuccess('Adresse supprimée');
        loadAddresses();
      }
    } catch (err) {
      setError('Erreur lors de la suppression de l\'adresse');
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefaultAddress = async (addressId: string) => {
    clearMessages();
    setLoading(true);

    try {
      await addresses.setDefault(addressId);
      setSuccess('Adresse par défaut mise à jour');
      loadAddresses();
    } catch (err) {
      setError('Erreur lors de la mise à jour de l\'adresse par défaut');
    } finally {
      setLoading(false);
    }
  };

  const resetAddressForm = () => {
    setAddressForm({
      firstName: '',
      lastName: '',
      company: '',
      address1: '',
      address2: '',
      city: '',
      province: '',
      country: 'FR',
      zip: '',
      phone: '',
    });
  };

  const startEditAddress = (address: Address) => {
    setAddressForm({
      firstName: address.firstName || '',
      lastName: address.lastName || '',
      company: address.company || '',
      address1: address.address1,
      address2: address.address2 || '',
      city: address.city,
      province: address.province || '',
      country: address.country,
      zip: address.zip,
      phone: address.phone || '',
    });
    setEditingAddress(address.id);
    setShowAddressForm(true);
  };

  const formatPrice = (amount: string, currencyCode: string) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currencyCode,
    }).format(parseFloat(amount));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Mon Profil</h1>
            <p className="text-white/70">Gérez vos informations personnelles</p>
          </div>
          <button
            onClick={signOut}
            className="bg-red-500 text-white font-bold py-2 px-4 border-2 border-red-500 
                     hover:bg-red-600 hover:border-red-600 
                     focus-visible:outline-none focus-visible:shadow-[2px_2px_0px_0px_rgb(124,58,237)]
                     active:shadow-[2px_2px_0px_0px_rgb(124,58,237)]
                     transition-all duration-150"
            aria-label="Se déconnecter"
          >
            Se déconnecter
          </button>
        </div>

        {/* Messages */}
        {error && (
          <div className="bg-red-500 text-white p-4 border-2 border-red-500 mb-6" role="alert">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-500 text-white p-4 border-2 border-green-500 mb-6" role="alert">
            {success}
          </div>
        )}

        {/* Tabs */}
        <div className="flex space-x-0 mb-8">
          {[
            { key: 'account', label: 'Compte' },
            { key: 'addresses', label: 'Adresses' },
            { key: 'orders', label: 'Commandes' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`font-bold py-3 px-6 border-2 transition-all duration-150 
                         focus-visible:outline-none focus-visible:shadow-[2px_2px_0px_0px_rgb(124,58,237)]
                         active:shadow-[2px_2px_0px_0px_rgb(124,58,237)]
                         ${activeTab === tab.key
                           ? 'bg-violet-500 text-white border-violet-500'
                           : 'bg-white text-black border-white hover:bg-black hover:text-white hover:border-black'
                         }`}
              aria-pressed={activeTab === tab.key}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Account Tab */}
        {activeTab === 'account' && (
          <div className="bg-white text-black p-6 border-2 border-white">
            <h2 className="text-2xl font-bold mb-6">Informations du compte</h2>
            <form onSubmit={handleAccountUpdate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block font-bold mb-2">
                    Prénom
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    value={accountForm.firstName}
                    onChange={(e) => setAccountForm({ ...accountForm, firstName: e.target.value })}
                    className="w-full p-3 border-2 border-black focus-visible:outline-none focus-visible:shadow-[2px_2px_0px_0px_rgb(124,58,237)] focus-visible:border-violet-500"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block font-bold mb-2">
                    Nom
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    value={accountForm.lastName}
                    onChange={(e) => setAccountForm({ ...accountForm, lastName: e.target.value })}
                    className="w-full p-3 border-2 border-black focus-visible:outline-none focus-visible:shadow-[2px_2px_0px_0px_rgb(124,58,237)]"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="email" className="block font-bold mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={accountForm.email}
                  onChange={(e) => setAccountForm({ ...accountForm, email: e.target.value })}
                  className="w-full p-3 border-2 border-black focus-visible:outline-none focus-visible:shadow-[2px_2px_0px_0px_rgb(124,58,237)]"
                  required
                />
              </div>
              <div>
                <label htmlFor="phone" className="block font-bold mb-2">
                  Téléphone
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={accountForm.phone}
                  onChange={(e) => setAccountForm({ ...accountForm, phone: e.target.value })}
                  className="w-full p-3 border-2 border-black focus-visible:outline-none focus-visible:shadow-[2px_2px_0px_0px_rgb(124,58,237)]"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="acceptsMarketing"
                  checked={accountForm.acceptsMarketing}
                  onChange={(e) => setAccountForm({ ...accountForm, acceptsMarketing: e.target.checked })}
                  className="mr-3 w-4 h-4"
                />
                <label htmlFor="acceptsMarketing" className="font-bold">
                  Recevoir les emails marketing
                </label>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-violet-500 text-white font-bold py-3 px-6 border-2 border-violet-500 
                         hover:bg-violet-600 hover:border-violet-600 
                         focus-visible:outline-none focus-visible:shadow-[2px_2px_0px_0px_rgb(124,58,237)]
                         active:shadow-[2px_2px_0px_0px_rgb(124,58,237)]
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-all duration-150"
              >
                {loading ? 'Mise à jour...' : 'Mettre à jour'}
              </button>
            </form>
          </div>
        )}

        {/* Addresses Tab */}
        {activeTab === 'addresses' && (
          <div className="bg-white text-black p-6 border-2 border-white">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Mes adresses</h2>
              <button
                onClick={() => {
                  resetAddressForm();
                  setEditingAddress(null);
                  setShowAddressForm(true);
                }}
                className="bg-violet-500 text-white font-bold py-2 px-4 border-2 border-violet-500 
                         hover:bg-violet-600 hover:border-violet-600 
                         focus-visible:outline-none focus-visible:shadow-[2px_2px_0px_0px_rgb(124,58,237)]
                         active:shadow-[2px_2px_0px_0px_rgb(124,58,237)]
                         transition-all duration-150"
              >
                Ajouter une adresse
              </button>
            </div>

            {/* Address Form */}
            {showAddressForm && (
              <div className="mb-6 p-4 border-2 border-black">
                <h3 className="text-xl font-bold mb-4">
                  {editingAddress ? 'Modifier l\'adresse' : 'Nouvelle adresse'}
                </h3>
                <form onSubmit={handleAddressSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="addr-firstName" className="block font-bold mb-2">
                        Prénom
                      </label>
                      <input
                        type="text"
                        id="addr-firstName"
                        value={addressForm.firstName}
                        onChange={(e) => setAddressForm({ ...addressForm, firstName: e.target.value })}
                        className="w-full p-3 border-2 border-black focus-visible:outline-none focus-visible:shadow-[2px_2px_0px_0px_rgb(124,58,237)]"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="addr-lastName" className="block font-bold mb-2">
                        Nom
                      </label>
                      <input
                        type="text"
                        id="addr-lastName"
                        value={addressForm.lastName}
                        onChange={(e) => setAddressForm({ ...addressForm, lastName: e.target.value })}
                        className="w-full p-3 border-2 border-black focus-visible:outline-none focus-visible:shadow-[2px_2px_0px_0px_rgb(124,58,237)]"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="addr-address1" className="block font-bold mb-2">
                      Adresse *
                    </label>
                    <input
                      type="text"
                      id="addr-address1"
                      value={addressForm.address1}
                      onChange={(e) => setAddressForm({ ...addressForm, address1: e.target.value })}
                      className="w-full p-3 border-2 border-black focus-visible:outline-none focus-visible:shadow-[2px_2px_0px_0px_rgb(124,58,237)]"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="addr-city" className="block font-bold mb-2">
                        Ville *
                      </label>
                      <input
                        type="text"
                        id="addr-city"
                        value={addressForm.city}
                        onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                        className="w-full p-3 border-2 border-black focus-visible:outline-none focus-visible:shadow-[2px_2px_0px_0px_rgb(124,58,237)]"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="addr-zip" className="block font-bold mb-2">
                        Code postal *
                      </label>
                      <input
                        type="text"
                        id="addr-zip"
                        value={addressForm.zip}
                        onChange={(e) => setAddressForm({ ...addressForm, zip: e.target.value })}
                        className="w-full p-3 border-2 border-black focus-visible:outline-none focus-visible:shadow-[2px_2px_0px_0px_rgb(124,58,237)]"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="addr-country" className="block font-bold mb-2">
                        Pays *
                      </label>
                      <select
                        id="addr-country"
                        value={addressForm.country}
                        onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                        className="w-full p-3 border-2 border-black focus-visible:outline-none focus-visible:shadow-[2px_2px_0px_0px_rgb(124,58,237)]"
                        required
                      >
                        <option value="FR">France</option>
                        <option value="BE">Belgique</option>
                        <option value="CH">Suisse</option>
                        <option value="CA">Canada</option>
                        <option value="US">États-Unis</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex space-x-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-violet-500 text-white font-bold py-2 px-4 border-2 border-violet-500 
                               hover:bg-violet-600 hover:border-violet-600 
                               focus-visible:outline-none focus-visible:shadow-[2px_2px_0px_0px_rgb(124,58,237)]
                               active:shadow-[2px_2px_0px_0px_rgb(124,58,237)]
                               disabled:opacity-50 disabled:cursor-not-allowed
                               transition-all duration-150"
                    >
                      {loading ? 'Sauvegarde...' : 'Sauvegarder'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddressForm(false)}
                      className="bg-white text-black font-bold py-2 px-4 border-2 border-black 
                               hover:bg-black hover:text-white 
                               focus-visible:outline-none focus-visible:shadow-[2px_2px_0px_0px_rgb(124,58,237)]
                               active:shadow-[2px_2px_0px_0px_rgb(124,58,237)]
                               transition-all duration-150"
                    >
                      Annuler
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Address List */}
            <div className="space-y-4">
              {customerAddresses.map((address) => (
                <div key={address.id} className="p-4 border-2 border-black">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold">
                        {address.firstName} {address.lastName}
                      </p>
                      <div className="text-sm space-y-1">
                        {address.formatted.map((line, index) => (
                          <p key={index}>{line}</p>
                        ))}
                      </div>
                      {customer?.defaultAddress?.id === address.id && (
                        <span className="inline-block bg-green-500 text-white px-2 py-1 text-xs font-bold mt-2">
                          ADRESSE PAR DÉFAUT
                        </span>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => startEditAddress(address)}
                        className="bg-violet-500 text-white font-bold py-1 px-3 border-2 border-violet-500 text-sm
                                 hover:bg-violet-600 hover:border-violet-600 
                                 focus-visible:outline-none focus-visible:shadow-[2px_2px_0px_0px_rgb(124,58,237)]
                                 active:shadow-[2px_2px_0px_0px_rgb(124,58,237)]
                                 transition-all duration-150"
                      >
                        Modifier
                      </button>
                      {customer?.defaultAddress?.id !== address.id && (
                        <button
                          onClick={() => handleSetDefaultAddress(address.id)}
                          className="bg-green-500 text-white font-bold py-1 px-3 border-2 border-green-500 text-sm
                                   hover:bg-green-600 hover:border-green-600 
                                   focus-visible:outline-none focus-visible:shadow-[2px_2px_0px_0px_rgb(124,58,237)]
                                   active:shadow-[2px_2px_0px_0px_rgb(124,58,237)]
                                   transition-all duration-150"
                        >
                          Par défaut
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteAddress(address.id)}
                        className="bg-red-500 text-white font-bold py-1 px-3 border-2 border-red-500 text-sm
                                 hover:bg-red-600 hover:border-red-600 
                                 focus-visible:outline-none focus-visible:shadow-[2px_2px_0px_0px_rgb(124,58,237)]
                                 active:shadow-[2px_2px_0px_0px_rgb(124,58,237)]
                                 transition-all duration-150"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="bg-white text-black p-6 border-2 border-white">
            <h2 className="text-2xl font-bold mb-6">Mes commandes</h2>
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="p-4 border-2 border-black">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-lg">Commande {order.name}</h3>
                      <p className="text-sm text-black/70">
                        Passée le {formatDate(order.processedAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">
                        {formatPrice(order.currentTotalPrice.amount, order.currentTotalPrice.currencyCode)}
                      </p>
                      <div className="flex space-x-2 text-xs">
                        <span className={`px-2 py-1 font-bold ${
                          order.fulfillmentStatus === 'FULFILLED' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-black'
                        }`}>
                          {order.fulfillmentStatus}
                        </span>
                        <span className={`px-2 py-1 font-bold ${
                          order.financialStatus === 'PAID' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                        }`}>
                          {order.financialStatus}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {order.lineItems.nodes.map((item) => (
                      <div key={item.id} className="flex justify-between items-center py-2 border-t border-black/20">
                        <div className="flex items-center space-x-3">
                          {item.image && (
                            <img
                              src={item.image.url}
                              alt={item.image.altText || item.title}
                              className="w-12 h-12 object-cover border border-black"
                            />
                          )}
                          <div>
                            <p className="font-bold">{item.title}</p>
                            <p className="text-sm text-black/70">Quantité: {item.quantity}</p>
                          </div>
                        </div>
                        <p className="font-bold">
                          {formatPrice(item.discountedTotalPrice.amount, item.discountedTotalPrice.currencyCode)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {orders.length === 0 && !loading && (
                <div className="text-center py-8">
                  <p className="text-black/70">Aucune commande trouvée</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}