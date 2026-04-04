import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";


export default function ZoologistProfile() {
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";
  const { user, updateUser, loading: authLoading } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    district: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email || "",
        phone: user.phone || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Validate passwords if changing
      if (formData.newPassword) {
        if (!formData.currentPassword) {
          throw new Error("Current password is required to change password");
        }
        if (formData.newPassword !== formData.confirmPassword) {
          throw new Error("New passwords don't match");
        }
        if (formData.newPassword.length < 6) {
          throw new Error("New password must be at least 6 characters");
        }
      }

      // Prepare update data
      const updateData = {
        email: formData.email,
        phone: formData.phone,
      };

      if (formData.newPassword) {
        updateData.password = formData.newPassword;
        updateData.currentPassword = formData.currentPassword;
      }

      if (user.role === "AUTHORIZED_PERSON") {
        updateData.district = formData.district;
      }

      const response = await fetch(`${apiBaseUrl}/api/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(updateData),
      });

      const contentType = response.headers.get("content-type") || "";
      const isJson = contentType.includes("application/json");
      const data = isJson ? await response.json() : null;

      if (!response.ok) {
        const message = data?.message || (isJson ? "Failed to update profile" : await response.text());
        throw new Error(message);
      }

      // Update local user data
      updateUser(data.user);
      setSuccess("Profile updated successfully!");

      // Clear password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif" }}>
      {authLoading || !user ? (
        <div style={{ textAlign: "center", padding: "50px" }}>
          <div>Loading profile...</div>
        </div>
      ) : (
        <>
          <div
            className="zoo-animate-fade-up"
            style={{
              background: "linear-gradient(135deg, #0a1628 0%, #0d2a45 100%)",
              borderRadius: "16px",
              padding: "36px 40px",
              marginBottom: "28px",
              position: "relative",
              overflow: "hidden",
            }}
          >
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.05,
            backgroundImage: "radial-gradient(circle, #22d3b0 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div style={{ position: "relative" }}>
          <div
            style={{
              fontSize: "11px",
              color: "#22d3b0",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              fontWeight: "500",
              marginBottom: "10px",
            }}
          >
            Zoologist Portal
          </div>
          <h1
            style={{
              fontSize: "26px",
              fontWeight: "600",
              color: "#f0f6ff",
              margin: "0 0 10px",
              letterSpacing: "-0.01em",
            }}
          >
            Edit Profile
          </h1>
          <p
            style={{
              fontSize: "14px",
              color: "rgba(200,220,255,0.65)",
              margin: "0",
              maxWidth: "520px",
              lineHeight: 1.6,
            }}
          >
            Update your account information and credentials.
          </p>
        </div>
      </div>

      <div
        style={{
          background: "#fff",
          borderRadius: "16px",
          border: "1px solid #e4eaf3",
          padding: "32px",
          maxWidth: "600px",
          margin: "0 auto",
        }}
      >
        <form onSubmit={handleSubmit}>
          {error && (
            <div
              style={{
                padding: "12px 16px",
                borderRadius: "8px",
                background: "#fef2f2",
                color: "#b91c1c",
                marginBottom: "20px",
                fontSize: "14px",
              }}
            >
              {error}
            </div>
          )}

          {success && (
            <div
              style={{
                padding: "12px 16px",
                borderRadius: "8px",
                background: "#f0fdf4",
                color: "#166534",
                marginBottom: "20px",
                fontSize: "14px",
              }}
            >
              {success}
            </div>
          )}

          <div style={{ marginBottom: "24px" }}>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "600",
                color: "#374151",
                marginBottom: "8px",
              }}
            >
              Full Name
            </label>
            <input
              type="text"
              value={user?.name || ""}
              readOnly
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                fontSize: "14px",
                boxSizing: "border-box",
                backgroundColor: "#f9fafb",
                color: "#6b7280",
              }}
            />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "600",
                color: "#374151",
                marginBottom: "8px",
              }}
            >
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email || user?.email || ""}
              onChange={handleInputChange}
              required
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                fontSize: "14px",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "600",
                color: "#374151",
                marginBottom: "8px",
              }}
            >
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone || user?.phone || ""}
              onChange={handleInputChange}
              required
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                fontSize: "14px",
                boxSizing: "border-box",
              }}
            />
          </div>


          <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: "24px", marginBottom: "24px" }}>
            <h3
              style={{
                fontSize: "16px",
                fontWeight: "600",
                color: "#111827",
                margin: "0 0 16px",
              }}
            >
              Change Password (Optional)
            </h3>

            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#374151",
                  marginBottom: "8px",
                }}
              >
                Current Password
              </label>
              <input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  border: "1px solid #d1d5db",
                  fontSize: "14px",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#374151",
                  marginBottom: "8px",
                }}
              >
                New Password
              </label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  border: "1px solid #d1d5db",
                  fontSize: "14px",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#374151",
                  marginBottom: "8px",
                }}
              >
                Confirm New Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  border: "1px solid #d1d5db",
                  fontSize: "14px",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px 24px",
              borderRadius: "8px",
              background: "#22d3b0",
              color: "#fff",
              fontSize: "16px",
              fontWeight: "600",
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </form>
      </div>
        </>
      )}
    </div>
  );
}