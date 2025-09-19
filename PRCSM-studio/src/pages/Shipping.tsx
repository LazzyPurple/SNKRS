export default function Shipping() {
  return (
    <div className="flex-1 w-full bg-prcsm-black text-prcsm-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8 border-2 border-white inline-block px-4 py-2 shadow-[4px_4px_0px_0px_#A488EF]">
          <h1 className="font-bold text-2xl uppercase">Livraison</h1>
        </div>
        
        {/* Content */}
        <div className="space-y-8">
          <div className="border-2 border-white p-6 shadow-[4px_4px_0px_0px_#A488EF]">
            <h2 className="text-2xl font-orbitron font-bold mb-4">INFORMATIONS DE LIVRAISON</h2>
            
            <div className="space-y-6 text-gray-300">
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Livraison Standard</h3>
                <p>3-5 jours ouvrés - Gratuite à partir de 100€</p>
                <p className="text-sm text-gray-400">Tarif : 5,99€</p>
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Livraison Express</h3>
                <p>1-2 jours ouvrés</p>
                <p className="text-sm text-gray-400">Tarif : 12,99€</p>
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Livraison Internationale</h3>
                <p>5-10 jours ouvrés selon la destination</p>
                <p className="text-sm text-gray-400">Tarifs variables selon le pays</p>
              </div>
            </div>
          </div>
          
          <div className="border-2 border-white p-6 shadow-[4px_4px_0px_0px_#A488EF]">
            <h2 className="text-2xl font-orbitron font-bold mb-4">RETOURS & ÉCHANGES</h2>
            <div className="text-gray-300 space-y-2">
              <p>• Retours gratuits sous 30 jours</p>
              <p>• Articles en parfait état avec étiquettes</p>
              <p>• Remboursement sous 5-7 jours ouvrés</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}