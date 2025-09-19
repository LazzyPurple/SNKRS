export default function Stores() {
  return (
    <div className="flex-1 w-full bg-prcsm-black text-prcsm-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8 border-2 border-white inline-block px-4 py-2 shadow-[4px_4px_0px_0px_#A488EF]">
          <h1 className="font-bold text-2xl uppercase">Nos Magasins</h1>
        </div>
        
        {/* Stores Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Store 1 - Paris */}
          <div className="border-2 border-white p-6 shadow-[4px_4px_0px_0px_#A488EF]">
            <h3 className="text-xl font-orbitron font-bold mb-4">PARIS MARAIS</h3>
            <div className="space-y-3 text-gray-300">
              <div>
                <h4 className="font-bold text-white">Adresse</h4>
                <p>15 Rue des Rosiers<br />75004 Paris</p>
              </div>
              <div>
                <h4 className="font-bold text-white">Horaires</h4>
                <p>Lun - Sam: 10h - 20h<br />Dim: 12h - 19h</p>
              </div>
              <div>
                <h4 className="font-bold text-white">Téléphone</h4>
                <p>+33 1 42 77 89 12</p>
              </div>
            </div>
          </div>
          
          {/* Store 2 - Lyon */}
          <div className="border-2 border-white p-6 shadow-[4px_4px_0px_0px_#A488EF]">
            <h3 className="text-xl font-orbitron font-bold mb-4">LYON PRESQU'ÎLE</h3>
            <div className="space-y-3 text-gray-300">
              <div>
                <h4 className="font-bold text-white">Adresse</h4>
                <p>28 Rue de la République<br />69002 Lyon</p>
              </div>
              <div>
                <h4 className="font-bold text-white">Horaires</h4>
                <p>Lun - Sam: 10h - 19h30<br />Dim: 14h - 19h</p>
              </div>
              <div>
                <h4 className="font-bold text-white">Téléphone</h4>
                <p>+33 4 78 42 15 67</p>
              </div>
            </div>
          </div>
          
          {/* Store 3 - Marseille */}
          <div className="border-2 border-white p-6 shadow-[4px_4px_0px_0px_#A488EF]">
            <h3 className="text-xl font-orbitron font-bold mb-4">MARSEILLE VIEUX-PORT</h3>
            <div className="space-y-3 text-gray-300">
              <div>
                <h4 className="font-bold text-white">Adresse</h4>
                <p>7 Quai du Port<br />13002 Marseille</p>
              </div>
              <div>
                <h4 className="font-bold text-white">Horaires</h4>
                <p>Lun - Sam: 9h30 - 19h<br />Dim: 11h - 18h</p>
              </div>
              <div>
                <h4 className="font-bold text-white">Téléphone</h4>
                <p>+33 4 91 54 32 89</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Coming Soon */}
        <div className="mt-12 text-center">
          <div className="border-2 border-[#A488EF] p-8 shadow-[4px_4px_0px_0px_#A488EF] inline-block">
            <h2 className="text-2xl font-orbitron font-bold mb-4 text-[#A488EF]">BIENTÔT</h2>
            <p className="text-gray-300">
              De nouveaux magasins ouvriront prochainement à Bordeaux, Lille et Nice.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Restez connectés pour plus d'informations !
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}