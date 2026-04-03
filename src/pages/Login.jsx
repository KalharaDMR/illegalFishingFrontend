import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const inputStyle = {
  width: "100%",
  padding: "11px 14px",
  fontSize: "14px",
  border: "1px solid #dde3ec",
  borderRadius: "8px",
  outline: "none",
  color: "#1a2640",
  background: "#fff",
  boxSizing: "border-box",
  transition: "border-color 0.15s ease, box-shadow 0.15s ease",
  fontFamily: "inherit",
};

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [focusedField, setFocusedField] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);

      switch (res.data.user.role) {
        case "ADMIN":       navigate("/admin"); break;
        case "PUBLIC_USER": navigate("/public"); break;
        case "ZOOLOGIST":   navigate("/zoologist"); break;
        case "AUTHORIZED_PERSON": navigate("/authorized"); break;
        default:            navigate("/login");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #0a1628 0%, #0d2a45 50%, #0a1628 100%)",
      fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif",
      padding: "20px",
    }}>
      {/* Subtle background pattern */}
      <div style={{
        position: "absolute", inset: 0, opacity: 0.03,
        backgroundImage: "radial-gradient(circle, #22d3b0 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }} />

      <div style={{
        background: "#fff",
        borderRadius: "16px",
        padding: "40px 36px",
        width: "100%",
        maxWidth: "400px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
        position: "relative",
      }}>
        {/* Brand mark */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{
            width: "48px", height: "48px",
            background: "linear-gradient(135deg, #22d3b0, #0ea5e9)",
            borderRadius: "12px",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "22px",
            fontWeight: "700",
            color: "#fff",
            marginBottom: "16px",
          }}>F</div>
          <h1 style={{ margin: 0, fontSize: "22px", fontWeight: "600", color: "#0a1628", letterSpacing: "-0.01em" }}>
            Welcome back
          </h1>
          <p style={{ margin: "6px 0 0", fontSize: "14px", color: "#6b7a99" }}>
            Sign in to FishWatch
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "500", color: "#374263", marginBottom: "6px" }}>
              Email address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              style={{
                ...inputStyle,
                borderColor: focusedField === "email" ? "#22d3b0" : "#dde3ec",
                boxShadow: focusedField === "email" ? "0 0 0 3px rgba(34,211,176,0.12)" : "none",
              }}
              onFocus={() => setFocusedField("email")}
              onBlur={() => setFocusedField(null)}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "500", color: "#374263", marginBottom: "6px" }}>
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              style={{
                ...inputStyle,
                borderColor: focusedField === "password" ? "#22d3b0" : "#dde3ec",
                boxShadow: focusedField === "password" ? "0 0 0 3px rgba(34,211,176,0.12)" : "none",
              }}
              onFocus={() => setFocusedField("password")}
              onBlur={() => setFocusedField(null)}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            style={{
              marginTop: "6px",
              width: "100%",
              padding: "12px",
              background: "linear-gradient(135deg, #22d3b0, #0ea5e9)",
              border: "none",
              borderRadius: "8px",
              color: "#fff",
              fontSize: "15px",
              fontWeight: "600",
              cursor: "pointer",
              letterSpacing: "0.01em",
              transition: "opacity 0.15s ease, transform 0.1s ease",
              fontFamily: "inherit",
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = "0.92"; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
            onMouseDown={e => { e.currentTarget.style.transform = "scale(0.99)"; }}
            onMouseUp={e => { e.currentTarget.style.transform = "scale(1)"; }}
          >
            Sign in
          </button>
        </form>

        <p style={{ textAlign: "center", fontSize: "13px", color: "#6b7a99", marginTop: "24px", marginBottom: 0 }}>
          Don't have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/signup")}
            style={{
              background: "none", border: "none", padding: 0,
              color: "#0ea5e9", fontWeight: "500", fontSize: "13px",
              cursor: "pointer", fontFamily: "inherit",
              textDecoration: "none",
            }}
            onMouseEnter={e => { e.currentTarget.style.textDecoration = "underline"; }}
            onMouseLeave={e => { e.currentTarget.style.textDecoration = "none"; }}
          >
            Create account
          </button>
        </p>
      </div>
    </div>
  );
}
