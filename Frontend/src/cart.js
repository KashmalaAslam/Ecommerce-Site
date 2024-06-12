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

// ================================================================================
//                      STORING DATA IN LOCAL STORAGE
// ================================================================================
fetch("usingLocalStorage.json")
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    localStorage.setItem("products", JSON.stringify(data));
    if (!localStorage.getItem("cart")) {
      localStorage.setItem("cart", "[]");
    }
  });

let products = JSON.parse(localStorage.getItem("products"));
let cart = JSON.parse(localStorage.getItem("cart"));

function initializeCartFunctionality() {
  const cartLink = document.getElementById("cart");
  if (cartLink) {
    cartLink.addEventListener("click", (event) => {
      event.preventDefault();
      toggleCartOverlay();
    });
  }
  setupAddToCartButtons();
  updateCartCount();
  updateCartOverlay();
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
  const itemId = event.target.getAttribute("data-id");
  addItemToCart(itemTitle, itemPrice, itemImage, itemId);
}

function addItemToCart(title, price, image, id) {
  const item = cart.find((item) => item.title === title);
  if (item) {
    item.quantity++;
  } else {
    const product = products.find((item) => item.id == id);
    cart.push({ ...product, id, title, price, image, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
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
  cart.forEach((item, index) => {
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
        <button class="increase-quantity mx-4 font-bold text-xl" data-index="${index}">+</button>
        <span class="text-lg font-semibold">${item.quantity}</span>
        <button class="decrease-quantity mx-4 font-bold text-xl" data-index="${index}">-</button>
      </div>
    `;
    cartItemsContainer.appendChild(cartItem);
  });

  document.querySelectorAll(".increase-quantity").forEach((button) => {
    button.addEventListener("click", increaseQuantity);
  });

  document.querySelectorAll(".decrease-quantity").forEach((button) => {
    button.addEventListener("click", decreaseQuantity);
  });
}

function increaseQuantity(event) {
  const index = event.target.dataset.index;
  cart[index].quantity++;
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  updateCartOverlay();
}

function decreaseQuantity(event) {
  const index = event.target.dataset.index;
  if (cart[index].quantity > 1) {
    cart[index].quantity--;
  } else {
    cart.splice(index, 1);
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  updateCartOverlay();
}

function toggleCartOverlay() {
  const cartOverlay = document.getElementById("cart-overlay");
  cartOverlay.classList.toggle("hidden");
}

document.addEventListener("DOMContentLoaded", () => {
  loadHTML("header.html", "header-container");
  loadHTML("footer.html", "footer-container");
  initializeCartFunctionality();
});

// CheckOut Page
function displayCartItemsOnCheckoutPage() {
  const cartItemsContainer = document.querySelector(".cartItems");
  const subtotal = document.getElementById("Subtotal");
  const shippingFee = "$8.00";
  const total = document.getElementById("total");
  if (!cartItemsContainer) return;

  console.log(shipping.text);
  cartItemsContainer.innerHTML = "";
  let totalAmount = 0;
  cart.forEach((item) => {
    const cartItem = document.createElement("div");
    cartItem.className =
      "cart-item flex justify-between items-center p-4 border-b";
    cartItem.innerHTML = `
      <img src="${item.image}" alt="${item.title}" class="w-16 h-16 object-cover">
      <div class="flex-1 ml-4">
        <h4 class="text-lg font-semibold">${item.title}</h4>
        <p class="text-sm text-gray-600">${item.price}</p>
        <span class="text-lg font-semibold">Quantity: ${item.quantity}</span>
      </div>
    `;
    cartItemsContainer.appendChild(cartItem);

    // Calculate the total amount
    const itemPrice = parseFloat(item.price.replace(/[^0-9.-]+/g, ""));
    totalAmount += itemPrice * item.quantity;
    subtotal.innerText = `$${totalAmount.toFixed(2)}`;
    const amount = totalAmount + 8.0;
    total.innerText = `$${amount.toFixed(2)}`;
  });

  // Display the total amount
  const totalAmountElement = document.createElement("div");
  totalAmountElement.className =
    "total-amount text-right p-4 text-xl font-bold";
  totalAmountElement.textContent = `Total: $${totalAmount.toFixed(2)}`;
  cartItemsContainer.appendChild(totalAmountElement);
}
