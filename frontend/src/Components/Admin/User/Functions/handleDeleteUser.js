const handleDeleteUser = async (
    userToDelete,
    setUsers,
    currentUsers,
    setCurrentPage,
    currentPage,
    setShowDeletePopup,
    setSessionExpired,
    setLoading,
    setErrorMessage
  ) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/users/delete-account/${userToDelete.id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
  
      if (response.status === 401) {
        setSessionExpired(true);
        return;
      }
  
      if (!response.ok) {
        throw new Error("Failed to delete user");
      }
  
      setUsers((prevUsers) => {
        const updatedUsers = prevUsers.filter(
          (user) => user.id !== userToDelete.id
        );
        return updatedUsers;
      });
  
      if (currentUsers.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
  
        setShowDeletePopup(false);
        setErrorMessage("");
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      setLoading(false);
    }
  };
  
  export default handleDeleteUser;