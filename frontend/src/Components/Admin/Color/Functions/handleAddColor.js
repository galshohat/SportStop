const handleAddColor = async (
  name,
  value,
  setColors,
  setShowPopup,
  setErrorMessage,
  setSessionExpired,
  setHighlightedColorIds 
) => {
  const isValidHex = /^#([0-9A-F]{3}|[0-9A-F]{6})$/i.test(value);

  if (!isValidHex) {
    setErrorMessage(
      "Invalid color value. Please enter a valid hex color code."
    );
    return;
  }

  try {
    const response = await fetch("http://localhost:8000/api/v1/colors/admin", {
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

    if (responseText.includes("A color with this name already exists")) {
      setErrorMessage(
        "This color name already exists. Please choose another name."
      );
      return;
    }

    if (responseText.includes("A color with this value already exists")) {
      setErrorMessage(
        "This color value already exists. Please choose another value."
      );
      return;
    }

    if (!response.ok) {
      throw new Error("Failed to add color");
    }

    const newColor = await response.json();

    setColors((prevColors) => {
      const updatedColors = [...prevColors, newColor];
      return updatedColors.sort((a, b) => a.name.localeCompare(b.name));
    });

    setHighlightedColorIds((prevIds) => [...prevIds, newColor.id]); 

    const storedIds = JSON.parse(localStorage.getItem("highlightedIds")) || [];
    const updatedStoredIds = [...storedIds, newColor.id];
    localStorage.setItem("highlightedIds", JSON.stringify(updatedStoredIds));

    setShowPopup(false);
    setErrorMessage("");
  } catch (error) {
    console.error("Error adding color:", error);
    setErrorMessage("Failed to add color. Please try again.");
  }
};

export default handleAddColor;
