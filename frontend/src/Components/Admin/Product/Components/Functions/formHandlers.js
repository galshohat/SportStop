export const handleCategoryChange = (
  e,
  categories,
  setSelectedCategoryIds,
  setError
) => {
  const { value, checked } = e.target;
  const categoryId = categories.find((category) => category.id === value)?.id;

  if (checked && categoryId) {
    setSelectedCategoryIds((prev) => [...prev, categoryId]);
  } else {
    setSelectedCategoryIds((prev) => prev.filter((id) => id !== categoryId));
  }
  setError("");
};

export const handleSizeChange = (e, sizes, setSelectedSizeIds) => {
  const { value, checked } = e.target;
  if (checked) {
    setSelectedSizeIds((prevSelected) => [...prevSelected, value]);
  } else {
    setSelectedSizeIds((prevSelected) =>
      prevSelected.filter((sizeId) => sizeId !== value)
    );
  }
};

export const handleColorChange = (e, colorsList, setSelectedColorIds) => {
  const { value, checked } = e.target;
  if (checked) {
    setSelectedColorIds((prevSelected) => [...prevSelected, value]);
  } else {
    setSelectedColorIds((prevSelected) =>
      prevSelected.filter((colorId) => colorId !== value)
    );
  }
};
