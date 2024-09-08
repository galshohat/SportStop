const fetchProductsByCategory = async (categoryId, setProductsToDelete, setLoading) => {
    try {
        setLoading(true);
        const response = await fetch(
            `http://localhost:8000/api/v1/categories/${categoryId}/products`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            }
        );
        const data = await response.json();

        if (response.ok) {
            setProductsToDelete(data.products || []);
        } else {
            setProductsToDelete([]);
        }
    } catch (error) {
        console.error("Error fetching products:", error);
        setProductsToDelete([]);
    } finally {
        setLoading(false);
    }
};

export default fetchProductsByCategory;