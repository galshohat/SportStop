const handleDeleteSize = async (
  sizeToUpdate,
  setName,
  setValue,
  setSizes,
  setShowDeletePopup,
  setErrorMessage,
  setSessionExpired,
  onDeletionComplete
) => {
  try {
    const response = await fetch(
      `http://localhost:8000/api/v1/sizes/${sizeToUpdate.id}/admin`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    if (response.status === 401) {
      setSessionExpired(true);
      return;
    }

    if (!response.ok) {
      throw new Error("Failed to delete size");
    }

    setName("");
    setValue("");

    setSizes((prevSizes) => {
      if (Array.isArray(prevSizes)) {
        onDeletionComplete && onDeletionComplete();
        return prevSizes.filter((size) => size.id !== sizeToUpdate.id);
      } else {
        return [];
      }
    });

    setShowDeletePopup(false);
    setErrorMessage("");
  } catch (error) {
    console.error("Error deleting size:", error);
    if (setErrorMessage) {
      setErrorMessage("Failed to delete size. Please try again.");
    }
  }
};

export default handleDeleteSize;
