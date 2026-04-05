import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CONSERVATION_STATUSES } from "../../zoologist/constants";
import { canManageSpecies } from "../../zoologist/getJwtPayload";
import { deleteSpecies, getSpeciesPage } from "../../zoologist/speciesApi";
import SpeciesEntryDetailView from "../../components/zoologist/SpeciesEntryDetailView";

export default function SpeciesListPage() {
  const navigate = useNavigate();
  const [viewEntry, setViewEntry] = useState(null);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [listError, setListError] = useState("");

  const limit = 8;

  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput.trim()), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const fetchList = useCallback(async () => {
    setLoading(true);
    setListError("");
    try {
      const data = await getSpeciesPage({
        page,
        limit,
        search: search || undefined,
        status: status || undefined,
        sortBy: "createdAt",
        order: "desc",
      });
      setRows(data.data || []);
      setTotalPages(data.totalPages || 1);
      setTotal(data.total ?? 0);
    } catch (err) {
      setListError(err.response?.data?.error || err.message || "Failed to load species");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [page, search, status]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const openEdit = (sp) => {
    try {
      sessionStorage.setItem(`zoo_species_${sp._id}`, JSON.stringify(sp));
    } catch {
      /* ignore */
    }
    navigate(`/zoologist/species/${sp._id}/edit`, { state: { species: sp } });
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteSpecies(deleteTarget._id);
      setDeleteTarget(null);
      fetchList();
    } catch (err) {
      alert(err.response?.data?.error || err.message || "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="zoo-animate-fade-up">
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "11px",
              color: "#22d3b0",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              fontWeight: "600",
              marginBottom: "8px",
            }}
          >
            Registry
          </div>
          <h1
            style={{
              fontSize: "24px",
              fontWeight: "600",
              color: "#0a1628",
              margin: 0,
              letterSpacing: "-0.02em",
            }}
          >
            Endangered species entries
          </h1>
          <p style={{ margin: "6px 0 0", fontSize: "14px", color: "#6b7a99" }}>
            {total} verified entr{total === 1 ? "y" : "ies"} · paginated API
          </p>
        </div>
        <Link
          to="/zoologist/species/new"
          className="zoo-btn-press zoo-focus-ring"
          style={{
            padding: "12px 20px",
            borderRadius: "10px",
            background: "linear-gradient(135deg, #22d3b0, #0ea5e9)",
            color: "#fff",
            fontWeight: "600",
            fontSize: "14px",
            textDecoration: "none",
            boxShadow: "0 4px 16px rgba(34,211,176,0.25)",
          }}
        >
          + Add entry
        </Link>
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "12px",
          marginBottom: "20px",
          alignItems: "center",
        }}
      >
        <input
          className="zoo-focus-ring"
          placeholder="Search scientific or local name…"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          style={{
            flex: "1 1 220px",
            maxWidth: "320px",
            padding: "10px 14px",
            borderRadius: "10px",
            border: "1px solid #dde3ec",
            fontSize: "14px",
          }}
        />
        <select
          className="zoo-focus-ring"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          style={{
            padding: "10px 14px",
            borderRadius: "10px",
            border: "1px solid #dde3ec",
            fontSize: "14px",
            minWidth: "200px",
            cursor: "pointer",
          }}
        >
          <option value="">All conservation statuses</option>
          {CONSERVATION_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <button
          type="button"
          className="zoo-btn-press"
          onClick={() => fetchList()}
          style={{
            padding: "10px 16px",
            borderRadius: "10px",
            border: "1px solid #e4eaf3",
            background: "#fff",
            fontSize: "14px",
            fontWeight: "500",
            color: "#374263",
            cursor: "pointer",
          }}
        >
          Refresh
        </button>
      </div>

      {listError && (
        <div
          style={{
            padding: "12px 14px",
            borderRadius: "10px",
            background: "#fef2f2",
            color: "#b91c1c",
            marginBottom: "16px",
            fontSize: "14px",
          }}
        >
          {listError}
        </div>
      )}

      <div
        style={{
          background: "#fff",
          borderRadius: "16px",
          border: "1px solid #e4eaf3",
          overflow: "hidden",
          boxShadow: "0 4px 24px rgba(10,22,40,0.04)",
        }}
      >
        {loading ? (
          <div style={{ padding: "48px", textAlign: "center" }}>
            <div className="zoo-skeleton" style={{ height: "14px", maxWidth: "200px", margin: "0 auto 12px" }} />
            <div className="zoo-skeleton" style={{ height: "120px", margin: "0 auto", maxWidth: "100%" }} />
          </div>
        ) : rows.length === 0 ? (
          <div style={{ padding: "48px", textAlign: "center", color: "#6b7a99" }}>
            <p style={{ margin: "0 0 12px", fontSize: "15px" }}>No entries match your filters.</p>
            <Link to="/zoologist/species/new" style={{ color: "#0ea5e9", fontWeight: "600" }}>
              Create the first entry
            </Link>
          </div>
        ) : (
          <div style={{ padding: "20px" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                gap: "20px",
              }}
            >
              {rows.map((sp) => {
                const names = (sp.fishes || [])
                  .map((f) => f.localName || f.scientificName)
                  .slice(0, 2)
                  .join(", ");
                const manage = canManageSpecies(sp);
                return (
                  <div
                    key={sp._id}
                    className="zoo-card-hover"
                    style={{
                      background: "#fff",
                      borderRadius: "16px",
                      border: "1px solid #e4eaf3",
                      overflow: "hidden",
                      boxShadow: "0 4px 24px rgba(10,22,40,0.04)",
                      transition: "transform 0.15s ease, box-shadow 0.15s ease",
                    }}
                  >
                    <div style={{ position: "relative" }}>
                      <img
                        src={sp.evidence?.url}
                        alt=""
                        style={{
                          width: "100%",
                          height: "180px",
                          objectFit: "cover",
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          top: "12px",
                          right: "12px",
                          background: "rgba(0,0,0,0.7)",
                          color: "#fff",
                          padding: "4px 8px",
                          borderRadius: "6px",
                          fontSize: "11px",
                          fontWeight: "600",
                        }}
                      >
                        {(sp.fishes || []).map((f) => f.conservationStatus).filter(Boolean).slice(0, 1).join("")}
                      </div>
                    </div>
                    <div style={{ padding: "16px" }}>
                      <h3
                        style={{
                          fontSize: "16px",
                          fontWeight: "600",
                          color: "#0a1628",
                          margin: "0 0 8px",
                        }}
                      >
                        {names || "Species"}
                      </h3>
                      <p
                        style={{
                          fontSize: "13px",
                          color: "#6b7a99",
                          margin: "0 0 12px",
                          lineHeight: 1.4,
                        }}
                      >
                        {sp.location?.formattedAddress ||
                          sp.location?.city ||
                          [sp.location?.coordinates?.[1], sp.location?.coordinates?.[0]].filter(Boolean).join(", ") ||
                          "Location not specified"}
                      </p>
                      <div
                        style={{
                          display: "flex",
                          gap: "8px",
                          flexWrap: "wrap",
                        }}
                      >
                        <button
                          type="button"
                          className="zoo-btn-press zoo-focus-ring"
                          onClick={() => setViewEntry(sp)}
                          style={{
                            padding: "8px 12px",
                            borderRadius: "8px",
                            border: "1px solid #e4eaf3",
                            background: "#f8fafc",
                            fontSize: "13px",
                            fontWeight: "500",
                            color: "#374263",
                            cursor: "pointer",
                          }}
                        >
                          View details
                        </button>
                        {manage && (
                          <>
                            <button
                              type="button"
                              className="zoo-btn-press zoo-focus-ring"
                              onClick={() => openEdit(sp)}
                              style={{
                                padding: "8px 12px",
                                borderRadius: "8px",
                                border: "1px solid #22d3b0",
                                background: "rgba(34,211,176,0.08)",
                                fontSize: "13px",
                                fontWeight: "500",
                                color: "#0f766e",
                                cursor: "pointer",
                              }}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="zoo-btn-press zoo-focus-ring"
                              onClick={() => setDeleteTarget(sp)}
                              style={{
                                padding: "8px 12px",
                                borderRadius: "8px",
                                border: "1px solid #ef4444",
                                background: "rgba(239,68,68,0.08)",
                                fontSize: "13px",
                                fontWeight: "500",
                                color: "#dc2626",
                                cursor: "pointer",
                              }}
                            >
                              Delete
                            </button>
                          </>
                        )}
                        {!manage && (
                          <span style={{ fontSize: "11px", color: "#94a3b8", alignSelf: "center" }}>Others' entries: view only</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "12px",
            marginTop: "24px",
          }}
        >
          <button
            type="button"
            className="zoo-btn-press zoo-focus-ring"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              border: "1px solid #dde3ec",
              background: page <= 1 ? "#f1f5f9" : "#fff",
              cursor: page <= 1 ? "not-allowed" : "pointer",
            }}
          >
            Previous
          </button>
          <span style={{ fontSize: "14px", color: "#6b7a99" }}>
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            className="zoo-btn-press zoo-focus-ring"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              border: "1px solid #dde3ec",
              background: page >= totalPages ? "#f1f5f9" : "#fff",
              cursor: page >= totalPages ? "not-allowed" : "pointer",
            }}
          >
            Next
          </button>
        </div>
      )}

      {viewEntry && (
        <div
          className="zoo-animate-fade-in"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(10,22,40,0.45)",
            zIndex: 1000,
          }}
          onClick={() => setViewEntry(null)}
        >
          <div
            className="zoo-animate-scale-in"
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              background: "#fff",
              borderRadius: "16px",
              padding: "24px 28px",
              maxWidth: "560px",
              maxHeight: "min(88vh, 720px)",
              overflowY: "auto",
              boxShadow: "0 24px 64px rgba(0,0,0,0.2)",
              border: "1px solid #e8ecf2",
              margin: "20px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: "16px",
                marginBottom: "18px",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "#22d3b0",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    fontWeight: "600",
                    marginBottom: "6px",
                  }}
                >
                  Species entry
                </div>
                <h2 style={{ margin: 0, fontSize: "20px", fontWeight: "600", color: "#0a1628" }}>
                  Details
                </h2>
              </div>
              <button
                type="button"
                className="zoo-btn-press zoo-focus-ring"
                onClick={() => setViewEntry(null)}
                style={{
                  padding: "8px 14px",
                  borderRadius: "8px",
                  border: "1px solid #e4eaf3",
                  background: "#f8fafc",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#64748b",
                  cursor: "pointer",
                }}
              >
                Close
              </button>
            </div>
            <SpeciesEntryDetailView species={viewEntry} variant="light" />
          </div>
        </div>
      )}

      {deleteTarget && (
        <div
          className="zoo-animate-fade-in"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(10,22,40,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1001,
            padding: "20px",
          }}
          onClick={() => !deleting && setDeleteTarget(null)}
        >
          <div
            className="zoo-animate-scale-in"
            style={{
              background: "#fff",
              borderRadius: "16px",
              padding: "28px",
              maxWidth: "400px",
              width: "100%",
              boxShadow: "0 24px 64px rgba(0,0,0,0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: "0 0 8px", color: "#0a1628", fontSize: "18px" }}>Delete entry?</h3>
            <p style={{ margin: "0 0 20px", color: "#6b7a99", fontSize: "14px", lineHeight: 1.5 }}>
              This removes the record and evidence from storage. This cannot be undone.
            </p>
            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button
                type="button"
                className="zoo-btn-press"
                disabled={deleting}
                onClick={() => setDeleteTarget(null)}
                style={{
                  padding: "10px 16px",
                  borderRadius: "8px",
                  border: "1px solid #dde3ec",
                  background: "#fff",
                  cursor: deleting ? "not-allowed" : "pointer",
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="zoo-btn-press"
                disabled={deleting}
                onClick={confirmDelete}
                style={{
                  padding: "10px 16px",
                  borderRadius: "8px",
                  border: "none",
                  background: "#dc2626",
                  color: "#fff",
                  fontWeight: "600",
                  cursor: deleting ? "wait" : "pointer",
                }}
              >
                {deleting ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
