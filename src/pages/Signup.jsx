import { useState } from "react";
import axios from "axios";
import { getDistricts } from "../api/districts"; // Import the districts API

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
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "PUBLIC_USER",
    district: "", // Add district field
  });
  const [files, setFiles] = useState([]);
  const [focusedField, setFocusedField] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate district for AUTHORIZED_PERSON
    if (form.role === "AUTHORIZED_PERSON" && !form.district) {
      alert("Please select a district");
      setLoading(false);
      return;
    }

    const data = new FormData();
    Object.keys(form).forEach((key) => {
      if (form[key]) { // Only append if value exists
        data.append(key, form[key]);
      }
    });

    if (form.role !== "PUBLIC_USER") {
      for (let file of files) {
        data.append("evidence", file);
      }
    }

    try {
      const res = await axios.post("http://localhost:5000/api/auth/signup", data);
      const res = await axios.post(
        "http://localhost:5000/api/auth/signup",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
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
    { name: "name",     label: "Full name",       type: "text",     placeholder: "Jane Smith" },
    { name: "email",    label: "Email address",   type: "email",    placeholder: "you@example.com" },
    { name: "phone",    label: "Phone number",    type: "tel",      placeholder: "+94 77 000 0000" },
    { name: "password", label: "Password",        type: "password", placeholder: "••••••••" },
  ];

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
      {/* Background dot pattern */}
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
        maxWidth: "420px",
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

          {/* Role selector */}
          <div>
            <label style={labelStyle}>Account type</label>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
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
                    background: form.role === value ? "rgba(34,211,176,0.06)" : "#fff",
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
                    style={{ accentColor: "#22d3b0", width: "15px", height: "15px" }}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          {/* Evidence upload for non-public users */}
          {form.role !== "PUBLIC_USER" && (
            <div style={{
              padding: "16px",
              border: "1px dashed #b0c0d8",
              borderRadius: "8px",
              background: "#f7faff",
            }}>
              <label style={{ ...labelStyle, marginBottom: "10px" }}>
                Upload credentials / evidence
              </label>
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                style={{ fontSize: "13px", color: "#374263", cursor: "pointer", width: "100%" }}
              />
              <p style={{ fontSize: "12px", color: "#8a96b0", marginTop: "8px", marginBottom: 0 }}>
                Upload documents to verify your professional role.
              </p>
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
            onMouseEnter={e => { e.currentTarget.style.opacity = "0.92"; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
            onMouseDown={e => { e.currentTarget.style.transform = "scale(0.99)"; }}
            onMouseUp={e => { e.currentTarget.style.transform = "scale(1)"; }}
          >
            Create account
          </button>
        </form>
      </div>
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            name="name"
            placeholder="Enter your full name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            name="email"
            type="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <input
            name="phone"
            placeholder="Enter your phone number"
            value={form.phone}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Role
          </label>
          <select 
            name="role" 
            value={form.role}
            onChange={handleChange} 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="PUBLIC_USER">Public User</option>
            <option value="ZOOLOGIST">Zoologist</option>
            <option value="AUTHORIZED_PERSON">Authorized Person</option>
          </select>
        </div>

        {/* District dropdown for AUTHORIZED_PERSON */}
        {form.role === "AUTHORIZED_PERSON" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              District <span className="text-red-500">*</span>
            </label>
            <select
              name="district"
              value={form.district}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select a district</option>
              {districts.map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Please select your district of operation
            </p>
          </div>
        )}

        {/* Evidence upload for non-public users */}
        {form.role !== "PUBLIC_USER" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Evidence Documents <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              accept=".pdf,.jpg,.jpeg,.png"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Upload relevant documents (PDF, JPG, PNG)
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 rounded-md text-white font-medium ${
            loading 
              ? "bg-gray-400 cursor-not-allowed" 
              : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          }`}
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => window.location.href = "/login"}
            className="text-blue-600 hover:underline focus:outline-none"
          >
            Login here
          </button>
        </p>
      </form>
    </div>
  );
}