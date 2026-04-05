import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import MapPicker from "../../components/zoologist/MapPicker";
import { CONSERVATION_STATUSES } from "../../zoologist/constants";
import { createSpecies, updateSpecies } from "../../zoologist/speciesApi";

const emptyFish = () => ({
  scientificName: "",
  localName: "",
  conservationStatus: "Endangered",
  populationEstimate: "",
});

const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: "8px",
  border: "1px solid #dde3ec",
  fontSize: "14px",
  boxSizing: "border-box",
  fontFamily: "inherit",
};

export default function SpeciesFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const location = useLocation();

  const [fishes, setFishes] = useState([emptyFish()]);
  const [description, setDescription] = useState("");
  const [loc, setLoc] = useState(null);
  const [threatsStr, setThreatsStr] = useState("");
  const [tagsStr, setTagsStr] = useState("");
  const [file, setFile] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Reset form only when navigating to new species form
    if (location.pathname === '/zoologist/species/new') {
      setFishes([emptyFish()]);
      setDescription("");
      setLoc(null);
      setThreatsStr("");
      setTagsStr("");
      setFile(null);
      setLoadError("");
      setSubmitError("");
    }
  }, [location.pathname]);

  useEffect(() => {
    if (!isEdit) return;
    let sp = location.state?.species;
    if (!sp && id) {
      try {
        const raw = sessionStorage.getItem(`zoo_species_${id}`);
        if (raw) sp = JSON.parse(raw);
      } catch {
        /* ignore */
      }
    }
    if (!sp || String(sp._id) !== String(id)) {
      setLoadError("Open this entry from the species list to edit, or your session may have expired.");
      return;
    }
    setFishes(
      sp.fishes?.length
        ? sp.fishes.map((f) => ({
            scientificName: f.scientificName || "",
            localName: f.localName || "",
            conservationStatus: f.conservationStatus || "Endangered",
            populationEstimate: f.populationEstimate || "",
          }))
        : [emptyFish()]
    );
    setDescription(sp.description || "");
    setLoc(sp.location || null);
    setThreatsStr((sp.threats || []).join(", "));
    setTagsStr((sp.tags || []).join(", "));
  }, [id, isEdit, location.state]);

  const threatsArr = useMemo(
    () =>
      threatsStr
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    [threatsStr]
  );
  const tagsArr = useMemo(
    () =>
      tagsStr
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    [tagsStr]
  );

  const updateFish = (index, field, val) => {
    setFishes((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: val };
      return next;
    });
  };

  const addFishRow = () => setFishes((prev) => [...prev, emptyFish()]);
  const removeFishRow = (index) => {
    if (fishes.length <= 1) return;
    setFishes((prev) => prev.filter((_, i) => i !== index));
  };

  const validate = () => {
    if (!loc?.coordinates || loc.coordinates.length !== 2) {
      return "Pick a location on the map or enter valid longitude and latitude.";
    }
    for (const f of fishes) {
      if (!f.scientificName?.trim() || !f.localName?.trim() || !f.conservationStatus) {
        return "Each fish entry needs scientific name, local name, and conservation status.";
      }
    }
    if (description.trim()) {
      if (description.trim().length < 20) return "Description must be at least 20 characters (or leave it empty).";
      if (description.length > 2000) return "Description must not exceed 2000 characters.";
    }
    if (!isEdit && !file) return "Evidence image is required for a new entry.";
    return null;
  };

  const buildFishesPayload = () =>
    fishes.map((f) => {
      const o = {
        scientificName: f.scientificName.trim(),
        localName: f.localName.trim(),
        conservationStatus: f.conservationStatus,
      };
      if (f.populationEstimate?.trim()) o.populationEstimate = f.populationEstimate.trim();
      return o;
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    const v = validate();
    if (v) {
      setSubmitError(v);
      return;
    }
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("fishes", JSON.stringify(buildFishesPayload()));
      formData.append("location", JSON.stringify(loc));
      formData.append("threats", JSON.stringify(threatsArr));
      formData.append("tags", JSON.stringify(tagsArr));
      if (description.trim()) formData.append("description", description.trim());

      if (isEdit) {
        if (file) formData.append("evidence", file);
        await updateSpecies(id, formData);
      } else {
        formData.append("evidence", file);
        await createSpecies(formData);
      }
      navigate("/zoologist/species");
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        "Request failed";
      setSubmitError(typeof msg === "string" ? msg : JSON.stringify(msg));
    } finally {
      setSaving(false);
    }
  };

  if (isEdit && loadError) {
    return (
      <div className="zoo-animate-fade-up">
        <div
          style={{
            background: "#fff",
            borderRadius: "14px",
            padding: "28px",
            border: "1px solid #fecaca",
            maxWidth: "520px",
          }}
        >
          <p style={{ margin: "0 0 16px", color: "#b91c1c" }}>{loadError}</p>
          <Link
            to="/zoologist/species"
            style={{
              color: "#0ea5e9",
              fontWeight: "600",
              textDecoration: "none",
            }}
          >
            ← Back to all species
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="zoo-animate-fade-up">
      <div style={{ marginBottom: "24px" }}>
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
          {isEdit ? "Edit entry" : "New entry"}
        </div>
        <h1
          style={{
            fontSize: "24px",
            fontWeight: "600",
            color: "#0a1628",
            margin: "0 0 8px",
            letterSpacing: "-0.02em",
          }}
        >
          {isEdit ? "Update endangered species" : "Add endangered species"}
        </h1>
        <p style={{ margin: 0, fontSize: "14px", color: "#6b7a99", maxWidth: "560px" }}>
          Use the map to place the observation. Evidence is uploaded to secure storage (multipart + Cloudinary on the
          server).
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{
          background: "#fff",
          borderRadius: "16px",
          padding: "28px 32px",
          border: "1px solid #e4eaf3",
          boxShadow: "0 4px 24px rgba(10,22,40,0.04)",
          maxWidth: "720px",
        }}
      >
        <section style={{ marginBottom: "28px" }}>
          <h2
            style={{
              fontSize: "13px",
              fontWeight: "600",
              color: "#8a96b0",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              margin: "0 0 14px",
            }}
          >
            Fish / species entries
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {fishes.map((f, i) => (
              <div
                key={i}
                className="zoo-animate-scale-in"
                style={{
                  padding: "16px",
                  borderRadius: "12px",
                  background: "#f8fafc",
                  border: "1px solid #e8ecf2",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "10px",
                  }}
                >
                  <span style={{ fontSize: "12px", fontWeight: "600", color: "#374263" }}>
                    Entry {i + 1}
                  </span>
                  {fishes.length > 1 && (
                    <button
                      type="button"
                      className="zoo-btn-press"
                      onClick={() => removeFishRow(i)}
                      style={{
                        fontSize: "12px",
                        border: "none",
                        background: "transparent",
                        color: "#ef4444",
                        cursor: "pointer",
                        fontWeight: "500",
                      }}
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div style={{ display: "grid", gap: "10px" }}>
                  <input
                    className="zoo-focus-ring"
                    style={inputStyle}
                    placeholder="Scientific name"
                    value={f.scientificName}
                    onChange={(e) => updateFish(i, "scientificName", e.target.value)}
                  />
                  <input
                    className="zoo-focus-ring"
                    style={inputStyle}
                    placeholder="Local name"
                    value={f.localName}
                    onChange={(e) => updateFish(i, "localName", e.target.value)}
                  />
                  <select
                    className="zoo-focus-ring"
                    style={{ ...inputStyle, cursor: "pointer" }}
                    value={f.conservationStatus}
                    onChange={(e) => updateFish(i, "conservationStatus", e.target.value)}
                  >
                    {CONSERVATION_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <input
                    className="zoo-focus-ring"
                    style={inputStyle}
                    placeholder="Population estimate (optional)"
                    value={f.populationEstimate}
                    onChange={(e) => updateFish(i, "populationEstimate", e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            className="zoo-btn-press zoo-focus-ring"
            onClick={addFishRow}
            style={{
              marginTop: "12px",
              padding: "8px 14px",
              borderRadius: "8px",
              border: "1px dashed #22d3b0",
              background: "rgba(34,211,176,0.06)",
              color: "#0d9488",
              fontSize: "13px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            + Add another species
          </button>
        </section>

        <section style={{ marginBottom: "28px" }}>
          <label
            style={{
              display: "block",
              fontSize: "13px",
              fontWeight: "600",
              color: "#374263",
              marginBottom: "8px",
            }}
          >
            Description (optional, 20–2000 chars if provided)
          </label>
          <textarea
            className="zoo-focus-ring"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            placeholder="Habitat notes, behaviour, survey context…"
            style={{
              ...inputStyle,
              resize: "vertical",
              minHeight: "100px",
            }}
          />
        </section>

        <section style={{ marginBottom: "28px" }}>
          <MapPicker value={loc} onChange={setLoc} />
        </section>

        <section style={{ marginBottom: "28px" }}>
          <label style={{ ...inputStyle, display: "block", marginBottom: "8px", border: "none", padding: 0 }}>
            <span style={{ fontWeight: "600", color: "#374263" }}>Threats</span>
            <span style={{ color: "#8a96b0", fontWeight: "400", fontSize: "12px" }}>
              {" "}
              (comma-separated)
            </span>
          </label>
          <input
            className="zoo-focus-ring"
            style={inputStyle}
            value={threatsStr}
            onChange={(e) => setThreatsStr(e.target.value)}
            placeholder="e.g. Overfishing, Habitat loss"
          />
        </section>

        <section style={{ marginBottom: "28px" }}>
          <label style={{ ...inputStyle, display: "block", marginBottom: "8px", border: "none", padding: 0 }}>
            <span style={{ fontWeight: "600", color: "#374263" }}>Tags</span>
            <span style={{ color: "#8a96b0", fontWeight: "400", fontSize: "12px" }}>
              {" "}
              (comma-separated)
            </span>
          </label>
          <input
            className="zoo-focus-ring"
            style={inputStyle}
            value={tagsStr}
            onChange={(e) => setTagsStr(e.target.value)}
            placeholder="e.g. coral, survey-2025"
          />
        </section>

        <section style={{ marginBottom: "24px" }}>
          <label
            style={{
              display: "block",
              fontSize: "13px",
              fontWeight: "600",
              color: "#374263",
              marginBottom: "8px",
            }}
          >
            Evidence image {isEdit ? "(optional — replaces existing if selected)" : "(required)"}
          </label>
          <input
            className="zoo-focus-ring"
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            style={{ fontSize: "14px" }}
          />
        </section>

        {submitError && (
          <div
            style={{
              padding: "12px 14px",
              borderRadius: "10px",
              background: "#fef2f2",
              border: "1px solid #fecaca",
              color: "#b91c1c",
              fontSize: "13px",
              marginBottom: "16px",
            }}
          >
            {submitError}
          </div>
        )}

        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <button
            type="submit"
            disabled={saving}
            className="zoo-btn-press zoo-focus-ring"
            style={{
              padding: "12px 22px",
              borderRadius: "10px",
              border: "none",
              background: saving ? "#94a3b8" : "linear-gradient(135deg, #22d3b0, #0ea5e9)",
              color: "#fff",
              fontSize: "15px",
              fontWeight: "600",
              cursor: saving ? "not-allowed" : "pointer",
              boxShadow: "0 4px 14px rgba(14,165,233,0.25)",
            }}
          >
            {saving ? "Saving…" : isEdit ? "Save changes" : "Create entry"}
          </button>
          <Link
            to="/zoologist/species"
            style={{
              padding: "12px 18px",
              borderRadius: "10px",
              border: "1px solid #dde3ec",
              color: "#374263",
              fontSize: "15px",
              fontWeight: "500",
              textDecoration: "none",
              alignSelf: "center",
            }}
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
