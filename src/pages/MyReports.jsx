import React, { useEffect, useState } from "react";
import api from "../api/axios";

const MyReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      const res = await api.get("/reports/my");
      setReports(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this report?"))
      return;

    try {
      await api.delete(`/reports/${id}`);
      fetchReports();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = async (report) => {
    const newDescription = prompt(
      "Update Description:",
      report.description
    );

    if (!newDescription) return;

    try {
      await api.put(`/reports/${report._id}`, {
        description: newDescription,
      });

      fetchReports();
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return (
      <div style={styles.center}>
        <h2>Loading Reports...</h2>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>📂 My Submitted Reports</h1>

      {reports.length === 0 ? (
        <p style={{ textAlign: "center" }}>No reports found.</p>
      ) : (
        reports.map((report) => (
          <div key={report._id} style={styles.card}>

            <div style={styles.row}>
              <span><b>Date:</b> {new Date(report.reportDate).toLocaleDateString()}</span>
              <span><b>Time:</b> {report.reportTime}</span>
            </div>

            <p><b>Location:</b> {report.location}</p>
            <p><b>Description:</b> {report.description}</p>

            <div style={styles.status(report.status)}>
              {report.status}
            </div>

            <div style={styles.buttonRow}>
              <button
                onClick={() => handleEdit(report)}
                style={styles.editBtn}
              >
                ✏ Update
              </button>

              <button
                onClick={() => handleDelete(report._id)}
                style={styles.deleteBtn}
              >
                🗑 Delete
              </button>
            </div>

          </div>
        ))
      )}
    </div>
  );
};

export default MyReports;

/* =========================
   MODERN STYLES
========================= */

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg,#0f2027,#203a43,#2c5364)",
    padding: "40px",
    color: "white",
  },

  title: {
    textAlign: "center",
    marginBottom: "30px",
  },

  card: {
    background: "white",
    color: "#333",
    padding: "20px",
    borderRadius: "12px",
    marginBottom: "20px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
  },

  status: (status) => ({
    display: "inline-block",
    padding: "5px 12px",
    borderRadius: "20px",
    background:
      status === "RESOLVED"
        ? "#2ecc71"
        : status === "INVESTIGATING"
        ? "#f39c12"
        : "#e74c3c",
    color: "white",
    fontWeight: "bold",
    marginTop: "10px",
  }),

  buttonRow: {
    marginTop: "15px",
    display: "flex",
    gap: "10px",
  },

  editBtn: {
    background: "#3498db",
    color: "white",
    border: "none",
    padding: "8px 14px",
    borderRadius: "6px",
    cursor: "pointer",
  },

  deleteBtn: {
    background: "#e74c3c",
    color: "white",
    border: "none",
    padding: "8px 14px",
    borderRadius: "6px",
    cursor: "pointer",
  },

  center: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  },
};
