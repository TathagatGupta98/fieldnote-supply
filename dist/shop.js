"use strict";

const storageKey = "fieldnote.saved.v1";
const bookmark = '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M6 4h12v17l-6-4-6 4z"/></svg>';
const byId = (id) => document.getElementById(id);
const products = [...document.querySelectorAll(".product")].map((card) => ({
  card,
  id: card.dataset.id,
  category: card.dataset.category,
  description: card.dataset.description,
  title: card.querySelector("h3").textContent,
  price: card.querySelector(".price").textContent,
  variant: card.querySelector(".variant").textContent,
  image: card.querySelector("img"),
  save: card.querySelector(".save-item")
}));

let canPersist = true;
const favorites = new Set();
try {
  const previous = JSON.parse(localStorage.getItem(storageKey) ?? "[]");
  if (Array.isArray(previous)) {
    for (const product of products) if (previous.includes(product.id)) favorites.add(product.id);
  }
} catch {
  canPersist = false;
}

const details = byId("details");
const saved = byId("saved");
const savedList = byId("saved-list");
const detailSave = byId("detail-save");
const filters = [...document.querySelectorAll("[data-filter]")];
let currentProduct;

function updateButtons() {
  byId("saved-count").textContent = favorites.size;
  for (const product of products) {
    const isSaved = favorites.has(product.id);
    product.save.setAttribute("aria-pressed", isSaved);
    product.save.setAttribute("aria-label", `Save ${product.title}`);
  }
  if (currentProduct) {
    const isSaved = favorites.has(currentProduct.id);
    detailSave.textContent = isSaved ? "Remove from saved" : "Save for later";
  }
}

function toggleSaved(product) {
  const isSaved = !favorites.has(product.id);
  if (isSaved) favorites.add(product.id);
  else favorites.delete(product.id);
  if (canPersist) {
    try {
      localStorage.setItem(storageKey, JSON.stringify([...favorites]));
    } catch {
      canPersist = false;
    }
  }
  updateButtons();
  byId("announcement").textContent = `${product.title} ${isSaved ? "saved" : "removed from saved items"}.`;
}

function openProduct(product) {
  currentProduct = product;
  const image = byId("detail-image");
  image.src = product.image.src;
  image.alt = product.image.alt;
  byId("detail-title").textContent = product.title;
  byId("detail-meta").textContent = `${product.category.toUpperCase()} / ${product.price}`;
  byId("detail-description").textContent = `${product.variant}. ${product.description}`;
  updateButtons();
  details.showModal();
}

function renderSaved() {
  savedList.replaceChildren();
  const items = products.filter((product) => favorites.has(product.id));
  byId("saved-note").textContent = items.length
    ? (canPersist ? "Saved items stay in this browser." : "Saved items are available until you leave this page.")
    : "Nothing saved yet. Use the bookmark on any product to keep it here.";
  for (const [index, product] of items.entries()) {
    const item = document.createElement("li");
    const image = new Image();
    image.src = product.image.src;
    image.alt = "";
    const label = document.createElement("div");
    const name = document.createElement("strong");
    name.textContent = product.title;
    const price = document.createElement("small");
    price.textContent = product.price;
    label.append(name, price);
    const remove = document.createElement("button");
    remove.type = "button";
    remove.textContent = "Remove";
    remove.setAttribute("aria-label", `Remove ${product.title} from saved items`);
    remove.addEventListener("click", () => {
      toggleSaved(product);
      renderSaved();
      const buttons = savedList.querySelectorAll("button");
      (buttons[Math.min(index, buttons.length - 1)] ?? saved.querySelector("form:last-child button")).focus();
    });
    item.append(image, label, remove);
    savedList.append(item);
  }
}

for (const product of products) {
  product.save.innerHTML = bookmark;
  product.save.addEventListener("click", () => toggleSaved(product));
  for (const button of product.card.querySelectorAll(".product-open, .product-name")) {
    button.addEventListener("click", () => openProduct(product));
  }
}

for (const filter of filters) {
  filter.addEventListener("click", () => {
    const category = filter.dataset.filter;
    let count = 0;
    for (const product of products) {
      product.card.hidden = category !== "All" && product.category !== category;
      if (!product.card.hidden) count += 1;
    }
    for (const button of filters) button.setAttribute("aria-pressed", button === filter);
    byId("product-count").textContent = `${String(count).padStart(2, "0")} ${count === 1 ? "GOOD" : "GOODS"}`;
    byId("announcement").textContent = `Showing ${count} ${count === 1 ? "product" : "products"}.`;
  });
}

detailSave.addEventListener("click", () => toggleSaved(currentProduct));
byId("open-saved").addEventListener("click", () => {
  renderSaved();
  saved.showModal();
});
updateButtons();
