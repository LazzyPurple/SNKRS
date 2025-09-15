import "dotenv/config";
import SneaksAPI from "sneaks-api";

const sneaks = new SneaksAPI();
const SHOPIFY_DOMAIN = process.env.SHOPIFY_DOMAIN;
const SHOPIFY_TOKEN = process.env.SHOPIFY_TOKEN;

// --- Générateur de tailles ---
function generateVariants(type, price) {
  let sizes = [];
  if (type === "homme") sizes = [40, 41, 42, 43, 44, 45, 46, 47];
  if (type === "femme") sizes = [36, 37, 38, 39, 40, 41, 42];
  if (type === "enfant") sizes = [28, 29, 30, 31, 32, 33, 34, 35, 36];

  return sizes.map((size) => ({
    option1: size.toString(),
    price: price || 100,
    inventory_quantity: 5,
  }));
}

// --- Ajout Shopify ---
async function addProduct(product, type = "homme") {
  const variants = generateVariants(type, product.retailPrice);

  const res = await fetch(
    `https://${SHOPIFY_DOMAIN}/admin/api/2023-07/products.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": SHOPIFY_TOKEN,
      },
      body: JSON.stringify({
        product: {
          title: product.shoeName,
          vendor: product.brand,
          body_html: `${product.silhouette} - ${product.colorway}`,
          options: [{ name: "Taille" }],
          variants,
          images: [{ src: product.thumbnail }],
        },
      }),
    }
  );

  const data = await res.json();
  if (res.ok && data.product) {
    console.log(`✅ Ajouté : ${data.product.title}`);
  } else {
    console.error("❌ Erreur Shopify :", JSON.stringify(data, null, 2));
  }
}

// --- Import Sneaks API ---
function importSneakers(query, limit = 3, type = "homme") {
  sneaks.getProducts(query, limit, async (err, products) => {
    if (err) return console.error(err);
    for (const p of products) {
      await addProduct(p, type);
      await new Promise((res) => setTimeout(res, 500));
    }
  });
}

// --- 20 produits : mix iconiques + tendances ---
importSneakers("Air Force 1", 3, "homme");
importSneakers("Stan Smith", 3, "femme");
importSneakers("Dunk Low", 3, "homme");
importSneakers("Superstar", 3, "femme");
importSneakers("Jordan 1", 3, "homme");
importSneakers("Vans Old Skool", 3, "enfant");
importSneakers("New Balance 550", 2, "homme");
