const handleDeleteCategory = async (
    categoryToDelete,
    setCategories,
    currentCategories,
    setCurrentPage,
    currentPage,
    setShowDeletePopup,
  setProducts,
    setSessionExpired
  ) => {
    try {

      const response = await fetch(
        `http://localhost:8000/api/v1/categories/${categoryToDelete.id}/admin`,
        {
          method: 'DELETE',
          credentials: 'include',
        }
      );
  

      if (response.status === 401) {
        setSessionExpired(true);
        return;
      }
  
      if (!response.ok) {
        console.error('Failed to delete category:', await response.text());
        return;
      }
  
      setCategories((prevCategories) => {
        if (Array.isArray(prevCategories)) {
          const updatedCategories = prevCategories.filter(
            (category) => category.id !== categoryToDelete.id
          );
          return updatedCategories.sort((a, b) => a.name.localeCompare(b.name));
        } else {
          return [];
        }
      });
  
      setProducts((prevProducts) => {
        if (Array.isArray(prevProducts)) {
          const updatedProducts = prevProducts.filter(
            (product) =>
              !product.categories.some(
                (category) => category.id === categoryToDelete.id
              )
          );
          return updatedProducts.sort((a, b) => a.name.localeCompare(b.name));
        } else {
          return [];
        }
      });
  
      setShowDeletePopup(false);
      if (currentCategories.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };
  
  export default handleDeleteCategory;