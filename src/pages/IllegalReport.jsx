import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function IllegalReport() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    reportDate: "",
    reportTime: "",
    location: "",
    latitude: "",
    longitude: "",
    description: "",
  });

  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.keys(form).forEach((key) => data.append(key, form[key]));
    files.forEach((file) => data.append("evidence", file));

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post("http://localhost:5000/api/reports", data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage(res.data.message);

      setTimeout(() => {
        navigate("/dashboard"); //  Redirect back
      }, 1500);
    } catch {
      setMessage("Submission failed");
    }
  };

  return (
    <div style={styles.page}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <h2 style={styles.title}>🚨 Report Illegal Fishing Activity</h2>

        {message && <p style={{ textAlign: "center" }}>{message}</p>}

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
            onChange={handleChange}
            style={styles.input}
          />
          <input
            placeholder="Longitude"
            name="longitude"
            onChange={handleChange}
            style={styles.input}
          />
        </div>

        <textarea
          placeholder="Describe the incident..."
          name="description"
          onChange={handleChange}
          style={{ ...styles.input, height: "90px" }}
        />

        <input
          type="file"
          multiple
          onChange={(e) => setFiles([...e.target.files])}
        />

        <button type="submit" style={styles.button}>
          Submit Report
        </button>

        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          style={styles.cancel}
        >
          Cancel
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
    background: "linear-gradient(135deg,#1d3557,#457b9d)",
  },

  card: {
    background: "white",
    padding: "35px",
    borderRadius: "14px",
    width: "420px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    boxShadow: "0 15px 35px rgba(0,0,0,.3)",
  },

  title: {
    textAlign: "center",
    color: "#e63946",
  },

  row: {
    display: "flex",
    gap: "10px",
  },

  input: {
    padding: "9px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    width: "100%",
  },

  button: {
    background: "#e63946",
    color: "white",
    padding: "10px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
    marginTop: "10px",
  },

  cancel: {
    background: "#555",
    color: "white",
    padding: "8px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};
