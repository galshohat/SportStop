const handleAddProduct = async (
  formData,
  setProducts,
  setShowPopup,
  setErrorMessage,
  setSessionExpired,
  setLoading,
  setHighlightedProductId
) => {
  setLoading(true);
  try {
    const response = await fetch("http://localhost:8000/api/v1/products/admin", {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    if (response.status === 401) {
      setSessionExpired(true);
      return;
    }

    if (!response.ok) {
      const responseText = await response.text();
      if (responseText.includes("A product with this name already exists")) {
        setErrorMessage("This product already exists. Choose another name.");
        return;
      }
      if (responseText.includes("Invalid")) {
        setErrorMessage("Only allowed to upload images PNG / JPEG / JPG");
        return;
      }
      throw new Error("Failed to add product");
    }

    const newProduct = await response.json();

    setProducts((prevProducts) => {
      const updatedProducts = [...prevProducts, newProduct];
      return updatedProducts.sort((a, b) => a.name.localeCompare(b.name));
    });

    setHighlightedProductId((prevIds) => {
      const updatedIds = [...prevIds, newProduct.id];

      const storedIds = JSON.parse(localStorage.getItem("highlightedIds")) || [];
      const newStoredIds = [...storedIds, newProduct.id];
      localStorage.setItem("highlightedIds", JSON.stringify(newStoredIds));

      return updatedIds;
    });

    setShowPopup(false);
    setErrorMessage("");
  } catch (error) {
    console.error("Error adding product:", error);
    setErrorMessage("An error occurred while adding the product.");
  } finally {
    setLoading(false);
  }
};

export default handleAddProduct;