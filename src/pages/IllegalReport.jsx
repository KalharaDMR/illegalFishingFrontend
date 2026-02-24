import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const sriLankaDistricts = [
  "Ampara", "Anuradhapura", "Badulla", "Batticaloa", "Colombo",
  "Galle", "Gampaha", "Hambantota", "Jaffna", "Kalutara",
  "Kandy", "Kegalle", "Kilinochchi", "Kurunegala", "Mannar",
  "Matale", "Matara", "Monaragala", "Mullaitivu", "Nuwara Eliya",
  "Polonnaruwa", "Puttalam", "Ratnapura", "Trincomalee", "Vavuniya"
];

export default function IllegalReport() {
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    district: "",
    reportDate: "",
    reportTime: "",
    location: "",
    latitude: "",
    longitude: "",
    description: "",
  });

  const [files, setFiles] = useState([]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // ✅ Initialize Leaflet Map
  useEffect(() => {
    if (mapRef.current) return; // Prevent multiple maps

    const map = L.map("map").setView([7.8731, 80.7718], 7); // Sri Lanka center

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    map.on("click", function (e) {
      const { lat, lng } = e.latlng;

      setForm((prev) => ({
        ...prev,
        latitude: lat.toFixed(6),
        longitude: lng.toFixed(6),
      }));

      if (markerRef.current) {
        map.removeLayer(markerRef.current);
      }

      markerRef.current = L.marker([lat, lng]).addTo(map);
    });

    mapRef.current = map;
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!form.district) {
      setMessage("District is required");
      setLoading(false);
      return;
    }

    const data = new FormData();

    Object.keys(form).forEach((key) => {
      data.append(key, form[key]);
    });

    files.forEach((file) => {
      data.append("evidence", file);
    });

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:5000/api/reports",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage(res.data.message);

      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);

    } catch (error) {
      setMessage(
        error.response?.data?.message || "Submission failed"
      );
    }

    setLoading(false);
  };

  return (
    <div style={styles.page}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <h2 style={styles.title}>
          🚨 Report Illegal Fishing Activity
        </h2>

        {message && <p style={{ textAlign: "center" }}>{message}</p>}

        <select
          name="district"
          value={form.district}
          onChange={handleChange}
          style={styles.input}
          required
        >
          <option value="">Select District</option>
          {sriLankaDistricts.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>

        <input
          type="date"
          name="reportDate"
          onChange={handleChange}
          style={styles.input}
          required
        />

        <input
          type="time"
          name="reportTime"
          onChange={handleChange}
          style={styles.input}
          required
        />

        <input
          placeholder="Location"
          name="location"
          onChange={handleChange}
          style={styles.input}
        />

        <div style={styles.row}>
          <input
            placeholder="Latitude"
            name="latitude"
            value={form.latitude}
            readOnly
            style={styles.input}
          />
          <input
            placeholder="Longitude"
            name="longitude"
            value={form.longitude}
            readOnly
            style={styles.input}
          />
        </div>

        {/* 🗺 Leaflet Map */}
        <div
          id="map"
          style={{
            width: "100%",
            height: "300px",
            borderRadius: "8px",
          }}
        ></div>

        <textarea
          placeholder="Describe the incident..."
          name="description"
          onChange={handleChange}
          style={{ ...styles.input, height: "90px" }}
          required
        />

        <input
          type="file"
          multiple
          onChange={(e) => setFiles([...e.target.files])}
        />

        <button
          type="submit"
          style={styles.button}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Report"}
        </button>
      </form>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
  },
  card: {
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "8px",
    width: "100%",
    maxWidth: "500px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  title: {
    textAlign: "center",
    marginBottom: "10px",
  },
  input: {
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  row: {
    display: "flex",
    gap: "10px",
  },
  button: {
    padding: "10px",
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};