import { useEffect, useState } from "react";

export const useAuth = () => {
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role");
    const userData = localStorage.getItem("user");
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

    const loadUser = async () => {
      if (token && userRole) {
        setRole(userRole);

        try {
          const response = await fetch(`${apiBaseUrl}/api/auth/profile`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
          
            setUser(data.user);
            localStorage.setItem("user", JSON.stringify(data.user));
          } else if (userData) {
            setUser(JSON.parse(userData));
          }
        } catch (error) {
          if (userData) {
            try {
              setUser(JSON.parse(userData));
            } catch (e) {
              console.error("Failed to parse user data:", e);
            }
          }
        }
      }

      setLoading(false);
    };

    loadUser();
  }, []);

  const updateUser = (newUserData) => {
    setUser(newUserData);
    localStorage.setItem("user", JSON.stringify(newUserData));
  };

  return { role, user, loading, updateUser };
};