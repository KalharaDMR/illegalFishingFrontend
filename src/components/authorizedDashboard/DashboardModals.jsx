import React, { useState } from "react";
import { API_BASE, inputStyle } from "./dashboardConstants";
import LeafletLocationPicker from "./LeafletLocationPicker";

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');`;

const Icon = ({ d, size = 16, strokeWidth = 1.6 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ display: "block", flexShrink: 0 }}
  >
    <path d={d} />
  </svg>
);

const IC = {
  x: "M18 6L6 18M6 6l12 12",
  trash: "M3 6h18M8 6V4h8v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6",
  pin: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z",
  edit: "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
  check: "M20 6L9 17l-5-5",
  warning:
    "M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01",
  img: "M21 15l-5-5L5 21M3 3h18v18H3zM8.5 10a1.5 1.5 0 100-3 1.5 1.5 0 000 3z",
};

const sectionStyle = { marginBottom: "18px" };

const FieldLabel = ({ children }) => (
  <label
    style={{
      fontSize: "11px",
      fontWeight: "700",
      color: "#475569",
      display: "block",
      marginBottom: "7px",
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      fontFamily: "'DM Sans', sans-serif",
    }}
  >
    {children}
  </label>
);

// ── Delete Confirm Modal ──────────────────────────────────────
export function DeleteConfirmModal({ zone, onConfirm, onCancel, loading }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(8,18,40,0.62)",
        backdropFilter: "blur(8px)",
        zIndex: 1100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <style>
        {FONT_IMPORT +
          `
        @keyframes slideUp { from { opacity:0; transform:translateY(18px) scale(0.97) } to { opacity:1; transform:translateY(0) scale(1) } }
      `}
      </style>

      <div
        style={{
          background: "#ffffff",
          borderRadius: "22px",
          maxWidth: "400px",
          width: "100%",
          boxShadow:
            "0 32px 80px rgba(8,18,40,0.2), 0 0 0 1.5px rgba(232,72,68,0.1)",
          overflow: "hidden",
          animation: "slideUp 0.22s cubic-bezier(0.16,1,0.3,1)",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {/* Top accent bar */}
        <div
          style={{
            height: "4px",
            background: "linear-gradient(90deg, #dc2626, #f87171, #fca5a5)",
          }}
        />

        <div style={{ padding: "30px 30px 28px" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "14px",
              background: "linear-gradient(135deg, #fff1f2, #fee2e2)",
              border: "1.5px solid #fecaca",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#dc2626",
              marginBottom: "18px",
              boxShadow: "0 4px 14px rgba(220,38,38,0.12)",
            }}
          >
            <Icon d={IC.trash} size={20} strokeWidth={1.6} />
          </div>

          <h3
            style={{
              margin: "0 0 9px",
              fontSize: "18px",
              fontWeight: "700",
              color: "#0d1f3c",
              letterSpacing: "-0.4px",
            }}
          >
            Delete Zone
          </h3>
          <p
            style={{
              margin: "0 0 26px",
              fontSize: "13.5px",
              color: "#5a6a86",
              lineHeight: 1.65,
            }}
          >
            Are you sure you want to delete{" "}
            <strong style={{ color: "#0d1f3c", fontWeight: "700" }}>
              {zone.name}
            </strong>
            ? This action cannot be undone.
          </p>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={onCancel}
              style={{
                flex: 1,
                padding: "12px 0",
                border: "1.5px solid #e2e8f0",
                borderRadius: "11px",
                background: "#f8fafc",
                color: "#334155",
                fontSize: "13.5px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.15s",
                fontFamily: "'DM Sans', sans-serif",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#eef2f8";
                e.currentTarget.style.borderColor = "#c8d3e8";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#f8fafc";
                e.currentTarget.style.borderColor = "#e2e8f0";
              }}
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              style={{
                flex: 1,
                padding: "12px 0",
                border: "none",
                borderRadius: "11px",
                background: loading
                  ? "#fca5a5"
                  : "linear-gradient(135deg, #dc2626, #b91c1c)",
                color: "#fff",
                fontSize: "13.5px",
                fontWeight: "700",
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: loading ? "none" : "0 6px 18px rgba(220,38,38,0.3)",
                transition: "all 0.15s",
                fontFamily: "'DM Sans', sans-serif",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "7px",
              }}
              onMouseEnter={(e) => {
                if (!loading)
                  e.currentTarget.style.background =
                    "linear-gradient(135deg, #b91c1c, #991b1b)";
              }}
              onMouseLeave={(e) => {
                if (!loading)
                  e.currentTarget.style.background =
                    "linear-gradient(135deg, #dc2626, #b91c1c)";
              }}
            >
              {loading ? "Deleting…" : "Yes, Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Zone Form Modal ───────────────────────────────────────────
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
    borderRadius: "11px",
    border: "1.5px solid #d0d9e8",
    fontSize: "13.5px",
    padding: "11px 14px",
    color: "#0d1f3c",
    fontWeight: "500",
    background: "#ffffff",
    fontFamily: "'DM Sans', sans-serif",
    transition: "border-color 0.18s ease, box-shadow 0.18s ease",
    outline: "none",
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(8,18,40,0.65)",
        backdropFilter: "blur(10px)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <style>
        {FONT_IMPORT +
          `
        @keyframes slideUp { from { opacity:0; transform:translateY(24px) scale(0.97) } to { opacity:1; transform:translateY(0) scale(1) } }
        .zf-input:focus { border-color: #3b82f6 !important; box-shadow: 0 0 0 3.5px rgba(59,130,246,0.12) !important; }
        .zf-input::placeholder { color: #a8b4c8; }
        .modal-scrollbar::-webkit-scrollbar { width: 5px; }
        .modal-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .modal-scrollbar::-webkit-scrollbar-thumb { background: #d0d9e8; border-radius: 6px; }
      `}
      </style>

      <div
        className="modal-scrollbar"
        style={{
          background: "#ffffff",
          borderRadius: "24px",
          width: "100%",
          maxWidth: "530px",
          maxHeight: "92vh",
          overflowY: "auto",
          boxShadow:
            "0 40px 100px rgba(8,18,40,0.24), 0 0 0 1.5px rgba(59,130,246,0.08)",
          animation: "slideUp 0.26s cubic-bezier(0.16,1,0.3,1)",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "24px 28px 22px",
            borderBottom: "1.5px solid #f0f4fa",
            position: "sticky",
            top: 0,
            background: "linear-gradient(to bottom, #ffffff, #fafcff)",
            zIndex: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            borderRadius: "24px 24px 0 0",
          }}
        >
          <div
            style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}
          >
            <div
              style={{
                width: "46px",
                height: "46px",
                borderRadius: "14px",
                background: isEdit
                  ? "linear-gradient(135deg, #eff6ff, #dbeafe)"
                  : "linear-gradient(135deg, #eef2ff, #e0e7ff)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: isEdit ? "#2563eb" : "#4f46e5",
                flexShrink: 0,
                marginTop: "1px",
                border: isEdit ? "1.5px solid #bfdbfe" : "1.5px solid #c7d2fe",
                boxShadow: isEdit
                  ? "0 4px 14px rgba(37,99,235,0.14)"
                  : "0 4px 14px rgba(79,70,229,0.14)",
              }}
            >
              <Icon d={isEdit ? IC.edit : IC.pin} size={19} strokeWidth={1.7} />
            </div>
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: "18px",
                  fontWeight: "700",
                  color: "#0d1f3c",
                  letterSpacing: "-0.4px",
                }}
              >
                {isEdit ? "Edit Restricted Area" : "Mark Restricted Area"}
              </h2>
              <p
                style={{
                  margin: "5px 0 0",
                  fontSize: "12.5px",
                  color: "#7a8aaa",
                }}
              >
                {isEdit
                  ? "Update zone details below"
                  : "Add a new zone where fishing is prohibited"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: "#f1f5f9",
              border: "1.5px solid #e2e8f0",
              width: "34px",
              height: "34px",
              borderRadius: "10px",
              cursor: "pointer",
              color: "#64748b",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.15s",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#e2e8f0";
              e.currentTarget.style.color = "#0d1f3c";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#f1f5f9";
              e.currentTarget.style.color = "#64748b";
            }}
          >
            <Icon d={IC.x} size={14} strokeWidth={2.2} />
          </button>
        </div>

        {/* Form body */}
        <div style={{ padding: "24px 28px 30px" }}>
          {/* Area Name */}
          <div style={sectionStyle}>
            <FieldLabel>Area Name *</FieldLabel>
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
            <FieldLabel>Location</FieldLabel>
            <div
              style={{
                borderRadius: "13px",
                overflow: "hidden",
                border: "1.5px solid #d0d9e8",
                boxShadow: "0 2px 8px rgba(13,31,60,0.06)",
              }}
            >
              <LeafletLocationPicker
                lat={form.lat}
                lng={form.lng}
                onChange={handleMapPick}
              />
            </div>
          </div>

          {/* Lat / Lng */}
          <div style={{ display: "flex", gap: "12px", ...sectionStyle }}>
            {["lat", "lng"].map((field, i) => (
              <div key={field} style={{ flex: 1 }}>
                <FieldLabel>{i === 0 ? "Latitude" : "Longitude"}</FieldLabel>
                <input
                  className="zf-input"
                  style={{
                    ...styledInput,
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "12.5px",
                    color: "#1e3a8a",
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

          {/* Confirm location */}
          <button
            onClick={() => setLocationConfirmed(true)}
            style={{
              width: "100%",
              padding: "13px",
              background: locationConfirmed
                ? "linear-gradient(135deg, #16a34a, #15803d)"
                : "linear-gradient(135deg, #1e3a8a, #1d4ed8)",
              color: "#fff",
              border: "none",
              borderRadius: "12px",
              fontSize: "13.5px",
              fontWeight: "700",
              cursor: "pointer",
              marginBottom: locationConfirmed ? "10px" : "18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "9px",
              boxShadow: locationConfirmed
                ? "0 6px 18px rgba(22,163,74,0.28)"
                : "0 6px 18px rgba(37,99,235,0.28)",
              transition: "all 0.2s ease",
              fontFamily: "'DM Sans', sans-serif",
              letterSpacing: "0.01em",
            }}
          >
            <Icon
              d={locationConfirmed ? IC.check : IC.pin}
              size={15}
              strokeWidth={2.2}
            />
            {locationConfirmed ? "Location Confirmed ✓" : "Confirm Location"}
          </button>

          {locationConfirmed && (
            <p
              style={{
                fontSize: "12px",
                color: "#5a6a86",
                marginBottom: "18px",
                marginTop: "-4px",
                display: "flex",
                alignItems: "center",
                gap: "7px",
                fontFamily: "'DM Mono', monospace",
              }}
            >
              <span style={{ color: "#16a34a", display: "flex" }}>
                <Icon d={IC.check} size={12} strokeWidth={2.8} />
              </span>
              {form.lat}, {form.lng}
            </p>
          )}

          {/* Restricted Time */}
          <div style={sectionStyle}>
            <FieldLabel>Restricted Time Period *</FieldLabel>
            <input
              className="zf-input"
              style={styledInput}
              placeholder="e.g., 6:00 PM – 6:00 AM, or All Day"
              value={form.restrictedTime}
              onChange={handleChange("restrictedTime")}
            />
          </div>

          {/* Dates */}
          <div style={{ display: "flex", gap: "12px", ...sectionStyle }}>
            {[
              { field: "startDate", label: "Start Date *" },
              { field: "endDate", label: "End Date (Optional)" },
            ].map(({ field, label }) => (
              <div key={field} style={{ flex: 1 }}>
                <FieldLabel>{label}</FieldLabel>
                <input
                  type="date"
                  className="zf-input"
                  style={{ ...styledInput, colorScheme: "light" }}
                  value={form[field]}
                  onChange={handleChange(field)}
                />
              </div>
            ))}
          </div>

          {/* Photo upload */}
          <div style={{ marginBottom: "22px" }}>
            <FieldLabel>
              Area Photo {isEdit ? "(leave blank to keep existing)" : "*"}
            </FieldLabel>
            <div
              style={{
                border: "2px dashed #c7d4e8",
                borderRadius: "13px",
                padding: "16px 18px",
                background: "linear-gradient(135deg, #f8faff, #f5f8fe)",
                display: "flex",
                alignItems: "center",
                gap: "14px",
                transition: "border-color 0.15s",
              }}
            >
              <span style={{ color: "#93b4d4" }}>
                <Icon d={IC.img} size={22} strokeWidth={1.3} />
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    margin: 0,
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "#334155",
                  }}
                >
                  {form.photo ? form.photo.name : "Choose image file"}
                </p>
                <p
                  style={{
                    margin: "3px 0 0",
                    fontSize: "11.5px",
                    color: "#94a3b8",
                  }}
                >
                  PNG, JPG, WEBP supported
                </p>
              </div>
              <label
                style={{
                  padding: "8px 16px",
                  background: "linear-gradient(135deg, #eff6ff, #dbeafe)",
                  border: "1.5px solid #93c5fd",
                  borderRadius: "9px",
                  fontSize: "12.5px",
                  fontWeight: "700",
                  color: "#1d4ed8",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  fontFamily: "'DM Sans', sans-serif",
                  transition: "all 0.15s",
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
                background: "linear-gradient(135deg, #fff5f5, #fff0f0)",
                border: "1.5px solid #fecaca",
                borderRadius: "11px",
                padding: "12px 16px",
                display: "flex",
                gap: "11px",
                alignItems: "flex-start",
                marginBottom: "18px",
                boxShadow: "0 2px 8px rgba(220,38,38,0.08)",
              }}
            >
              <span
                style={{ color: "#dc2626", marginTop: "1px", flexShrink: 0 }}
              >
                <Icon d={IC.warning} size={15} strokeWidth={2} />
              </span>
              <p
                style={{
                  fontSize: "13px",
                  color: "#b91c1c",
                  margin: 0,
                  lineHeight: 1.6,
                  fontWeight: "500",
                }}
              >
                {error}
              </p>
            </div>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              background: loading
                ? "#93c5fd"
                : "linear-gradient(135deg, #1d4ed8, #2563eb)",
              color: "#fff",
              border: "none",
              borderRadius: "13px",
              fontSize: "14.5px",
              fontWeight: "700",
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: loading ? "none" : "0 8px 22px rgba(37,99,235,0.32)",
              letterSpacing: "0.02em",
              transition: "all 0.2s ease",
              fontFamily: "'DM Sans', sans-serif",
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 14px 32px rgba(37,99,235,0.38)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = loading
                ? "none"
                : "0 8px 22px rgba(37,99,235,0.32)";
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
