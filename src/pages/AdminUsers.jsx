import { useEffect, useState } from "react";
import api from "../api/axios";
import AdminLayout from "./AdminLayout";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    const res = await api.get("/admin/users");
    setUsers(res.data);
  };

  const removeUser = async (id) => {
    if (!window.confirm("Are you sure you want to remove this user?")) return;

    try {
      await api.delete(`/admin/users/${id}`);
      fetchUsers();
      alert("User removed successfully");
    } catch (error) {
      alert("Failed to remove user");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const getStatusBadgeColor = (status) => {
    switch(status) {
      case 'APPROVED': return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">All Users</h1>

        {users.length === 0 ? (
          <p className="text-gray-500">No users found</p>
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
                  <th className="border p-2 text-left">Status</th>
                  <th className="border p-2 text-left">Joined</th>
                  <th className="border p-2 text-left">Action</th>
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
                          u.role === 'ADMIN' ? 'bg-red-100 text-red-800' :
                          'bg-green-100 text-green-800'}`}>
                        {u.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="border p-2">
                      {u.district || '-'}
                    </td>
                    <td className="border p-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadgeColor(u.status)}`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="border p-2">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="border p-2">
                      <button
                        onClick={() => removeUser(u._id)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                        disabled={u.role === 'ADMIN'}
                      >
                        Remove
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