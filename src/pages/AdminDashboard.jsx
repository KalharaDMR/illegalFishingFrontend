import { useEffect, useState } from "react";
import api from "../api/axios";
import AdminLayout from "./AdminLayout";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    const res = await api.get("/admin/pending-users");
    setUsers(res.data);
  };

  const approve = async (id) => {
    await api.put(`/admin/approve/${id}`);
    fetchUsers();
  };

  const reject = async (id) => {
    await api.put(`/admin/reject/${id}`);
    fetchUsers();
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Pending Approvals</h1>

        <table className="w-full border">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Evidence</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-t">
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>
                  {u.evidenceFiles.map((file, i) => (
                    <a
                      href={`http://localhost:5000/uploads/${file}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 block"
                    >
                      View Evidence
                    </a>
                  ))}
                </td>
                <td>
                  <button
                    onClick={() => approve(u._id)}
                    className="bg-green-600 text-white px-2 py-1 mr-2"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => reject(u._id)}
                    className="bg-red-600 text-white px-2 py-1"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
