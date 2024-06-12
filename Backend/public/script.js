let addProductForm = document.getElementById("addProductForm");
addProductForm.addEventListener("submit", async (event) => {
  event.preventDefault(); // Prevent default form submission

  const formData = new FormData(addProductForm); // Extract form data

  const product = {
    name: formData.get("name"),
    title: formData.get("title"),
    content: formData.get("content"),
    imageUrl: formData.get("imageUrl"),
    price: formData.get("price"),
    quantity: formData.get("quantity"),
  };

  try {
    const response = await axios.post(
      "http://localhost:5000/api/products",
      product
    );
    console.log("Product added:", response.data);

    // Clear form fields and refetch products to update UI
    addProductForm.reset();
    fetchProducts();
  } catch (error) {
    console.error("Error adding product:", error);
    // Handle potential errors (e.g., display error message to user)
  }
});
