const handleUpdateProduct = async (
  updatedProductData, 
  productToUpdate, 
  setProducts, 
  setShowUpdatePopup, 
  setErrorMessage, 
  setSessionExpired,
  setLoading,
) => {
  setLoading(true);
  try {
    const response = await fetch(
      `http://localhost:8000/api/v1/products/${productToUpdate.id}/admin`,
      {
        method: "PUT",
        body: updatedProductData,
        credentials: "include",
      }
    );

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
      throw new Error("Failed to update product");
    }

    const updatedProduct = await response.json();

    setProducts((prevProducts) => {
      const updatedProducts = prevProducts.map((product) =>
        product.id === updatedProduct.id
          ? {
              ...updatedProduct,
              categories: updatedProduct.categories ? updatedProduct.categories : [],
              colors: updatedProduct.colors ? updatedProduct.colors : [],
              sizes: updatedProduct.sizes ? updatedProduct.sizes : [],
            }
          : product
      );

      return updatedProducts.sort((a, b) => a.name.localeCompare(b.name));
    });

    setTimeout(() => {
      const element = document.getElementById(`product-${updatedProduct.id}`);
    if (element) {
      element.classList.add("highlighted-row");
      setTimeout(() => {
        element.classList.remove("highlighted-row");
      }, 1000);
    }
    },0)
  
    setShowUpdatePopup(false);
    setLoading(false);
    setErrorMessage("");
  } catch (error) {
    console.error("Error updating product:", error);
    setErrorMessage("An error occurred while updating the product.");
  }
};

export default handleUpdateProduct;