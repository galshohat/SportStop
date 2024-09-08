const handleUpdateSize = async (
    updatedName,
    updatedValue,
    sizeToUpdate,
    setName,
    setValue,
    setSizes,
    setShowUpdatePopup,
    setErrorMessage,
    setSessionExpired,
    setLoading
  ) => {
    if (
      !sizeToUpdate ||
      (sizeToUpdate.name === updatedName && sizeToUpdate.value === updatedValue)
    ) return;
  
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/sizes/${sizeToUpdate.id}/admin`,
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
  
      if (responseText.includes("A size with this name already exists")) {
        setErrorMessage("This size name already exists. Please choose another name.");
        return;
      }
  
      if (responseText.includes("A size with this value already exists")) {
        setErrorMessage("This size value already exists. Please choose another value.");
        return;
      }
  
      if (!response.ok) {
        throw new Error("Failed to update size");
      }
  
      const updatedSizeData = await response.json();
  
      setName(updatedSizeData.name);
      setValue(updatedSizeData.value);
  
      setSizes((prevSizes) => {
        const updatedSizes = prevSizes.map((size) =>
          size.id === updatedSizeData.id ? updatedSizeData : size
        );
        return updatedSizes.sort((a, b) => a.name.localeCompare(b.name));
      });
  
      setTimeout(() => {
        const element = document.getElementById(`size-${updatedSizeData.id}`);
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
      console.error("Error updating size:", error);
      setErrorMessage("Failed to update size. Please try again.");
    }
  };
  
  export default handleUpdateSize;