const fetchCategories = async (
  setCategories,
  setLoading,
) => {
  try {
    const response = await fetch("http://localhost:8000/api/v1/categories", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    const data = await response.json();

    const categories = Array.isArray(data.category)
    ? data.category.sort((a, b) => a.name.localeCompare(b.name))
    : [];

    const productsResponse = await fetch("http://localhost:8000/api/v1/products", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    const productsData = await productsResponse.json();

    const products = Array.isArray(productsData) ? productsData : [];

    const updatedCategories = categories.map(category => {
      const productCount = products.filter(product => 
        product.categories.some(cat => cat._id === category._id)
      ).length;
      return { ...category, productCount };
    });

    setCategories(updatedCategories);
    setLoading(false);
  } catch (error) {
    console.error("Error fetching categories:", error);
    setCategories([]);
    setLoading(false);
  }
};

export default fetchCategories;