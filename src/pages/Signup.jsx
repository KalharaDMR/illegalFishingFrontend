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
  const [focusedField, setFocusedField] = useState(null);
  const [districts, setDistricts] = useState([]);

  // Fetch districts from backend when component mounts
  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/districts");
        setDistricts(res.data.districts);
      } catch (err) {
        console.error("Failed to load districts:", err);
      }
    };
    fetchDistricts();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
    } catch (err) {
      alert(err.response.data.message);
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
      {/* Background dot pattern */}
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
        {/* Brand mark */}
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
          <h1
            style={{
              margin: 0,
              fontSize: "22px",
              fontWeight: "600",
              color: "#0a1628",
              letterSpacing: "-0.01em",
            }}
          >
            Create an account
          </h1>
          <p style={{ margin: "6px 0 0", fontSize: "14px", color: "#6b7a99" }}>
            Join the FishWatch community
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "14px" }}
        >
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

          {/* Role selector */}
          <div>
            <label style={labelStyle}>Account type</label>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              {Object.entries(roleLabels).map(([value, label]) => (
                <label
                  key={value}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "10px 14px",
                    border: `1px solid ${form.role === value ? "#22d3b0" : "#dde3ec"}`,
                    borderRadius: "8px",
                    cursor: "pointer",
                    background:
                      form.role === value ? "rgba(34,211,176,0.06)" : "#fff",
                    transition: "all 0.15s ease",
                    fontSize: "14px",
                    color: form.role === value ? "#0a6155" : "#374263",
                    fontWeight: form.role === value ? "500" : "400",
                  }}
                >
                  <input
                    type="radio"
                    name="role"
                    value={value}
                    checked={form.role === value}
                    onChange={handleChange}
                    style={{
                      accentColor: "#22d3b0",
                      width: "15px",
                      height: "15px",
                    }}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          {/* Evidence upload for non-public users */}
          {form.role !== "PUBLIC_USER" && (
            <div
              style={{
                padding: "16px",
                border: "1px dashed #b0c0d8",
                borderRadius: "8px",
                background: "#f7faff",
              }}
            >
              <label style={{ ...labelStyle, marginBottom: "10px" }}>
                Upload credentials / evidence
              </label>
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                style={{
                  fontSize: "13px",
                  color: "#374263",
                  cursor: "pointer",
                  width: "100%",
                }}
              />
              <p
                style={{
                  fontSize: "12px",
                  color: "#8a96b0",
                  marginTop: "8px",
                  marginBottom: 0,
                }}
              >
                Upload documents to verify your professional role.
              </p>

              {/* District field only for Authorized Person */}
            </div>
          )}
          {form.role === "AUTHORIZED_PERSON" && (
            <div style={{ marginTop: "14px" }}>
              <label style={labelStyle}>District</label>
              <select
                name="district"
                value={form.district}
                onChange={handleChange}
                required
                style={{
                  ...inputStyle,
                  ...(focusedField === "district" ? focusStyle : {}),
                  appearance: "none",
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7a99' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 12px center",
                }}
                onFocus={() => setFocusedField("district")}
                onBlur={() => setFocusedField(null)}
              >
                <option value="" disabled>
                  Select your district
                </option>
                {districts.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          )}
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
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "0.92";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "1";
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = "scale(0.99)";
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            Create account
          </button>

          <p
            style={{
              textAlign: "center",
              fontSize: "13px",
              color: "#6b7a99",
              marginTop: "20px",
              marginBottom: 0,
            }}
          >
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              style={{
                background: "none",
                border: "none",
                padding: 0,
                color: "#0ea5e9",
                fontWeight: "500",
                fontSize: "13px",
                cursor: "pointer",
                fontFamily: "inherit",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.textDecoration = "underline";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.textDecoration = "none";
              }}
            >
              Login
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
