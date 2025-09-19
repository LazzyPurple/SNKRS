export default function Lookbook() {
  return (
    <div className="flex-1 w-full bg-prcsm-black text-prcsm-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8 border-2 border-white inline-block px-4 py-2 shadow-[4px_4px_0px_0px_#A488EF]">
          <h1 className="font-bold text-2xl uppercase">Lookbook</h1>
        </div>
        
        {/* Content */}
        <div className="text-center py-20">
          <h2 className="text-4xl font-orbitron font-bold mb-4">LOOKBOOK</h2>
          <p className="text-gray-400 text-lg">
            Découvrez nos dernières collections et inspirations mode.
          </p>
          <div className="mt-8 text-sm text-gray-500">
            Page en cours de développement...
          </div>
        </div>
      </div>
    </div>
  );
}