const handleAddCategory = async (
  categoryName,
  setCategories,
  setShowPopup,
  setErrorMessage,
  setSessionExpired,
  setHighlightedCategoryIds
) => {
  try {
    const response = await fetch("http://localhost:8000/api/v1/categories/admin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: categoryName }),
      credentials: "include",
    });

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
      console.error("Failed to add category:", responseText);
      return;
    }

    const newCategory = await response.json();
    console.log("New Category added:", newCategory);

    setCategories((prevCategories) => {
      const updatedCategories = [...prevCategories, newCategory];
      
      return updatedCategories.sort((a, b) => a.name.localeCompare(b.name));
    });

    // Update state and local storage
    setHighlightedCategoryIds((prevIds) => [...prevIds, newCategory.id]);
    const storedIds = JSON.parse(localStorage.getItem("highlightedIds")) || [];
    localStorage.setItem(
      "highlightedIds",
      JSON.stringify([...storedIds, newCategory.id])
    );

    setErrorMessage("");
    setShowPopup(false);
  } catch (error) {
    console.error("Error adding category:", error);
  }
};

export default handleAddCategory;