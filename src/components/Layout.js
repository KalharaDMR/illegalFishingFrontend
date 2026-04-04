import Sidebar from "./Sidebar";
import { useAuth } from "../hooks/useAuth";

export default function Layout({ children }) {
  const { role } = useAuth();

  return (
    <div
      style={{
        display: "flex", // side-by-side: sidebar | main
        height: "100vh",
        fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif",
        background: "#f3f5f8",
      }}
    >
      {/* Dark blue vertical sidebar — unchanged */}
      <Sidebar role={role} />

      {/* Scrollable main content area */}
      <main
        style={{
          flex: 1,
          overflowY: "auto",
          background: "#f3f5f8",
          padding: "36px 40px",
        }}
      >
        {children}
      </main>
    </div>
  );
}
