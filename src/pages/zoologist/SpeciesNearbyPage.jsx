import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CircleMarker, MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import {
  DEFAULT_MAP_CENTER,
  DEFAULT_MAP_ZOOM,
  OSM_ATTRIBUTION,
  OSM_TILE_URL,
} from "../../zoologist/constants";
import { NearbyMapViewSync } from "../../components/zoologist/leafletHelpers";
import SpeciesEntryDetailView from "../../components/zoologist/SpeciesEntryDetailView";
import { getNearbySpecies, getSpeciesDetailsByLocation } from "../../zoologist/speciesApi";

export default function SpeciesNearbyPage() {
  const mapPaneRef = useRef(null);
  const [selectedPos, setSelectedPos] = useState(null);
  const [maxKm, setMaxKm] = useState(50);
  const [nearbyList, setNearbyList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState("");
  /** When set, map flies to this species pin (list or marker click). */
  const [mapFocus, setMapFocus] = useState(null);
  const [highlightedId, setHighlightedId] = useState(null);

  const defaultCenter = useMemo(
    () => ({ lat: DEFAULT_MAP_CENTER.lat, lng: DEFAULT_MAP_CENTER.lng }),
    []
  );

  const mapInitialCenter = useMemo(() => {
    if (selectedPos) return [selectedPos.lat, selectedPos.lng];
    return [DEFAULT_MAP_CENTER.lat, DEFAULT_MAP_CENTER.lng];
  }, [selectedPos]);

  const mapInitialZoom = selectedPos ? 11 : DEFAULT_MAP_ZOOM;

  const fetchNearby = useCallback(
    async (lat, lng) => {
      setLoading(true);
      setError("");
      setDetail(null);
      setDetailError("");
      try {
        const maxDistance = Math.round(maxKm * 1000);
        const data = await getNearbySpecies({
          latitude: lat,
          longitude: lng,
          maxDistance,
        });
        setNearbyList(data.data || []);
      } catch (err) {
        setNearbyList([]);
        setError(err.response?.data?.error || err.message || "Failed to load nearby species");
      } finally {
        setLoading(false);
      }
    },
    [maxKm]
  );

  useEffect(() => {
    if (!selectedPos) return;
    fetchNearby(selectedPos.lat, selectedPos.lng);
  }, [selectedPos, maxKm, fetchNearby]);

  useEffect(() => {
    if (highlightedId && !nearbyList.some((s) => String(s._id) === String(highlightedId))) {
      setHighlightedId(null);
      setMapFocus(null);
    }
  }, [nearbyList, highlightedId]);

  const onUseMyLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported in this browser.");
      return;
    }
    setError("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setSelectedPos({ lat, lng });
      },
      () => {
        setError(
          "Location permission denied or unavailable. Allow location access, or click on the map to select a location."
        );
      },
      { enableHighAccuracy: true, timeout: 12000 }
    );
  };

  const loadSpeciesDetails = async (sp) => {
    const coords = sp.location?.coordinates;
    if (!coords || coords.length !== 2) return;
    setDetailLoading(true);
    setDetailError("");
    setDetail(null);
    try {
      const res = await getSpeciesDetailsByLocation({
        type: "Point",
        coordinates: [Number(coords[0]), Number(coords[1])],
      });
      setDetail(res.data);
    } catch (err) {
      setDetailError(
        err.response?.data?.error || "No verified entry at this exact coordinate (try list view)."
      );
    } finally {
      setDetailLoading(false);
    }
  };

  const selectNearbySpecies = (sp) => {
    const coords = sp.location?.coordinates;
    if (coords?.length === 2) {
      setHighlightedId(sp._id);
      setMapFocus({ lat: Number(coords[1]), lng: Number(coords[0]), zoom: 15 });
    }
    mapPaneRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    loadSpeciesDetails(sp);
  };

  const MapClickHandler = () => {
    useMapEvents({
      click: (e) => {
        setSelectedPos({ lat: e.latlng.lat, lng: e.latlng.lng });
        setError("");
      },
    });
    return null;
  };

  const showSearchOverview = () => {
    setMapFocus(null);
    setHighlightedId(null);
  };

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
          Geospatial
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
          Species near me
        </h1>
        <p style={{ margin: 0, fontSize: "14px", color: "#6b7a99", maxWidth: "640px" }}>
          Map: OpenStreetMap (no API key). Click on the map to select a location, or use your location to load nearby entries, then click a result or pin — the
          map moves to that location and details load below.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(280px, 360px)",
          gap: "20px",
          alignItems: "stretch",
        }}
        className="zoo-nearby-grid"
      >
        <div
          ref={mapPaneRef}
          style={{
            background: "#fff",
            borderRadius: "16px",
            border: "1px solid #e4eaf3",
            overflow: "hidden",
            boxShadow: "0 4px 24px rgba(10,22,40,0.04)",
            minHeight: "440px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              padding: "16px 18px",
              borderBottom: "1px solid #eef2f7",
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              alignItems: "center",
            }}
          >
            <button
              type="button"
              className="zoo-btn-press zoo-focus-ring"
              onClick={onUseMyLocation}
              style={{
                padding: "10px 16px",
                borderRadius: "10px",
                border: "none",
                background: "linear-gradient(135deg, #22d3b0, #0ea5e9)",
                color: "#fff",
                fontWeight: "600",
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              Use my location
            </button>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#374263" }}>
              Radius
              <select
                className="zoo-focus-ring"
                value={maxKm}
                onChange={(e) => setMaxKm(Number(e.target.value))}
                style={{
                  padding: "8px 10px",
                  borderRadius: "8px",
                  border: "1px solid #dde3ec",
                  cursor: "pointer",
                }}
              >
                <option value={5}>5 km</option>
                <option value={25}>25 km</option>
                <option value={50}>50 km</option>
                <option value={100}>100 km</option>
              </select>
            </label>
            {selectedPos && (
              <button
                type="button"
                className="zoo-btn-press"
                onClick={() => fetchNearby(selectedPos.lat, selectedPos.lng)}
                disabled={loading}
                style={{
                  padding: "10px 14px",
                  borderRadius: "10px",
                  border: "1px solid #e4eaf3",
                  background: "#fff",
                  fontSize: "13px",
                  fontWeight: "500",
                  cursor: loading ? "wait" : "pointer",
                }}
              >
                Refresh search
              </button>
            )}
            {mapFocus && (
              <button
                type="button"
                className="zoo-btn-press zoo-focus-ring"
                onClick={showSearchOverview}
                style={{
                  padding: "10px 14px",
                  borderRadius: "10px",
                  border: "1px solid rgba(34,211,176,0.45)",
                  background: "rgba(34,211,176,0.08)",
                  color: "#0f766e",
                  fontSize: "13px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Show search area
              </button>
            )}
          </div>

          <div style={{ flex: 1, position: "relative", minHeight: "360px", height: "420px" }}>
            <MapContainer
              center={mapInitialCenter}
              zoom={mapInitialZoom}
              style={{ height: "100%", width: "100%", borderRadius: "0 0 12px 12px" }}
              scrollWheelZoom
            >
              <TileLayer attribution={OSM_ATTRIBUTION} url={OSM_TILE_URL} />
              <MapClickHandler />
              <NearbyMapViewSync
                focus={mapFocus}
                userPos={selectedPos}
                defaultCenter={defaultCenter}
                defaultZoom={DEFAULT_MAP_ZOOM}
                userZoom={11}
              />
              {selectedPos && (
                <CircleMarker
                  center={[selectedPos.lat, selectedPos.lng]}
                  radius={11}
                  pathOptions={{
                    color: "#0ea5e9",
                    fillColor: "#0ea5e9",
                    fillOpacity: 0.9,
                    weight: 2,
                  }}
                />
              )}
              {nearbyList.map((sp) => {
                const c = sp.location?.coordinates;
                if (!c || c.length !== 2) return null;
                const isHi = highlightedId && String(sp._id) === String(highlightedId);
                return (
                  <Marker
                    key={sp._id}
                    position={[c[1], c[0]]}
                    zIndexOffset={isHi ? 600 : 0}
                    eventHandlers={{ click: () => selectNearbySpecies(sp) }}
                  />
                );
              })}
            </MapContainer>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div
            className="zoo-card-hover"
            style={{
              background: "#fff",
              borderRadius: "16px",
              border: "1px solid #e4eaf3",
              padding: "18px",
              boxShadow: "0 4px 24px rgba(10,22,40,0.04)",
              flex: 1,
              minHeight: "200px",
              overflowY: "auto",
            }}
          >
            <h2
              style={{
                fontSize: "12px",
                fontWeight: "600",
                color: "#8a96b0",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                margin: "0 0 12px",
              }}
            >
              Nearby results
            </h2>
            {error && (
              <p style={{ color: "#b91c1c", fontSize: "13px", margin: "0 0 12px" }}>{error}</p>
            )}
            {loading && <div className="zoo-skeleton" style={{ height: "80px" }} />}
            {!loading && nearbyList.length === 0 && !error && (
              <p style={{ margin: 0, fontSize: "14px", color: "#94a3b8" }}>
                Click on the map or use your location to see endangered species entries near you.
              </p>
            )}
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {nearbyList.map((sp) => {
                const isHi = highlightedId && String(sp._id) === String(highlightedId);
                return (
                  <li key={sp._id} style={{ marginBottom: "12px" }}>
                    <button
                      type="button"
                      className="zoo-btn-press"
                      onClick={() => selectNearbySpecies(sp)}
                      style={{
                        width: "100%",
                        textAlign: "left",
                        padding: "12px 14px",
                        borderRadius: "12px",
                        border: isHi ? "2px solid #22d3b0" : "1px solid #eef2f7",
                        background: isHi ? "rgba(34,211,176,0.08)" : "#f8fafc",
                        cursor: "pointer",
                        transition: "border-color 0.15s ease, background 0.15s ease",
                        boxShadow: isHi ? "0 4px 14px rgba(34,211,176,0.2)" : "none",
                      }}
                    >
                      <div style={{ fontWeight: "600", color: "#0a1628", fontSize: "14px" }}>
                        {(sp.fishes || []).map((f) => f.localName).filter(Boolean).slice(0, 2).join(", ") || "Species"}
                      </div>
                      <div style={{ fontSize: "12px", color: "#22d3b0", marginTop: "4px" }}>
                        {sp.distanceKm != null ? `${sp.distanceKm} km away` : ""}
                        {isHi ? " · shown on map" : ""}
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <div
            className="zoo-animate-fade-in"
            style={{
              background: "linear-gradient(145deg, #0a1628 0%, #0d2a45 100%)",
              borderRadius: "16px",
              padding: "20px",
              border: "1px solid rgba(34,211,176,0.15)",
              color: "#e0f0ff",
            }}
          >
            <h2
              style={{
                fontSize: "12px",
                fontWeight: "600",
                color: "#22d3b0",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                margin: "0 0 12px",
              }}
            >
              Pin details (read-only)
            </h2>
            {detailLoading && <div className="zoo-skeleton" style={{ height: "100px", opacity: 0.35 }} />}
            {detailError && !detailLoading && (
              <p style={{ margin: 0, fontSize: "13px", color: "#fca5a5" }}>{detailError}</p>
            )}
            {detail && !detailLoading && (
              <div className="zoo-animate-scale-in">
                <SpeciesEntryDetailView species={detail} variant="dark" />
              </div>
            )}
            {!detail && !detailLoading && !detailError && (
              <p style={{ margin: 0, fontSize: "13px", color: "rgba(200,220,255,0.55)" }}>
                Choose a nearby result or map pin — the map centers on that location and details appear here.
              </p>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 960px) {
          .zoo-nearby-grid {
            grid-template-columns: 1fr !important;
          }
        }
        .leaflet-container {
          font-family: inherit;
        }
      `}</style>
    </div>
  );
}
