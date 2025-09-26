import React from 'react';

const CGU: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-orbitron text-4xl font-bold mb-8 border-b-2 border-white pb-4">
          CONDITIONS GÉNÉRALES D'UTILISATION
        </h1>

        <div className="space-y-8">
          {/* Objet */}
          <section className="border-2 border-white p-6">
            <h2 className="font-orbitron text-2xl font-bold mb-4 focus:shadow-[4px_4px_0px_#A488EF] active:shadow-[4px_4px_0px_#A488EF]">
              OBJET
            </h2>
            <div className="font-lato space-y-4">
              <p>
                Les présentes Conditions Générales d'Utilisation (CGU) ont pour objet de définir les modalités 
                et conditions d'utilisation du site internet [Nom du site] exploité par [Nom de société].
              </p>
              <p>
                L'utilisation du site implique l'acceptation pleine et entière des présentes CGU. 
                Ces conditions s'appliquent à l'exclusion de toute autre condition.
              </p>
              <p>
                [Nom de société] se réserve le droit de modifier à tout moment les présentes CGU. 
                Les modifications entrent en vigueur dès leur publication sur le site.
              </p>
            </div>
          </section>

          {/* Accès au site */}
          <section className="border-2 border-white p-6">
            <h2 className="font-orbitron text-2xl font-bold mb-4 focus:shadow-[4px_4px_0px_#A488EF] active:shadow-[4px_4px_0px_#A488EF]">
              ACCÈS AU SITE
            </h2>
            <div className="font-lato space-y-4">
              <h3 className="text-xl font-bold">Conditions d'accès</h3>
              <p>
                Le site est accessible gratuitement à tout utilisateur disposant d'un accès à Internet. 
                Tous les frais supportés par l'utilisateur pour accéder au service sont à sa charge.
              </p>
              
              <h3 className="text-xl font-bold mt-6">Disponibilité</h3>
              <p>
                [Nom de société] s'efforce de permettre l'accès au site 24 heures sur 24, 7 jours sur 7, 
                sauf en cas de force majeure ou d'un événement hors du contrôle de [Nom de société].
              </p>
              <p>
                [Nom de société] se réserve le droit d'interrompre, de suspendre momentanément ou de modifier 
                sans préavis l'accès à tout ou partie du site pour des raisons de maintenance ou pour tout autre motif.
              </p>
              
              <h3 className="text-xl font-bold mt-6">Utilisation conforme</h3>
              <p>L'utilisateur s'engage à utiliser le site de manière conforme à sa destination et s'interdit notamment :</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>D'utiliser le site à des fins illégales ou non autorisées</li>
                <li>De porter atteinte aux droits de propriété intellectuelle</li>
                <li>De diffuser des contenus illicites, diffamatoires ou contraires à l'ordre public</li>
                <li>De perturber le fonctionnement du site</li>
              </ul>
            </div>
          </section>

          {/* Compte utilisateur */}
          <section className="border-2 border-white p-6">
            <h2 className="font-orbitron text-2xl font-bold mb-4 focus:shadow-[4px_4px_0px_#A488EF] active:shadow-[4px_4px_0px_#A488EF]">
              COMPTE UTILISATEUR
            </h2>
            <div className="font-lato space-y-4">
              <h3 className="text-xl font-bold">Création de compte</h3>
              <p>
                L'accès à certaines fonctionnalités du site nécessite la création d'un compte utilisateur. 
                L'utilisateur s'engage à fournir des informations exactes et à les maintenir à jour.
              </p>
              
              <h3 className="text-xl font-bold mt-6">Identifiants</h3>
              <p>
                L'utilisateur est responsable de la confidentialité de ses identifiants de connexion. 
                Il s'engage à ne pas les communiquer à des tiers et à informer immédiatement [Nom de société] 
                de toute utilisation non autorisée de son compte.
              </p>
              
              <h3 className="text-xl font-bold mt-6">Suspension et suppression</h3>
              <p>
                [Nom de société] se réserve le droit de suspendre ou supprimer un compte utilisateur 
                en cas de violation des présentes CGU, sans préavis ni indemnité.
              </p>
            </div>
          </section>

          {/* Commandes et paiement */}
          <section className="border-2 border-white p-6">
            <h2 className="font-orbitron text-2xl font-bold mb-4 focus:shadow-[4px_4px_0px_#A488EF] active:shadow-[4px_4px_0px_#A488EF]">
              COMMANDES ET PAIEMENT
            </h2>
            <div className="font-lato space-y-4">
              <h3 className="text-xl font-bold">Conditions Générales de Vente</h3>
              <p>
                Les achats effectués sur ce site sont régis par nos Conditions Générales de Vente (CGV) 
                disponibles sur notre plateforme Shopify. Ces CGV font partie intégrante du processus de commande.
              </p>
              
              <h3 className="text-xl font-bold mt-6">Processus de commande</h3>
              <p>
                Toute commande passée sur le site constitue la formation d'un contrat entre l'utilisateur et [Nom de société]. 
                La validation de la commande vaut acceptation des prix et descriptions des produits disponibles à la vente.
              </p>
              
              <h3 className="text-xl font-bold mt-6">Paiement sécurisé</h3>
              <p>
                Les paiements sont traités de manière sécurisée via notre partenaire Shopify. 
                [Nom de société] ne stocke aucune information de paiement sur ses serveurs.
              </p>
              
              <h3 className="text-xl font-bold mt-6">Référence aux CGV Shopify</h3>
              <p>
                Pour toute question relative aux commandes, livraisons, retours et remboursements, 
                veuillez consulter nos CGV complètes disponibles lors du processus de commande sur notre boutique Shopify.
              </p>
            </div>
          </section>

          {/* Propriété intellectuelle */}
          <section className="border-2 border-white p-6">
            <h2 className="font-orbitron text-2xl font-bold mb-4 focus:shadow-[4px_4px_0px_#A488EF] active:shadow-[4px_4px_0px_#A488EF]">
              PROPRIÉTÉ INTELLECTUELLE
            </h2>
            <div className="font-lato space-y-4">
              <h3 className="text-xl font-bold">Droits de [Nom de société]</h3>
              <p>
                Tous les éléments du site (textes, images, sons, vidéos, marques, logos, etc.) sont protégés 
                par les droits de propriété intellectuelle et appartiennent à [Nom de société] ou à ses partenaires.
              </p>
              
              <h3 className="text-xl font-bold mt-6">Utilisation autorisée</h3>
              <p>
                L'utilisateur dispose d'un droit d'usage privé, non-collectif et non-exclusif sur les contenus du site. 
                Toute reproduction, représentation, modification, publication ou adaptation est strictement interdite 
                sans autorisation expresse de [Nom de société].
              </p>
              
              <h3 className="text-xl font-bold mt-6">Marques tierces</h3>
              <p>
                Les marques et logos de tiers présents sur le site sont la propriété de leurs détenteurs respectifs. 
                Leur présence ne saurait être interprétée comme une autorisation d'usage.
              </p>
            </div>
          </section>

          {/* Responsabilité */}
          <section className="border-2 border-white p-6">
            <h2 className="font-orbitron text-2xl font-bold mb-4 focus:shadow-[4px_4px_0px_#A488EF] active:shadow-[4px_4px_0px_#A488EF]">
              RESPONSABILITÉ
            </h2>
            <div className="font-lato space-y-4">
              <h3 className="text-xl font-bold">Limitation de responsabilité</h3>
              <p>
                [Nom de société] ne saurait être tenu responsable des dommages directs ou indirects causés au matériel 
                de l'utilisateur lors de l'accès au site, et résultant soit de l'utilisation d'un matériel ne répondant 
                pas aux spécifications indiquées, soit de l'apparition d'un bug ou d'une incompatibilité.
              </p>
              
              <h3 className="text-xl font-bold mt-6">Contenu utilisateur</h3>
              <p>
                L'utilisateur est seul responsable du contenu qu'il publie sur le site. 
                [Nom de société] se réserve le droit de supprimer tout contenu jugé inapproprié sans préavis.
              </p>
              
              <h3 className="text-xl font-bold mt-6">Liens externes</h3>
              <p>
                Le site peut contenir des liens vers d'autres sites internet. 
                [Nom de société] n'exerce aucun contrôle sur ces sites et décline toute responsabilité 
                quant à leur contenu ou leur politique de confidentialité.
              </p>
            </div>
          </section>

          {/* Loi applicable */}
          <section className="border-2 border-white p-6">
            <h2 className="font-orbitron text-2xl font-bold mb-4 focus:shadow-[4px_4px_0px_#A488EF] active:shadow-[4px_4px_0px_#A488EF]">
              LOI APPLICABLE
            </h2>
            <div className="font-lato space-y-4">
              <h3 className="text-xl font-bold">Droit français</h3>
              <p>
                Les présentes CGU sont régies par le droit français. 
                En cas de litige, les tribunaux français seront seuls compétents.
              </p>
              
              <h3 className="text-xl font-bold mt-6">Médiation</h3>
              <p>
                Conformément aux dispositions du Code de la consommation concernant le règlement amiable des litiges, 
                [Nom de société] adhère au Service du Médiateur du e-commerce de la FEVAD (Fédération du e-commerce et de la vente à distance) 
                dont les coordonnées sont les suivantes : [Coordonnées du médiateur].
              </p>
              
              <h3 className="text-xl font-bold mt-6">Nullité partielle</h3>
              <p>
                Si une ou plusieurs stipulations des présentes CGU sont tenues pour non valides ou déclarées telles 
                en application d'une loi, d'un règlement ou à la suite d'une décision définitive d'une juridiction compétente, 
                les autres stipulations garderont toute leur force et leur portée.
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

export default CGU;