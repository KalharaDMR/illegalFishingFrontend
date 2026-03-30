import { useEffect, useState } from "react";

export const useAuth = () => {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role");
    if (token && userRole) {
      setRole(userRole);
    }
    setLoading(false);
  }, []);

  return { role, loading };
};