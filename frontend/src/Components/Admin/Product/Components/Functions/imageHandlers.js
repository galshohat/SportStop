export const handleMainImageUpload = (e, setMainImage, setError) => {
  const file = e.target.files[0];
  if (file) {
    setMainImage(file);
    setError("");
  } else {
    setError("Invalid file selected");
  }
};

export const handleAdditionalImagesUpload = (e, additionalImages, setAdditionalImages) => {
    const files = Array.from(e.target.files);
    
    setAdditionalImages((prevImages) => {
      const existingFiles = new Set(prevImages.map((img) => (typeof img === 'string' ? img : img.name)));
      const newFiles = files.filter(file => !existingFiles.has(file.name));
      
      const totalImages = prevImages.length + newFiles.length;
      if (totalImages > 4) {
        const imagesToAdd = newFiles.slice(0, 4 - prevImages.length);
        return [...prevImages, ...imagesToAdd];
      } else {
        return [...prevImages, ...newFiles];
      }
    });
};
  
export const handleDeleteMainImage = (setMainImage) => {
  setMainImage(null);
};

export const handleDeleteAdditionalImage = (
  index,
  additionalImages,
  setAdditionalImages,
  setImagesToDelete
) => {
  const imageToDelete = additionalImages[index];

  if (typeof imageToDelete === "string") {
    setImagesToDelete((prevToDelete) => [...prevToDelete, imageToDelete]);
  }

  setAdditionalImages((prevImages) => prevImages.filter((_, i) => i !== index));
};
