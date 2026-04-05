// src/components/authorizedDashboard/dashboardConstants.js

// ── Base URL — points to your Express backend ────────────────
export const API_BASE =
  process.env.REACT_APP_API_URL || "http://localhost:5000";

export const inputStyle = {
  width: "100%",
  border: "1px solid #dde3ee",
  borderRadius: "8px",
  padding: "9px 12px",
  fontSize: "13px",
  color: "#1a2235",
  background: "#f8fafc",
  outline: "none",
  boxSizing: "border-box",
};

// ════════════════════════════════════════════════════════════════
// INVESTIGATION CONSTANTS  (added for investigation management)
// Everything above this line belongs to the zone/reports module
// ════════════════════════════════════════════════════════════════

// Focus ring applied on input focus inside SubmitInvestigation
export const focusStyle = {
  borderColor: "#22d3b0",
  boxShadow: "0 0 0 3px rgba(34,211,176,0.12)",
};

// Report status badge colours (matches IllegalReport.status enum)
export const reportStatusConfig = {
  PENDING: { bg: "#faeeda", color: "#854f0b", label: "Pending" },
  INVESTIGATING: { bg: "#e6f1fb", color: "#185fa5", label: "Investigating" },
  RESOLVED: { bg: "#e1f5ee", color: "#0f6e56", label: "Resolved" },
};

// Investigation status badge colours (investigationStatus field)
export const invStatusConfig = {
  NOT_STARTED: { bg: "#f1efe8", color: "#5f5e5a", label: "Not Started" },
  INVESTIGATING: { bg: "#e6f1fb", color: "#185fa5", label: "In Progress" },
  COMPLETED: { bg: "#e1f5ee", color: "#0f6e56", label: "Completed" },
};

// Action taken badge colours (matches Investigation.actionTaken enum)
export const actionConfig = {
  NO_ACTION: { bg: "#f1efe8", color: "#5f5e5a" },
  WARNING: { bg: "#faeeda", color: "#854f0b" },
  FINE: { bg: "#fcebeb", color: "#a32d2d" },
  EQUIPMENT_CONFISCATED: { bg: "#e6f1fb", color: "#185fa5" },
  ARREST: { bg: "#fcebeb", color: "#7c1d1d" },
  OTHER: { bg: "#f1efe8", color: "#5f5e5a" },
};

// Radio options for the action taken field in SubmitInvestigation
export const ACTION_OPTIONS = [
  { value: "NO_ACTION", label: "No Action" },
  { value: "WARNING", label: "Warning Issued" },
  { value: "FINE", label: "Fine Issued" },
  { value: "EQUIPMENT_CONFISCATED", label: "Equipment Confiscated" },
  { value: "ARREST", label: "Arrest Made" },
  { value: "OTHER", label: "Other" },
];
