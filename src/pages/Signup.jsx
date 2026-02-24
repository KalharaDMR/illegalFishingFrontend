import { useState, useEffect } from "react";
import axios from "axios";
import { getDistricts } from "../api/districts"; // Import the districts API

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "PUBLIC_USER",
    district: "", // Add district field
  });
  const [files, setFiles] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch districts when component mounts
  useEffect(() => {
    const fetchDistricts = async () => {
      const districtList = await getDistricts();
      setDistricts(districtList);
    };
    fetchDistricts();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate district for AUTHORIZED_PERSON
    if (form.role === "AUTHORIZED_PERSON" && !form.district) {
      alert("Please select a district");
      setLoading(false);
      return;
    }

    const data = new FormData();
    Object.keys(form).forEach((key) => {
      if (form[key]) { // Only append if value exists
        data.append(key, form[key]);
      }
    });

    if (form.role !== "PUBLIC_USER") {
      for (let file of files) {
        data.append("evidence", file);
      }
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/signup",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert(res.data.message);
      // Redirect to login after successful signup
      window.location.href = "/login";
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            name="name"
            placeholder="Enter your full name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            name="email"
            type="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <input
            name="phone"
            placeholder="Enter your phone number"
            value={form.phone}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Role
          </label>
          <select 
            name="role" 
            value={form.role}
            onChange={handleChange} 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="PUBLIC_USER">Public User</option>
            <option value="ZOOLOGIST">Zoologist</option>
            <option value="AUTHORIZED_PERSON">Authorized Person</option>
          </select>
        </div>

        {/* District dropdown for AUTHORIZED_PERSON */}
        {form.role === "AUTHORIZED_PERSON" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              District <span className="text-red-500">*</span>
            </label>
            <select
              name="district"
              value={form.district}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select a district</option>
              {districts.map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Please select your district of operation
            </p>
          </div>
        )}

        {/* Evidence upload for non-public users */}
        {form.role !== "PUBLIC_USER" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Evidence Documents <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              accept=".pdf,.jpg,.jpeg,.png"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Upload relevant documents (PDF, JPG, PNG)
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 rounded-md text-white font-medium ${
            loading 
              ? "bg-gray-400 cursor-not-allowed" 
              : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          }`}
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => window.location.href = "/login"}
            className="text-blue-600 hover:underline focus:outline-none"
          >
            Login here
          </button>
        </p>
      </form>
    </div>
  );
}