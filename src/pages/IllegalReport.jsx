import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { getDistricts } from "../api/districts";
import Layout from "../components/Layout";

export default function IllegalReport() {
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const leafletMap = useRef(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [districts, setDistricts] = useState([]);
  const [step, setStep] = useState(1); // 1=details, 2=location, 3=evidence
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  const [form, setForm] = useState({
    district: "",
    reportDate: "",
    reportTime: "",
    location: "",
    latitude: "",
    longitude: "",
    description: "",
  });

  useEffect(() => {
    getDistricts().then(setDistricts);
  }, []);

  useEffect(() => {
    if (step !== 2) return;
    if (leafletMap.current) return;

    setTimeout(() => {
      if (!mapRef.current) return;

      const map = L.map(mapRef.current).setView([7.8731, 80.7718], 7);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(map);

      map.on("click", function (e) {
        const { lat, lng } = e.latlng;
        setForm((prev) => ({
          ...prev,
          latitude: lat.toFixed(6),
          longitude: lng.toFixed(6),
        }));
        if (markerRef.current) map.removeLayer(markerRef.current);
        markerRef.current = L.marker([lat, lng]).addTo(map);
      });

      leafletMap.current = map;
    }, 100);
  }, [step]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFiles = (e) => {
    const selected = [...e.target.files];
    setFiles(selected);
    const urls = selected.map((f) => URL.createObjectURL(f));
    setPreviews(urls);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    const data = new FormData();
    Object.keys(form).forEach((key) => data.append(key, form[key]));
    files.forEach((file) => data.append("evidence", file));

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("http://localhost:5000/api/reports", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setMessage({ text: res.data.message || "Report submitted successfully!", type: "success" });
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (err) {
      setMessage({ text: err?.response?.data?.message || "Submission failed. Please try again.", type: "error" });
    }
    setLoading(false);
  };

  const canProceed1 =
    form.district && form.reportDate && form.reportTime && form.description;
  const canProceed2 = form.latitude && form.longitude;

  const steps = ["Incident Details", "Pin Location", "Attach Evidence"];

  return (
    <Layout>
      <div style={s.page}>
        {/* Header */}
        <div style={s.header}>
          <button style={s.backBtn} onClick={() => navigate("/dashboard")}>
            ← Back
          </button>
          <div>
            <h1 style={s.title}>🚨 Report Illegal Activity</h1>
            <p style={s.subtitle}>
              Help protect Sri Lanka's marine ecosystem
            </p>
          </div>
        </div>

        {/* Step indicator */}
        <div style={s.stepRow}>
          {steps.map((label, i) => {
            const num = i + 1;
            const done = step > num;
            const active = step === num;
            return (
              <React.Fragment key={label}>
                <div style={s.stepItem}>
                  <div
                    style={{
                      ...s.stepCircle,
                      background: done ? "#2ed573" : active ? "#00d4ff" : "#eef2f7",
                      color: done || active ? "#fff" : "#8a96b0",
                    }}
                  >
                    {done ? "✓" : num}
                  </div>
                  <div
                    style={{
                      ...s.stepLabel,
                      color: active ? "#0d1b2a" : done ? "#2ed573" : "#8a96b0",
                      fontWeight: active ? 700 : 500,
                    }}
                  >
                    {label}
                  </div>
                </div>
                {i < steps.length - 1 && (
                  <div style={{ ...s.stepLine, background: step > num ? "#2ed573" : "#eef2f7" }} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Form card */}
        <div style={s.card}>
          {/* Message */}
          {message.text && (
            <div
              style={{
                ...s.msg,
                background: message.type === "success" ? "rgba(46,213,115,0.1)" : "rgba(255,71,87,0.1)",
                borderColor: message.type === "success" ? "#2ed573" : "#ff4757",
                color: message.type === "success" ? "#2ed573" : "#ff4757",
              }}
            >
              {message.type === "success" ? "✅" : "⚠️"} {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* ── Step 1 ── */}
            {step === 1 && (
              <div style={s.stepContent}>
                <div style={s.sectionTitle}>📝 Incident Details</div>

                <div style={s.fieldGroup}>
                  <label style={s.label}>District *</label>
                  <select
                    name="district"
                    value={form.district}
                    onChange={handleChange}
                    style={s.input}
                    required
                  >
                    <option value="">Select district</option>
                    {districts.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div style={s.row}>
                  <div style={s.fieldGroup}>
                    <label style={s.label}>Date of Incident *</label>
                    <input
                      type="date"
                      name="reportDate"
                      value={form.reportDate}
                      onChange={handleChange}
                      style={s.input}
                      required
                    />
                  </div>
                  <div style={s.fieldGroup}>
                    <label style={s.label}>Time of Incident *</label>
                    <input
                      type="time"
                      name="reportTime"
                      value={form.reportTime}
                      onChange={handleChange}
                      style={s.input}
                      required
                    />
                  </div>
                </div>

                <div style={s.fieldGroup}>
                  <label style={s.label}>Location Description</label>
                  <input
                    type="text"
                    placeholder="e.g. Near Mirissa Harbour"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    style={s.input}
                  />
                </div>

                <div style={s.fieldGroup}>
                  <label style={s.label}>Incident Description *</label>
                  <textarea
                    placeholder="Describe what you witnessed in detail…"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    style={{ ...s.input, minHeight: 120, resize: "vertical" }}
                    required
                  />
                </div>

                <button
                  type="button"
                  style={{ ...s.btn, opacity: canProceed1 ? 1 : 0.5 }}
                  disabled={!canProceed1}
                  onClick={() => setStep(2)}
                >
                  Continue to Location →
                </button>
              </div>
            )}

            {/* ── Step 2 ── */}
            {step === 2 && (
              <div style={s.stepContent}>
                <div style={s.sectionTitle}>📍 Pin the Incident Location</div>
                <p style={s.hint}>Click anywhere on the map to drop a pin at the exact incident location.</p>

                <div ref={mapRef} style={s.mapBox} />

                {form.latitude && (
                  <div style={s.coordsDisplay}>
                    <span>📌 Lat: <b>{form.latitude}</b></span>
                    <span>Lng: <b>{form.longitude}</b></span>
                  </div>
                )}

                <div style={s.row}>
                  <button type="button" style={s.btnSecondary} onClick={() => setStep(1)}>
                    ← Back
                  </button>
                  <button
                    type="button"
                    style={{ ...s.btn, flex: 1, opacity: canProceed2 ? 1 : 0.5 }}
                    disabled={!canProceed2}
                    onClick={() => setStep(3)}
                  >
                    Continue to Evidence →
                  </button>
                </div>
              </div>
            )}

            {/* ── Step 3 ── */}
            {step === 3 && (
              <div style={s.stepContent}>
                <div style={s.sectionTitle}>📸 Attach Evidence</div>
                <p style={s.hint}>Upload up to 5 photos or videos (max 20MB each). Evidence strengthens your report.</p>

                <label style={s.uploadZone}>
                  <input
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={handleFiles}
                    style={{ display: "none" }}
                  />
                  <div style={s.uploadIcon}>📁</div>
                  <div style={s.uploadText}>
                    {files.length > 0
                      ? `${files.length} file(s) selected`
                      : "Click to upload files"}
                  </div>
                  <div style={s.uploadSub}>JPG, PNG, MP4 up to 20MB each</div>
                </label>

                {previews.length > 0 && (
                  <div style={s.previewGrid}>
                    {previews.map((url, i) => (
                      <img key={i} src={url} alt="" style={s.previewImg} />
                    ))}
                  </div>
                )}

                {/* Summary */}
                <div style={s.summaryBox}>
                  <div style={s.summaryTitle}>📋 Report Summary</div>
                  <div style={s.summaryRow}><span>District</span><b>{form.district}</b></div>
                  <div style={s.summaryRow}><span>Date & Time</span><b>{form.reportDate} at {form.reportTime}</b></div>
                  <div style={s.summaryRow}><span>Location</span><b>{form.location || "See map pin"}</b></div>
                  <div style={s.summaryRow}><span>Coordinates</span><b>{form.latitude}, {form.longitude}</b></div>
                  <div style={s.summaryRow}><span>Evidence Files</span><b>{files.length} file(s)</b></div>
                </div>

                <div style={s.row}>
                  <button type="button" style={s.btnSecondary} onClick={() => setStep(2)}>
                    ← Back
                  </button>
                  <button
                    type="submit"
                    style={{ ...s.btn, flex: 1, background: loading ? "#8a96b0" : "linear-gradient(135deg, #ff4757, #ff6b81)" }}
                    disabled={loading}
                  >
                    {loading ? "Submitting…" : "🚨 Submit Report"}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </Layout>
  );
}

const s = {
  page: {
    fontFamily: "'Sora', 'DM Sans', system-ui, sans-serif",
    maxWidth: 720,
    margin: "0 auto",
    paddingBottom: 48,
  },
  header: {
    display: "flex",
    alignItems: "flex-start",
    gap: 16,
    marginBottom: 28,
  },
  backBtn: {
    background: "#fff",
    border: "1.5px solid #eef2f7",
    borderRadius: 10,
    padding: "8px 16px",
    fontSize: 13,
    fontWeight: 600,
    color: "#5a6480",
    cursor: "pointer",
    marginTop: 6,
    flexShrink: 0,
  },
  title: { fontSize: 26, fontWeight: 800, color: "#0d1b2a", margin: "0 0 4px", letterSpacing: "-0.02em" },
  subtitle: { fontSize: 14, color: "#8a96b0", margin: 0 },
  stepRow: {
    display: "flex",
    alignItems: "center",
    marginBottom: 28,
  },
  stepItem: { display: "flex", flexDirection: "column", alignItems: "center", gap: 6 },
  stepCircle: {
    width: 36,
    height: 36,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    fontSize: 14,
    transition: "all 0.2s",
  },
  stepLabel: { fontSize: 11, letterSpacing: "0.04em", textAlign: "center", maxWidth: 80 },
  stepLine: { flex: 1, height: 2, margin: "0 8px", marginBottom: 22, transition: "background 0.3s" },
  card: {
    background: "#fff",
    borderRadius: 20,
    padding: "32px 36px",
    boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
    border: "1.5px solid #eef2f7",
  },
  stepContent: { display: "flex", flexDirection: "column", gap: 20 },
  sectionTitle: { fontSize: 17, fontWeight: 700, color: "#0d1b2a" },
  hint: { fontSize: 13, color: "#8a96b0", margin: "-12px 0 4px" },
  fieldGroup: { display: "flex", flexDirection: "column", gap: 7 },
  label: { fontSize: 12, fontWeight: 700, color: "#5a6480", letterSpacing: "0.05em", textTransform: "uppercase" },
  input: {
    padding: "12px 14px",
    borderRadius: 10,
    border: "1.5px solid #e4eaf3",
    fontSize: 14,
    color: "#0d1b2a",
    fontFamily: "inherit",
    outline: "none",
    transition: "border 0.15s",
    background: "#fafbfd",
  },
  row: { display: "flex", gap: 14 },
  btn: {
    padding: "13px 24px",
    background: "linear-gradient(135deg, #0078c8, #00d4ff)",
    color: "#fff",
    border: "none",
    borderRadius: 12,
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    transition: "opacity 0.15s",
    letterSpacing: "0.02em",
  },
  btnSecondary: {
    padding: "13px 20px",
    background: "#f0f4f8",
    color: "#5a6480",
    border: "none",
    borderRadius: 12,
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
  },
  mapBox: {
    width: "100%",
    height: 320,
    borderRadius: 14,
    overflow: "hidden",
    border: "1.5px solid #e4eaf3",
  },
  coordsDisplay: {
    display: "flex",
    gap: 20,
    background: "rgba(0,212,255,0.08)",
    borderRadius: 10,
    padding: "10px 16px",
    fontSize: 13,
    color: "#0d1b2a",
  },
  uploadZone: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    border: "2px dashed #c8d6e5",
    borderRadius: 14,
    padding: "32px",
    cursor: "pointer",
    background: "#fafbfd",
    transition: "border-color 0.15s",
  },
  uploadIcon: { fontSize: 32 },
  uploadText: { fontSize: 15, fontWeight: 600, color: "#0d1b2a" },
  uploadSub: { fontSize: 12, color: "#8a96b0" },
  previewGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
    gap: 10,
  },
  previewImg: {
    width: "100%",
    aspectRatio: "1",
    objectFit: "cover",
    borderRadius: 10,
    border: "1.5px solid #eef2f7",
  },
  summaryBox: {
    background: "#f8fafd",
    borderRadius: 14,
    padding: "18px 20px",
    border: "1.5px solid #eef2f7",
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  summaryTitle: { fontSize: 13, fontWeight: 700, color: "#5a6480", marginBottom: 4 },
  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 13,
    color: "#5a6480",
  },
  msg: {
    padding: "12px 16px",
    borderRadius: 10,
    border: "1.5px solid",
    fontSize: 14,
    fontWeight: 600,
    marginBottom: 8,
  },
};