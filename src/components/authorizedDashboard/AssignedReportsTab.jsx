// src/components/authorizedDashboard/AssignedReportsTab.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  API_BASE,
  inputStyle,
  reportStatusConfig,
  invStatusConfig,
} from "./dashboardConstants";

const Tag = ({ bg, color, children }) => (
  <span
    style={{
      display: "inline-block",
      padding: "3px 10px",
      borderRadius: "20px",
      fontSize: "11px",
      fontWeight: "600",
      letterSpacing: "0.04em",
      textTransform: "uppercase",
      background: bg,
      color,
    }}
  >
    {children}
  </span>
);

const ActionBtn = ({ onClick, disabled, bg, color, border, children }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    style={{
      padding: "7px 16px",
      fontSize: "12px",
      fontWeight: "600",
      background: disabled ? "#f0f4f8" : bg,
      color: disabled ? "#b0bac9" : color,
      border: `0.5px solid ${disabled ? "#e4eaf3" : border}`,
      borderRadius: "8px",
      cursor: disabled ? "not-allowed" : "pointer",
      fontFamily: "inherit",
      transition: "all 0.15s",
      whiteSpace: "nowrap",
    }}
  >
    {children}
  </button>
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
      if (res.ok) {
        navigate(`/authorized/submit-investigation/${json.investigation._id}`);
      } else if (json.investigation) {
        navigate(`/authorized/submit-investigation/${json.investigation._id}`);
      } else {
        alert(json.message || "Failed to start investigation");
      }
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

  if (loading)
    return (
      <div
        style={{
          padding: "60px 20px",
          textAlign: "center",
          color: "#9aa4be",
          fontSize: "14px",
        }}
      >
        Loading assigned reports…
      </div>
    );

  return (
    <div style={{ maxWidth: "860px" }}>
      {/* Toolbar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        {/* Mini stats */}
        <div style={{ display: "flex", gap: "8px" }}>
          {[
            { label: "Total", value: data?.total || 0, color: "#0a1628" },
            {
              label: "Unstarted",
              value: reports.filter(
                (r) => r.investigationStatus === "NOT_STARTED",
              ).length,
              color: "#854f0b",
            },
            {
              label: "In Progress",
              value: reports.filter(
                (r) => r.investigationStatus === "INVESTIGATING",
              ).length,
              color: "#185fa5",
            },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                background: "#fff",
                border: "0.5px solid #dde3ee",
                borderRadius: "10px",
                padding: "8px 16px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span
                style={{
                  fontSize: "17px",
                  fontWeight: "700",
                  color: s.color,
                  lineHeight: 1,
                }}
              >
                {s.value}
              </span>
              <span
                style={{
                  fontSize: "11px",
                  color: "#8a96b0",
                  fontWeight: "500",
                }}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Search */}
        <div style={{ position: "relative", flex: 1, maxWidth: "280px" }}>
          <span
            style={{
              position: "absolute",
              left: "11px",
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: "13px",
              color: "#9aa4be",
              pointerEvents: "none",
            }}
          >
            🔍
          </span>
          <input
            style={{
              ...inputStyle,
              paddingLeft: "32px",
              background: "#fff",
              border: "0.5px solid #dde3ee",
              borderRadius: "10px",
              height: "38px",
            }}
            placeholder="Search location or district…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <button
          onClick={fetchReports}
          style={{
            padding: "8px 16px",
            fontSize: "12px",
            fontWeight: "500",
            background: "#fff",
            border: "0.5px solid #dde3ee",
            borderRadius: "10px",
            cursor: "pointer",
            fontFamily: "inherit",
            color: "#6b7a99",
            height: "38px",
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#f8fafc";
            e.currentTarget.style.borderColor = "#c8d0e0";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#fff";
            e.currentTarget.style.borderColor = "#dde3ee";
          }}
        >
          ↻ Refresh
        </button>
      </div>

      {/* Table */}
      <div
        style={{
          background: "#fff",
          border: "0.5px solid #dde3ee",
          borderRadius: "14px",
          overflow: "hidden",
        }}
      >
        {reports.length === 0 ? (
          <div style={{ padding: "60px 20px", textAlign: "center" }}>
            <div
              style={{
                fontSize: "36px",
                marginBottom: "12px",
                color: "#c5cfe0",
              }}
            >
              ◎
            </div>
            <h3
              style={{
                margin: "0 0 6px",
                fontSize: "16px",
                fontWeight: "600",
                color: "#3a4565",
              }}
            >
              {search
                ? "No reports match your search"
                : "No reports assigned to your district"}
            </h3>
            <p style={{ margin: 0, fontSize: "13px", color: "#9aa4be" }}>
              {search
                ? "Try a different search."
                : "Reports will appear here when submitted in your district."}
            </p>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr
                style={{
                  background: "#f7f9fc",
                  borderBottom: "0.5px solid #e4eaf3",
                }}
              >
                {[
                  "Location",
                  "Date / Time",
                  "Description",
                  "Status",
                  "Investigation",
                  "Action",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      fontSize: "10px",
                      fontWeight: "700",
                      color: "#94a3b8",
                      letterSpacing: "0.07em",
                      textTransform: "uppercase",
                      whiteSpace: "nowrap",
                    }}
                  >
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

                return (
                  <tr
                    key={r._id}
                    style={{
                      borderBottom:
                        idx < reports.length - 1
                          ? "0.5px solid #f0f4f8"
                          : "none",
                      transition: "background 0.1s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#fafbfd")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <td style={{ padding: "14px 16px" }}>
                      <div
                        style={{
                          fontSize: "13px",
                          fontWeight: "600",
                          color: "#1a2640",
                        }}
                      >
                        {r.location}
                      </div>
                      <div
                        style={{
                          fontSize: "11px",
                          color: "#9aa4be",
                          marginTop: "2px",
                        }}
                      >
                        {r.district}
                      </div>
                    </td>
                    <td
                      style={{
                        padding: "14px 16px",
                        fontSize: "12px",
                        color: "#6b7a99",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {r.reportDate
                        ? new Date(r.reportDate).toLocaleDateString("en-GB")
                        : "—"}
                      <div
                        style={{
                          fontSize: "11px",
                          color: "#b0bac9",
                          marginTop: "2px",
                        }}
                      >
                        {r.reportTime || ""}
                      </div>
                    </td>
                    <td style={{ padding: "14px 16px", maxWidth: "200px" }}>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#6b7a99",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {r.description}
                      </div>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <Tag bg={sc.bg} color={sc.color}>
                        {sc.label}
                      </Tag>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <Tag bg={ic.bg} color={ic.color}>
                        {ic.label}
                      </Tag>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      {r.investigationStatus === "NOT_STARTED" ? (
                        <ActionBtn
                          onClick={() => handleStart(r._id)}
                          disabled={isStarting}
                          bg="rgba(34,211,176,0.1)"
                          color="#0f6e56"
                          border="rgba(34,211,176,0.35)"
                        >
                          {isStarting ? "Starting…" : "Start Investigation"}
                        </ActionBtn>
                      ) : r.investigationStatus === "INVESTIGATING" ? (
                        <ActionBtn
                          onClick={() =>
                            navigate(
                              `/authorized/submit-investigation/${r._id}`,
                            )
                          }
                          bg="rgba(14,165,233,0.1)"
                          color="#185fa5"
                          border="rgba(14,165,233,0.35)"
                        >
                          Continue →
                        </ActionBtn>
                      ) : (
                        <span style={{ fontSize: "12px", color: "#9aa4be" }}>
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
    </div>
  );
}
