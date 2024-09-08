const handleDeleteProduct = async (productToDelete, setProducts, currentProducts, setCurrentPage, currentPage, setShowDeletePopup, setSessionExpired, setLoading) => {
    setLoading(true);
    try {
        const response = await fetch(`http://localhost:8000/api/v1/products/${productToDelete.id}/admin`, {
            method: 'DELETE',
            credentials: 'include',
        });

        if (response.status === 401) {
            setSessionExpired(true);
            setLoading(false);
            return;
        }

        if (!response.ok) {
            console.error('Failed to delete product');
            setLoading(false);
            return;
        }

        setProducts(prevProducts => prevProducts.filter(product => product.id !== productToDelete.id));
        if (currentProducts.length === 1 && currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
        setShowDeletePopup(false);
        setLoading(false);
    } catch (error) {
        console.error('Error deleting product:', error);
        setLoading(false);
    }
};

export default handleDeleteProduct;