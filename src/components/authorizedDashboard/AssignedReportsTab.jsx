// src/components/authorizedDashboard/AssignedReportsTab.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  API_BASE,
  inputStyle,
  reportStatusConfig,
  invStatusConfig,
} from "./dashboardConstants";

// ── Fonts: Source Sans 3 (crisp, high-legibility, government-grade) ──
const FONT = `@import url('https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;500;600;700;900&display=swap');`;

// ── Design tokens ─────────────────────────────────────────────
const T = {
  navy: "#0d1f3c",
  navyMid: "#1e3a5f",
  blue: "#1d4ed8",
  blueLight: "#2563eb",
  slate: "#334155", // was too light before — now strong slate
  slateM: "#475569", // medium body text
  muted: "#64748b", // secondary — still readable
  border: "#d8e2f0",
  borderStr: "#bfcfe0",
  bgPage: "#f4f7fb",
  bgCard: "#ffffff",
  font: "'Source Sans 3', 'Segoe UI', system-ui, sans-serif",
};

// ── Icon ──────────────────────────────────────────────────────
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
  clip: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
  search: "M21 21l-4.35-4.35M17 11A6 6 0 105 11a6 6 0 0012 0z",
  refresh:
    "M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15",
  play: "M5 3l14 9-14 9V3z",
  arrow: "M5 12h14M12 5l7 7-7 7",
  pin: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z",
  cal: "M8 2v3M16 2v3M3 8h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z",
  empty:
    "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
  check: "M20 6L9 17l-5-5",
};

// ── Status badge ──────────────────────────────────────────────
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

// ── Summary stat card ─────────────────────────────────────────
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

export default function AssignedReportsTab({ onStatsUpdate }) {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(null);
  const [search, setSearch] = useState("");

  const fetchReports = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${API_BASE}/api/investigations/assigned-reports`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (res.ok) {
        const json = await res.json();
        setData(json);
        onStatsUpdate?.({
          assignedTotal: json.total,
          assignedPending:
            json.reports?.filter((r) => r.investigationStatus === "NOT_STARTED")
              .length || 0,
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleStart = async (reportId) => {
    setStarting(reportId);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${API_BASE}/api/investigations/start/${reportId}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const json = await res.json();
      if (res.ok)
        navigate(`/authorized/submit-investigation/${json.investigation._id}`);
      else if (json.investigation)
        navigate(`/authorized/submit-investigation/${json.investigation._id}`);
      else alert(json.message || "Failed to start investigation");
    } catch (err) {
      alert("Network error: " + err.message);
    } finally {
      setStarting(null);
    }
  };

  const reports = (data?.reports || []).filter((r) => {
    const q = search.toLowerCase();
    return (
      !q ||
      r.location?.toLowerCase().includes(q) ||
      r.district?.toLowerCase().includes(q)
    );
  });

  const unstartedCount = reports.filter(
    (r) => r.investigationStatus === "NOT_STARTED",
  ).length;
  const inProgressCount = reports.filter(
    (r) => r.investigationStatus === "INVESTIGATING",
  ).length;

  // ── Loading state ─────────────────────────────────────────
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
          <Icon d={IC.clip} size={24} sw={1.6} />
        </div>
        <p style={{ color: T.muted, fontSize: "14px", fontWeight: "600" }}>
          Loading assigned reports…
        </p>
      </div>
    );

  return (
    <div style={{ maxWidth: "1040px", fontFamily: T.font }}>
      <style>
        {FONT +
          `
        @keyframes fadeIn { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }

        .art-search {
          font-family: '${T.font}' !important;
          font-weight: 500 !important;
          color: ${T.navy} !important;
        }
        .art-search:focus {
          border-color: ${T.blue} !important;
          box-shadow: 0 0 0 3px rgba(29,78,216,0.1) !important;
          outline: none !important;
        }
        .art-search::placeholder {
          color: #9bafc8 !important;
          font-weight: 400 !important;
        }

        .art-wrap {
          background: #fff;
          border: 1.5px solid ${T.border};
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 24px rgba(13,31,60,0.07);
          animation: fadeIn 0.28s ease both;
        }

        .art-thead-row {
          background: linear-gradient(to bottom, #f0f5fb, #eaf0f8);
          border-bottom: 2px solid ${T.borderStr};
        }

        .art-th {
          padding: 14px 18px;
          text-align: left;
          font-family: '${T.font}', sans-serif;
          font-size: 10.5px; font-weight: 700;
          color: ${T.navyMid};
          letter-spacing: 0.1em; text-transform: uppercase;
          white-space: nowrap; user-select: none;
        }

        .art-tr { transition: background 0.1s ease; }
        .art-tr:hover .art-td { background: #f0f6ff !important; }

        .art-td {
          padding: 16px 18px;
          vertical-align: middle;
          font-family: '${T.font}', sans-serif;
          transition: background 0.1s ease;
        }

        .art-start-btn {
          padding: 8px 16px; border-radius: 8px; font-size: 12.5px;
          font-weight: 700; cursor: pointer; transition: all 0.16s ease;
          font-family: '${T.font}', sans-serif;
          display: inline-flex; align-items: center; gap: 7px;
          white-space: nowrap; letter-spacing: 0.01em;
          background: linear-gradient(135deg, #f0fdf4, #dcfce7);
          color: #14532d; border: 1.5px solid #6ee7b7;
          box-shadow: 0 2px 8px rgba(20,83,45,0.1);
        }
        .art-start-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, #dcfce7, #a7f3d0) !important;
          border-color: #34d399 !important;
          box-shadow: 0 4px 16px rgba(20,83,45,0.18) !important;
          transform: translateY(-1px) !important;
        }
        .art-start-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .art-continue-btn {
          padding: 8px 16px; border-radius: 8px; font-size: 12.5px;
          font-weight: 700; cursor: pointer; transition: all 0.16s ease;
          font-family: '${T.font}', sans-serif;
          display: inline-flex; align-items: center; gap: 7px;
          white-space: nowrap; letter-spacing: 0.01em;
          background: linear-gradient(135deg, #eff6ff, #dbeafe);
          color: #1e3a8a; border: 1.5px solid #93c5fd;
          box-shadow: 0 2px 8px rgba(30,58,138,0.1);
        }
        .art-continue-btn:hover {
          background: linear-gradient(135deg, #dbeafe, #bfdbfe) !important;
          border-color: #60a5fa !important;
          box-shadow: 0 4px 16px rgba(30,58,138,0.18) !important;
          transform: translateY(-1px) !important;
        }

        .art-refresh-btn {
          padding: 0 18px; height: 42px;
          font-size: 13px; font-weight: 700;
          background: #fff; color: ${T.slateM};
          border: 1.5px solid ${T.border}; border-radius: 10px;
          cursor: pointer; font-family: '${T.font}', sans-serif;
          transition: all 0.16s ease;
          display: flex; align-items: center; gap: 8px;
          letter-spacing: 0.01em;
        }
        .art-refresh-btn:hover {
          background: #eff6ff !important;
          border-color: #93c5fd !important;
          color: ${T.blue} !important;
          box-shadow: 0 3px 10px rgba(29,78,216,0.1) !important;
        }
      `}
      </style>

      {/* ── Toolbar ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        {/* Stats */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <StatChip
            label="Total Assigned"
            value={data?.total || 0}
            color={T.navy}
            accent={T.border}
          />
          <StatChip
            label="Not Started"
            value={unstartedCount}
            color="#92400e"
            accent="#fcd34d"
          />
          <StatChip
            label="In Progress"
            value={inProgressCount}
            color={T.blue}
            accent="#93c5fd"
          />
        </div>

        {/* Search */}
        <div
          style={{
            position: "relative",
            flex: 1,
            minWidth: "220px",
            maxWidth: "300px",
          }}
        >
          <span
            style={{
              position: "absolute",
              left: "13px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#9bafc8",
              pointerEvents: "none",
              display: "flex",
            }}
          >
            <Icon d={IC.search} size={14} sw={2} />
          </span>
          <input
            className="art-search"
            style={{
              ...inputStyle,
              paddingLeft: "38px",
              background: "#fff",
              border: `1.5px solid ${T.border}`,
              borderRadius: "10px",
              height: "42px",
              fontSize: "13.5px",
              fontWeight: "500",
              color: T.navy,
              fontFamily: T.font,
              transition: "all 0.16s ease",
              boxSizing: "border-box",
            }}
            placeholder="Search location or district…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <button className="art-refresh-btn" onClick={fetchReports}>
          <Icon d={IC.refresh} size={14} sw={2} />
          Refresh
        </button>
      </div>

      {/* ── Table / Empty ── */}
      <div className="art-wrap">
        {reports.length === 0 ? (
          <div style={{ padding: "72px 20px", textAlign: "center" }}>
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
                boxShadow: "0 4px 14px rgba(13,31,60,0.07)",
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
              {search
                ? "No reports match your search"
                : "No reports assigned to your district"}
            </h3>
            <p
              style={{
                margin: 0,
                fontSize: "13.5px",
                color: T.muted,
                fontWeight: "500",
              }}
            >
              {search
                ? "Try a different search term."
                : "Reports will appear here when submitted in your district."}
            </p>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr className="art-thead-row">
                {[
                  "Location & District",
                  "Report Date",
                  "Description",
                  "Report Status",
                  "Investigation",
                  "Action",
                ].map((h) => (
                  <th key={h} className="art-th">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reports.map((r, idx) => {
                const sc =
                  reportStatusConfig[r.status] || reportStatusConfig.PENDING;
                const ic =
                  invStatusConfig[r.investigationStatus] ||
                  invStatusConfig.NOT_STARTED;
                const isStarting = starting === r._id;
                const isLast = idx === reports.length - 1;
                const rowBorder = isLast ? "none" : `1px solid #edf2f8`;

                // Format date cleanly
                const dateStr = r.reportDate
                  ? new Date(r.reportDate).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : "—";
                const timeStr = r.reportTime || "";

                return (
                  <tr key={r._id} className="art-tr">
                    {/* Location */}
                    <td
                      className="art-td"
                      style={{ borderBottom: rowBorder, minWidth: "160px" }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "10px",
                        }}
                      >
                        <span
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "8px",
                            background:
                              "linear-gradient(135deg,#eff6ff,#dbeafe)",
                            border: "1.5px solid #bfdbfe",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: T.blue,
                            flexShrink: 0,
                          }}
                        >
                          <Icon d={IC.pin} size={14} sw={2.1} color={T.blue} />
                        </span>
                        <div>
                          <div
                            style={{
                              fontSize: "13.5px",
                              fontWeight: "700",
                              color: T.navy,
                              lineHeight: 1.35,
                            }}
                          >
                            {r.location || "—"}
                          </div>
                          <div
                            style={{
                              fontSize: "12px",
                              fontWeight: "600",
                              color: T.muted,
                              marginTop: "3px",
                            }}
                          >
                            {r.district || ""}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Date / Time — now fully readable */}
                    <td
                      className="art-td"
                      style={{ borderBottom: rowBorder, whiteSpace: "nowrap" }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "7px",
                          marginBottom: "4px",
                        }}
                      >
                        <Icon d={IC.cal} size={13} sw={2} color={T.blue} />
                        <span
                          style={{
                            fontSize: "13px",
                            fontWeight: "700",
                            color: T.slate /* strong contrast */,
                            fontFamily: T.font,
                          }}
                        >
                          {dateStr}
                        </span>
                      </div>
                      {timeStr && (
                        <div
                          style={{
                            fontSize: "12.5px",
                            fontWeight: "600",
                            color: T.slateM /* not too faint */,
                            paddingLeft: "20px",
                            fontFamily: T.font,
                          }}
                        >
                          {timeStr}
                        </div>
                      )}
                    </td>

                    {/* Description */}
                    <td
                      className="art-td"
                      style={{ borderBottom: rowBorder, maxWidth: "220px" }}
                    >
                      <div
                        style={{
                          fontSize: "13px",
                          color: T.slateM,
                          fontWeight: "500",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          maxWidth: "200px",
                        }}
                      >
                        {r.description || "—"}
                      </div>
                    </td>

                    {/* Report status */}
                    <td className="art-td" style={{ borderBottom: rowBorder }}>
                      <Badge bg={sc.bg} color={sc.color}>
                        {sc.label}
                      </Badge>
                    </td>

                    {/* Investigation status */}
                    <td className="art-td" style={{ borderBottom: rowBorder }}>
                      <Badge bg={ic.bg} color={ic.color}>
                        {ic.label}
                      </Badge>
                    </td>

                    {/* Action */}
                    <td className="art-td" style={{ borderBottom: rowBorder }}>
                      {r.investigationStatus === "NOT_STARTED" ? (
                        <button
                          className="art-start-btn"
                          onClick={() => handleStart(r._id)}
                          disabled={isStarting}
                        >
                          <Icon
                            d={IC.play}
                            size={11}
                            sw={2.5}
                            color="#14532d"
                          />
                          {isStarting ? "Starting…" : "Start"}
                        </button>
                      ) : r.investigationStatus === "INVESTIGATING" ? (
                        <button
                          className="art-continue-btn"
                          onClick={() =>
                            navigate(
                              `/authorized/submit-investigation/${r._id}`,
                            )
                          }
                        >
                          Continue
                          <Icon
                            d={IC.arrow}
                            size={13}
                            sw={2.2}
                            color="#1e3a8a"
                          />
                        </button>
                      ) : (
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            fontSize: "12px",
                            fontWeight: "700",
                            color: "#14532d",
                            background:
                              "linear-gradient(135deg,#f0fdf4,#dcfce7)",
                            padding: "5px 13px",
                            borderRadius: "6px",
                            border: "1.5px solid #6ee7b7",
                            fontFamily: T.font,
                          }}
                        >
                          <Icon
                            d={IC.check}
                            size={11}
                            sw={2.8}
                            color="#14532d"
                          />
                          Completed
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Row count footer */}
      {reports.length > 0 && (
        <div
          style={{
            marginTop: "12px",
            textAlign: "right",
            fontSize: "12px",
            fontWeight: "600",
            color: T.muted,
            fontFamily: T.font,
          }}
        >
          Showing {reports.length} report{reports.length !== 1 ? "s" : ""}
          {search && ` matching "${search}"`}
        </div>
      )}
    </div>
  );
}
