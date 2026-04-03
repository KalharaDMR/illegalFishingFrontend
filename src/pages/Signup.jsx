import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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

const focusStyle = {
  borderColor: "#22d3b0",
  boxShadow: "0 0 0 3px rgba(34,211,176,0.12)",
};

const labelStyle = {
  display: "block",
  fontSize: "13px",
  fontWeight: "500",
  color: "#374263",
  marginBottom: "6px",
};

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "PUBLIC_USER",
    district: "",
  });

  const [files, setFiles] = useState([]);

  // ✅ FIX: Missing states (no logic change)
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true); // ✅ safe addition (does not change logic)

    const data = new FormData();
    Object.keys(form).forEach((key) => {
      if (key === "district" && form.role !== "AUTHORIZED_PERSON") return;
      data.append(key, form[key]);
    });

    if (form.role !== "PUBLIC_USER") {
      for (let file of files) {
        data.append("evidence", file);
      }
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/signup",
        data,
      );
      alert(res.data.message);
      window.location.href = "/login";
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const roleLabels = {
    PUBLIC_USER: "Public User",
    ZOOLOGIST: "Zoologist",
    AUTHORIZED_PERSON: "Authorized Person",
  };

  const fields = [
    {
      name: "name",
      label: "Full name",
      type: "text",
      placeholder: "Jane Smith",
    },
    {
      name: "email",
      label: "Email address",
      type: "email",
      placeholder: "you@example.com",
    },
    {
      name: "phone",
      label: "Phone number",
      type: "tel",
      placeholder: "+94 77 000 0000",
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      placeholder: "••••••••",
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg, #0a1628 0%, #0d2a45 50%, #0a1628 100%)",
        fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif",
        padding: "20px",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.03,
          backgroundImage:
            "radial-gradient(circle, #22d3b0 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div
        style={{
          background: "#fff",
          borderRadius: "16px",
          padding: "40px 36px",
          width: "100%",
          maxWidth: "420px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
          position: "relative",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              background: "linear-gradient(135deg, #22d3b0, #0ea5e9)",
              borderRadius: "12px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "22px",
              fontWeight: "700",
              color: "#fff",
              marginBottom: "16px",
            }}
          >
            F
          </div>
          <h1 style={{ margin: 0, fontSize: "22px", fontWeight: "600" }}>
            Create an account
          </h1>
          <p style={{ margin: "6px 0 0", fontSize: "14px", color: "#6b7a99" }}>
            Join the FishWatch community
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {fields.map(({ name, label, type, placeholder }) => (
            <div key={name}>
              <label style={labelStyle}>{label}</label>
              <input
                name={name}
                type={type}
                placeholder={placeholder}
                onChange={handleChange}
                onFocus={() => setFocusedField(name)}
                onBlur={() => setFocusedField(null)}
                style={{
                  ...inputStyle,
                  ...(focusedField === name ? focusStyle : {}),
                }}
                required
              />
            </div>
          ))}

          <div>
            <label style={labelStyle}>Account type</label>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {Object.entries(roleLabels).map(([value, label]) => (
                <label key={value} style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "10px 14px",
                  border: `1px solid ${form.role === value ? "#22d3b0" : "#dde3ec"}`,
                  borderRadius: "8px",
                  cursor: "pointer",
                  background: form.role === value ? "rgba(34,211,176,0.06)" : "#fff",
                }}>
                  <input
                    type="radio"
                    name="role"
                    value={value}
                    checked={form.role === value}
                    onChange={handleChange}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          {form.role !== "PUBLIC_USER" && (
            <div>
              <label style={labelStyle}>Upload credentials</label>
              <input type="file" multiple onChange={handleFileChange} />
            </div>
          )}

          {form.role === "AUTHORIZED_PERSON" && (
            <input
              name="district"
              placeholder="Enter your district"
              value={form.district}
              onChange={handleChange}
              style={inputStyle}
              required
            />
          )}

          <button type="submit" style={inputStyle}>
            {loading ? "Creating..." : "Create account"}
          </button>
        </form>
      </div>
    </div>
  );
}