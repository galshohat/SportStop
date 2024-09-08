const handleUpdateCategory = async (
  updatedName,
  categoryToUpdate,
  setCategories,
  setShowUpdatePopup,
  setErrorMessage,
  setSessionExpired
) => {
  if (!categoryToUpdate || categoryToUpdate.name === updatedName) return;

  try {
    const response = await fetch(
      `http://localhost:8000/api/v1/categories/${categoryToUpdate.id}/admin`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: updatedName }),
        credentials: "include",
      }
    );

    if (response.status === 401) {
      setSessionExpired(true);
      return;
    }

    const responseText = await response.clone().text();
    if (responseText.includes("A category with this name already exists")) {
      setErrorMessage("This category already exists. Choose another name.");
      return;
    }

    if (!response.ok) {
      console.error("Failed to update category:", responseText);
      return;
    }

    const updatedCategory = await response.json();
    console.log("Category updated:", updatedCategory);

    setCategories((prevCategories) => {
      const updatedCategories = prevCategories.map((category) =>
        category.id === updatedCategory.id ? updatedCategory : category
      );

      return updatedCategories.sort((a, b) => a.name.localeCompare(b.name));
    });


    setTimeout(() => {
      const element = document.getElementById(`category-${updatedCategory.id}`);
      if (element) {
        element.classList.add("highlighted-row");
        setTimeout(() => {
          element.classList.remove("highlighted-row");
        }, 1000);
      }
    }, 0);

    setErrorMessage("");
    setShowUpdatePopup(false);
  } catch (error) {
    console.error("Error updating category:", error);
  }
};

export default handleUpdateCategory;