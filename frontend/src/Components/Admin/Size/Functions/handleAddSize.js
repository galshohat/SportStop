const handleAddSize = async (
  name,
  value,
  setSizes,
  setShowPopup,
  setErrorMessage,
  setSessionExpired,
  setHighlightedSizeIds
) => {
  try {
    const response = await fetch("http://localhost:8000/api/v1/sizes/admin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, value }),
      credentials: "include",
    });

    if (response.status === 401) {
      setSessionExpired(true);
      return;
    }

    const responseText = await response.clone().text();

    if (responseText.includes("A size with this name already exists")) {
      setErrorMessage("This size name already exists. Please choose another name.");
      return;
    }

    if (responseText.includes("A size with this value already exists")) {
      setErrorMessage("This size value already exists. Please choose another value.");
      return;
    }

    if (!response.ok) {
      throw new Error("Failed to add size");
    }

    const newSize = await response.json();
    
    setSizes((prevSizes) => {
      const updatedSizes = [...prevSizes, newSize];
      return updatedSizes.sort((a, b) => a.name.localeCompare(b.name));
    });

    setHighlightedSizeIds((prevIds) => [...prevIds, newSize.id]); 

    const storedIds = JSON.parse(localStorage.getItem("highlightedIds")) || [];
    const updatedStoredIds = [...storedIds, newSize.id];
    localStorage.setItem("highlightedIds", JSON.stringify(updatedStoredIds));

    setShowPopup(false);
    setErrorMessage("");
  } catch (error) {
    console.error("Error adding size:", error);
    setErrorMessage("Failed to add size. Please try again.");
  }
};

export default handleAddSize;