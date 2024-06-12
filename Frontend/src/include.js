// include.js
function loadHTML(url, elementId) {
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.text();
    })
    .then((data) => {
      document.getElementById(elementId).innerHTML = data;
      if (elementId === "header-container") {
        initializeCartFunctionality(); // Initialize cart functionality after loading the header
      }
    })
    .catch((error) => {
      console.error(
        "There has been a problem with your fetch operation:",
        error
      );
    });
}

function initializeCartFunctionality() {
  const cartLink = document.getElementById("cart");
  if (cartLink) {
    cartLink.addEventListener("click", (event) => {
      event.preventDefault();
      toggleCartOverlay();
    });
  }
  setupAddToCartButtons();
}

function setupAddToCartButtons() {
  const cartButtons = document.querySelectorAll(".add-to-cart");
  cartButtons.forEach((button) => {
    button.addEventListener("click", addToCart);
  });
}

function addToCart(event) {
  event.preventDefault();
  const itemElement = event.target.closest(".card");
  const itemTitle = itemElement.querySelector(".card-title").textContent;
  const itemPrice = itemElement.querySelector(".card-price").textContent;
  const itemImage = itemElement.querySelector(".card-image").src;
  addItemToCart(itemTitle, itemPrice, itemImage);
}

let cart = [];

function addItemToCart(title, price, image) {
  const item = cart.find((item) => item.title === title);
  if (item) {
    item.quantity++;
  } else {
    cart.push({ title, price, image, quantity: 1 });
  }
  updateCartCount();
  updateCartOverlay();
}

function updateCartCount() {
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  document.getElementById("cart-count").textContent = cartCount;
}

function updateCartOverlay() {
  const cartItemsContainer = document.getElementById("cart-items");
  cartItemsContainer.innerHTML = "";
  cart.forEach((item) => {
    const cartItem = document.createElement("div");
    cartItem.className =
      "cart-item flex justify-between items-center p-4 border-b";
    cartItem.innerHTML = `
      <img src="${item.image}" alt="${item.title}" class="w-16 h-16 object-cover">
      <div class="flex-1 ml-4">
        <h4 class="text-lg font-semibold">${item.title}</h4>
        <p class="text-sm text-gray-600">${item.price}</p>
      </div>
      <div class="flex items-center">
        <span class="text-lg font-semibold">${item.quantity}</span>
      </div>
    `;
    cartItemsContainer.appendChild(cartItem);
  });
}

function toggleCartOverlay() {
  const cartOverlay = document.getElementById("cart-overlay");
  cartOverlay.classList.toggle("hidden");
}

document.addEventListener("DOMContentLoaded", () => {
  loadHTML("header.html", "header-container");
  loadHTML("footer.html", "footer-container");
});
