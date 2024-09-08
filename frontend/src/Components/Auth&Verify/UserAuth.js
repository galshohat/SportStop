import React, { createContext, useEffect, useState } from "react";


const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [loader, setLoading] = useState(false);


  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      const userId = JSON.parse(localStorage.getItem("userId"));
      if (userId) {
        try {
          const response = await fetch(
            `http://localhost:8000/api/v1/users/${userId}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          if (response.ok) {
            const data = await response.json();
            setUserInfo(data);
            setIsLoggedIn(true);
          } else {
            console.error("Failed to fetch user data:", response.statusText);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserData();
  }, []);

  const login = async (userData) => {
    setIsLoggedIn(true);
    setUserInfo(userData);
    localStorage.setItem("userId", JSON.stringify(userData._id));
    try {
      await fetch(
        `http://localhost:8000/api/v1/users/login-activity/${userData._id}`,
        {
          method: "PUT",
        }
      );
    } catch (error) {
      console.error("Error updating login activity:", error);
    }
  };

  const logout = async () => {
    setIsLoggedIn(false);
    setUserInfo(null);
    localStorage.removeItem("searchValue");
    localStorage.removeItem("userId");
    localStorage.removeItem("highlightedIds");
    try {
      if (userInfo && userInfo._id) {
        await fetch(
          `http://localhost:8000/api/v1/users/logout-activity/${userInfo._id}`,
          {
            method: "PUT",
          }
        );
      }
    } catch (error) {
      console.error("Error updating logout activity:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, userInfo, setUserInfo, login, logout, loader }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };