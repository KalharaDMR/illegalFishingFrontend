import React, { useState } from "react";
import { API_BASE, inputStyle } from "./dashboardConstants";
import LeafletLocationPicker from "./LeafletLocationPicker";

const fieldLabel = (text) => ({
  fontSize: "12px",
  fontWeight: "600",
  color: "#3a4565",
  display: "block",
  marginBottom: "6px",
  letterSpacing: "0.03em",
  textTransform: "uppercase",
});

const sectionStyle = {
  marginBottom: "16px",
};

// ── Delete Confirm Dialog ────────────────────────────────────
export function DeleteConfirmModal({ zone, onConfirm, onCancel, loading }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(10,22,40,0.65)",
        backdropFilter: "blur(6px)",
        zIndex: 1100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        animation: "fadeIn 0.15s ease",
      }}
    >
      <style>{`
        @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
        @keyframes slideUp { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:translateY(0) } }
        .del-cancel:hover { background: #eef0f5 !important; }
        .del-confirm:hover:not(:disabled) { background: #c53030 !important; }
      `}</style>

      <div
        style={{
          background: "#fff",
          borderRadius: "18px",
          padding: "0",
          maxWidth: "400px",
          width: "100%",
          boxShadow:
            "0 24px 70px rgba(10,22,40,0.25), 0 0 0 1px rgba(0,0,0,0.04)",
          overflow: "hidden",
          animation: "slideUp 0.2s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        {/* danger stripe */}
        <div
          style={{
            height: "5px",
            background: "linear-gradient(90deg, #e53e3e, #f87171)",
          }}
        />

        <div style={{ padding: "26px 28px 28px" }}>
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "14px",
              background: "#fff5f5",
              border: "1px solid #fecaca",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
              marginBottom: "14px",
            }}
          >
            🗑
          </div>

          <h3
            style={{
              margin: "0 0 8px",
              fontSize: "17px",
              fontWeight: "700",
              color: "#0a1628",
              letterSpacing: "-0.3px",
            }}
          >
            Delete Zone
          </h3>
          <p
            style={{
              margin: "0 0 22px",
              fontSize: "13px",
              color: "#6b7a99",
              lineHeight: 1.65,
            }}
          >
            Are you sure you want to delete{" "}
            <strong style={{ color: "#0a1628" }}>{zone.name}</strong>? This
            action cannot be undone.
          </p>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              className="del-cancel"
              onClick={onCancel}
              style={{
                flex: 1,
                padding: "11px",
                border: "1px solid #dde3ee",
                borderRadius: "10px",
                background: "#f8fafc",
                color: "#3a4565",
                fontSize: "13px",
                fontWeight: "500",
                cursor: "pointer",
                transition: "background 0.15s ease",
              }}
            >
              Cancel
            </button>
            <button
              className="del-confirm"
              onClick={onConfirm}
              disabled={loading}
              style={{
                flex: 1,
                padding: "11px",
                border: "none",
                borderRadius: "10px",
                background: loading ? "#fca5a5" : "#e53e3e",
                color: "#fff",
                fontSize: "13px",
                fontWeight: "600",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "background 0.15s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
              }}
            >
              {loading ? (
                <>
                  <span style={{ opacity: 0.8 }}>⏳</span> Deleting…
                </>
              ) : (
                "Yes, Delete"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Add / Edit Zone Modal ────────────────────────────────────
export function ZoneFormModal({ zone, onClose, onSuccess }) {
  const isEdit = !!zone;

  const [form, setForm] = useState({
    name: zone?.name || "",
    lat: zone?.location?.lat?.toString() || "7.8731",
    lng: zone?.location?.lng?.toString() || "80.7718",
    restrictedTime: zone?.restrictedTime || "",
    startDate: zone?.startDate
      ? zone.startDate.split("T")[0]
      : new Date().toISOString().split("T")[0],
    endDate: zone?.endDate ? zone.endDate.split("T")[0] : "",
    photo: null,
  });

  const [locationConfirmed, setLocationConfirmed] = useState(isEdit);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleMapPick = ({ lat, lng }) => {
    setForm((f) => ({ ...f, lat: String(lat), lng: String(lng) }));
    setLocationConfirmed(true);
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      setError("Area name is required.");
      return;
    }
    if (!locationConfirmed) {
      setError("Please confirm the location first.");
      return;
    }
    if (!form.startDate) {
      setError("Start date is required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append(
        "location",
        JSON.stringify({
          lat: parseFloat(form.lat),
          lng: parseFloat(form.lng),
        }),
      );
      formData.append("startDate", form.startDate);
      if (form.endDate) formData.append("endDate", form.endDate);
      formData.append("restrictedTime", form.restrictedTime || "All Day");
      if (form.photo) formData.append("evidenceFiles", form.photo);

      const url = isEdit
        ? `${API_BASE}/api/zones/${zone._id}`
        : `${API_BASE}/api/zones`;
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const ct = res.headers.get("content-type") || "";
      if (!ct.includes("application/json"))
        throw new Error(`Server unreachable at ${API_BASE}.`);

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || `Request failed (${res.status})`);
      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const styledInput = {
    ...inputStyle,
    borderRadius: "10px",
    border: "1px solid #e2e8f0",
    fontSize: "13px",
    padding: "10px 13px",
    transition: "border-color 0.15s ease, box-shadow 0.15s ease",
    outline: "none",
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(10,22,40,0.65)",
        backdropFilter: "blur(8px)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        animation: "fadeIn 0.15s ease",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <style>{`
        @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
        @keyframes slideUp { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:translateY(0) } }
        .zf-input:focus { border-color: #818cf8 !important; box-shadow: 0 0 0 3px rgba(129,140,248,0.12) !important; }
        .zf-submit:hover:not(:disabled) { background: #1d4ed8 !important; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(37,99,235,0.35) !important; }
        .zf-submit { transition: all 0.18s ease !important; }
        .zf-close:hover { background: #f1f5f9 !important; color: #0a1628 !important; }
        .confirm-loc:hover { opacity: 0.9; }
      `}</style>

      <div
        style={{
          background: "#fff",
          borderRadius: "20px",
          width: "100%",
          maxWidth: "520px",
          maxHeight: "92vh",
          overflowY: "auto",
          boxShadow:
            "0 32px 80px rgba(10,22,40,0.28), 0 0 0 1px rgba(0,0,0,0.04)",
          animation: "slideUp 0.25s cubic-bezier(0.16,1,0.3,1)",
          scrollbarWidth: "thin",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "22px 26px 18px",
            borderBottom: "1px solid #f1f5f9",
            position: "sticky",
            top: 0,
            background: "#fff",
            zIndex: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            borderRadius: "20px 20px 0 0",
          }}
        >
          <div
            style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "12px",
                background: isEdit
                  ? "#eff6ff"
                  : "linear-gradient(135deg, #dbeafe, #ede9fe)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "18px",
                flexShrink: 0,
                marginTop: "1px",
              }}
            >
              {isEdit ? "✏️" : "📍"}
            </div>
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: "17px",
                  fontWeight: "700",
                  color: "#0a1628",
                  letterSpacing: "-0.3px",
                }}
              >
                {isEdit ? "Edit Restricted Area" : "Mark Restricted Area"}
              </h2>
              <p
                style={{
                  margin: "3px 0 0",
                  fontSize: "12px",
                  color: "#8a96b0",
                }}
              >
                {isEdit
                  ? "Update zone details below"
                  : "Add a new zone where fishing is prohibited"}
              </p>
            </div>
          </div>
          <button
            className="zf-close"
            onClick={onClose}
            style={{
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              width: "32px",
              height: "32px",
              borderRadius: "9px",
              fontSize: "13px",
              cursor: "pointer",
              color: "#8a96b0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.15s ease",
              flexShrink: 0,
            }}
          >
            ✕
          </button>
        </div>

        {/* Form body */}
        <div style={{ padding: "20px 26px 26px" }}>
          {/* Area Name */}
          <div style={sectionStyle}>
            <label style={fieldLabel("Area Name")}>Area Name *</label>
            <input
              className="zf-input"
              style={styledInput}
              placeholder="e.g., Mirissa Bay Marine Reserve"
              value={form.name}
              onChange={handleChange("name")}
            />
          </div>

          {/* Map */}
          <div style={sectionStyle}>
            <label style={fieldLabel("Location")}>Location</label>
            <div
              style={{
                borderRadius: "12px",
                overflow: "hidden",
                border: "1px solid #e2e8f0",
                boxShadow: "0 2px 8px rgba(10,22,40,0.06)",
              }}
            >
              <LeafletLocationPicker
                lat={form.lat}
                lng={form.lng}
                onChange={handleMapPick}
              />
            </div>
          </div>

          {/* Lat/Lng */}
          <div style={{ display: "flex", gap: "10px", ...sectionStyle }}>
            {["lat", "lng"].map((field, i) => (
              <div key={field} style={{ flex: 1 }}>
                <label
                  style={{
                    fontSize: "11px",
                    fontWeight: "600",
                    color: "#8a96b0",
                    display: "block",
                    marginBottom: "5px",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                  }}
                >
                  {i === 0 ? "Latitude" : "Longitude"}
                </label>
                <input
                  className="zf-input"
                  style={{
                    ...styledInput,
                    fontFamily: "monospace",
                    fontSize: "12px",
                  }}
                  value={form[field]}
                  onChange={(e) => {
                    handleChange(field)(e);
                    setLocationConfirmed(false);
                  }}
                />
              </div>
            ))}
          </div>

          {/* Confirm Location */}
          <button
            className="confirm-loc"
            onClick={() => setLocationConfirmed(true)}
            style={{
              width: "100%",
              padding: "11px",
              background: locationConfirmed
                ? "linear-gradient(135deg, #16a34a, #15803d)"
                : "linear-gradient(135deg, #1e3a5f, #0a1628)",
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              fontSize: "13px",
              fontWeight: "600",
              cursor: "pointer",
              marginBottom: locationConfirmed ? "8px" : "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "7px",
              boxShadow: locationConfirmed
                ? "0 4px 14px rgba(22,163,74,0.3)"
                : "0 4px 14px rgba(10,22,40,0.2)",
              transition: "all 0.2s ease",
            }}
          >
            <span>📍</span>
            {locationConfirmed ? "Location Confirmed ✓" : "Confirm Location"}
          </button>

          {locationConfirmed && (
            <p
              style={{
                fontSize: "11.5px",
                color: "#6b7a99",
                marginBottom: "16px",
                marginTop: "-2px",
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <span style={{ color: "#16a34a" }}>✓</span>
              {form.lat}, {form.lng}
            </p>
          )}

          {/* Restricted Time */}
          <div style={sectionStyle}>
            <label style={fieldLabel("Restricted Time")}>
              Restricted Time Period *
            </label>
            <input
              className="zf-input"
              style={styledInput}
              placeholder="e.g., 6:00 PM – 6:00 AM, or All Day"
              value={form.restrictedTime}
              onChange={handleChange("restrictedTime")}
            />
          </div>

          {/* Dates */}
          <div style={{ display: "flex", gap: "10px", ...sectionStyle }}>
            {[
              {
                field: "startDate",
                label: "Start Date",
                required: true,
                type: "date",
              },
              {
                field: "endDate",
                label: "End Date (Optional)",
                required: false,
                type: "date",
              },
            ].map(({ field, label, required, type }) => (
              <div key={field} style={{ flex: 1 }}>
                <label
                  style={{
                    fontSize: "11px",
                    fontWeight: "600",
                    color: "#8a96b0",
                    display: "block",
                    marginBottom: "5px",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                  }}
                >
                  {label}
                  {required ? " *" : ""}
                </label>
                <input
                  type={type}
                  className="zf-input"
                  style={styledInput}
                  value={form[field]}
                  onChange={handleChange(field)}
                />
              </div>
            ))}
          </div>

          {/* Photo */}
          <div style={{ marginBottom: "20px" }}>
            <label style={fieldLabel("Area Photo")}>
              Area Photo {isEdit ? "(leave blank to keep existing)" : "*"}
            </label>
            <div
              style={{
                border: "1.5px dashed #c7d2e8",
                borderRadius: "10px",
                padding: "14px 16px",
                background: "#f8fafc",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                cursor: "pointer",
              }}
            >
              <span style={{ fontSize: "20px" }}>🖼</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    margin: 0,
                    fontSize: "12px",
                    fontWeight: "500",
                    color: "#3a4565",
                  }}
                >
                  {form.photo ? form.photo.name : "Choose image file"}
                </p>
                <p
                  style={{
                    margin: "2px 0 0",
                    fontSize: "11px",
                    color: "#94a3b8",
                  }}
                >
                  PNG, JPG, WEBP supported
                </p>
              </div>
              <label
                style={{
                  padding: "6px 12px",
                  background: "#eff6ff",
                  border: "1px solid #bfdbfe",
                  borderRadius: "7px",
                  fontSize: "12px",
                  fontWeight: "500",
                  color: "#1d4ed8",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                Browse
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, photo: e.target.files[0] }))
                  }
                />
              </label>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div
              style={{
                background: "#fff5f5",
                border: "1px solid #fecaca",
                borderRadius: "10px",
                padding: "10px 14px",
                display: "flex",
                gap: "8px",
                alignItems: "flex-start",
                marginBottom: "14px",
              }}
            >
              <span
                style={{ fontSize: "14px", flexShrink: 0, marginTop: "1px" }}
              >
                ⚠️
              </span>
              <p
                style={{
                  fontSize: "13px",
                  color: "#e53e3e",
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                {error}
              </p>
            </div>
          )}

          {/* Submit */}
          <button
            className="zf-submit"
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: "100%",
              padding: "13px",
              background: loading
                ? "#93c5fd"
                : "linear-gradient(135deg, #2563eb, #1d4ed8)",
              color: "#fff",
              border: "none",
              borderRadius: "11px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: loading ? "none" : "0 4px 16px rgba(37,99,235,0.3)",
              letterSpacing: "0.01em",
            }}
          >
            {loading
              ? isEdit
                ? "Saving…"
                : "Adding…"
              : isEdit
                ? "Save Changes"
                : "Add Restricted Area"}
          </button>
        </div>
      </div>
    </div>
  );
}
