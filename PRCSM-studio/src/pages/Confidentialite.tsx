import React from 'react';

const Confidentialite: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-orbitron text-4xl font-bold mb-8 border-b-2 border-white pb-4">
          POLITIQUE DE CONFIDENTIALITÉ
        </h1>

        <div className="space-y-8">
          {/* Données collectées */}
          <section className="border-2 border-white p-6">
            <h2 className="font-orbitron text-2xl font-bold mb-4 focus:shadow-[4px_4px_0px_#A488EF] active:shadow-[4px_4px_0px_#A488EF]">
              DONNÉES COLLECTÉES
            </h2>
            <div className="font-lato space-y-4">
              <h3 className="text-xl font-bold">Données personnelles</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Nom, prénom</li>
                <li>Adresse email</li>
                <li>Adresse postale</li>
                <li>Numéro de téléphone</li>
                <li>Informations de paiement (via processeurs sécurisés)</li>
              </ul>
              
              <h3 className="text-xl font-bold mt-6">Données techniques</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Adresse IP</li>
                <li>Type de navigateur</li>
                <li>Pages visitées</li>
                <li>Durée de visite</li>
                <li>Données de géolocalisation (si autorisée)</li>
              </ul>
            </div>
          </section>

          {/* Usage des données */}
          <section className="border-2 border-white p-6">
            <h2 className="font-orbitron text-2xl font-bold mb-4 focus:shadow-[4px_4px_0px_#A488EF] active:shadow-[4px_4px_0px_#A488EF]">
              USAGE DES DONNÉES
            </h2>
            <div className="font-lato space-y-4">
              <p>Vos données personnelles sont utilisées pour :</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Traitement et suivi de vos commandes</li>
                <li>Gestion de votre compte client</li>
                <li>Service client et support technique</li>
                <li>Envoi d'informations commerciales (avec votre consentement)</li>
                <li>Amélioration de nos services</li>
                <li>Respect des obligations légales</li>
                <li>Prévention de la fraude</li>
              </ul>
              
              <h3 className="text-xl font-bold mt-6">Base légale du traitement</h3>
              <p>
                Le traitement de vos données repose sur votre consentement, l'exécution d'un contrat, 
                le respect d'une obligation légale ou notre intérêt légitime.
              </p>
            </div>
          </section>

          {/* Consentement et droits RGPD */}
          <section className="border-2 border-white p-6">
            <h2 className="font-orbitron text-2xl font-bold mb-4 focus:shadow-[4px_4px_0px_#A488EF] active:shadow-[4px_4px_0px_#A488EF]">
              CONSENTEMENT ET DROITS RGPD
            </h2>
            <div className="font-lato space-y-4">
              <h3 className="text-xl font-bold">Vos droits</h3>
              <p>Conformément au RGPD, vous disposez des droits suivants :</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Droit d'accès :</strong> Obtenir une copie de vos données personnelles</li>
                <li><strong>Droit de rectification :</strong> Corriger des données inexactes</li>
                <li><strong>Droit à l'effacement :</strong> Demander la suppression de vos données</li>
                <li><strong>Droit à la limitation :</strong> Limiter le traitement de vos données</li>
                <li><strong>Droit à la portabilité :</strong> Récupérer vos données dans un format structuré</li>
                <li><strong>Droit d'opposition :</strong> Vous opposer au traitement de vos données</li>
                <li><strong>Droit de retrait du consentement :</strong> Retirer votre consentement à tout moment</li>
              </ul>
              
              <h3 className="text-xl font-bold mt-6">Exercer vos droits</h3>
              <p>
                Pour exercer vos droits, contactez-nous à l'adresse : <strong>[Email DPO]</strong>
              </p>
              <p>
                Vous disposez également du droit d'introduire une réclamation auprès de la CNIL.
              </p>
            </div>
          </section>

          {/* Cookies */}
          <section className="border-2 border-white p-6">
            <h2 className="font-orbitron text-2xl font-bold mb-4 focus:shadow-[4px_4px_0px_#A488EF] active:shadow-[4px_4px_0px_#A488EF]">
              COOKIES
            </h2>
            <div className="font-lato space-y-4">
              <h3 className="text-xl font-bold">Types de cookies utilisés</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Cookies essentiels :</strong> Nécessaires au fonctionnement du site</li>
                <li><strong>Cookies de performance :</strong> Analyse du trafic et amélioration du site</li>
                <li><strong>Cookies de fonctionnalité :</strong> Mémorisation de vos préférences</li>
                <li><strong>Cookies publicitaires :</strong> Personnalisation des publicités (avec consentement)</li>
              </ul>
              
              <h3 className="text-xl font-bold mt-6">Gestion des cookies</h3>
              <p>
                Vous pouvez gérer vos préférences de cookies via notre bandeau de consentement 
                ou les paramètres de votre navigateur.
              </p>
              <p>
                La désactivation de certains cookies peut affecter le fonctionnement du site.
              </p>
            </div>
          </section>

          {/* Contact DPO */}
          <section className="border-2 border-white p-6">
            <h2 className="font-orbitron text-2xl font-bold mb-4 focus:shadow-[4px_4px_0px_#A488EF] active:shadow-[4px_4px_0px_#A488EF]">
              CONTACT DPO
            </h2>
            <div className="font-lato space-y-4">
              <h3 className="text-xl font-bold">Délégué à la Protection des Données</h3>
              <div className="space-y-2">
                <p><strong>Nom :</strong> [Nom du DPO]</p>
                <p><strong>Email :</strong> [Email DPO]</p>
                <p><strong>Adresse :</strong> [Adresse DPO]</p>
              </div>
              
              <h3 className="text-xl font-bold mt-6">Conservation des données</h3>
              <p>
                Vos données personnelles sont conservées pendant la durée nécessaire aux finalités 
                pour lesquelles elles ont été collectées, conformément aux obligations légales.
              </p>
              
              <h3 className="text-xl font-bold mt-6">Sécurité</h3>
              <p>
                Nous mettons en œuvre des mesures techniques et organisationnelles appropriées 
                pour protéger vos données personnelles contre tout accès non autorisé, 
                altération, divulgation ou destruction.
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

export default Confidentialite;