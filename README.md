# PRCSM Studio

Boutique sneakers **headless** (Shopify Storefront) — front **React + Vite + TypeScript + Tailwind**, animations **Framer Motion**, design **brutaliste** (no-rounded, border **2px** blanc, hard shadow **#A488EF** sur focus/actif).

---

## Sommaire

- [Stack & prérequis](https://chatgpt.com/g/g-p-68b1ebe3f998819199587071b0a594aa-coding-projects/c/68cd4bfa-8214-8323-8816-06b24205051a#stack--pr%C3%A9requis)
- [Démarrage rapide](https://chatgpt.com/g/g-p-68b1ebe3f998819199587071b0a594aa-coding-projects/c/68cd4bfa-8214-8323-8816-06b24205051a#d%C3%A9marrage-rapide)
- [Variables d’environnement](https://chatgpt.com/g/g-p-68b1ebe3f998819199587071b0a594aa-coding-projects/c/68cd4bfa-8214-8323-8816-06b24205051a#variables-denvironnement)
- [Scripts NPM utiles](https://chatgpt.com/g/g-p-68b1ebe3f998819199587071b0a594aa-coding-projects/c/68cd4bfa-8214-8323-8816-06b24205051a#scripts-npm-utiles)
- [Structure du projet](https://chatgpt.com/g/g-p-68b1ebe3f998819199587071b0a594aa-coding-projects/c/68cd4bfa-8214-8323-8816-06b24205051a#structure-du-projet)
- [Fonctionnalités clés](https://chatgpt.com/g/g-p-68b1ebe3f998819199587071b0a594aa-coding-projects/c/68cd4bfa-8214-8323-8816-06b24205051a#fonctionnalit%C3%A9s-cl%C3%A9s)
- [Checkout & page Merci](https://chatgpt.com/g/g-p-68b1ebe3f998819199587071b0a594aa-coding-projects/c/68cd4bfa-8214-8323-8816-06b24205051a#checkout--page-merci)
- [Authentification (Customer Accounts)](https://chatgpt.com/g/g-p-68b1ebe3f998819199587071b0a594aa-coding-projects/c/68cd4bfa-8214-8323-8816-06b24205051a#authentification-customer-accounts)
- [Import catalogue (100+ paires)](https://chatgpt.com/g/g-p-68b1ebe3f998819199587071b0a594aa-coding-projects/c/68cd4bfa-8214-8323-8816-06b24205051a#import-catalogue-100-paires)
- [Design system (brutalist)](https://chatgpt.com/g/g-p-68b1ebe3f998819199587071b0a594aa-coding-projects/c/68cd4bfa-8214-8323-8816-06b24205051a#design-system-brutalist)
- [Tests manuels](https://chatgpt.com/g/g-p-68b1ebe3f998819199587071b0a594aa-coding-projects/c/68cd4bfa-8214-8323-8816-06b24205051a#tests-manuels)
- [Dépannage (FAQ)](https://chatgpt.com/g/g-p-68b1ebe3f998819199587071b0a594aa-coding-projects/c/68cd4bfa-8214-8323-8816-06b24205051a#d%C3%A9pannage-faq)
- [Roadmap](https://chatgpt.com/g/g-p-68b1ebe3f998819199587071b0a594aa-coding-projects/c/68cd4bfa-8214-8323-8816-06b24205051a#roadmap)

---

## Stack & prérequis

- **Node 18+** (recommandé 20 LTS)
- **pnpm** ou **npm**
- **Shopify** : un store + **Storefront API** (lecture) + **Admin API** (si import de dataset) + **Customer Accounts (Headless)** pour l’auth.

---

## Démarrage rapide

```bash
# 1) Cloner
git clone https://github.com/LazzyPurple/SNKRS
cd SNKRS
cd PRCSM-studio

# 2) Installer
npm i   # ou npm i

# 3) Créer le .env (voir section dédiée)

# 4) Lancer le front
npm run dev  # http://localhost:5173
```

---

## Variables d’environnement

> ⚠️ Ne jamais commiter des tokens. Créez un fichier .env à la racine.
> 

### Front (Storefront + Auth)

```
# Storefront API (lecture catalogue, PDP, cart)
VITE_SHOPIFY_DOMAIN=<your-shop>.myshopify.com
VITE_SHOPIFY_STOREFRONT_TOKEN=<public-storefront-access-token>
VITE_SHOPIFY_API_VERSION=2024-07

# Customer Accounts (Headless OAuth)
VITE_SHOPIFY_CUSTOMER_APP_ID=<Client ID des comptes clients>
VITE_SHOPIFY_CUSTOMER_AUTH_URL=https://shopify.com/authentication/<store_id>/oauth/authorize
VITE_SHOPIFY_CUSTOMER_TOKEN_URL=https://shopify.com/authentication/<store_id>/oauth/token
VITE_AUTH_REDIRECT_URI=http://localhost:5173/auth/callback
# Optionnel si vous utilisez l’API GraphQL Customer Accounts
VITE_SHOPIFY_CUSTOMER_GRAPHQL_URL=https://shopify.com/<store_id>/account/customer/api/2024-07/graphql.json

```

### Script d’import (Admin API)

```
SHOPIFY_DOMAIN=<your-shop>.myshopify.com
SHOPIFY_TOKEN=<Admin API access token>
SHOPIFY_API_VERSION=2024-07
# Optionnel: surcharger le volume d’import
TARGET_COUNT=100

```

> Astuce : Si vous alternez entre 5173/5174, ajoutez les deux redirections dans l’admin Shopify (URI de rappel) et alignez VITE_AUTH_REDIRECT_URI.
> 

---

## Scripts NPM utiles

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview --port 5174",
    "import:sneakers": "node scripts/importSneakers.js"
  }
}

```

---

## Structure du projet

```
src/
  api/
    shopify.ts            # SDK léger Storefront
  components/
    ui/                   # primitives (chip, button, select...)
    catalogue/            # carte produit, filtres…
    hero/                 # logo sprite canvas, newsletter, menu
  context/
    CartContext.tsx       # cartId persisté (localStorage), mutations + badge
    AuthContext.tsx       # session client (Customer Accounts)
  lib/
    oidc.ts               # OAuth PKCE (Customer Accounts)
  pages/
    Catalogue.tsx
    ProductPage.tsx
    Panier.tsx
    LoginPage.tsx / CallbackPage.tsx / ProfilePage.tsx
    Merci.tsx             # reset panier post-checkout
  layout/
    Layout.tsx Header.tsx Footer.tsx
scripts/
  importSneakers.js       # import 100+ paires via Admin API

```

---

## Fonctionnalités clés

- **Catalogue** : cartes brutalistes (bord 2px), tri, pas de bouton *Ajouter au panier* (navigation vers la PDP).
- Page Produit :
    - Galerie image, titre, **prix**.
    - **Gender** (Men/Women/Kids) + **chips de tailles** filtrées par genre.
    - Affichage inline des **tailles disponibles** sous le titre.
    - Ajout au panier **après** sélection taille.
- **Panier** :
    - `cartId` persistant, rehydration au mount.
    - **Stepper quantité** (− / input / +), **remove line**.
    - **Debounce** des updates, rollback en cas d’erreur.
    - Badge header fiable (= somme des quantités).
- **Checkout** : redirection Shopify dans l’onglet courant. **Page Merci** côté front ⇒ reset du panier puis retour accueil.
- **Header/Footer** : style brutaliste, **liens blancs**, focus violet avec hard-shadow.

---

## Checkout & page Merci

- Le bouton *Passer commande* crée/ouvre le **checkout Shopify**.
- À l’issue du paiement, Shopify renvoie vers `/merci`.
- **`/merci`** :
    - vide le panier (clear localStorage + annulation cart context),
    - affiche un message de confirmation,
    - bouton *Continuer vos achats* → `"/"`.

> Note : Pas besoin d’“Additional scripts” côté Online Store. On reste headless-safe.
> 

---

## Authentification (Customer Accounts)

**Mode choisi : Customer Accounts (Headless, OAuth + PKCE)**

1. **Admin Shopify → Vente Headless → API de compte client** :
    - Copier **Client ID** et **Store ID**.
    - **URI de rappel** : `http://localhost:5173/auth/callback` (ajoutez `127.0.0.1` si nécessaire).
    - **Origines JS** : `http://localhost:5173`.
2. **.env** : remplir les variables *Front (Auth)*.
3. `src/lib/oidc.ts` :
    - `startLogin()` construit l’URL sur **`shopify.com/authentication/<store_id>/oauth/authorize`** (PKCE S256, `state/nonce` base64url).
    - `handleOAuthCallback()` échange `code` → token via **`/oauth/token`** et persiste la session.
4. **Pages** :
    - `/login` (CTA Se connecter),
    - `/auth/callback` (traitement),
    - `/profile` (infos client, adresses, commandes).

### Intégration dans `main` (plan rapide)

1. **Copier** `context/AuthContext.tsx`, `lib/oidc.ts`, `pages/LoginPage.tsx`, `pages/CallbackPage.tsx`, `pages/ProfilePage.tsx`, `components/ui/*` requis.
2. **Router** : ajouter les 3 routes + guard `RequireAuth`.
3. **Header** : bouton *Se connecter* ⇄ avatar + menu *Profile / Sign out* selon l’état.
4. **Env** : ajouter les 5 variables *Customer Accounts* (voir section env) + **mettre à jour** l’URI de rappel si port ≠ 5173.
5. **Tests** :
    - Login → redirect Shopify authorize → retour `/auth/callback` → `/profile`.
    - Déconnexion → purge tokens + retour `/login`.

### Dépannage auth (rappels rapides)

- `redirect_uri mismatch` → l’URL **doit matcher à l’octet près** (host/port/slash). Ajoutez 5173 **et** 5174 en Admin si besoin.
- `400 Bad Request /authorize` → vérifiez `code_challenge` **base64url** et `nonce` sans `.` ni `=`.
- Boucle de redirections → supprimez cookies du domaine `shopify.com` (session OAuth), relancez le flow.

---

## Import catalogue (100+ paires)

- Script : `scripts/importSneakers.js`
- Lance : `npm importSneakers.js`.
- Source : **Sneaks-API** (Air Force 1, Dunk, Jordan, etc.).
- Création **REST Admin** : produit **actif**, variants **Gender × US Size**, images, tags (`brand:`, `silhouette:`, `height:`, `color:`, `gender:`, `style:<styleID>`...).

> Si vous voulez cibler uniquement Nike/Adidas/… : modifiez SOURCES dans le script.
> 

---

## Design system (brutalist)

- **Couleurs** : fond noir, texte blanc, ombre violette `#A488EF` (uniquement *focus/actif*).
- **Borders** : `2px` blanches, **sans arrondis**.
- **Fonts** : *Orbitron* (titres/nav), *Lato* (texte).
- **Accessibilité** : `:focus-visible` violet + hard-shadow, contrastes élevés.

---

## Tests manuels

- **Cart flow** :
    1. Ajout depuis PDP (sélectionner taille requise).
    2. Changer quantité (− / + / input) → badge à jour.
    3. Supprimer une ligne.
    4. Passer commande → paiement test → redirection `/merci` → panier vidé.
- **Auth flow** :
    1. `/login` → OAuth Shopify (authorize) → `/auth/callback` → `/profile`.
    2. Déconnexion → retour `/login`.
- **Catalogue/PDP** :
    - Cartes cliquables → PDP correspondante.
    - Tailles affichées **dispos** seulement.

---

## Dépannage (FAQ)

- **Badge x2 ou faux** → vider `localStorage`, vérifier somme des `cart.lines.quantity` côté context.
- **Login 404 myshopify** → l’URL d’authorize doit être sur `shopify.com/authentication/...`, pas `/account` du thème.
- **400 Bad Request (authorize)** → PKCE (`code_challenge` base64url), `nonce` sans `.` ni `=`.
- **redirect_uri mismatch** → port/host ne correspondent pas entre `.env` et Admin.
- **Checkout dans un nouvel onglet** → forcer `window.location.assign()` (pas `target="_blank"`).

---

## Roadmap

- [ ]  Searchbar catalogue.
- [ ]  Galerie PDP multi-images (thumbnails).
- [ ]  Profil client : adresses, commandes (Customer API GraphQL).
- [ ]  Observabilité (Sentry) & Web Vitals.

---
