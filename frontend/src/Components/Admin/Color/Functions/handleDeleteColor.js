const handleDeleteColor = async (
    colorToDelete,
    setColors,
    setShowDeletePopup,
    setErrorMessage,
    setSessionExpired,
    setLoading,
    onDeletionComplete
) => {
    setLoading(true);
    try {
        const response = await fetch(`http://localhost:8000/api/v1/colors/${colorToDelete.id}/admin`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: "include"
        });

        if (response.status === 401) {
            setSessionExpired(true);
            return;
        }

        if (!response.ok) {
            throw new Error('Failed to delete color');
        }

     

        setColors((prevColors) => {
            if (Array.isArray(prevColors)) {
                onDeletionComplete && onDeletionComplete();
                return prevColors.filter((color) => color.id !== colorToDelete.id);
            } else {
                return [];
            }
        });

        setShowDeletePopup(false);
        setErrorMessage('');
    } catch (error) {
        console.error('Error deleting color:', error);
        setErrorMessage('Failed to delete color. Please try again.');
    } finally {
        setLoading(false);
    }
};

export default handleDeleteColor;