// src/components/authorizedDashboard/MyInvestigationsTab.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE, invStatusConfig, actionConfig } from "./dashboardConstants";

const FONT = `@import url('https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;500;600;700;900&display=swap');`;

const T = {
  navy: "#0d1f3c",
  navyM: "#1e3a5f",
  blue: "#1d4ed8",
  slate: "#334155",
  slateM: "#475569",
  muted: "#64748b",
  border: "#d8e2f0",
  borderS: "#bfcfe0",
  font: "'Source Sans 3', 'Segoe UI', system-ui, sans-serif",
};

const Icon = ({ d, size = 14, sw = 1.8, color }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color || "currentColor"}
    strokeWidth={sw}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ display: "block", flexShrink: 0 }}
  >
    <path d={d} />
  </svg>
);
const IC = {
  compass:
    "M12 2a10 10 0 100 20A10 10 0 0012 2zM16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z",
  check: "M20 6L9 17l-5-5",
  arrow: "M5 12h14M12 5l7 7-7 7",
  pdf: "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8",
  camera:
    "M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2zM12 17a4 4 0 100-8 4 4 0 000 8z",
  video:
    "M15 10l4.553-2.069A1 1 0 0121 8.82v6.362a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z",
  pin: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z",
  cal: "M8 2v3M16 2v3M3 8h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z",
  clock: "M12 2a10 10 0 100 20A10 10 0 0012 2zm0 5v5l3 3",
  empty:
    "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
  warning:
    "M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z",
};

const Badge = ({ bg, color, children }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      padding: "4px 11px",
      borderRadius: "6px",
      fontSize: "11px",
      fontWeight: "700",
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      background: bg,
      color,
      border: `1.5px solid ${color}35`,
      fontFamily: T.font,
      whiteSpace: "nowrap",
    }}
  >
    {children}
  </span>
);

const StatChip = ({ label, value, color, accent }) => (
  <div
    style={{
      background: "#fff",
      border: `1.5px solid ${accent || T.border}`,
      borderRadius: "10px",
      padding: "10px 20px",
      display: "flex",
      alignItems: "center",
      gap: "12px",
      fontFamily: T.font,
      boxShadow: "0 1px 4px rgba(13,31,60,0.06)",
    }}
  >
    <span
      style={{
        fontSize: "26px",
        fontWeight: "900",
        color,
        lineHeight: 1,
        letterSpacing: "-1px",
      }}
    >
      {value}
    </span>
    <span
      style={{
        fontSize: "11px",
        fontWeight: "700",
        color: T.muted,
        textTransform: "uppercase",
        letterSpacing: "0.08em",
      }}
    >
      {label}
    </span>
  </div>
);

export default function MyInvestigationsTab({ onStatsUpdate }) {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [pdfLoading, setPdfLoading] = useState(null);

  const fetchMyInvestigations = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${API_BASE}/api/investigations/my-investigations`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (!res.ok) throw new Error("Failed to fetch");
      const json = await res.json();
      setData(json);
      onStatsUpdate?.({
        myInProgress: json.investigating || 0,
        myCompleted: json.completed || 0,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyInvestigations();
  }, []);

  const handleDownloadPDF = async (invId) => {
    setPdfLoading(invId);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/investigations/${invId}/pdf`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("PDF generation failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `investigation_report_${invId}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert("Failed to download PDF report");
    } finally {
      setPdfLoading(null);
    }
  };

  const investigations = data?.investigations || [];
  const filtered =
    filter === "ALL"
      ? investigations
      : investigations.filter((i) => i.status === filter);

  if (loading)
    return (
      <div
        style={{
          padding: "80px 20px",
          textAlign: "center",
          fontFamily: T.font,
        }}
      >
        <style>{FONT}</style>
        <div
          style={{
            width: "52px",
            height: "52px",
            borderRadius: "14px",
            background: "linear-gradient(135deg,#eff6ff,#dbeafe)",
            border: "1.5px solid #93c5fd",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
            color: T.blue,
            boxShadow: "0 4px 14px rgba(37,99,235,0.12)",
          }}
        >
          <Icon d={IC.compass} size={24} sw={1.6} />
        </div>
        <p style={{ color: T.muted, fontSize: "14px", fontWeight: "600" }}>
          Loading investigations…
        </p>
      </div>
    );

  return (
    <div style={{ maxWidth: "920px", fontFamily: T.font }}>
      <style>
        {FONT +
          `
        @keyframes cardIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }

        .mit-filter {
          padding: 8px 18px; border-radius: 8px; font-size: 13px;
          font-weight: 700; cursor: pointer; transition: all 0.16s ease;
          font-family: '${T.font}'; letter-spacing: 0.02em;
          border: 1.5px solid;
        }

        .mit-card {
          background: #fff;
          border: 1.5px solid ${T.border};
          border-radius: 16px;
          padding: 22px 24px;
          transition: all 0.22s cubic-bezier(.22,1,.36,1);
          animation: cardIn 0.3s ease both;
          position: relative; overflow: hidden;
          box-shadow: 0 2px 8px rgba(13,31,60,0.04);
        }
        .mit-card::before {
          content: '';
          position: absolute; left: 0; top: 0; bottom: 0;
          width: 4px; border-radius: 4px 0 0 4px;
          opacity: 0; transition: opacity 0.2s ease;
        }
        .mit-card:hover {
          border-color: #93c5fd !important;
          box-shadow: 0 10px 32px rgba(13,31,60,0.1), 0 3px 10px rgba(29,78,216,0.07) !important;
          transform: translateY(-2px) !important;
        }
        .mit-card:hover::before { opacity: 1; }
        .mit-card-completed::before  { background: linear-gradient(to bottom,#22c55e,#16a34a); }
        .mit-card-progress::before   { background: linear-gradient(to bottom,#3b82f6,#4f46e5); }

        .mit-pdf-btn {
          padding: 9px 18px; border-radius: 8px; font-size: 13px;
          font-weight: 700; cursor: pointer; transition: all 0.16s ease;
          font-family: '${T.font}';
          display: flex; align-items: center; gap: 8px; white-space: nowrap;
          background: linear-gradient(135deg,#f0fdf4,#dcfce7);
          color: #14532d; border: 1.5px solid #6ee7b7;
          box-shadow: 0 2px 8px rgba(20,83,45,0.1); letter-spacing: 0.01em;
        }
        .mit-pdf-btn:hover:not(:disabled) {
          background: linear-gradient(135deg,#dcfce7,#a7f3d0) !important;
          border-color: #34d399 !important;
          box-shadow: 0 4px 16px rgba(20,83,45,0.18) !important;
          transform: translateY(-1px) !important;
        }
        .mit-pdf-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .mit-continue-btn {
          padding: 9px 18px; border-radius: 8px; font-size: 13px;
          font-weight: 700; cursor: pointer; transition: all 0.16s ease;
          font-family: '${T.font}';
          display: flex; align-items: center; gap: 8px; white-space: nowrap;
          background: linear-gradient(135deg,#eff6ff,#dbeafe);
          color: #1e3a8a; border: 1.5px solid #93c5fd;
          box-shadow: 0 2px 8px rgba(30,58,138,0.1); letter-spacing: 0.01em;
        }
        .mit-continue-btn:hover {
          background: linear-gradient(135deg,#dbeafe,#bfdbfe) !important;
          border-color: #60a5fa !important;
          box-shadow: 0 4px 16px rgba(30,58,138,0.18) !important;
          transform: translateY(-1px) !important;
        }

        .mit-nav-btn {
          margin-left: auto; padding: 10px 22px;
          background: linear-gradient(135deg,#1e3a8a,#1d4ed8);
          color: #fff; border: none; border-radius: 10px;
          font-size: 13.5px; font-weight: 700; cursor: pointer;
          box-shadow: 0 6px 18px rgba(29,78,216,0.28);
          transition: all 0.16s ease; font-family: '${T.font}';
          display: flex; align-items: center; gap: 8px; letter-spacing: 0.01em;
        }
        .mit-nav-btn:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 10px 28px rgba(29,78,216,0.36) !important;
        }
      `}
      </style>

      {/* ── Toolbar ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "22px",
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <StatChip label="Total" value={data?.total || 0} color={T.navy} />
          <StatChip
            label="Completed"
            value={data?.completed || 0}
            color="#14532d"
            accent="#6ee7b7"
          />
          <StatChip
            label="In Progress"
            value={data?.investigating || 0}
            color={T.blue}
            accent="#93c5fd"
          />
        </div>

        <div style={{ display: "flex", gap: "6px" }}>
          {[
            ["ALL", "All"],
            ["INVESTIGATING", "In Progress"],
            ["COMPLETED", "Completed"],
          ].map(([val, label]) => (
            <button
              key={val}
              className="mit-filter"
              onClick={() => setFilter(val)}
              style={{
                background:
                  filter === val
                    ? "linear-gradient(135deg,#1e3a8a,#1d4ed8)"
                    : "#fff",
                color: filter === val ? "#fff" : T.slateM,
                borderColor: filter === val ? "#1d4ed8" : T.border,
                boxShadow:
                  filter === val ? "0 4px 14px rgba(29,78,216,0.24)" : "none",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        <button className="mit-nav-btn" onClick={() => navigate("/authorized")}>
          Assigned Reports
          <Icon d={IC.arrow} size={14} sw={2.2} />
        </button>
      </div>

      {/* ── Empty ── */}
      {filtered.length === 0 ? (
        <div
          style={{
            background: "#fff",
            border: `1.5px solid ${T.border}`,
            borderRadius: "16px",
            padding: "72px 20px",
            textAlign: "center",
            boxShadow: "0 2px 12px rgba(13,31,60,0.05)",
          }}
        >
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "16px",
              background: "linear-gradient(135deg,#f0f5fb,#e6eef8)",
              border: `1.5px solid ${T.border}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 18px",
              color: "#94a3b8",
            }}
          >
            <Icon d={IC.empty} size={24} sw={1.5} />
          </div>
          <h3
            style={{
              margin: "0 0 8px",
              fontSize: "17px",
              fontWeight: "700",
              color: T.navy,
              letterSpacing: "-0.3px",
            }}
          >
            No investigations found
          </h3>
          <p
            style={{
              margin: 0,
              fontSize: "13.5px",
              color: T.muted,
              fontWeight: "500",
            }}
          >
            Start an investigation from Assigned Reports.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {filtered.map((inv, idx) => {
            const sc = invStatusConfig[inv.status] || invStatusConfig.COMPLETED;
            const ac = actionConfig[inv.actionTaken] || actionConfig.NO_ACTION;
            const report = inv.reportId;
            const isCompleted = inv.status === "COMPLETED";
            const isInProgress = inv.status === "INVESTIGATING";

            const visitedDate = inv.visitDate
              ? new Date(inv.visitDate).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
              : "—";
            const resolvedDate = inv.resolvedAt
              ? new Date(inv.resolvedAt).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
              : null;

            return (
              <div
                key={inv._id}
                className={`mit-card ${isCompleted ? "mit-card-completed" : "mit-card-progress"}`}
                style={{ animationDelay: `${idx * 0.04}s` }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: "16px",
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {/* Title row */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        marginBottom: "14px",
                        flexWrap: "wrap",
                      }}
                    >
                      <div
                        style={{
                          width: "34px",
                          height: "34px",
                          borderRadius: "9px",
                          background: isCompleted
                            ? "linear-gradient(135deg,#dcfce7,#bbf7d0)"
                            : "linear-gradient(135deg,#dbeafe,#bfdbfe)",
                          border: isCompleted
                            ? "1.5px solid #6ee7b7"
                            : "1.5px solid #93c5fd",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: isCompleted ? "#14532d" : "#1e3a8a",
                          flexShrink: 0,
                        }}
                      >
                        <Icon
                          d={isCompleted ? IC.check : IC.compass}
                          size={16}
                          sw={2.2}
                        />
                      </div>
                      <span
                        style={{
                          fontSize: "15px",
                          fontWeight: "700",
                          color: T.navy,
                          letterSpacing: "-0.2px",
                        }}
                      >
                        {report?.location || "Location unavailable"}
                      </span>
                      <Badge bg={sc.bg} color={sc.color}>
                        {sc.label}
                      </Badge>
                      {inv.illegalActivityFound && (
                        <Badge bg="#fee2e2" color="#991b1b">
                          ⚠ Illegal Activity
                        </Badge>
                      )}
                    </div>

                    {/* Meta strip */}
                    <div
                      style={{
                        display: "flex",
                        gap: "0",
                        flexWrap: "wrap",
                        background: "linear-gradient(135deg,#f6f9ff,#f0f5ff)",
                        borderRadius: "10px",
                        border: `1.5px solid #dce8f8`,
                        marginBottom: "14px",
                        overflow: "hidden",
                      }}
                    >
                      {[
                        {
                          label: "District",
                          value: report?.district || "—",
                          icon: IC.pin,
                          iconColor: T.blue,
                        },
                        {
                          label: "Visit Date",
                          value: `${visitedDate}${inv.visitTime ? "  ·  " + inv.visitTime : ""}`,
                          icon: IC.cal,
                          iconColor: "#6366f1",
                        },
                        resolvedDate && {
                          label: "Submitted",
                          value: resolvedDate,
                          icon: IC.check,
                          iconColor: "#14532d",
                        },
                      ]
                        .filter(Boolean)
                        .map(({ label, value, icon, iconColor }, i, arr) => (
                          <div
                            key={label}
                            style={{
                              flex: 1,
                              minWidth: "130px",
                              padding: "11px 16px",
                              borderRight:
                                i < arr.length - 1
                                  ? `1.5px solid #d4e4f7`
                                  : "none",
                            }}
                          >
                            <div
                              style={{
                                fontSize: "10px",
                                fontWeight: "700",
                                color: T.muted,
                                textTransform: "uppercase",
                                letterSpacing: "0.09em",
                                marginBottom: "5px",
                                display: "flex",
                                alignItems: "center",
                                gap: "5px",
                              }}
                            >
                              <Icon
                                d={icon}
                                size={10}
                                sw={2.2}
                                color={iconColor}
                              />
                              {label}
                            </div>
                            <div
                              style={{
                                fontSize: "13px",
                                fontWeight: "700",
                                color: T.slate /* strong, not muted */,
                                lineHeight: 1.3,
                              }}
                            >
                              {value}
                            </div>
                          </div>
                        ))}
                    </div>

                    {/* Action taken */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        flexWrap: "wrap",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: "700",
                          color: T.muted,
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                        }}
                      >
                        Action taken
                      </span>
                      <Badge bg={ac.bg} color={ac.color}>
                        {(inv.actionTaken || "—").replace(/_/g, " ")}
                      </Badge>
                      {inv.actionTaken === "FINE" && inv.fineAmount > 0 && (
                        <span
                          style={{
                            fontSize: "13px",
                            color: "#991b1b",
                            fontWeight: "800",
                            background: "#fee2e2",
                            padding: "4px 12px",
                            borderRadius: "6px",
                            border: "1.5px solid #fca5a5",
                            fontFamily: T.font,
                          }}
                        >
                          LKR {inv.fineAmount.toLocaleString()}
                        </span>
                      )}
                    </div>

                    {/* Situation summary */}
                    {inv.actualSituation && (
                      <div
                        style={{
                          marginTop: "12px",
                          padding: "11px 15px",
                          background: "linear-gradient(135deg,#f8faff,#f3f7ff)",
                          borderRadius: "9px",
                          borderLeft: "4px solid #bfcfe0",
                          fontSize: "13px",
                          fontWeight: "500",
                          color: T.slateM,
                          lineHeight: 1.65,
                          fontStyle: "italic",
                        }}
                      >
                        {inv.actualSituation.length > 160
                          ? inv.actualSituation.slice(0, 160) + "…"
                          : inv.actualSituation}
                      </div>
                    )}
                  </div>

                  {/* Buttons */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                      flexShrink: 0,
                    }}
                  >
                    {isCompleted && (
                      <button
                        className="mit-pdf-btn"
                        onClick={() => handleDownloadPDF(inv._id)}
                        disabled={pdfLoading === inv._id}
                        style={{
                          opacity: pdfLoading === inv._id ? 0.6 : 1,
                          cursor:
                            pdfLoading === inv._id ? "not-allowed" : "pointer",
                        }}
                      >
                        <Icon d={IC.pdf} size={14} sw={2} color="#14532d" />
                        {pdfLoading === inv._id ? "Generating…" : "PDF Report"}
                      </button>
                    )}
                    {isInProgress && (
                      <button
                        className="mit-continue-btn"
                        onClick={() =>
                          navigate(
                            `/authorized/submit-investigation/${inv._id}`,
                          )
                        }
                      >
                        Continue
                        <Icon d={IC.arrow} size={14} sw={2.2} color="#1e3a8a" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Evidence footer */}
                {(inv.evidenceImages?.length > 0 ||
                  inv.evidenceVideos?.length > 0) && (
                  <div
                    style={{
                      marginTop: "14px",
                      paddingTop: "12px",
                      borderTop: `1.5px solid #edf2f8`,
                      display: "flex",
                      gap: "10px",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "10.5px",
                        fontWeight: "700",
                        color: T.muted,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                      }}
                    >
                      Evidence
                    </span>
                    {inv.evidenceImages?.length > 0 && (
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          padding: "4px 12px",
                          borderRadius: "6px",
                          fontSize: "12px",
                          fontWeight: "700",
                          background: "#eff6ff",
                          color: "#1e3a8a",
                          border: "1.5px solid #bfdbfe",
                          fontFamily: T.font,
                        }}
                      >
                        <Icon d={IC.camera} size={11} sw={2} color="#1e3a8a" />
                        {inv.evidenceImages.length} Photo
                        {inv.evidenceImages.length > 1 ? "s" : ""}
                      </span>
                    )}
                    {inv.evidenceVideos?.length > 0 && (
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          padding: "4px 12px",
                          borderRadius: "6px",
                          fontSize: "12px",
                          fontWeight: "700",
                          background: "#f0fdf4",
                          color: "#14532d",
                          border: "1.5px solid #6ee7b7",
                          fontFamily: T.font,
                        }}
                      >
                        <Icon d={IC.video} size={11} sw={2} color="#14532d" />
                        {inv.evidenceVideos.length} Video
                        {inv.evidenceVideos.length > 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
