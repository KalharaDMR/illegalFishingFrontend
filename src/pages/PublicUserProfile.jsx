import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import api from "../api/axios";

/* ─── helpers ─────────────────────────────────────────────── */
const initials = (name = "") =>
  name.split(" ").filter(Boolean).map((w) => w[0]).join("").toUpperCase().slice(0, 2) || "?";

const deepGlass = {
  background: "rgba(4,14,30,0.62)",
  backdropFilter: "blur(18px)",
  WebkitBackdropFilter: "blur(18px)",
  border: "1px solid rgba(34,211,176,0.20)",
};

const glassLight = (a = 0.07) => ({
  background: `rgba(255,255,255,${a})`,
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  border: "1px solid rgba(255,255,255,0.13)",
});

const labelSt = {
  display: "block", fontSize: 11, fontWeight: 700,
  color: "rgba(180,210,255,0.45)", letterSpacing: "0.09em",
  textTransform: "uppercase", marginBottom: 6,
};

const eyeBtn = {
  position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
  background: "none", border: "none", cursor: "pointer", fontSize: 15, padding: 0,
};

/* ══════════════════════════════════════════════════════════ */
export default function PublicUserProfile() {
  const navigate = useNavigate();

  /* ── server data ── */
  const [user,           setUser]           = useState(null);
  const [reports,        setReports]        = useState([]);
  const [loadingReports, setLoadingReports] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);

  /*
   * form mirrors the three editable fields.
   * It is populated once the API responds (or from localStorage fallback).
   * This is what the inputs are bound to — so the user always sees
   * their real data pre-filled when they click "Edit".
   */
  const [form, setForm] = useState({ name: "", email: "", phone: "" });

  /* ── ui state ── */
  const [activeTab,    setActiveTab]    = useState("profile");
  const [editingField, setEditingField] = useState(null);
  const [saving,       setSaving]       = useState(false);
  const [toast,        setToast]        = useState(null);

  /* ── password state ── */
  const [pw,     setPw]     = useState({ current: "", next: "", confirm: "" });
  const [showPw, setShowPw] = useState({ cur: false, nw: false, cf: false });

  /* ════════════════════════════════════════════════════════
     On mount: load profile + reports in parallel
  ════════════════════════════════════════════════════════ */
  useEffect(() => {
    loadProfile();
    loadReports();
  }, []);

  /* ── fetch profile from API ── */
  const loadProfile = async () => {
    setProfileLoading(true);
    try {
      const res = await api.get("/profile/public/me");
      const u   = res.data;
      setUser(u);
      /*
       * KEY: autofill form with the real values from the server.
       * When the user opens any field for editing, the input already
       * contains their current name / email / phone.
       */
      setForm({
        name:  u.name  || "",
        email: u.email || "",
        phone: u.phone || "",
      });
    } catch {
      /*
       * Fallback to localStorage (values stored at login time).
       * This keeps the UI usable even when the API is temporarily down.
       */
      const fallback = {
        name:      localStorage.getItem("userName")  || "",
        email:     localStorage.getItem("userEmail") || "",
        phone:     localStorage.getItem("userPhone") || "",
        role:      localStorage.getItem("userRole")  || "PUBLIC_USER",
        createdAt: null,
        status:    "PENDING",
      };
      setUser(fallback);
      setForm({
        name:  fallback.name,
        email: fallback.email,
        phone: fallback.phone,
      });
    } finally {
      setProfileLoading(false);
    }
  };

  /* ── fetch user's reports ── */
  const loadReports = async () => {
    setLoadingReports(true);
    try {
      const res = await api.get("/reports/my");
      setReports(res.data || []);
    } catch {
      setReports([]);
    } finally {
      setLoadingReports(false);
    }
  };

  /* ── toast helper ── */
  const flash = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  /* ── open edit for a field: form already has the current value ── */
  const startEdit = (field) => {
    setEditingField(field);
  };

  /* ── cancel: restore form value from server data ── */
  const cancelEdit = () => {
    setForm((prev) => ({
      ...prev,
      [editingField]: user?.[editingField] || "",
    }));
    setEditingField(null);
  };

  /* ── save a single field ── */
  const saveField = async (field) => {
    const value = form[field]?.trim();
    if (!value) { flash(`${field} cannot be empty`, "error"); return; }

    setSaving(true);
    try {
      const res     = await api.put("/profile/public/me", { [field]: value });
      const updated = res.data.user;

      /* update both user object and form so display reflects new value */
      setUser((prev) => ({ ...prev, ...updated }));
      setForm((prev) => ({ ...prev, [field]: updated[field] || value }));

      /* keep localStorage in sync (used as fallback) */
      if (updated.name)  localStorage.setItem("userName",  updated.name);
      if (updated.email) localStorage.setItem("userEmail", updated.email);
      if (updated.phone) localStorage.setItem("userPhone", updated.phone);

      setEditingField(null);
      flash("Saved ✓");
    } catch (err) {
      flash(err?.response?.data?.message || "Save failed", "error");
    } finally {
      setSaving(false);
    }
  };

  /* ── change password ── */
  const changePassword = async () => {
    if (!pw.current || !pw.next || !pw.confirm) { flash("All fields are required", "error"); return; }
    if (pw.next !== pw.confirm) { flash("Passwords do not match", "error"); return; }
    if (pw.next.length < 6)    { flash("Minimum 6 characters required", "error"); return; }

    setSaving(true);
    try {
      await api.put("/profile/public/password", {
        currentPassword: pw.current,
        newPassword:     pw.next,
      });
      flash("Password updated ✓");
      setPw({ current: "", next: "", confirm: "" });
    } catch (err) {
      flash(err?.response?.data?.message || "Password change failed", "error");
    } finally {
      setSaving(false);
    }
  };

  /* ── password strength meter ── */
  const strength = (() => {
    const p = pw.next;
    if (!p) return null;
    let s = 0;
    if (p.length >= 8)          s++;
    if (/[A-Z]/.test(p))        s++;
    if (/[0-9]/.test(p))        s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return [
      { label: "Weak",   pct: 25,  color: "#ff2d55" },
      { label: "Fair",   pct: 50,  color: "#f59e0b" },
      { label: "Good",   pct: 75,  color: "#0ea5e9" },
      { label: "Strong", pct: 100, color: "#22d3b0" },
    ][Math.max(0, s - 1)];
  })();

  const handleLogout = () => { localStorage.clear(); navigate("/login"); };

  /* ── derived stats ── */
  const stats = {
    total:         reports.length,
    pending:       reports.filter((r) => r.status === "PENDING").length,
    investigating: reports.filter((r) => r.status === "INVESTIGATING").length,
    resolved:      reports.filter((r) => r.status === "RESOLVED").length,
  };

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-GB", { month: "long", year: "numeric" })
    : "—";

  /* ── shared input style factory ── */
  const inp = (extra = {}) => ({
    width: "100%", boxSizing: "border-box",
    background: "rgba(255,255,255,0.07)",
    border: "1px solid rgba(255,255,255,0.18)",
    borderRadius: 10, padding: "11px 14px",
    fontSize: 14, color: "#e8f0ff",
    outline: "none", fontFamily: "inherit",
    transition: "border-color 0.2s",
    ...extra,
  });

  /* ════════════════════════════════════════════════════════
     RENDER
  ════════════════════════════════════════════════════════ */
  return (
    <div style={{
      minHeight: "100vh",
      backgroundImage: "url('/images/marine-bg.jpg')",
      backgroundSize: "cover", backgroundPosition: "center top", backgroundAttachment: "fixed",
    }}>
      {/* dark overlay */}
      <div style={{
        position: "fixed", inset: 0,
        background: "linear-gradient(160deg,rgba(4,14,30,0.74) 0%,rgba(6,22,44,0.67) 60%,rgba(8,28,54,0.72) 100%)",
        zIndex: 0, pointerEvents: "none",
      }} />

      <Layout transparentBg>
        <div style={{
          fontFamily: "'DM Sans','Segoe UI',system-ui,sans-serif",
          maxWidth: 740, margin: "0 auto", paddingBottom: 60,
          position: "relative", zIndex: 1,
        }}>

          {/* ── Toast notification ── */}
          {toast && (
            <div style={{
              position: "fixed", top: 24, right: 24, zIndex: 9999,
              padding: "12px 22px", borderRadius: 12, fontWeight: 700, fontSize: 13, color: "#fff",
              background: toast.type === "success"
                ? "linear-gradient(90deg,#22d3b0,#0ea5e9)"
                : "linear-gradient(90deg,#ff2d55,#ff6b00)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.35)", animation: "slideIn .3s ease",
            }}>{toast.msg}</div>
          )}

          {/* ════════════════════════════════════════════════
              HERO CARD  — avatar + name + role badge
          ════════════════════════════════════════════════ */}
          <div style={{
            ...deepGlass, borderRadius: 20, padding: "28px 30px", marginBottom: 16,
            display: "flex", alignItems: "center", gap: 20,
            position: "relative", overflow: "hidden",
          }}>
            {/* glow blob */}
            <div style={{
              position: "absolute", top: -60, right: -60, width: 220, height: 220,
              borderRadius: "50%",
              background: "radial-gradient(circle,rgba(34,211,176,0.15) 0%,transparent 70%)",
              pointerEvents: "none",
            }} />

            {/* avatar */}
            <div style={{
              width: 72, height: 72, borderRadius: "50%", flexShrink: 0,
              background: "linear-gradient(135deg,#22d3b0,#0ea5e9)", padding: 3,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <div style={{
                width: "100%", height: "100%", borderRadius: "50%", background: "#040e1e",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 24, fontWeight: 800, color: "#22d3b0",
              }}>
                {profileLoading ? "…" : initials(user?.name)}
              </div>
            </div>

            {/* name / email / badges */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 21, fontWeight: 700, color: "#f0f6ff", marginBottom: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {profileLoading ? "Loading…" : (user?.name || "—")}
              </div>
              <div style={{ fontSize: 13, color: "rgba(200,230,255,0.50)", marginBottom: 8 }}>
                {user?.email || ""}
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", background: "rgba(34,211,176,0.15)", color: "#22d3b0", borderRadius: 99, padding: "4px 12px" }}>
                  🌊 {(user?.role || "PUBLIC USER").replace(/_/g, " ")}
                </span>
                <span style={{ fontSize: 10, fontWeight: 600, background: "rgba(255,255,255,0.08)", color: "rgba(180,210,255,0.45)", borderRadius: 99, padding: "4px 12px" }}>
                  Since {memberSince}
                </span>
              </div>
            </div>

            {/* sign out */}
            <button onClick={handleLogout}
              style={{ flexShrink: 0, background: "rgba(255,45,85,0.10)", color: "#ff2d55", border: "1px solid rgba(255,45,85,0.25)", borderRadius: 10, padding: "9px 18px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,45,85,0.20)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,45,85,0.10)"; }}
            >Sign Out</button>
          </div>

          {/* ════════════════════════════════════════════════
              STATS ROW
          ════════════════════════════════════════════════ */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 16 }}>
            {[
              { label: "Total",         value: stats.total,         color: "#0ea5e9", icon: "📋" },
              { label: "Pending",       value: stats.pending,       color: "#f59e0b", icon: "⏳" },
              { label: "Investigating", value: stats.investigating, color: "#8b5cf6", icon: "🔍" },
              { label: "Resolved",      value: stats.resolved,      color: "#22d3b0", icon: "✅" },
            ].map((s) => (
              <div key={s.label} style={{ ...glassLight(0.07), borderRadius: 13, padding: "14px", textAlign: "center" }}>
                <div style={{ fontSize: 17, marginBottom: 4 }}>{s.icon}</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: s.color, letterSpacing: "-0.03em", lineHeight: 1, marginBottom: 4 }}>{s.value}</div>
                <div style={{ fontSize: 10, color: "rgba(180,210,255,0.45)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* ════════════════════════════════════════════════
              TAB BAR
          ════════════════════════════════════════════════ */}
          <div style={{ ...glassLight(0.06), borderRadius: 13, padding: 5, display: "flex", gap: 4, marginBottom: 16 }}>
            {[
              { key: "profile",  label: "Profile",    icon: "◈" },
              { key: "security", label: "Security",   icon: "◉" },
              { key: "activity", label: "My Reports", icon: "◎" },
            ].map((tab) => (
              <button key={tab.key}
                onClick={() => { setActiveTab(tab.key); setEditingField(null); }}
                style={{
                  flex: 1, border: "none", cursor: "pointer", padding: "10px 0", borderRadius: 9,
                  fontSize: 13, fontWeight: 600,
                  background: activeTab === tab.key ? "linear-gradient(135deg,#22d3b0,#0ea5e9)" : "transparent",
                  color: activeTab === tab.key ? "#040e1e" : "rgba(180,210,255,0.55)",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  transition: "all 0.18s",
                }}
              >{tab.icon} {tab.label}</button>
            ))}
          </div>

          {/* ════════════════════════════════════════════════════════
              PROFILE TAB
              • Shows real data fetched from GET /profile/public/me
              • Each field has its own "Edit" button
              • Clicking Edit opens an inline input pre-filled with the
                current value (from `form` state, which mirrors the API data)
          ════════════════════════════════════════════════════════ */}
          {activeTab === "profile" && (
            <div style={{ ...deepGlass, borderRadius: 18, overflow: "hidden" }}>
              <div style={{ padding: "18px 26px 14px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#f0f6ff" }}>Personal Information</div>
                <div style={{ fontSize: 12, color: "rgba(180,210,255,0.38)", marginTop: 3 }}>
                  Your details are shown below. Tap{" "}
                  <strong style={{ color: "#22d3b0" }}>Edit</strong> on any row to update it.
                </div>
              </div>

              {/* ── Editable rows: Name / Email / Phone ── */}
              {[
                { key: "name",  label: "Full Name",     type: "text",  icon: "👤" },
                { key: "email", label: "Email Address", type: "email", icon: "✉️" },
                { key: "phone", label: "Phone Number",  type: "tel",   icon: "📞" },
              ].map((f, i, arr) => (
                <div key={f.key} style={{
                  padding: "16px 26px",
                  borderBottom: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
                  display: "flex", alignItems: "flex-start", gap: 14,
                }}>
                  {/* icon chip */}
                  <div style={{
                    width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                    background: "rgba(34,211,176,0.10)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 15, marginTop: 1,
                  }}>{f.icon}</div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(180,210,255,0.42)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 5 }}>
                      {f.label}
                    </div>

                    {editingField === f.key ? (
                      /* ── EDIT MODE: input is pre-filled with form[f.key] ── */
                      <>
                        <input
                          autoFocus
                          type={f.type}
                          value={form[f.key]}
                          onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                          onKeyDown={(e) => {
                            if (e.key === "Enter")  saveField(f.key);
                            if (e.key === "Escape") cancelEdit();
                          }}
                          style={inp({ marginBottom: 10 })}
                          onFocus={(e) => { e.target.style.borderColor = "#22d3b0"; }}
                          onBlur={(e)  => { e.target.style.borderColor = "rgba(255,255,255,0.18)"; }}
                        />
                        <div style={{ display: "flex", gap: 8 }}>
                          <button onClick={() => saveField(f.key)} disabled={saving}
                            style={{ padding: "7px 18px", borderRadius: 8, border: "none", background: "linear-gradient(135deg,#22d3b0,#0ea5e9)", color: "#040e1e", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                            {saving ? "Saving…" : "Save"}
                          </button>
                          <button onClick={cancelEdit}
                            style={{ padding: "7px 14px", borderRadius: 8, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(180,210,255,0.55)", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                            Cancel
                          </button>
                        </div>
                      </>
                    ) : (
                      /* ── DISPLAY MODE: shows the real value from API ── */
                      <div style={{
                        fontSize: 15,
                        color: form[f.key] ? "#e8f0ff" : "rgba(180,210,255,0.28)",
                        fontWeight: form[f.key] ? 500 : 400,
                      }}>
                        {profileLoading ? "Loading…" : (form[f.key] || `No ${f.label.toLowerCase()} set`)}
                      </div>
                    )}
                  </div>

                  {/* Edit button — hidden while this field is being edited */}
                  {editingField !== f.key && (
                    <button onClick={() => startEdit(f.key)}
                      style={{
                        flexShrink: 0, background: "rgba(34,211,176,0.10)",
                        border: "1px solid rgba(34,211,176,0.22)", borderRadius: 8,
                        padding: "6px 14px", fontSize: 12, fontWeight: 700, color: "#22d3b0",
                        cursor: "pointer", marginTop: 1, transition: "background 0.15s",
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(34,211,176,0.20)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(34,211,176,0.10)"; }}
                    >Edit</button>
                  )}
                </div>
              ))}

              {/* ── Read-only rows ── */}
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                {[
                  { label: "Role",           value: (user?.role   || "PUBLIC_USER").replace(/_/g, " ") },
                  { label: "Member Since",   value: memberSince },
                  { label: "Account Status", value: user?.status  || "Active" },
                ].map((f, i, arr) => (
                  <div key={f.label} style={{
                    padding: "14px 26px",
                    borderBottom: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                  }}>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(180,210,255,0.35)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>{f.label}</div>
                      <div style={{ fontSize: 14, color: "rgba(200,225,255,0.55)" }}>{f.value}</div>
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 600, borderRadius: 99, padding: "3px 10px", background: "rgba(255,255,255,0.07)", color: "rgba(180,210,255,0.28)" }}>
                      read-only
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════
              SECURITY TAB
          ════════════════════════════════════════════════════════ */}
          {activeTab === "security" && (
            <div style={{ ...deepGlass, borderRadius: 18, overflow: "hidden" }}>
              <div style={{ padding: "18px 26px 14px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#f0f6ff" }}>Change Password</div>
                <div style={{ fontSize: 12, color: "rgba(180,210,255,0.38)", marginTop: 3 }}>Keep your account safe with a strong password</div>
              </div>

              <div style={{ padding: "22px 26px" }}>
                {/* Current password */}
                <div style={{ marginBottom: 16 }}>
                  <label style={labelSt}>Current Password</label>
                  <div style={{ position: "relative" }}>
                    <input style={inp()} type={showPw.cur ? "text" : "password"}
                      value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })}
                      placeholder="Enter your current password"
                      onFocus={(e) => { e.target.style.borderColor = "#22d3b0"; }}
                      onBlur={(e)  => { e.target.style.borderColor = "rgba(255,255,255,0.18)"; }}
                    />
                    <button style={eyeBtn} onClick={() => setShowPw({ ...showPw, cur: !showPw.cur })}>
                      {showPw.cur ? "🙈" : "👁"}
                    </button>
                  </div>
                </div>

                {/* New password */}
                <div style={{ marginBottom: 16 }}>
                  <label style={labelSt}>New Password</label>
                  <div style={{ position: "relative" }}>
                    <input style={inp()} type={showPw.nw ? "text" : "password"}
                      value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })}
                      placeholder="At least 6 characters"
                      onFocus={(e) => { e.target.style.borderColor = "#22d3b0"; }}
                      onBlur={(e)  => { e.target.style.borderColor = "rgba(255,255,255,0.18)"; }}
                    />
                    <button style={eyeBtn} onClick={() => setShowPw({ ...showPw, nw: !showPw.nw })}>
                      {showPw.nw ? "🙈" : "👁"}
                    </button>
                  </div>
                  {/* strength meter */}
                  {strength && (
                    <div style={{ marginTop: 8 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontSize: 11, color: "rgba(180,210,255,0.38)" }}>Strength</span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: strength.color }}>{strength.label}</span>
                      </div>
                      <div style={{ height: 3, borderRadius: 99, background: "rgba(255,255,255,0.08)" }}>
                        <div style={{ height: "100%", borderRadius: 99, width: `${strength.pct}%`, background: strength.color, transition: "width .3s,background .3s" }} />
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm password */}
                <div style={{ marginBottom: 20 }}>
                  <label style={labelSt}>Confirm New Password</label>
                  <div style={{ position: "relative" }}>
                    <input
                      style={inp({
                        borderColor: pw.confirm
                          ? pw.confirm === pw.next ? "#22d3b0" : "#ff2d55"
                          : "rgba(255,255,255,0.18)",
                      })}
                      type={showPw.cf ? "text" : "password"}
                      value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })}
                      placeholder="Re-enter new password"
                    />
                    <button style={eyeBtn} onClick={() => setShowPw({ ...showPw, cf: !showPw.cf })}>
                      {showPw.cf ? "🙈" : "👁"}
                    </button>
                  </div>
                  {pw.confirm && (
                    <div style={{ fontSize: 11, marginTop: 5, fontWeight: 600, color: pw.confirm === pw.next ? "#22d3b0" : "#ff2d55" }}>
                      {pw.confirm === pw.next ? "Passwords match ✓" : "Passwords do not match"}
                    </div>
                  )}
                </div>

                {/* tip */}
                <div style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.10)", borderRadius: 10, padding: "10px 14px", marginBottom: 20, fontSize: 12, color: "rgba(180,210,255,0.42)", lineHeight: 1.6 }}>
                  💡 Use 8+ characters with uppercase letters, numbers and symbols for best security.
                </div>

                <button onClick={changePassword}
                  disabled={saving || !pw.current || !pw.next || !pw.confirm}
                  style={{
                    width: "100%", border: "none", borderRadius: 10, padding: "12px 0",
                    fontSize: 14, fontWeight: 700, color: "#040e1e",
                    cursor: (saving || !pw.current || !pw.next || !pw.confirm) ? "not-allowed" : "pointer",
                    background: (saving || !pw.current || !pw.next || !pw.confirm)
                      ? "rgba(34,211,176,0.20)"
                      : "linear-gradient(135deg,#22d3b0,#0ea5e9)",
                  }}
                >{saving ? "Updating…" : "Update Password"}</button>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════
              ACTIVITY TAB — My Reports preview
          ════════════════════════════════════════════════════════ */}
          {activeTab === "activity" && (
            <div style={{ ...deepGlass, borderRadius: 18, overflow: "hidden" }}>
              <div style={{
                padding: "18px 26px 14px", borderBottom: "1px solid rgba(255,255,255,0.07)",
                display: "flex", justifyContent: "space-between", alignItems: "center",
              }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#f0f6ff" }}>My Reports</div>
                  <div style={{ fontSize: 12, color: "rgba(180,210,255,0.38)", marginTop: 3 }}>
                    {reports.length} report{reports.length !== 1 ? "s" : ""} submitted
                  </div>
                </div>
                <button onClick={() => navigate("/my-reports")}
                  style={{ background: "rgba(34,211,176,0.10)", border: "1px solid rgba(34,211,176,0.22)", borderRadius: 9, padding: "7px 16px", fontSize: 12, fontWeight: 700, color: "#22d3b0", cursor: "pointer" }}>
                  View All →
                </button>
              </div>

              {loadingReports ? (
                <div style={{ padding: 48, textAlign: "center", color: "rgba(180,210,255,0.38)" }}>Loading…</div>
              ) : reports.length === 0 ? (
                <div style={{ padding: "48px 20px", textAlign: "center" }}>
                  <div style={{ fontSize: 36, marginBottom: 10 }}>📭</div>
                  <div style={{ fontWeight: 700, color: "#e8f0ff", marginBottom: 6 }}>No reports yet</div>
                  <div style={{ fontSize: 13, color: "rgba(180,210,255,0.38)", marginBottom: 20 }}>
                    Help protect marine life by submitting your first report.
                  </div>
                  <button onClick={() => navigate("/report")}
                    style={{ background: "linear-gradient(135deg,#22d3b0,#0ea5e9)", border: "none", borderRadius: 10, padding: "11px 28px", fontSize: 13, fontWeight: 700, color: "#040e1e", cursor: "pointer" }}>
                    File a Report
                  </button>
                </div>
              ) : reports.slice(0, 8).map((r, i) => {
                const sc = {
                  PENDING:       { color: "#f59e0b", bg: "rgba(245,158,11,0.14)"  },
                  INVESTIGATING: { color: "#8b5cf6", bg: "rgba(139,92,246,0.14)" },
                  RESOLVED:      { color: "#22d3b0", bg: "rgba(34,211,176,0.14)" },
                }[r.status] || { color: "#8a96b0", bg: "rgba(138,150,176,0.14)" };

                return (
                  <div key={r._id} onClick={() => navigate("/my-reports")}
                    style={{
                      display: "flex", alignItems: "center", gap: 14, padding: "14px 22px",
                      cursor: "pointer",
                      borderBottom: i < Math.min(reports.length, 8) - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                      transition: "background .12s",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                  >
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: sc.color, flexShrink: 0, boxShadow: `0 0 7px ${sc.color}99` }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "#e8f0ff", marginBottom: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {r.district}{r.location ? ` — ${r.location}` : ""}
                      </div>
                      <div style={{ fontSize: 11, color: "rgba(180,210,255,0.38)" }}>
                        {new Date(r.reportDate).toLocaleDateString("en-GB")}
                        {r.reportTime ? ` · ${r.reportTime}` : ""}
                      </div>
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 700, borderRadius: 99, padding: "3px 10px", color: sc.color, background: sc.bg, whiteSpace: "nowrap" }}>
                      {r.status}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </Layout>

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}