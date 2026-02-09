import { Link } from "react-router-dom";

export default function AdminLayout({ children }) {
  return (
    <div>
      <nav className="bg-gray-800 text-white p-4 flex gap-4">
        <Link to="/admin">Pending Approvals</Link>
        <Link to="/admin/users">All Users</Link>
        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = "/login";
          }}
          className="ml-auto"
        >
          Logout
        </button>
      </nav>

      <div>{children}</div>
    </div>
  );
}
