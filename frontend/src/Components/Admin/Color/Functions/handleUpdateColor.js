const handleUpdateColor = async (
  updatedName,
  updatedValue,
  colorToUpdate,
  setColors,
  setShowUpdatePopup,
  setErrorMessage,
  setSessionExpired,
  setLoading,
) => {

  const isValidHex = /^#([0-9A-F]{3}|[0-9A-F]{6})$/i.test(updatedValue);


  if (!isValidHex) {
    setErrorMessage(
      "Invalid color value. Please enter a valid hex color code."
    );
    return;
  }

  if (
    !colorToUpdate ||
    (colorToUpdate.name === updatedName && colorToUpdate.value === updatedValue)
  )
    return;
  setLoading(true);
  try {
    const response = await fetch(
      `http://localhost:8000/api/v1/colors/${colorToUpdate.id}/admin`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: updatedName, value: updatedValue }),
        credentials: "include",
      }
    );

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
      throw new Error("Failed to update color");
    }

    const updatedColorData = await response.json();
    setColors((prevColors) => {

      const updatedColors = prevColors.map((color) =>
        color.id === updatedColorData.id ? updatedColorData : color
      );


      return updatedColors.sort((a, b) => a.name.localeCompare(b.name));
    });

    setTimeout(() => {
        const element = document.getElementById(`color-${updatedColorData.id}`);
        if (element) {
          element.classList.add("highlighted-row");
          setTimeout(() => {
            element.classList.remove("highlighted-row");
          }, 1000);
        }
      }, 0);

    setShowUpdatePopup(false);
    setErrorMessage("");
    setLoading(false);
  } catch (error) {
    console.error("Error updating color:", error);
    setErrorMessage("Failed to update color. Please try again.");
  }
};

export default handleUpdateColor;
