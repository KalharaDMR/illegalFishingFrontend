import { useState } from "react";
import axios from "axios";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "PUBLIC_USER",
  });
  const [files, setFiles] = useState([]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.keys(form).forEach((key) => data.append(key, form[key]));

    if (form.role !== "PUBLIC_USER") {
      for (let file of files) {
        data.append("evidence", file);
      }
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/signup",
        data
      );
      alert(res.data.message);
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow w-96"
      >
        <h2 className="text-xl font-bold mb-4">Sign Up</h2>

        <input
          name="name"
          placeholder="Name"
          onChange={handleChange}
          className="input"
        />
        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="input"
        />
        <input
          name="phone"
          placeholder="Phone"
          onChange={handleChange}
          className="input"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="input"
        />

        <select name="role" onChange={handleChange} className="input">
          <option value="PUBLIC_USER">Public User</option>
          <option value="ZOOLOGIST">Zoologist</option>
          <option value="AUTHORIZED_PERSON">Authorized Person</option>
        </select>

        {form.role !== "PUBLIC_USER" && (
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="mt-3"
          />
        )}

        <button className="bg-blue-600 text-white w-full py-2 mt-4 rounded">
          Register
        </button>
      </form>
    </div>
  );
}
