// src/pages/authorized/SubmitInvestigation.jsx
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import { API_BASE, inputStyle, focusStyle, ACTION_OPTIONS } from "../../components/authorizedDashboard/dashboardConstants";

const labelStyle = { display: "block", fontSize: "13px", fontWeight: "500", color: "#374263", marginBottom: "6px" };
const sectionTitleStyle = { fontSize: "12px", fontWeight: "600", color: "#374263", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "16px", paddingBottom: "10px", borderBottom: "1px solid #f0f4f8" };

function Field({ label, children }) { return <div><label style={labelStyle}>{label}</label>{children}</div>; }
function RadioCard({ name, value, checked, onChange, accentColor = "#22d3b0", children }) {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: "8px", padding: "9px 13px", border: `1px solid ${checked ? accentColor : "#dde3ee"}`, borderRadius: "8px", cursor: "pointer", fontSize: "13px", background: checked ? `${accentColor}10` : "#fff", color: checked ? (accentColor === "#ef4444" ? "#991b1b" : "#0a6155") : "#374263", fontWeight: checked ? "500" : "400", transition: "all 0.15s" }}>
      <input type="radio" name={name} value={value} checked={checked} onChange={onChange} style={{ accentColor }} />
      {children}
    </label>
  );
}

export default function SubmitInvestigation() {
  const { investigationId } = useParams(); // Must be a real ID from backend
  const navigate = useNavigate();
  const [focused, setFocused] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);
  const [videoFiles, setVideoFiles] = useState([]);

  const [form, setForm] = useState({
    visited: "true",
    actualSituation: "",
    illegalActivityFound: "false",
    actionTaken: "NO_ACTION",
    actionDescription: "",
    fineAmount: "",
    visitDate: new Date().toISOString().split("T")[0],
    visitTime: new Date().toTimeString().slice(0, 5),
    officerNotes: "",
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const fi = (name) => ({
    ...inputStyle,
    border: `1px solid ${focused === name ? "#22d3b0" : "#dde3ee"}`,
    boxShadow: focused === name ? focusStyle.boxShadow : "none",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.actualSituation.trim()) return alert("Please describe the actual situation.");
    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => formData.append(k, v));
    imageFiles.forEach(f => formData.append("images", f));
    videoFiles.forEach(f => formData.append("videos", f));
    try {
      setSubmitting(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/investigations/submit/${investigationId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const json = await res.json();
      if (res.ok) {
        alert("Investigation submitted successfully!");
        navigate("/authorized");
      } else {
        alert(json.message || "Failed to submit investigation");
      }
    } catch (err) {
      alert("Network error: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm("Cancel this investigation? The report will return to Pending status.")) return;
    try {
      setCancelling(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/investigations/cancel/${investigationId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        alert("Investigation cancelled.");
        navigate("/authorized");
      } else {
        const json = await res.json();
        alert(json.message || "Failed to cancel");
      }
    } catch (err) {
      alert("Network error: " + err.message);
    } finally {
      setCancelling(false);
    }
  };

  if (!investigationId || investigationId === "new") {
    return (
      <Layout>
        <div style={{ padding: "60px 20px", textAlign: "center", color: "#9aa4be" }}>
          Invalid investigation ID. Please start an investigation first from the dashboard.
          <button onClick={() => navigate("/authorized")} style={{ marginLeft: "12px", padding: "6px 12px", background: "#2563eb", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}>Go to Dashboard</button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div style={{ maxWidth: "780px", margin: "0 auto" }}>
        <button onClick={() => navigate("/authorized")} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "13px", color: "#9aa4be", padding: 0, marginBottom: "12px", fontFamily: "inherit" }}>← Back to Dashboard</button>
        <div style={{ marginBottom: "28px" }}>
          <h1 style={{ margin: 0, fontSize: "26px", fontWeight: "700", color: "#0a1628" }}>Submit Investigation Report</h1>
          <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#8a96b0" }}>Fill in your field findings for this investigation</p>
        </div>
        <form onSubmit={handleSubmit}>
          {/* Section 1: Visit Details */}
          <div style={{ background: "#fff", border: "1px solid #dde3ee", borderRadius: "12px", padding: "24px", marginBottom: "16px" }}>
            <div style={sectionTitleStyle}>1 · Visit Details</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
              <Field label="Visit Date"><input type="date" name="visitDate" value={form.visitDate} onChange={handleChange} style={fi("visitDate")} onFocus={() => setFocused("visitDate")} onBlur={() => setFocused(null)} required /></Field>
              <Field label="Visit Time"><input type="time" name="visitTime" value={form.visitTime} onChange={handleChange} style={fi("visitTime")} onFocus={() => setFocused("visitTime")} onBlur={() => setFocused(null)} required /></Field>
            </div>
            <Field label="Did you visit the site?">
              <div style={{ display: "flex", gap: "10px" }}>
                <RadioCard name="visited" value="true" checked={form.visited === "true"} onChange={handleChange}>Yes, I visited</RadioCard>
                <RadioCard name="visited" value="false" checked={form.visited === "false"} onChange={handleChange}>Unable to visit</RadioCard>
              </div>
            </Field>
          </div>

          {/* Section 2: Findings */}
          <div style={{ background: "#fff", border: "1px solid #dde3ee", borderRadius: "12px", padding: "24px", marginBottom: "16px" }}>
            <div style={sectionTitleStyle}>2 · Investigation Findings</div>
            <Field label="Actual Situation at Site">
              <textarea name="actualSituation" value={form.actualSituation} onChange={handleChange} placeholder="Describe what you found at the location in detail…" rows={4} required style={{ ...fi("actualSituation"), resize: "vertical", lineHeight: "1.6" }} onFocus={() => setFocused("actualSituation")} onBlur={() => setFocused(null)} />
            </Field>
            <Field label="Was illegal activity found?">
              <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
                <RadioCard name="illegalActivityFound" value="true" checked={form.illegalActivityFound === "true"} onChange={handleChange} accentColor="#ef4444">Yes — illegal activity confirmed</RadioCard>
                <RadioCard name="illegalActivityFound" value="false" checked={form.illegalActivityFound === "false"} onChange={handleChange}>No — no illegal activity</RadioCard>
              </div>
            </Field>
          </div>

          {/* Section 3: Action Taken */}
          <div style={{ background: "#fff", border: "1px solid #dde3ee", borderRadius: "12px", padding: "24px", marginBottom: "16px" }}>
            <div style={sectionTitleStyle}>3 · Action Taken</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", marginBottom: "16px" }}>
              {ACTION_OPTIONS.map(opt => <RadioCard key={opt.value} name="actionTaken" value={opt.value} checked={form.actionTaken === opt.value} onChange={handleChange}>{opt.label}</RadioCard>)}
            </div>
            {form.actionTaken === "FINE" && (
              <Field label="Fine Amount (LKR)">
                <input type="number" name="fineAmount" value={form.fineAmount} onChange={handleChange} placeholder="e.g. 25000" min="0" style={fi("fineAmount")} onFocus={() => setFocused("fineAmount")} onBlur={() => setFocused(null)} />
              </Field>
            )}
            <Field label="Action Description">
              <textarea name="actionDescription" value={form.actionDescription} onChange={handleChange} placeholder="Describe the action taken…" rows={3} style={{ ...fi("actionDescription"), resize: "vertical", lineHeight: "1.6" }} onFocus={() => setFocused("actionDescription")} onBlur={() => setFocused(null)} />
            </Field>
            <Field label="Officer Notes (optional)">
              <textarea name="officerNotes" value={form.officerNotes} onChange={handleChange} placeholder="Any additional observations…" rows={2} style={{ ...fi("officerNotes"), resize: "vertical", lineHeight: "1.6" }} onFocus={() => setFocused("officerNotes")} onBlur={() => setFocused(null)} />
            </Field>
          </div>

          {/* Section 4: Evidence */}
          <div style={{ background: "#fff", border: "1px solid #dde3ee", borderRadius: "12px", padding: "24px", marginBottom: "24px" }}>
            <div style={sectionTitleStyle}>4 · Evidence Upload</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div style={{ border: "1px dashed #c8d3e8", borderRadius: "8px", padding: "18px", background: "#f7f9fc" }}>
                <label style={{ ...labelStyle, marginBottom: "10px" }}>Photos <span style={{ fontWeight: "400", color: "#9aa4be" }}>(max 5, images only)</span></label>
                <input type="file" multiple accept="image/*" onChange={e => setImageFiles(Array.from(e.target.files))} style={{ fontSize: "13px", color: "#374263", cursor: "pointer", width: "100%" }} />
                {imageFiles.length > 0 && <div style={{ marginTop: "8px", fontSize: "12px", color: "#22d3b0", fontWeight: "500" }}>✓ {imageFiles.length} photo{imageFiles.length > 1 ? "s" : ""} selected</div>}
              </div>
              <div style={{ border: "1px dashed #c8d3e8", borderRadius: "8px", padding: "18px", background: "#f7f9fc" }}>
                <label style={{ ...labelStyle, marginBottom: "10px" }}>Videos <span style={{ fontWeight: "400", color: "#9aa4be" }}>(max 3, up to 50MB each)</span></label>
                <input type="file" multiple accept="video/*" onChange={e => setVideoFiles(Array.from(e.target.files))} style={{ fontSize: "13px", color: "#374263", cursor: "pointer", width: "100%" }} />
                {videoFiles.length > 0 && <div style={{ marginTop: "8px", fontSize: "12px", color: "#22d3b0", fontWeight: "500" }}>✓ {videoFiles.length} video{videoFiles.length > 1 ? "s" : ""} selected</div>}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
            <button type="button" onClick={handleCancel} disabled={cancelling} style={{ padding: "10px 20px", fontSize: "13px", fontWeight: "500", background: cancelling ? "#f0f4f8" : "rgba(239,68,68,0.08)", color: cancelling ? "#b0bac9" : "#991b1b", border: `1px solid ${cancelling ? "#e4eaf3" : "rgba(239,68,68,0.25)"}`, borderRadius: "8px", cursor: cancelling ? "not-allowed" : "pointer" }}>
              {cancelling ? "Cancelling…" : "Cancel Investigation"}
            </button>
            <button type="submit" disabled={submitting} style={{ padding: "10px 28px", fontSize: "13px", fontWeight: "600", background: submitting ? "#c5cfe0" : "linear-gradient(135deg, #22d3b0, #0ea5e9)", color: "#fff", border: "none", borderRadius: "8px", cursor: submitting ? "not-allowed" : "pointer" }}>
              {submitting ? "Submitting…" : "Submit Investigation"}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}