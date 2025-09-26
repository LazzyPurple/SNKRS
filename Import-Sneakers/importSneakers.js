// scripts/importSneakers.js
// Node >= 18 (fetch global). Deps: sneaks-api, dotenv
import "dotenv/config";
import SneaksAPI from "sneaks-api";

const sneaks = new SneaksAPI();
const SHOPIFY_DOMAIN = process.env.SHOPIFY_DOMAIN;
const SHOPIFY_TOKEN = process.env.SHOPIFY_TOKEN;
const API_VERSION = process.env.SHOPIFY_API_VERSION || "2024-07";

// ==== Objectifs par genre ====
// On vise 200 total (50/50/50/50), mais on FORCE Men à 50 même si ça fait baisser les autres bacs.
const QUOTAS = { Men: 50, Women: 50, Unisex: 50, Kids: 50 };
const TOTAL_TARGET = QUOTAS.Men + QUOTAS.Women + QUOTAS.Unisex + QUOTAS.Kids;

// Si true, on abort quand un bac < quota. Si false, on avertit mais on continue.
// D'après ta demande, on passe à false pour pouvoir siphonner vers Men.
const STRICT_QUOTAS = false;

// -------- utils --------
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const slug = (s = "") =>
  String(s)
    .toLowerCase()
    .normalize("NFKD")
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
  Women: ["6", "7", "8", "9", "10", "11"],
  Kids: ["3Y", "4Y", "5Y", "6Y", "7Y"],
};
const sizesForGender = (g) => SIZES[g] || [];

// === Détection (élargie) ===
function detectGenders(raw) {
  const s =
    `${raw.gender || ""} ${raw.silhouette || ""} ${raw.title || ""} ${raw.shoeName || ""} ${raw.styleID || ""}`
      .toLowerCase()
      .replace(/[\s_-]+/g, " ");

  const brand = normalizedBrand(raw);
  const G = new Set();

  // Kids
  if (/(kids|youth|grade school|gs|ps|td|toddler|infant|little kids|big kids|\b[3-7]y\b)/i.test(s))
    G.add("Kids");

  // Women
  if (/(wmns|wmn|\bw(?!\d)\b|women|female|ladies|\bfemmes?\b|\bgirl'?s?\b)/i.test(s))
    G.add("Women");

  // Men explicite
  if (/(men|male|\bhommes?\b|\bm\b)/i.test(s)) G.add("Men");

  // Unisex explicite
  if (/unisex/i.test(s)) {
    G.add("Men");
    G.add("Women");
  }

  // Heuristique silhouettes unisex
  const UNISEX_SILH = /(air force 1|af1|blazer|dunk|gazelle|campus|forum|samba|stan smith|superstar|chuck( 70| taylor)?|one star|old skool|authentic|era|sk8[- ]?hi)/i;
  if (UNISEX_SILH.test(s) && !G.has("Kids")) {
    G.add("Men");
    G.add("Women");
  }

  // Converse/Vans souvent unisex
  if ((brand === "converse" || brand === "vans") && !G.has("Kids")) {
    G.add("Men");
    G.add("Women");
  }

  // Jordan WMNS
  if (brand === "jordan" && !G.has("Kids")) {
    if (/wmns|women|w\b/.test(s)) G.add("Women");
  }

  // Fallback large → unisex
  if (!G.size) {
    G.add("Men");
    G.add("Women");
  }

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
          .replace(/\s+/g, "")
          .toUpperCase()}-${g[0]}${size}`,
        inventory_management: "SHOPIFY",
        inventory_policy: "continue", // Changed from "deny" to "continue"
        inventory_quantity: 10, // Add initial stock quantity
        requires_shipping: true,
        taxable: true,
      });
      sizeValues.add(size);
    }
  }

  const options = [
    { name: "Gender", values: genders },
    { name: "US Size", values: [...sizeValues] },
  ];
  return { variants, options };
}

// -------- Shopify REST --------
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
    status: "active",
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

  // unisex explicite si Men & Women sans Kids
  const setG = new Set(genders || []);
  if (setG.has("Men") && setG.has("Women") && !setG.has("Kids")) {
    tags.add("gender:unisex");
  }
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

// ====== Binning & brand filter ======
const BRAND_WHITELIST = new Set(["nike", "adidas", "jordan", "converse", "vans"]);

function normalizedBrand(p) {
  const b = (p.brand || "").toLowerCase().trim();
  if (!b) {
    const t = (p.title || p.shoeName || "").toLowerCase();
    if (/jordan/.test(t)) return "jordan";
    if (/nike/.test(t)) return "nike";
    if (/adidas/.test(t)) return "adidas";
    if (/converse/.test(t)) return "converse";
    if (/vans/.test(t)) return "vans";
    return "";
  }
  if (b.includes("air jordan")) return "jordan";
  return b;
}

const HYPE_RE =
  /(dunk|jordan 1|air force 1|af1|yeezy|gazelle|campus|forum|samba|stan smith|superstar|chuck( 70| taylor)?|one star|old skool|authentic|era|sk8[- ]?hi|blazer|air max)/i;
function hypeScore(p) {
  const s = `${p.title || ""} ${p.silhouette || ""}`;
  return HYPE_RE.test(s) ? 1 : 0;
}

// -------- SOURCES (élargies par vagues) --------
const SOURCES_STANDARD = [
  "Nike",
  "Adidas",
  "Jordan",
  "Converse",
  "Vans",
  "Dunk",
  "Jordan 1",
  "Air Force 1",
  "Blazer",
  "Air Max",
  "Gazelle",
  "Campus",
  "Forum",
  "Samba",
  "Stan Smith",
  "Superstar",
  "Chuck Taylor",
  "Chuck 70",
  "One Star",
  "Old Skool",
  "Authentic",
  "Era",
  "Sk8-Hi",
];

const SOURCES_WOMEN = [
  "WMNS",
  "Women",
  "Nike Women",
  "Nike WMNS",
  "Jordan WMNS",
  "Adidas Women",
  "Converse Women",
  "Vans Women",
  "Dunk Low WMNS",
  "AF1 WMNS",
  "Jordan 1 WMNS",
  "Gazelle Women",
  "Stan Smith Women",
  "Campus Women",
  "Samba Women",
  "Forum Women",
  "Chuck Taylor Women",
  "Old Skool Women",
];

const SOURCES_KIDS = [
  "Kids",
  "Youth",
  "Grade School",
  "GS",
  "PS",
  "TD",
  "Toddler",
  "Little Kids",
  "Big Kids",
  "Jordan GS",
  "Nike GS",
  "Adidas Kids",
  "Converse Kids",
  "Vans Kids",
  "Dunk GS",
  "AF1 GS",
  "Jordan 1 GS",
  "Gazelle Kids",
  "Stan Smith Kids",
  "Old Skool Kids",
];

const SOURCES_UNISEX = [
  "Unisex",
  "Nike Unisex",
  "Adidas Unisex",
  "Converse Unisex",
  "Vans Unisex",
  "AF1 Unisex",
  "Blazer Unisex",
  "Dunk Unisex",
  "Gazelle Unisex",
  "Stan Smith Unisex",
  "Samba Unisex",
  "Campus Unisex",
  "Forum Unisex",
  "Chuck Taylor Unisex",
  "Old Skool Unisex",
];

const SOURCES_WIDE = [
  ...SOURCES_STANDARD,
  "Women's Sneakers",
  "Girls Sneakers",
  "Boys Sneakers",
  "Youth Sneakers",
  "Ladies Sneakers",
  "Women WMNS",
];

// -------- Main --------
(async function run() {
  if (!SHOPIFY_DOMAIN || !SHOPIFY_TOKEN) {
    console.error("❌ Missing SHOPIFY_DOMAIN or SHOPIFY_TOKEN in .env");
    process.exit(1);
  }

  console.log(
    `🎯 Objectif: ${TOTAL_TARGET} produits (Men ${QUOTAS.Men}, Women ${QUOTAS.Women}, Unisex ${QUOTAS.Unisex}, Kids ${QUOTAS.Kids})`
  );

  const seen = new Set();
  const bins = { Men: [], Women: [], Unisex: [], Kids: [] };
  const quotasReached = () =>
    bins.Men.length >= QUOTAS.Men &&
    bins.Women.length >= QUOTAS.Women &&
    bins.Unisex.length >= QUOTAS.Unisex &&
    bins.Kids.length >= QUOTAS.Kids;

  async function harvest(sources, perQuery) {
    for (let i = 0; i < sources.length && !quotasReached(); i++) {
      const q = sources[i];
      try {
        const batch = await sneaksGetProducts(q, perQuery);
        for (const p of batch) {
          const styleID = (p.styleID || slug(p.shoeName || p.title || "").toUpperCase()).replace(
            /\s+/g,
            ""
          );
          if (seen.has(styleID)) continue;

          const nb = normalizedBrand(p);
          if (!BRAND_WHITELIST.has(nb)) continue;

          const genders = detectGenders(p);
          const bin = decideBin(genders);
          // on laisse grossir les bacs (on coupera ensuite)
          seen.add(styleID);
          bins[bin].push({ raw: p, styleID, genders, hype: hypeScore(p) });
        }
      } catch (e) {
        console.warn("⚠️ Sneaks batch error for", q, e?.message || e);
      }
      await sleep(150);
      if (quotasReached()) break;
    }
  }

  // Vagues de collecte
  await harvest(SOURCES_STANDARD, 120);
  if (!quotasReached() && bins.Women.length < QUOTAS.Women) {
    console.log("➕ Vague WOMEN…");
    await harvest(SOURCES_WOMEN, 160);
  }
  if (!quotasReached() && bins.Kids.length < QUOTAS.Kids) {
    console.log("➕ Vague KIDS…");
    await harvest(SOURCES_KIDS, 160);
  }
  if (!quotasReached() && bins.Unisex.length < QUOTAS.Unisex) {
    console.log("➕ Vague UNISEX…");
    await harvest(SOURCES_UNISEX, 160);
  }
  if (!quotasReached()) {
    console.log("➕ Vague WIDE (large filet)…");
    await harvest(SOURCES_WIDE, 180);
  }

  // Tri hype & buffer 2x quotas
  for (const key of /** @type {const} */ (["Men", "Women", "Unisex", "Kids"])) {
    bins[key].sort((a, b) => b.hype - a.hype);
    bins[key] = bins[key].slice(0, QUOTAS[key] * 2); // garder du rab
  }

  // === Reclassements "classiques" pour combler WOMEN/UNISEX/KIDS depuis MEN, si possible ===
  const deficit = (k) => Math.max(0, QUOTAS[k] - bins[k].length);
  const pickFrom = (arr, n, predicate) => {
    const out = [];
    for (const item of arr) {
      if (out.length >= n) break;
      if (!predicate || predicate(item)) out.push(item);
    }
    return out;
  };

  // 1) Remplir UNISEX avec MEN "unisexables"
  let needU = deficit("Unisex");
  if (needU > 0 && bins.Men.length > QUOTAS.Men) {
    const menPool = bins.Men.filter((x) => {
      const s = `${x.raw.title || ""} ${x.raw.silhouette || ""}`.toLowerCase();
      return /(air force 1|af1|blazer|dunk|gazelle|campus|forum|samba|stan smith|superstar|chuck|old skool|authentic|era|sk8[- ]?hi)/i.test(
        s
      );
    });
    const moved = pickFrom(menPool, needU);
    const movedSet = new Set(moved.map((m) => m.styleID));
    for (const m of moved) bins.Unisex.push({ ...m, genders: ["Men", "Women"] });
    bins.Men = bins.Men.filter((m) => !movedSet.has(m.styleID));
  }

  // 2) Remplir WOMEN depuis MEN si surplus
  let needW = deficit("Women");
  if (needW > 0 && bins.Men.length > QUOTAS.Men) {
    const moved = pickFrom(bins.Men, needW);
    const movedSet = new Set(moved.map((m) => m.styleID));
    for (const m of moved) bins.Women.push({ ...m, genders: ["Women"] });
    bins.Men = bins.Men.filter((m) => !movedSet.has(m.styleID));
  }

  // 3) Remplir KIDS depuis MEN/UNISEX si GS-like
  let needK = deficit("Kids");
  if (needK > 0) {
    const pool = [...bins.Men, ...bins.Unisex].filter((x) => {
      const s = `${x.raw.styleID || ""} ${x.raw.title || ""}`.toLowerCase();
      return /(gs|ps|td|\b(3|4|5|6|7)y\b|grade school|youth|kids)/i.test(s);
    });
    const moved = pickFrom(pool, needK);
    const movedSet = new Set(moved.map((m) => m.styleID));
    for (const m of moved) bins.Kids.push({ ...m, genders: ["Kids"] });
    bins.Men = bins.Men.filter((m) => !movedSet.has(m.styleID));
    bins.Unisex = bins.Unisex.filter((m) => !movedSet.has(m.styleID));
  }

  // === NOUVEAU : Forcer Men à 50 en siphonnant Unisex -> Women -> Kids (comme demandé) ===
  const needMen = Math.max(0, QUOTAS.Men - bins.Men.length);

  function siphonToMen(fromKey, n) {
    if (n <= 0) return 0;
    const take = Math.min(n, bins[fromKey].length);
    if (!take) return 0;
    const moved = bins[fromKey].splice(0, take); // déjà triés par hype
    for (const m of moved) {
      bins.Men.push({ ...m, genders: ["Men"] }); // override genre -> Men
    }
    return take;
  }

  let remaining = needMen - siphonToMen("Unisex", needMen);
  if (remaining > 0) remaining -= siphonToMen("Women", remaining);
  if (remaining > 0) remaining -= siphonToMen("Kids", remaining); // dernier recours

  // === Couper à quota "cible" pour chaque bac, MAIS on n'abort pas si < quota (STRICT_QUOTAS=false) ===
  for (const key of /** @type {const} */ (["Men", "Women", "Unisex", "Kids"])) {
    bins[key].sort((a, b) => b.hype - a.hype);
    bins[key] = bins[key].slice(0, QUOTAS[key]); // coupe dur à la cible (ou moins si pas assez)
  }

  // Diagnostics finaux
  const counts = {
    Men: bins.Men.length,
    Women: bins.Women.length,
    Unisex: bins.Unisex.length,
    Kids: bins.Kids.length,
  };
  console.log(
    `🧾 Candidats retenus → Men:${counts.Men} Women:${counts.Women} Unisex:${counts.Unisex} Kids:${counts.Kids}`
  );

  if (STRICT_QUOTAS) {
    const shortage = [];
    for (const k of Object.keys(QUOTAS)) {
      if (bins[k].length < QUOTAS[k]) shortage.push(`${k} (${bins[k].length}/${QUOTAS[k]})`);
    }
    if (shortage.length) {
      console.error("❌ Quotas insuffisants:", shortage.join(", "));
      process.exit(1);
    }
  } else {
    const warns = [];
    for (const k of Object.keys(QUOTAS)) {
      if (bins[k].length < QUOTAS[k]) warns.push(`${k} (${bins[k].length}/${QUOTAS[k]})`);
    }
    if (warns.length) {
      console.warn(
        "⚠️ Quotas non atteints (on poursuit quand même comme demandé):",
        warns.join(", ")
      );
    }
  }

  // Construire la liste finale à créer
  const finalList = [];
  for (const key of /** @type {const} */ (["Men", "Women", "Unisex", "Kids"])) {
    finalList.push(...bins[key]);
  }

  console.log(`🚀 Création Shopify de ${finalList.length} produits…`);
  let created = 0;
  let failed = 0;

  for (let i = 0; i < finalList.length; i++) {
    const { raw, genders, styleID } = finalList[i];

    // Option: images GOAT (visuels souvent “hype”)
    let goatLinks = null;
    try {
      const priceData = await sneaksGetProductPrices(styleID);
      if (
        priceData?.product?.goat?.imageLinks &&
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
      console.log(`✅ ${created}/${finalList.length} → ${prod.title} (${prod.id})`);
      await sleep(420); // throttle REST
    } catch (e) {
      failed++;
      console.error("❌ Échec création:", e.message || e);
      await sleep(600);
    }
  }

  console.log(`\n✅ Créés: ${created}   ❌ Échecs: ${failed}`);
  if (created < TOTAL_TARGET) {
    console.log(
      "ℹ️ Total < 200 : élargis encore les SOURCES_* ou relance avec des perQuery plus élevés."
    );
  }
})().catch((e) => {
  console.error("Fatal:", e);
  process.exit(1);
});

// ---------- Helpers de binning ----------
function decideBin(genders) {
  const set = new Set(genders);
  if (set.has("Kids")) return "Kids";
  const hasMen = set.has("Men");
  const hasWomen = set.has("Women");
  if (hasMen && hasWomen) return "Unisex";
  if (hasWomen) return "Women";
  return "Men";
}
