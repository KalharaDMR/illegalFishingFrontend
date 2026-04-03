import React, { useState } from "react";
import { API_BASE, inputStyle } from "./dashboardConstants";

// ── Delete Confirm Dialog ────────────────────────────────────
export function DeleteConfirmModal({ zone, onConfirm, onCancel, loading }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(10,22,40,0.55)",
        zIndex: 1100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "12px",
          padding: "28px 30px",
          maxWidth: "400px",
          width: "100%",
          boxShadow: "0 20px 50px rgba(0,0,0,0.2)",
        }}
      >
        <h3 style={{ margin: "0 0 10px", fontSize: "17px", color: "#0a1628" }}>
          Delete Zone
        </h3>
        <p
          style={{
            margin: "0 0 20px",
            fontSize: "13px",
            color: "#6b7a99",
            lineHeight: 1.6,
          }}
        >
          Are you sure you want to delete <strong>{zone.name}</strong>? This
          cannot be undone.
        </p>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              padding: "10px",
              border: "1px solid #dde3ee",
              borderRadius: "8px",
              background: "#f8fafc",
              color: "#3a4565",
              fontSize: "13px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            style={{
              flex: 1,
              padding: "10px",
              border: "none",
              borderRadius: "8px",
              background: loading ? "#fca5a5" : "#e53e3e",
              color: "#fff",
              fontSize: "13px",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Deleting…" : "Yes, Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Add / Edit Zone Modal ────────────────────────────────────
// zone=null → Create mode (POST /api/zones)
// zone=object → Edit mode  (PUT  /api/zones/:id)
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
      if (!ct.includes("application/json")) {
        throw new Error(
          `Server unreachable at ${API_BASE}. Check backend is running.`,
        );
      }

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || `Request failed (${res.status})`);
      }

      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const mapSrc = `https://maps.google.com/maps?q=${form.lat},${form.lng}&z=8&output=embed`;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(10,22,40,0.55)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "14px",
          width: "100%",
          maxWidth: "520px",
          maxHeight: "90vh",
          overflowY: "auto",
          padding: "28px 30px",
          boxShadow: "0 24px 60px rgba(0,0,0,0.2)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "18px",
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: "18px",
                fontWeight: "700",
                color: "#0a1628",
              }}
            >
              {isEdit ? "Edit Restricted Area" : "Mark Restricted Fishing Area"}
            </h2>
            <p
              style={{ margin: "4px 0 0", fontSize: "13px", color: "#8a96b0" }}
            >
              {isEdit
                ? "Update zone details below"
                : "Add a new restricted area where fishing is prohibited"}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              fontSize: "18px",
              cursor: "pointer",
              color: "#8a96b0",
            }}
          >
            ✕
          </button>
        </div>

        {/* Name */}
        <div style={{ marginBottom: "14px" }}>
          <label
            style={{
              fontSize: "13px",
              fontWeight: "500",
              color: "#3a4565",
              display: "block",
              marginBottom: "6px",
            }}
          >
            Area Name *
          </label>
          <input
            style={inputStyle}
            placeholder="e.g., Mirissa Bay Marine Reserve"
            value={form.name}
            onChange={handleChange("name")}
          />
        </div>

        {/* Map preview */}
        <div style={{ marginBottom: "12px" }}>
          <label
            style={{
              fontSize: "13px",
              fontWeight: "500",
              color: "#3a4565",
              display: "block",
              marginBottom: "6px",
            }}
          >
            Location
          </label>
          <div
            style={{
              borderRadius: "8px",
              overflow: "hidden",
              border: "1px solid #dde3ee",
              height: "190px",
            }}
          >
            <iframe
              title="location-map"
              src={mapSrc}
              width="100%"
              height="100%"
              style={{ border: 0, display: "block" }}
              allowFullScreen
              loading="lazy"
            />
          </div>
        </div>

        {/* Lat / Lng */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
          <div style={{ flex: 1 }}>
            <label
              style={{
                fontSize: "12px",
                color: "#6b7a99",
                display: "block",
                marginBottom: "4px",
              }}
            >
              Latitude
            </label>
            <input
              style={inputStyle}
              value={form.lat}
              onChange={handleChange("lat")}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label
              style={{
                fontSize: "12px",
                color: "#6b7a99",
                display: "block",
                marginBottom: "4px",
              }}
            >
              Longitude
            </label>
            <input
              style={inputStyle}
              value={form.lng}
              onChange={handleChange("lng")}
            />
          </div>
        </div>

        {/* Confirm Location */}
        <button
          onClick={() => setLocationConfirmed(true)}
          style={{
            width: "100%",
            padding: "11px",
            background: locationConfirmed ? "#16a34a" : "#0a1628",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            fontSize: "13px",
            fontWeight: "600",
            cursor: "pointer",
            marginBottom: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
          }}
        >
          <span>📍</span>
          {locationConfirmed ? "Location Confirmed ✓" : "Confirm Location"}
        </button>

        {locationConfirmed && (
          <p
            style={{ fontSize: "12px", color: "#6b7a99", marginBottom: "12px" }}
          >
            Location: {form.lat}, {form.lng}
          </p>
        )}

        {/* Time */}
        <div style={{ marginBottom: "14px" }}>
          <label
            style={{
              fontSize: "13px",
              fontWeight: "500",
              color: "#3a4565",
              display: "block",
              marginBottom: "6px",
            }}
          >
            Restricted Time Period *
          </label>
          <input
            style={inputStyle}
            placeholder="e.g., 6:00 PM - 6:00 AM, or All Day"
            value={form.restrictedTime}
            onChange={handleChange("restrictedTime")}
          />
        </div>

        {/* Dates */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "14px" }}>
          <div style={{ flex: 1 }}>
            <label
              style={{
                fontSize: "12px",
                color: "#6b7a99",
                display: "block",
                marginBottom: "4px",
              }}
            >
              Start Date *
            </label>
            <input
              type="date"
              style={inputStyle}
              value={form.startDate}
              onChange={handleChange("startDate")}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label
              style={{
                fontSize: "12px",
                color: "#6b7a99",
                display: "block",
                marginBottom: "4px",
              }}
            >
              End Date (Optional)
            </label>
            <input
              type="date"
              style={inputStyle}
              value={form.endDate}
              onChange={handleChange("endDate")}
            />
          </div>
        </div>

        {/* Photo */}
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              fontSize: "13px",
              fontWeight: "500",
              color: "#3a4565",
              display: "block",
              marginBottom: "6px",
            }}
          >
            Area Photo {isEdit ? "(leave blank to keep existing)" : "*"}
          </label>
          <input
            type="file"
            accept="image/*"
            style={inputStyle}
            onChange={(e) =>
              setForm((f) => ({ ...f, photo: e.target.files[0] }))
            }
          />
        </div>

        {error && (
          <p
            style={{ fontSize: "13px", color: "#e53e3e", marginBottom: "10px" }}
          >
            {error}
          </p>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px",
            background: loading ? "#93c5fd" : "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "600",
            cursor: loading ? "not-allowed" : "pointer",
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
  );
}
