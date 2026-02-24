import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (token) {
      navigate(role === "ADMIN" ? "/admin" : "/dashboard");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );

      // ✅ Save token, role, and username
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);
      localStorage.setItem("username", res.data.user.name); // ✅ save actual name

      // Redirect
      navigate(res.data.user.role === "ADMIN" ? "/admin" : "/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow w-96"
      >
        <h2 className="text-xl font-bold mb-4 text-center">Login</h2>

        <input
          placeholder="Email"
          className="input mb-2 w-full p-2 border rounded"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="input mb-2 w-full p-2 border rounded"
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="bg-green-600 text-white w-full py-2 rounded mt-2">
          Login
        </button>

        <p className="text-sm text-center mt-4">
          Don’t have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/signup")}
            className="text-blue-600 hover:underline"
          >
            Sign up
          </button>
        </p>
      </form>
    </div>
  );
}
