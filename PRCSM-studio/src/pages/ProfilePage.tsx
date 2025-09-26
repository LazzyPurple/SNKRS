import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { addAddress, type CustomerAddressInput } from '../auth/customer';

export default function ProfilePage() {
  const { me, logout, refreshMe, token } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CustomerAddressInput>({
    firstName: '',
    lastName: '',
    address1: '',
    address2: '',
    zip: '',
    city: '',
    country: 'France',
    phone: ''
  });
  const modalRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        closeModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleEscape);
      // Focus the first input when modal opens
      setTimeout(() => {
        firstInputRef.current?.focus();
      }, 100);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isModalOpen]);

  // Focus trap for modal
  useEffect(() => {
    if (!isModalOpen || !modalRef.current) return;

    const modal = modalRef.current;
    const focusableElements = modal.querySelectorAll(
      'button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    modal.addEventListener('keydown', handleTabKey);
    return () => modal.removeEventListener('keydown', handleTabKey);
  }, [isModalOpen]);

  const handleLogout = async () => {
    await logout();
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await addAddress(token, formData);
      await refreshMe();
      setIsModalOpen(false);
      setFormData({
        firstName: '',
        lastName: '',
        address1: '',
        address2: '',
        zip: '',
        city: '',
        country: 'France',
        phone: ''
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'ajout de l\'adresse');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setError(null);
    setFormData({
      firstName: '',
      lastName: '',
      address1: '',
      address2: '',
      zip: '',
      city: '',
      country: 'France',
      phone: ''
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatPrice = (amount: string, currencyCode: string) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currencyCode
    }).format(parseFloat(amount));
  };

  if (!me) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="border-2 border-white p-6 mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">PROFIL</h1>
              <p className="text-lg">
                {me.firstName && me.lastName 
                  ? `${me.firstName} ${me.lastName}` 
                  : 'Utilisateur'
                }
              </p>
              <p className="text-gray-300">{me.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-black border-2 border-white text-white font-bold hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[8px_8px_0_0_#A488EF] transition-all"
            >
              DÉCONNEXION
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Addresses */}
          <div className="border-2 border-white p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">ADRESSES</h2>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 bg-black border-2 border-white text-white font-bold hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[8px_8px_0_0_#A488EF] transition-all focus:outline-none focus:translate-x-[-1px] focus:translate-y-[-1px] focus:shadow-[8px_8px_0_0_#A488EF]"
              >
                Ajouter une adresse
              </button>
            </div>
            {me.addresses.nodes.length > 0 ? (
              <div className="space-y-4">
                {me.addresses.nodes.map((address) => (
                  <div key={address.id} className="border border-gray-600 p-4">
                    <div className="space-y-1">
                      {(address.firstName || address.lastName) && (
                        <p className="font-bold">
                          {[address.firstName, address.lastName].filter(Boolean).join(' ')}
                        </p>
                      )}
                      {address.company && (
                        <p className="text-gray-300">{address.company}</p>
                      )}
                      {address.address1 && <p>{address.address1}</p>}
                      {address.address2 && <p>{address.address2}</p>}
                      <p>
                        {[address.city, address.province, address.zip].filter(Boolean).join(', ')}
                      </p>
                      {address.country && <p>{address.country}</p>}
                      {address.phone && (
                        <p className="text-gray-300">Tél: {address.phone}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">Aucune adresse enregistrée</p>
            )}
          </div>

          {/* Orders */}
          <div className="border-2 border-white p-6">
            <h2 className="text-2xl font-bold mb-4">COMMANDES RÉCENTES</h2>
            {me.orders.nodes.length > 0 ? (
              <div className="space-y-4">
                {me.orders.nodes.map((order) => (
                  <div key={order.id} className="border border-gray-600 p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-bold">Commande #{order.orderNumber}</p>
                        <p className="text-sm text-gray-300">
                          {formatDate(order.processedAt)}
                        </p>
                      </div>
                      <p className="font-bold">
                        {formatPrice(order.totalPrice.amount, order.totalPrice.currencyCode)}
                      </p>
                    </div>
                    
                    <div className="flex gap-4 text-sm mb-3">
                      <span className={`px-2 py-1 border ${
                        order.fulfillmentStatus === 'FULFILLED' 
                          ? 'border-green-500 text-green-400' 
                          : 'border-yellow-500 text-yellow-400'
                      }`}>
                        {order.fulfillmentStatus === 'FULFILLED' ? 'Expédiée' : 'En cours'}
                      </span>
                      <span className={`px-2 py-1 border ${
                        order.financialStatus === 'PAID' 
                          ? 'border-green-500 text-green-400' 
                          : 'border-red-500 text-red-400'
                      }`}>
                        {order.financialStatus === 'PAID' ? 'Payée' : 'Non payée'}
                      </span>
                    </div>

                    <div className="space-y-1">
                      {order.lineItems.nodes.map((item, index) => (
                        <p key={index} className="text-sm text-gray-300">
                          {item.quantity}x {item.variant?.product.title || item.title}
                          {item.variant?.title && item.variant.title !== 'Default Title' && (
                            <span> - {item.variant.title}</span>
                          )}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">Aucune commande trouvée</p>
            )}
          </div>
        </div>
      </div>

      {/* Modal for adding address */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div ref={modalRef} className="bg-black border-2 border-white p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4 text-white">AJOUTER UNE ADRESSE</h3>
            
            {error && (
              <div className="mb-4 p-3 border-2 border-red-500 bg-red-900 text-red-100">
                {error}
              </div>
            )}

            <form onSubmit={handleAddAddress} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white text-sm font-bold mb-2">
                    Prénom
                  </label>
                  <input
                    ref={firstInputRef}
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-black border-2 border-white text-white focus:outline-none focus:shadow-[4px_4px_0_0_#A488EF] focus:translate-x-[-1px] focus:translate-y-[-1px]"
                  />
                </div>
                <div>
                  <label className="block text-white text-sm font-bold mb-2">
                    Nom
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-black border-2 border-white text-white focus:outline-none focus:shadow-[4px_4px_0_0_#A488EF] focus:translate-x-[-1px] focus:translate-y-[-1px]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white text-sm font-bold mb-2">
                  Adresse 1 *
                </label>
                <input
                  type="text"
                  name="address1"
                  value={formData.address1}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 bg-black border-2 border-white text-white focus:outline-none focus:shadow-[4px_4px_0_0_#A488EF] focus:translate-x-[-1px] focus:translate-y-[-1px]"
                />
              </div>

              <div>
                <label className="block text-white text-sm font-bold mb-2">
                  Adresse 2
                </label>
                <input
                  type="text"
                  name="address2"
                  value={formData.address2}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-black border-2 border-white text-white focus:outline-none focus:shadow-[4px_4px_0_0_#A488EF] focus:translate-x-[-1px] focus:translate-y-[-1px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white text-sm font-bold mb-2">
                    Code postal *
                  </label>
                  <input
                    type="text"
                    name="zip"
                    value={formData.zip}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 bg-black border-2 border-white text-white focus:outline-none focus:shadow-[4px_4px_0_0_#A488EF] focus:translate-x-[-1px] focus:translate-y-[-1px]"
                  />
                </div>
                <div>
                  <label className="block text-white text-sm font-bold mb-2">
                    Ville *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 bg-black border-2 border-white text-white focus:outline-none focus:shadow-[4px_4px_0_0_#A488EF] focus:translate-x-[-1px] focus:translate-y-[-1px]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white text-sm font-bold mb-2">
                  Pays *
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 bg-black border-2 border-white text-white focus:outline-none focus:shadow-[4px_4px_0_0_#A488EF] focus:translate-x-[-1px] focus:translate-y-[-1px]"
                />
              </div>

              <div>
                <label className="block text-white text-sm font-bold mb-2">
                  Téléphone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-black border-2 border-white text-white focus:outline-none focus:shadow-[4px_4px_0_0_#A488EF] focus:translate-x-[-1px] focus:translate-y-[-1px]"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 bg-black border-2 border-white text-white font-bold hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0_0_#A488EF] transition-all focus:outline-none focus:translate-x-[-1px] focus:translate-y-[-1px] focus:shadow-[4px_4px_0_0_#A488EF]"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-black border-2 border-white text-white font-bold hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0_0_#A488EF] transition-all focus:outline-none focus:translate-x-[-1px] focus:translate-y-[-1px] focus:shadow-[4px_4px_0_0_#A488EF] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Ajout...' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}