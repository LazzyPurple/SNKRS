export default function Contact() {
  return (
    <div className="flex-1 w-full bg-prcsm-black text-prcsm-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8 border-2 border-white inline-block px-4 py-2 shadow-[4px_4px_0px_0px_#A488EF]">
          <h1 className="font-bold text-2xl uppercase">Contact</h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="border-2 border-white p-6 shadow-[4px_4px_0px_0px_#A488EF]">
            <h2 className="text-2xl font-orbitron font-bold mb-6">NOUS CONTACTER</h2>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-2">Nom</label>
                <input 
                  type="text" 
                  className="w-full bg-transparent border-2 border-white text-white px-4 py-3 focus:outline-none focus:border-[#A488EF]"
                  placeholder="Votre nom"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold mb-2">Email</label>
                <input 
                  type="email" 
                  className="w-full bg-transparent border-2 border-white text-white px-4 py-3 focus:outline-none focus:border-[#A488EF]"
                  placeholder="votre@email.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold mb-2">Sujet</label>
                <input 
                  type="text" 
                  className="w-full bg-transparent border-2 border-white text-white px-4 py-3 focus:outline-none focus:border-[#A488EF]"
                  placeholder="Sujet de votre message"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold mb-2">Message</label>
                <textarea 
                  rows={5}
                  className="w-full bg-transparent border-2 border-white text-white px-4 py-3 focus:outline-none focus:border-[#A488EF] resize-none"
                  placeholder="Votre message..."
                />
              </div>
              
              <button 
                type="submit"
                className="w-full border-2 border-white bg-white text-black py-3 font-bold hover:bg-[#A488EF] hover:border-[#A488EF] transition-colors shadow-[4px_4px_0px_0px_#A488EF]"
              >
                ENVOYER
              </button>
            </form>
          </div>
          
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="border-2 border-white p-6 shadow-[4px_4px_0px_0px_#A488EF]">
              <h3 className="text-xl font-orbitron font-bold mb-4">INFORMATIONS</h3>
              <div className="space-y-3 text-gray-300">
                <div>
                  <h4 className="font-bold text-white">Email</h4>
                  <p>contact@prcsm-studio.com</p>
                </div>
                <div>
                  <h4 className="font-bold text-white">Téléphone</h4>
                  <p>+33 1 23 45 67 89</p>
                </div>
                <div>
                  <h4 className="font-bold text-white">Adresse</h4>
                  <p>123 Rue de la Mode<br />75001 Paris, France</p>
                </div>
              </div>
            </div>
            
            <div className="border-2 border-white p-6 shadow-[4px_4px_0px_0px_#A488EF]">
              <h3 className="text-xl font-orbitron font-bold mb-4">HORAIRES</h3>
              <div className="space-y-2 text-gray-300">
                <p><span className="text-white font-bold">Lun - Ven:</span> 9h00 - 18h00</p>
                <p><span className="text-white font-bold">Sam:</span> 10h00 - 17h00</p>
                <p><span className="text-white font-bold">Dim:</span> Fermé</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}