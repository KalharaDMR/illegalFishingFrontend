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
    if (window.confirm("Are you sure you want to approve this user?")) {
      await api.put(`/admin/approve/${id}`);
      fetchUsers();
    }
  };

  const reject = async (id) => {
    if (window.confirm("Are you sure you want to reject this user?")) {
      await api.put(`/admin/reject/${id}`);
      fetchUsers();
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Pending Approvals</h1>

        {users.length === 0 ? (
          <p className="text-gray-500">No pending approvals</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 text-left">Name</th>
                  <th className="border p-2 text-left">Email</th>
                  <th className="border p-2 text-left">Phone</th>
                  <th className="border p-2 text-left">Role</th>
                  <th className="border p-2 text-left">District</th>
                  <th className="border p-2 text-left">Evidence</th>
                  <th className="border p-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="border-t hover:bg-gray-50">
                    <td className="border p-2">{u.name}</td>
                    <td className="border p-2">{u.email}</td>
                    <td className="border p-2">{u.phone}</td>
                    <td className="border p-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium
                        ${u.role === 'AUTHORIZED_PERSON' ? 'bg-purple-100 text-purple-800' : 
                          u.role === 'ZOOLOGIST' ? 'bg-blue-100 text-blue-800' : 
                          'bg-green-100 text-green-800'}`}>
                        {u.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="border p-2">
                      {u.district || '-'}
                    </td>
                    <td className="border p-2">
                      {u.evidenceFiles.map((file, i) => (
                        <a
                          key={i}
                          href={`http://localhost:5000/uploads/${file}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 hover:underline block text-sm"
                        >
                          📎 Evidence {i + 1}
                        </a>
                      ))}
                    </td>
                    <td className="border p-2">
                      <button
                        onClick={() => approve(u._id)}
                        className="bg-green-600 text-white px-3 py-1 rounded mr-2 hover:bg-green-700 text-sm"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => reject(u._id)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}