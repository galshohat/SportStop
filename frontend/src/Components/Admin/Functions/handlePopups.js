const handleAddNewClick = (setShowPopup, setErrorMessage) => {
    setShowPopup(true);
    setErrorMessage("");
};

const handleClosePopup = (setShowPopup, setShowDeletePopup, setShowUpdatePopup) => {
    setShowPopup(false);
    setShowDeletePopup(false);
    setShowUpdatePopup(false);
};

export { handleAddNewClick, handleClosePopup };