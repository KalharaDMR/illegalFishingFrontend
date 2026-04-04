import { useEffect, useState } from "react";
import Layout from "../components/Layout";

const API_BASE = "http://localhost:5000";

export default function AuthorizedUserProfile() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    district: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const res = await fetch(`${API_BASE}/api/profile/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch profile details");
      }

      setUser(data);
      setForm({
        name: data?.name || "",
        email: data?.email || "",
        phone: data?.phone || "",
        district: data?.district || "",
      });
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleEditToggle = () => {
    setSuccess("");
    setError("");

    if (editing && user) {
      setForm({
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
        district: user?.district || "",
      });
    }

    setEditing((prev) => !prev);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const token = localStorage.getItem("token");

      const res = await fetch(`${API_BASE}/api/profile/me`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          district: form.district,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      setUser(data.user);
      setForm({
        name: data.user?.name || "",
        email: data.user?.email || "",
        phone: data.user?.phone || "",
        district: data.user?.district || "",
      });
      setEditing(false);
      setSuccess(data.message || "Profile updated successfully");
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="p-6">
          <div className="max-w-6xl mx-auto">
            <div className="rounded-2xl bg-white border border-gray-200 shadow-md p-8 text-center text-gray-500">
              Loading profile...
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error && !user) {
    return (
      <Layout>
        <div className="p-6">
          <div className="max-w-6xl mx-auto">
            <div className="rounded-2xl bg-white border border-red-200 shadow-md p-8 text-center text-red-500">
              {error}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const fullName = user?.name || "No Name";
  const role = user?.role || "AUTHORIZED_PERSON";
  const email = user?.email || "No Email";
  const phone = user?.phone || "No Phone";
  const district = user?.district || "No District";
  const badgeId = user?.id || user?._id || "N/A";
  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString()
    : "N/A";
  const status = user?.status || "APPROVED";

  const infoItems = [
    { label: "Full Name", value: fullName, field: "name" },
    { label: "Role", value: role, field: null },
    { label: "Email", value: email, field: "email" },
    { label: "Phone", value: phone, field: "phone" },
    { label: "District", value: district, field: "district" },
    { label: "Status", value: status, field: null },
  ];

  return (
    <Layout>
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 text-white shadow-lg mb-6">
            <h1 className="text-2xl font-bold">My Profile</h1>
            <p className="text-sm opacity-80">
              Manage your account and personal information
            </p>
          </div>

          {success && (
            <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {success}
            </div>
          )}

          {error && user && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white/80 backdrop-blur border border-gray-200 rounded-2xl shadow-md p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-3xl font-bold text-white shadow-md">
                  {fullName.charAt(0).toUpperCase()}
                </div>

                <h2 className="mt-4 text-xl font-semibold text-gray-900">
                  {fullName}
                </h2>

                <p className="text-sm text-gray-500">{role}</p>

                <span className="mt-3 px-4 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">
                  ● {status}
                </span>
              </div>

              <div className="mt-6 border-t pt-4 space-y-4 text-sm">
                <div>
                  <p className="text-gray-400">Badge ID</p>
                  <p className="font-medium text-gray-900">{badgeId}</p>
                </div>

                <div>
                  <p className="text-gray-400">District</p>
                  <p className="font-medium text-gray-900">{district}</p>
                </div>

                <div>
                  <p className="text-gray-400">Joined</p>
                  <p className="font-medium text-gray-900">{joinedDate}</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Personal Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {infoItems.map((item) => (
                  <div key={item.label}>
                    <label className="block text-sm text-gray-400 mb-1">
                      {item.label}
                    </label>

                    {editing && item.field ? (
                      <input
                        type="text"
                        value={form[item.field]}
                        onChange={handleChange(item.field)}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 shadow-sm outline-none focus:border-indigo-400"
                      />
                    ) : (
                      <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 shadow-sm">
                        {item.value}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  About
                </h3>

                <div className="rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 p-4 text-sm text-gray-700 leading-relaxed">
                  {fullName} is an authorized officer responsible for monitoring
                  restricted fishing zones, verifying reports, and supporting
                  marine conservation activities in the {district} district.
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                {!editing ? (
                  <button
                    onClick={handleEditToggle}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold shadow-md hover:scale-[1.02] transition"
                  >
                    ✏️ Edit Profile
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white text-sm font-semibold shadow-md hover:scale-[1.02] transition disabled:opacity-70"
                    >
                      {saving ? "Saving..." : "✅ Save Changes"}
                    </button>

                    <button
                      onClick={handleEditToggle}
                      disabled={saving}
                      className="px-5 py-2.5 rounded-xl border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-100 transition disabled:opacity-70"
                    >
                      Cancel
                    </button>
                  </>
                )}

                <button className="px-5 py-2.5 rounded-xl border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-100 transition">
                  🔒 Change Password
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
