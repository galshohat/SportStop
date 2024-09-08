const fetchProducts = async (
  setProducts,
  setLoading,
  isStock
) => {
  setLoading(true);
  try {
    const response = await fetch("http://localhost:8000/api/v1/products", {
      method: "GET",
      credentials: "include",
    });

    const data = await response.json();
    const transformedProducts = data.map((product) => ({
      ...product,
      categories: product.categories ? product.categories : [],
      colors: product.colors ? product.colors : [],
      sizes: product.sizes ? product.sizes : [],
    }));

    let sortedProducts = transformedProducts.sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    if (isStock) {
      sortedProducts = sortedProducts.filter(
        (product) => product.countStock > 0
      );
      setProducts(sortedProducts);
    } else {
      setProducts(sortedProducts);
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    setProducts([]);
  } finally {
    setLoading(false);
  }
};

export default fetchProducts;
