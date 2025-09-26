import React from 'react';

const MentionsLegales: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-orbitron text-4xl font-bold mb-8 border-b-2 border-white pb-4">
          MENTIONS LÉGALES
        </h1>

        <div className="space-y-8">
          {/* Éditeur du site */}
          <section className="border-2 border-white p-6">
            <h2 className="font-orbitron text-2xl font-bold mb-4 focus:shadow-[4px_4px_0px_#A488EF] active:shadow-[4px_4px_0px_#A488EF]">
              ÉDITEUR DU SITE
            </h2>
            <div className="font-lato space-y-2">
              <p><strong>Raison sociale :</strong> [Nom de société]</p>
              <p><strong>Adresse :</strong> [Adresse]</p>
              <p><strong>SIREN :</strong> [SIREN]</p>
              <p><strong>Téléphone :</strong> [Téléphone]</p>
              <p><strong>Email :</strong> [Email]</p>
            </div>
          </section>

          {/* Directeur de la publication */}
          <section className="border-2 border-white p-6">
            <h2 className="font-orbitron text-2xl font-bold mb-4 focus:shadow-[4px_4px_0px_#A488EF] active:shadow-[4px_4px_0px_#A488EF]">
              DIRECTEUR DE LA PUBLICATION
            </h2>
            <div className="font-lato space-y-2">
              <p><strong>Nom :</strong> [Nom du directeur]</p>
              <p><strong>Qualité :</strong> [Fonction]</p>
              <p><strong>Email :</strong> [Email du directeur]</p>
            </div>
          </section>

          {/* Hébergeur */}
          <section className="border-2 border-white p-6">
            <h2 className="font-orbitron text-2xl font-bold mb-4 focus:shadow-[4px_4px_0px_#A488EF] active:shadow-[4px_4px_0px_#A488EF]">
              HÉBERGEUR
            </h2>
            <div className="font-lato space-y-2">
              <p><strong>Nom :</strong> [Nom de l'hébergeur]</p>
              <p><strong>Adresse :</strong> [Adresse de l'hébergeur]</p>
              <p><strong>Téléphone :</strong> [Téléphone de l'hébergeur]</p>
              <p><strong>Site web :</strong> [Site web de l'hébergeur]</p>
            </div>
          </section>

          {/* Propriété intellectuelle */}
          <section className="border-2 border-white p-6">
            <h2 className="font-orbitron text-2xl font-bold mb-4 focus:shadow-[4px_4px_0px_#A488EF] active:shadow-[4px_4px_0px_#A488EF]">
              PROPRIÉTÉ INTELLECTUELLE
            </h2>
            <div className="font-lato space-y-4">
              <p>
                L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle. 
                Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.
              </p>
              <p>
                La reproduction de tout ou partie de ce site sur un support électronique quel qu'il soit est formellement interdite sauf autorisation expresse du directeur de la publication.
              </p>
              <p>
                Les marques citées sur ce site sont déposées par les sociétés qui en sont propriétaires.
              </p>
            </div>
          </section>

          {/* Responsabilité */}
          <section className="border-2 border-white p-6">
            <h2 className="font-orbitron text-2xl font-bold mb-4 focus:shadow-[4px_4px_0px_#A488EF] active:shadow-[4px_4px_0px_#A488EF]">
              RESPONSABILITÉ
            </h2>
            <div className="font-lato space-y-4">
              <p>
                Les informations contenues sur ce site sont aussi précises que possible et le site est périodiquement remis à jour, 
                mais peut toutefois contenir des inexactitudes, des omissions ou des lacunes.
              </p>
              <p>
                Si vous constatez une lacune, erreur ou ce qui parait être un dysfonctionnement, merci de bien vouloir le signaler par email 
                en décrivant le problème de la manière la plus précise possible.
              </p>
              <p>
                [Nom de société] ne pourra en aucune circonstance être tenu responsable de tout dommage de quelque nature qu'il soit 
                résultant de l'interprétation ou de l'utilisation des informations et/ou documents disponibles sur ce site.
              </p>
              <p>
                L'utilisateur reconnaît avoir pris connaissance des présentes mentions légales et s'engage à les respecter.
              </p>
            </div>
          </section>
        </div>

        <div className="mt-12 border-t-2 border-white pt-6">
          <p className="font-lato text-sm text-gray-300">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MentionsLegales;