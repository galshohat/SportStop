const fetchUsers = async (setUsers, setLoading, setSessionExpired) => {
  setLoading(true);
  try {
    const response = await fetch("http://localhost:8000/api/v1/users", {
      method: "GET",
      credentials: "include",
    });
    if (response.status === 401) {
      setSessionExpired(true);
      return;
    }

    const data = await response.json();

    const sortedUsers = data.sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    setUsers(sortedUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    setUsers([]);
  } finally {
    setLoading(false);
  }
};

export default fetchUsers;
