import Sidebar from "./Sidebar";
import { useAuth } from "../hooks/useAuth";

export default function Layout({ children }) {
  const { role } = useAuth();

  return (
    <div style={{
      display: "flex",
      height: "100vh",
      fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif",
      background: "#f0f4f8",
    }}>
      <Sidebar role={role} />
      <main style={{
        flex: 1,
        overflowY: "auto",
        background: "#f0f4f8",
        padding: "32px",
      }}>
        {children}
      </main>
    </div>
  );
}
