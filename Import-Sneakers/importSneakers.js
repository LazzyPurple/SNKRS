// importSneakers.js
// Node >=18 (fetch global). Sinon: npm i node-fetch et: import fetch from 'node-fetch'
import 'dotenv/config';
import SneaksAPI from 'sneaks-api';

const sneaks = new SneaksAPI();
const SHOPIFY_DOMAIN = process.env.SHOPIFY_DOMAIN; // ex: my-shop.myshopify.com
const SHOPIFY_TOKEN  = process.env.SHOPIFY_TOKEN;  // Admin API access token
const API_VERSION    = process.env.SHOPIFY_API_VERSION || '2023-10';

// ---------------------------
// Helpers: taxo & normalizers
// ---------------------------
const KNOWN_COLORS = [
  'black','white','purple','green','blue','red','yellow','orange','pink','brown','grey','gray','multicolor'
];

const normalizeColor = (c) => (c === 'gray' ? 'grey' : c);

function slugify(str) {
  return String(str || '')
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function stripBrandFromTitle(title, brand) {
  if (!title) return '';
  const t = title.trim();
  const b = (brand || '').trim();
  return (b && t.toLowerCase().startsWith(b.toLowerCase() + ' '))
    ? t.slice(b.length).trim()
    : t;
}

function deriveHeightFromText(text) {
  const t = (text || '').toLowerCase();
  if (/\b(high|retro high|hi)\b/.test(t)) return 'high';
  if (/\bmid\b/.test(t)) return 'mid';
  if (/\blow\b/.test(t)) return 'low';
  return 'low'; // défaut raisonnable
}

function parseColorwayToColors(colorway = '') {
  const raw = colorway.toLowerCase();
  const hits = new Set();
  for (const c of KNOWN_COLORS) {
    if (raw.includes(c)) hits.add(normalizeColor(c));
  }
  if (!hits.size && /multi|rainbow|various/.test(raw)) hits.add('multicolor');
  return Array.from(hits);
}

// ---------------------------
// Variants: Gender x US Size
// ---------------------------
function sizesForGender(gender) {
  if (gender === 'Men'   || gender === 'Women') return ['7','8','9','10','11','12'];
  if (gender === 'Kids') return ['3Y','4Y','5Y','6Y','7Y'];
  return [];
}

function buildVariants({ genders, price, styleCode, vendor }) {
  const variants = [];
  const sizeValues = new Set();

  for (const g of genders) {
    for (const size of sizesForGender(g)) {
      variants.push({
        option1: g,           // Gender
        option2: size,        // US Size
        price: String(price), // shop currency
        sku: `${vendor?.slice(0,2).toUpperCase() || 'XX'}-${(styleCode || 'SKU').toUpperCase()}-${g[0].toUpperCase()}-${size}`.replace(/\s+/g,''),
        inventory_management: 'shopify',
        inventory_policy: 'deny',
        inventory_quantity: 10, // défaut : ajuste si tu veux
        taxable: true,
      });
      sizeValues.add(size);
    }
  }

  return {
    variants,
    options: [
      { name: 'Gender',  values: genders },
      { name: 'US Size', values: Array.from(sizeValues) },
    ],
  };
}

// ---------------------------
// Tags (Identité + Apparence)
// ---------------------------
function buildTags({ brand, modelName, height, sport = 'lifestyle', genders = [], colors = [], material }) {
  const tags = new Set();

  if (brand)      tags.add(`brand:${slugify(brand)}`);
  if (modelName)  tags.add(`silhouette:${slugify(modelName)}`);
  if (height)     tags.add(`height:${slugify(height)}`);
  if (sport)      tags.add(`sport:${slugify(sport)}`);

  for (const g of genders) {
    const v = g.toLowerCase();
    if (['men','women','kids','unisex'].includes(v)) tags.add(`gender:${v}`);
  }

  for (const c of colors) tags.add(`color:${slugify(c)}`);

  if (material) tags.add(`material:${slugify(material)}`);

  return Array.from(tags).join(','); // Shopify attend une string
}

// ---------------------------
// Images
// ---------------------------
function buildImages(product) {
  const urls = new Set();
  if (product.thumbnail) urls.add(product.thumbnail);

  // Certaines versions de Sneaks-API exposent d'autres liens (media, imageLinks)...
  // Ajoute ici si tu as d'autres champs d'images:
  if (Array.isArray(product.imageLinks)) {
    for (const u of product.imageLinks) if (u) urls.add(u);
  }
  if (product.media && Array.isArray(product.media)) {
    for (const u of product.media) if (u) urls.add(u);
  }

  return Array.from(urls).map((src) => ({ src }));
}

// ---------------------------
// Shopify: POST product
// ---------------------------
async function postProductToShopify(payload) {
  const res = await fetch(`https://${SHOPIFY_DOMAIN}/admin/api/${API_VERSION}/products.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': SHOPIFY_TOKEN,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (res.ok && data.product) {
    console.log(`✅ Ajouté: ${data.product.title} (${data.product.id})`);
  } else {
    console.error('❌ Erreur Shopify:', JSON.stringify(data, null, 2));
  }
}

// ---------------------------
// Build payload from Sneaks
// ---------------------------
function buildProductPayloadFromSneaks(raw, genders) {
  const vendor = raw.brand?.trim() || 'Unknown';
  const originalTitle = raw.shoeName || raw.title || '';
  const title = stripBrandFromTitle(originalTitle, vendor); // <-- SANS la marque
  const modelName = title.split(/["“”']/)[0].trim();        // partie modèle avant guillemets
  const colorway = raw.colorway || '';
  const price = Number(raw.retailPrice || 149.99);

  const height = deriveHeightFromText(originalTitle);
  const colors = parseColorwayToColors(colorway);
  const material = raw.material || ''; // souvent indispo → pas grave

  const { variants, options } = buildVariants({
    genders,
    price,
    styleCode: raw.styleID || slugify(title).toUpperCase(),
    vendor,
  });

  const product = {
    title,                  // <--- brand retirée
    vendor,                 // brand ici
    product_type: 'sneakers',
    body_html: `${modelName}${colorway ? ` — ${colorway}` : ''}`,
    options,                // [{ Gender }, { US Size }]
    variants,
    images: buildImages(raw),
    tags: buildTags({
      brand: vendor,
      modelName,
      height,
      sport: 'lifestyle',
      genders: genders.map((g) => g.toLowerCase()),
      colors,
      material,
    }),
  };

  return { product };
}

// ---------------------------
// Import depuis Sneaks-API
// ---------------------------
/**
 * @param {string} query    - terme de recherche Sneaks (ex: "Dunk Low")
 * @param {number} limit    - nombre max à importer
 * @param {Array<'Men'|'Women'|'Kids'>} genders - variantes à générer
 */
function importSneakers(query, limit = 10, genders = ['Men','Women']) {
  sneaks.getProducts(query, limit, async (err, products) => {
    if (err) return console.error('Sneaks error:', err);

    for (const p of products) {
      try {
        const payload = buildProductPayloadFromSneaks(p, genders);
        await postProductToShopify(payload);
        await new Promise((r) => setTimeout(r, 500)); // petit throttle
      } catch (e) {
        console.error('❌ Import error:', e);
      }
    }
  });
}

// ---------------------------
// Démo: 20 produits répartis
// ---------------------------
// Choisis tes combos `query` + `genders` selon ce que tu veux générer:
importSneakers('Air Force 1', 4, ['Men','Women']);
importSneakers('Dunk Low',    4, ['Men','Women']);
importSneakers('Jordan 1',    4, ['Men']);          // ex: uniquement Men
importSneakers('Stan Smith',   4, ['Women']);       // ex: uniquement Women
importSneakers('Old Skool',    4, ['Kids']);        // Kids 3Y..7Y
