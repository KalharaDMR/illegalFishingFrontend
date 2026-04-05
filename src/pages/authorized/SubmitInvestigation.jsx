// src/pages/authorized/SubmitInvestigation.jsx
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import {
  API_BASE,
  inputStyle,
  focusStyle,
  ACTION_OPTIONS,
} from "../../components/authorizedDashboard/dashboardConstants";

const FONT = `@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@500&display=swap');`;

// ── Icon ──────────────────────────────────────────────────────
const Icon = ({ d, size = 16, strokeWidth = 1.8, color }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color || "currentColor"}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ display: "block", flexShrink: 0 }}
  >
    <path d={d} />
  </svg>
);
const IC = {
  back: "M19 12H5M12 19l-7-7 7-7",
  shield:
    "M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7l-9-5z",
  cal: "M8 2v3M16 2v3M3 8h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z",
  clock: "M12 2a10 10 0 100 20A10 10 0 0012 2zm0 5v5l3 3",
  eye: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 100 6 3 3 0 000-6z",
  alert:
    "M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z",
  check: "M20 6L9 17l-5-5",
  action: "M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9zM13 2v7h7",
  camera:
    "M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2zM12 17a4 4 0 100-8 4 4 0 000 8z",
  video:
    "M15 10l4.553-2.069A1 1 0 0121 8.82v6.362a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z",
  send: "M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z",
  trash: "M3 6h18M8 6V4h8v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6",
  upload: "M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12",
  pin: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z",
};

// ── Section card wrapper ──────────────────────────────────────
function Section({
  number,
  icon,
  title,
  color = "#3b82f6",
  bg = "#eff6ff",
  border = "#bfdbfe",
  children,
}) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1.5px solid #e8edf5",
        borderRadius: "20px",
        overflow: "hidden",
        marginBottom: "16px",
        boxShadow: "0 2px 10px rgba(13,31,60,0.05)",
      }}
    >
      {/* Section header */}
      <div
        style={{
          padding: "16px 24px",
          borderBottom: "1.5px solid #f0f5ff",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          background: "linear-gradient(to right, #f8faff, #ffffff)",
        }}
      >
        <div
          style={{
            width: "34px",
            height: "34px",
            borderRadius: "10px",
            background: bg,
            border: `1.5px solid ${border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color,
            flexShrink: 0,
            boxShadow: `0 3px 10px ${color}20`,
          }}
        >
          <Icon d={icon} size={16} strokeWidth={1.8} />
        </div>
        <div>
          <div
            style={{
              fontSize: "10px",
              fontWeight: "700",
              color: "#94a3b8",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            Step {number}
          </div>
          <div
            style={{
              fontSize: "14px",
              fontWeight: "700",
              color: "#0d1f3c",
              letterSpacing: "-0.2px",
              lineHeight: 1.2,
            }}
          >
            {title}
          </div>
        </div>
      </div>
      <div style={{ padding: "22px 24px" }}>{children}</div>
    </div>
  );
}

// ── Field wrapper ─────────────────────────────────────────────
function Field({ label, hint, children }) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <label
        style={{
          display: "block",
          fontSize: "11px",
          fontWeight: "700",
          color: "#475569",
          marginBottom: "7px",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {label}
        {hint && (
          <span
            style={{
              fontSize: "10.5px",
              color: "#94a3b8",
              fontWeight: "500",
              textTransform: "none",
              letterSpacing: 0,
              marginLeft: "6px",
            }}
          >
            {hint}
          </span>
        )}
      </label>
      {children}
    </div>
  );
}

// ── Radio card ────────────────────────────────────────────────
function RadioCard({
  name,
  value,
  checked,
  onChange,
  variant = "default",
  icon,
  children,
}) {
  const variants = {
    default: {
      active: {
        bg: "linear-gradient(135deg,#eff6ff,#dbeafe)",
        border: "#3b82f6",
        color: "#1d4ed8",
        iconBg: "#dbeafe",
      },
      idle: {
        bg: "#fff",
        border: "#d0d9e8",
        color: "#475569",
        iconBg: "#f1f5f9",
      },
    },
    danger: {
      active: {
        bg: "linear-gradient(135deg,#fff1f2,#fee2e2)",
        border: "#f87171",
        color: "#b91c1c",
        iconBg: "#fee2e2",
      },
      idle: {
        bg: "#fff",
        border: "#d0d9e8",
        color: "#475569",
        iconBg: "#f1f5f9",
      },
    },
    success: {
      active: {
        bg: "linear-gradient(135deg,#f0fdf4,#dcfce7)",
        border: "#4ade80",
        color: "#15803d",
        iconBg: "#dcfce7",
      },
      idle: {
        bg: "#fff",
        border: "#d0d9e8",
        color: "#475569",
        iconBg: "#f1f5f9",
      },
    },
  };
  const v = variants[variant] || variants.default;
  const s = checked ? v.active : v.idle;

  return (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "11px 14px",
        border: `1.5px solid ${s.border}`,
        borderRadius: "12px",
        cursor: "pointer",
        fontSize: "13px",
        fontWeight: checked ? "700" : "500",
        background: s.bg,
        color: s.color,
        transition: "all 0.18s ease",
        fontFamily: "'DM Sans', sans-serif",
        boxShadow: checked ? `0 4px 14px ${s.border}28` : "none",
      }}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        style={{ display: "none" }}
      />
      <span
        style={{
          width: "18px",
          height: "18px",
          borderRadius: "50%",
          border: `2px solid ${s.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          background: checked ? s.border : "transparent",
          transition: "all 0.15s",
        }}
      >
        {checked && (
          <span
            style={{
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              background: "#fff",
            }}
          />
        )}
      </span>
      {children}
    </label>
  );
}

// ── Action radio card (compact grid) ─────────────────────────
function ActionCard({ name, value, checked, onChange, children }) {
  return (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "10px 13px",
        border: `1.5px solid ${checked ? "#3b82f6" : "#d0d9e8"}`,
        borderRadius: "11px",
        cursor: "pointer",
        fontSize: "12.5px",
        fontWeight: checked ? "700" : "500",
        background: checked
          ? "linear-gradient(135deg,#eff6ff,#dbeafe)"
          : "#fff",
        color: checked ? "#1d4ed8" : "#475569",
        transition: "all 0.18s ease",
        fontFamily: "'DM Sans', sans-serif",
        boxShadow: checked ? "0 4px 14px rgba(59,130,246,0.18)" : "none",
      }}
      onMouseEnter={(e) => {
        if (!checked) {
          e.currentTarget.style.borderColor = "#93c5fd";
          e.currentTarget.style.background = "#f8fbff";
        }
      }}
      onMouseLeave={(e) => {
        if (!checked) {
          e.currentTarget.style.borderColor = "#d0d9e8";
          e.currentTarget.style.background = "#fff";
        }
      }}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        style={{ display: "none" }}
      />
      <span
        style={{
          width: "16px",
          height: "16px",
          borderRadius: "50%",
          border: `2px solid ${checked ? "#3b82f6" : "#cbd5e1"}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          background: checked ? "#3b82f6" : "transparent",
          transition: "all 0.15s",
        }}
      >
        {checked && (
          <span
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "#fff",
            }}
          />
        )}
      </span>
      {children}
    </label>
  );
}

// ── Upload drop zone ──────────────────────────────────────────
function UploadZone({ icon, label, hint, accept, multiple, files, onChange }) {
  return (
    <div
      style={{
        border: "2px dashed #c7d4e8",
        borderRadius: "14px",
        padding: "20px",
        background: "linear-gradient(135deg,#f8faff,#f4f7fe)",
        transition: "border-color 0.18s",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "#93c5fd";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "#c7d4e8";
      }}
    >
      <div
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "11px",
          background: "linear-gradient(135deg,#eff6ff,#dbeafe)",
          border: "1.5px solid #bfdbfe",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#3b82f6",
          margin: "0 auto 12px",
          boxShadow: "0 3px 10px rgba(59,130,246,0.12)",
        }}
      >
        <Icon d={icon} size={18} strokeWidth={1.8} />
      </div>
      <p
        style={{
          margin: "0 0 4px",
          fontSize: "13px",
          fontWeight: "700",
          color: "#0d1f3c",
          textAlign: "center",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {label}
      </p>
      <p
        style={{
          margin: "0 0 14px",
          fontSize: "11.5px",
          color: "#7a8aaa",
          textAlign: "center",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {hint}
      </p>
      <label
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "8px 16px",
          background: "linear-gradient(135deg,#1d4ed8,#2563eb)",
          color: "#fff",
          borderRadius: "9px",
          fontSize: "12px",
          fontWeight: "700",
          cursor: "pointer",
          fontFamily: "'DM Sans', sans-serif",
          boxShadow: "0 4px 12px rgba(37,99,235,0.24)",
          gap: "7px",
        }}
      >
        <Icon d={IC.upload} size={13} strokeWidth={2.2} />
        Browse Files
        <input
          type="file"
          multiple={multiple}
          accept={accept}
          onChange={onChange}
          style={{ display: "none" }}
        />
      </label>
      {files.length > 0 && (
        <div
          style={{
            marginTop: "12px",
            padding: "8px 12px",
            background: "linear-gradient(135deg,#f0fdf4,#dcfce7)",
            borderRadius: "9px",
            border: "1.5px solid #86efac",
            display: "flex",
            alignItems: "center",
            gap: "7px",
          }}
        >
          <Icon d={IC.check} size={12} strokeWidth={2.5} color="#15803d" />
          <span
            style={{
              fontSize: "12px",
              fontWeight: "700",
              color: "#15803d",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {files.length} {files.length === 1 ? "file" : "files"} selected
          </span>
        </div>
      )}
    </div>
  );
}

export default function SubmitInvestigation() {
  const { investigationId } = useParams();
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

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const styledInput = (name) => ({
    width: "100%",
    border: `1.5px solid ${focused === name ? "#3b82f6" : "#d0d9e8"}`,
    borderRadius: "11px",
    padding: "11px 14px",
    fontSize: "13.5px",
    color: "#0d1f3c",
    background: "#fff",
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: "500",
    transition: "border-color 0.18s ease, box-shadow 0.18s ease",
    boxShadow: focused === name ? "0 0 0 3.5px rgba(59,130,246,0.12)" : "none",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.actualSituation.trim())
      return alert("Please describe the actual situation.");
    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => formData.append(k, v));
    imageFiles.forEach((f) => formData.append("images", f));
    videoFiles.forEach((f) => formData.append("videos", f));
    try {
      setSubmitting(true);
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${API_BASE}/api/investigations/submit/${investigationId}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        },
      );
      const json = await res.json();
      if (res.ok) {
        alert("Investigation submitted successfully!");
        navigate("/authorized");
      } else alert(json.message || "Failed to submit investigation");
    } catch (err) {
      alert("Network error: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async () => {
    if (
      !window.confirm(
        "Cancel this investigation? The report will return to Pending status.",
      )
    )
      return;
    try {
      setCancelling(true);
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${API_BASE}/api/investigations/cancel/${investigationId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
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
        <style>{FONT}</style>
        <div
          style={{
            padding: "80px 20px",
            textAlign: "center",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          <div
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "16px",
              background: "linear-gradient(135deg,#fff7ed,#fef3c7)",
              border: "1.5px solid #fde68a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
              color: "#d97706",
            }}
          >
            <Icon d={IC.alert} size={22} strokeWidth={1.5} />
          </div>
          <h3
            style={{
              margin: "0 0 8px",
              fontSize: "16px",
              fontWeight: "700",
              color: "#0d1f3c",
            }}
          >
            Invalid Investigation ID
          </h3>
          <p style={{ margin: "0 0 20px", fontSize: "13px", color: "#7a8aaa" }}>
            Please start an investigation from the dashboard first.
          </p>
          <button
            onClick={() => navigate("/authorized")}
            style={{
              padding: "10px 22px",
              background: "linear-gradient(135deg,#1d4ed8,#2563eb)",
              color: "#fff",
              border: "none",
              borderRadius: "11px",
              fontSize: "13px",
              fontWeight: "700",
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
              boxShadow: "0 6px 18px rgba(37,99,235,0.28)",
            }}
          >
            Go to Dashboard
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <style>
        {FONT +
          `
        @keyframes fadeInUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        .si-textarea {
          width: 100%; border-radius: 11px; padding: 12px 14px;
          font-size: 13.5px; color: #0d1f3c; background: #fff;
          outline: none; box-sizing: border-box;
          font-family: 'DM Sans', sans-serif; font-weight: 500;
          resize: vertical; line-height: 1.65;
          transition: border-color 0.18s ease, box-shadow 0.18s ease;
        }
        .si-textarea:focus {
          border-color: #3b82f6 !important;
          box-shadow: 0 0 0 3.5px rgba(59,130,246,0.12) !important;
        }
        .si-textarea::placeholder { color: #a8b4c8; font-weight: 400; }
        .si-input:focus {
          border-color: #3b82f6 !important;
          box-shadow: 0 0 0 3.5px rgba(59,130,246,0.12) !important;
        }
        .si-input::placeholder { color: #a8b4c8; font-weight: 400; }
        .si-back-btn {
          background: none; border: none; cursor: pointer;
          font-size: 13px; color: #7a8aaa; padding: 0;
          font-family: 'DM Sans', sans-serif; font-weight: 600;
          display: flex; align-items: center; gap: 6px;
          transition: color 0.15s;
          margin-bottom: 20px;
        }
        .si-back-btn:hover { color: #0d1f3c; }
        .si-submit-btn {
          padding: 13px 32px;
          background: linear-gradient(135deg, #1d4ed8, #2563eb);
          color: #fff; border: none; border-radius: 12px;
          font-size: 14px; font-weight: 700; cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          display: flex; align-items: center; gap: 9px;
          box-shadow: 0 8px 22px rgba(37,99,235,0.32);
          transition: all 0.2s ease; letter-spacing: 0.01em;
        }
        .si-submit-btn:hover:not(:disabled) {
          transform: translateY(-2px) !important;
          box-shadow: 0 14px 32px rgba(37,99,235,0.4) !important;
        }
        .si-submit-btn:disabled { background: #93c5fd; box-shadow: none; cursor: not-allowed; }
        .si-cancel-btn {
          padding: 13px 22px;
          background: linear-gradient(135deg,#fff1f2,#fee2e2);
          color: #b91c1c; border: 1.5px solid #fca5a5; border-radius: 12px;
          font-size: 13.5px; font-weight: 700; cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          display: flex; align-items: center; gap: 8px;
          box-shadow: 0 4px 14px rgba(220,38,38,0.1);
          transition: all 0.18s ease;
        }
        .si-cancel-btn:hover:not(:disabled) {
          background: linear-gradient(135deg,#fee2e2,#fecaca) !important;
          border-color: #f87171 !important;
          box-shadow: 0 6px 18px rgba(220,38,38,0.2) !important;
          transform: translateY(-1px) !important;
        }
        .si-cancel-btn:disabled { opacity: 0.5; cursor: not-allowed; }
      `}
      </style>

      <div
        style={{
          maxWidth: "780px",
          margin: "0 auto",
          fontFamily: "'DM Sans', sans-serif",
          animation: "fadeInUp 0.35s ease both",
        }}
      >
        {/* Back button */}
        <button className="si-back-btn" onClick={() => navigate("/authorized")}>
          <Icon d={IC.back} size={15} strokeWidth={2.2} />
          Back to Dashboard
        </button>

        {/* Page header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "28px",
          }}
        >
          <div
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "16px",
              background: "linear-gradient(135deg,#1e3a8a,#2563eb)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              flexShrink: 0,
              boxShadow: "0 8px 24px rgba(37,99,235,0.32)",
            }}
          >
            <Icon d={IC.shield} size={22} strokeWidth={1.8} />
          </div>
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: "22px",
                fontWeight: "700",
                color: "#0d1f3c",
                letterSpacing: "-0.4px",
              }}
            >
              Submit Investigation Report
            </h1>
            <p
              style={{
                margin: "5px 0 0",
                fontSize: "12.5px",
                color: "#7a8aaa",
                fontWeight: "500",
              }}
            >
              Fill in your field findings for this investigation
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* ── Section 1: Visit Details ── */}
          <Section
            number="1"
            icon={IC.cal}
            title="Visit Details"
            color="#3b82f6"
            bg="#eff6ff"
            border="#bfdbfe"
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "14px",
                marginBottom: "18px",
              }}
            >
              <Field label="Visit Date">
                <input
                  type="date"
                  name="visitDate"
                  value={form.visitDate}
                  onChange={handleChange}
                  className="si-input"
                  required
                  style={styledInput("visitDate")}
                  onFocus={() => setFocused("visitDate")}
                  onBlur={() => setFocused(null)}
                />
              </Field>
              <Field label="Visit Time">
                <input
                  type="time"
                  name="visitTime"
                  value={form.visitTime}
                  onChange={handleChange}
                  className="si-input"
                  required
                  style={styledInput("visitTime")}
                  onFocus={() => setFocused("visitTime")}
                  onBlur={() => setFocused(null)}
                />
              </Field>
            </div>
            <Field label="Did you visit the site?">
              <div style={{ display: "flex", gap: "10px" }}>
                <RadioCard
                  name="visited"
                  value="true"
                  checked={form.visited === "true"}
                  onChange={handleChange}
                  variant="success"
                >
                  Yes, I visited
                </RadioCard>
                <RadioCard
                  name="visited"
                  value="false"
                  checked={form.visited === "false"}
                  onChange={handleChange}
                >
                  Unable to visit
                </RadioCard>
              </div>
            </Field>
          </Section>

          {/* ── Section 2: Findings ── */}
          <Section
            number="2"
            icon={IC.eye}
            title="Investigation Findings"
            color="#6366f1"
            bg="#eef2ff"
            border="#c7d2fe"
          >
            <Field label="Actual Situation at Site">
              <textarea
                name="actualSituation"
                value={form.actualSituation}
                onChange={handleChange}
                placeholder="Describe what you found at the location in detail…"
                rows={4}
                required
                className="si-textarea"
                style={{
                  border: `1.5px solid ${focused === "actualSituation" ? "#3b82f6" : "#d0d9e8"}`,
                }}
                onFocus={() => setFocused("actualSituation")}
                onBlur={() => setFocused(null)}
              />
            </Field>
            <Field label="Was illegal activity found?">
              <div style={{ display: "flex", gap: "10px" }}>
                <RadioCard
                  name="illegalActivityFound"
                  value="true"
                  checked={form.illegalActivityFound === "true"}
                  onChange={handleChange}
                  variant="danger"
                >
                  Yes — illegal activity confirmed
                </RadioCard>
                <RadioCard
                  name="illegalActivityFound"
                  value="false"
                  checked={form.illegalActivityFound === "false"}
                  onChange={handleChange}
                  variant="success"
                >
                  No — all clear
                </RadioCard>
              </div>
            </Field>
          </Section>

          {/* ── Section 3: Action Taken ── */}
          <Section
            number="3"
            icon={IC.action}
            title="Action Taken"
            color="#f59e0b"
            bg="#fffbeb"
            border="#fde68a"
          >
            <Field label="Action">
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "8px",
                  marginBottom: "16px",
                }}
              >
                {ACTION_OPTIONS.map((opt) => (
                  <ActionCard
                    key={opt.value}
                    name="actionTaken"
                    value={opt.value}
                    checked={form.actionTaken === opt.value}
                    onChange={handleChange}
                  >
                    {opt.label}
                  </ActionCard>
                ))}
              </div>
            </Field>

            {form.actionTaken === "FINE" && (
              <Field label="Fine Amount (LKR)">
                <div style={{ position: "relative" }}>
                  <span
                    style={{
                      position: "absolute",
                      left: "14px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      fontSize: "12px",
                      fontWeight: "700",
                      color: "#94a3b8",
                      fontFamily: "'DM Mono', monospace",
                      pointerEvents: "none",
                    }}
                  >
                    LKR
                  </span>
                  <input
                    type="number"
                    name="fineAmount"
                    value={form.fineAmount}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                    className="si-input"
                    style={{
                      ...styledInput("fineAmount"),
                      paddingLeft: "52px",
                      fontFamily: "'DM Mono', monospace",
                    }}
                    onFocus={() => setFocused("fineAmount")}
                    onBlur={() => setFocused(null)}
                  />
                </div>
              </Field>
            )}

            <Field label="Action Description">
              <textarea
                name="actionDescription"
                value={form.actionDescription}
                onChange={handleChange}
                placeholder="Describe the action taken…"
                rows={3}
                className="si-textarea"
                style={{
                  border: `1.5px solid ${focused === "actionDescription" ? "#3b82f6" : "#d0d9e8"}`,
                }}
                onFocus={() => setFocused("actionDescription")}
                onBlur={() => setFocused(null)}
              />
            </Field>

            <Field label="Officer Notes" hint="(optional)">
              <textarea
                name="officerNotes"
                value={form.officerNotes}
                onChange={handleChange}
                placeholder="Any additional observations or context…"
                rows={2}
                className="si-textarea"
                style={{
                  border: `1.5px solid ${focused === "officerNotes" ? "#3b82f6" : "#d0d9e8"}`,
                  marginBottom: 0,
                }}
                onFocus={() => setFocused("officerNotes")}
                onBlur={() => setFocused(null)}
              />
            </Field>
          </Section>

          {/* ── Section 4: Evidence ── */}
          <Section
            number="4"
            icon={IC.camera}
            title="Evidence Upload"
            color="#8b5cf6"
            bg="#f5f3ff"
            border="#ddd6fe"
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "14px",
              }}
            >
              <UploadZone
                icon={IC.camera}
                label="Photos"
                hint="Max 5 images — JPG, PNG, WEBP"
                accept="image/*"
                multiple
                files={imageFiles}
                onChange={(e) => setImageFiles(Array.from(e.target.files))}
              />
              <UploadZone
                icon={IC.video}
                label="Videos"
                hint="Max 3 videos — up to 50MB each"
                accept="video/*"
                multiple
                files={videoFiles}
                onChange={(e) => setVideoFiles(Array.from(e.target.files))}
              />
            </div>
          </Section>

          {/* ── Action buttons ── */}
          <div
            style={{
              display: "flex",
              gap: "12px",
              justifyContent: "flex-end",
              marginTop: "8px",
              paddingBottom: "32px",
            }}
          >
            <button
              type="button"
              className="si-cancel-btn"
              onClick={handleCancel}
              disabled={cancelling}
            >
              <Icon d={IC.trash} size={14} strokeWidth={2} />
              {cancelling ? "Cancelling…" : "Cancel Investigation"}
            </button>
            <button
              type="submit"
              className="si-submit-btn"
              disabled={submitting}
            >
              <Icon d={IC.send} size={15} strokeWidth={2} />
              {submitting ? "Submitting…" : "Submit Investigation"}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
