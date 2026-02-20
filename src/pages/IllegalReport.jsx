import React, { useState } from "react";
import axios from "axios";

export default function IllegalReport() {
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

  const handleFileChange = (e) => setFiles([...e.target.files]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();

    Object.keys(form).forEach((key) => data.append(key, form[key]));
    files.forEach((file) => data.append("evidence", file));

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post("http://localhost:5000/api/reports", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage(res.data.message);
    } catch (err) {
      setMessage("Submission failed");
    }
  };

  return (
    <div style={styles.page}>
      <form onSubmit={handleSubmit} style={styles.card}>

        <h2 style={styles.title}>🚨 Report Illegal Fishing</h2>

        {message && <p>{message}</p>}

        <div style={styles.row}>
          <input type="date" name="reportDate" onChange={handleChange} style={styles.input} required />
          <input type="time" name="reportTime" onChange={handleChange} style={styles.input} required />
        </div>

        <input placeholder="Location" name="location" onChange={handleChange} style={styles.input} />

        <div style={styles.row}>
          <input placeholder="Latitude" name="latitude" onChange={handleChange} style={styles.input} />
          <input placeholder="Longitude" name="longitude" onChange={handleChange} style={styles.input} />
        </div>

        <textarea
          placeholder="Describe what you witnessed..."
          name="description"
          onChange={handleChange}
          style={{ ...styles.input, height: "90px" }}
        />

        <input type="file" multiple onChange={handleFileChange} />

        <button type="submit" style={styles.button}>
          Submit Report
        </button>

      </form>
    </div>
  );
}

/* INLINE CSS OBJECT */

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f2f2f2",
  },

  card: {
    background: "white",
    padding: "25px",
    borderRadius: "10px",
    width: "380px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    boxShadow: "0 0 15px rgba(0,0,0,.15)",
  },

  title: {
    textAlign: "center",
    color: "red",
  },

  row: {
    display: "flex",
    gap: "8px",
  },

  input: {
    padding: "8px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    width: "100%",
  },

  button: {
    background: "red",
    color: "white",
    padding: "10px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
    marginTop: "10px",
  },
};
