import "dotenv/config";
import fetch from "node-fetch";
import SneaksAPI from "sneaks-api";

const sneaks = new SneaksAPI();

// 👉 Mets ton store + ton Admin API Access Token
const SHOPIFY_DOMAIN = process.env.SHOPIFY_DOMAIN;
const SHOPIFY_TOKEN = process.env.SHOPIFY_TOKEN;

async function addProductToShopify(product) {
  try {
    // 👉 Création des variantes tailles 40 à 47
    const variants = [];
    for (let size = 40; size <= 47; size++) {
      variants.push({
        option1: size.toString(),
        price: product.retailPrice || 120,
        inventory_quantity: 10,
      });
    }

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
      console.log(`✅ Produit ajouté : ${data.product.title}`);
    } else {
      console.error("❌ Erreur Shopify :", JSON.stringify(data, null, 2));
    }
  } catch (err) {
    console.error("❌ Erreur réseau :", err);
  }
}

// --- Import ciblé sur Air Force 1 ---
sneaks.getProducts("Air Force 1", 5, async (err, products) => {
  if (err) return console.error("❌ Erreur Sneaks API :", err);

  for (const p of products) {
    await addProductToShopify(p);
    await new Promise((resolve) => setTimeout(resolve, 500)); // éviter de spammer Shopify
  }
});
