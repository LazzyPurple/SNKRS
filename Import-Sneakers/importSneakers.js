// scripts/importSneakers.js
// Node >= 18 (fetch global). Déps: sneaks-api, dotenv
import "dotenv/config";
import SneaksAPI from "sneaks-api";

const sneaks = new SneaksAPI();
const SHOPIFY_DOMAIN = process.env.SHOPIFY_DOMAIN;
const SHOPIFY_TOKEN = process.env.SHOPIFY_TOKEN;
const API_VERSION = process.env.SHOPIFY_API_VERSION || "2024-07";
const TARGET = Number(process.env.TARGET_COUNT || 100);

// -------- utils --------
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const slug = (s = "") =>
  String(s)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const stripBrandFromTitle = (title, brand) => {
  if (!title) return "";
  const t = title.trim(),
    b = (brand || "").trim();
  return b && t.toLowerCase().startsWith(b.toLowerCase() + " ")
    ? t.slice(b.length).trim()
    : t;
};

const deriveHeight = (txt = "") => {
  const t = txt.toLowerCase();
  if (/\b(high|retro high|hi)\b/.test(t)) return "high";
  if (/\bmid\b/.test(t)) return "mid";
  return "low";
};

const KNOWN_COLORS = [
  "black",
  "white",
  "purple",
  "green",
  "blue",
  "red",
  "yellow",
  "orange",
  "pink",
  "brown",
  "grey",
  "gray",
  "multicolor",
];
const normColor = (c) => (c === "gray" ? "grey" : c);
const colorsFromColorway = (cw = "") => {
  const raw = cw.toLowerCase();
  const out = new Set();
  for (const c of KNOWN_COLORS) if (raw.includes(c)) out.add(normColor(c));
  if (!out.size && /multi|rainbow|various/.test(raw)) out.add("multicolor");
  return [...out];
};

// -------- variants (Gender × US Size) --------
const SIZES = {
  Men: ["7", "8", "9", "10", "11", "12"],
  Women: ["7", "8", "9", "10", "11", "12"],
  Kids: ["3Y", "4Y", "5Y", "6Y", "7Y"],
};
const sizesForGender = (g) => SIZES[g] || [];

function detectGenders(p) {
  const s = (p.gender || p.silhouette || p.title || "").toLowerCase();
  const G = new Set();
  if (/men|male|m\b/.test(s)) G.add("Men");
  if (/women|female|wmn|w\b/.test(s)) G.add("Women");
  if (/kids|gs|ps|td|y\b/.test(s)) G.add("Kids");
  if (!G.size) G.add("Men"); // défaut simple
  return [...G];
}

function buildVariants({ genders, price, styleID, vendor }) {
  const variants = [];
  const sizeValues = new Set();
  for (const g of genders) {
    for (const size of sizesForGender(g)) {
      variants.push({
        option1: g,
        option2: size,
        price: String(price),
        sku: `${(vendor || "XX").slice(0, 2).toUpperCase()}-${(styleID || "SKU")
          .toUpperCase()
          .replace(/\s+/g, "")}-${g[0]}-${size}`,
        inventory_management: "shopify",
        inventory_policy: "deny",
        inventory_quantity: 10,
        taxable: true,
      });
      sizeValues.add(size);
    }
  }
  return {
    variants,
    options: [
      { name: "Gender", values: genders },
      { name: "US Size", values: [...sizeValues] },
    ],
  };
}

// -------- images + tags --------
function dedupe(arr = []) {
  const set = new Set();
  for (const u of arr) if (u) set.add(String(u).trim());
  return [...set];
}

function buildImages(raw, goatImages = []) {
  const urls = dedupe([
    raw.thumbnail,
    ...(raw.imageLinks || []),
    ...(raw.media || []),
    ...(goatImages || []),
  ]);
  return urls.slice(0, 8).map((src) => ({ src }));
}

const buildTags = ({ brand, modelName, height, genders, colors, material, styleID }) => {
  const tags = new Set();
  if (brand) tags.add(`brand:${slug(brand)}`);
  if (modelName) tags.add(`silhouette:${slug(modelName)}`);
  if (height) tags.add(`height:${slug(height)}`);
  tags.add("sport:lifestyle");
  (genders || []).forEach((g) => tags.add(`gender:${g.toLowerCase()}`));
  (colors || []).forEach((c) => tags.add(`color:${slug(c)}`));
  if (material) tags.add(`material:${slug(material)}`);
  if (styleID) tags.add(`style:${styleID}`);
  return [...tags].join(",");
};

// -------- Sneaks helpers --------
function sneaksGetProducts(query, limit) {
  return new Promise((resolve, reject) => {
    sneaks.getProducts(query, limit, (err, products) => {
      if (err) return reject(err);
      resolve(products || []);
    });
  });
}
function sneaksGetProductPrices(styleID) {
  return new Promise((resolve) => {
    sneaks.getProductPrices(styleID, (err, data) => {
      if (err || !data) return resolve(null);
      resolve(data);
    });
  });
}

// -------- Shopify (REST) --------
async function createProduct(productPayload) {
  const res = await fetch(
    `https://${SHOPIFY_DOMAIN}/admin/api/${API_VERSION}/products.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": SHOPIFY_TOKEN,
      },
      body: JSON.stringify({ product: productPayload }),
    }
  );
  const data = await res.json();
  if (!res.ok) throw new Error(JSON.stringify(data));
  return data.product;
}

// -------- Build payload from Sneaks --------
function buildProductPayload(raw, genders, goatImages) {
  const vendor = raw.brand?.trim() || "Unknown";
  const original = raw.shoeName || raw.title || "";
  const title = stripBrandFromTitle(original, vendor) || original || "Sneaker";
  const model = title.split(/["“”']/)[0].trim();
  const colorway = raw.colorway || "";
  const height = deriveHeight(original);
  const colors = colorsFromColorway(colorway);
  const material = raw.material || "";
  const styleID = (raw.styleID || slug(original).toUpperCase()).replace(/\s+/g, "");
  const price = Number(raw.retailPrice || 149.99);

  const { variants, options } = buildVariants({
    genders,
    price,
    styleID,
    vendor,
  });

  return {
    title,
    vendor,
    status: "active", // visible direct
    product_type: "sneakers",
    body_html: `${model}${colorway ? ` — ${colorway}` : ""}`,
    options,
    variants,
    images: buildImages(raw, goatImages),
    tags: buildTags({
      brand: vendor,
      modelName: model,
      height,
      genders,
      colors,
      material,
      styleID,
    }),
  };
}

// -------- Main --------
const SOURCES = [
  "Air Force 1",
  "Dunk Low",
  "Jordan 1",
  "Air Max 1",
  "Blazer",
  "Stan Smith",
  "Gazelle",
  "Yeezy",
  "New Balance 550",
  "Vans Old Skool",
];

(async function run() {
  if (!SHOPIFY_DOMAIN || !SHOPIFY_TOKEN) {
    console.error("❌ Missing SHOPIFY_DOMAIN or SHOPIFY_TOKEN in .env");
    process.exit(1);
  }

  console.log(`🎯 Import de ${TARGET} paires (sans vérification d'existant)…`);
  const seen = new Set();
  const picked = [];
  const perQuery = Math.ceil(TARGET / SOURCES.length);

  // 1) Collecter des candidats uniques par styleID
  for (let i = 0; i < SOURCES.length && picked.length < TARGET; i++) {
    const q = SOURCES[i];
    const limit = Math.min(perQuery, TARGET - picked.length) || perQuery;
    const batch = await sneaksGetProducts(q, Math.max(limit, 10));
    for (const p of batch) {
      const styleID =
        (p.styleID || slug(p.shoeName || p.title || "").toUpperCase()).replace(/\s+/g, "");
      if (seen.has(styleID)) continue;
      seen.add(styleID);
      picked.push(p);
      if (picked.length >= TARGET) break;
    }
    await sleep(300);
  }

  console.log(`🧾 Candidats retenus: ${picked.length}`);

  // 2) Créer les produits
  let created = 0,
    failed = 0;
  for (const raw of picked) {
    const genders = detectGenders(raw);
    let goatLinks = [];
    try {
      const priceData = await sneaksGetProductPrices(raw.styleID);
      if (
        priceData &&
        priceData.product &&
        priceData.product.goat &&
        Array.isArray(priceData.product.goat.imageLinks)
      ) {
        goatLinks = priceData.product.goat.imageLinks;
      }
    } catch {
      // ignore
    }

    const payload = buildProductPayload(raw, genders, goatLinks);
    try {
      const prod = await createProduct(payload);
      created++;
      console.log(`✅ ${created}/${TARGET} → ${prod.title} (${prod.id})`);
      await sleep(450); // throttle REST
    } catch (e) {
      failed++;
      console.error("❌ Échec création:", e.message || e);
      await sleep(600);
    }
  }

  console.log(`\n✅ Créés: ${created}   ❌ Échecs: ${failed}`);
  if (created < TARGET) {
    console.log("ℹ️ Astuce: ajoute d'autres requêtes dans SOURCES pour atteindre 100.");
  }
})().catch((e) => {
  console.error("Fatal:", e);
  process.exit(1);
});
