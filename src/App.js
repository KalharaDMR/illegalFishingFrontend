import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminUsers from "./pages/AdminUsers";
import PublicDashboard from "./pages/PublicDashboard";
import ZoologistDashboard from "./pages/ZoologistDashboard";
import AuthorizedDashboard from "./pages/AuthorizedDashboard";
import AuthorizedProfile from "./pages/AuthorizedUserProfile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute role="ADMIN">
              <AdminUsers />
            </ProtectedRoute>
          }
        />

        {/* Public User Routes */}
        <Route
          path="/public"
          element={
            <ProtectedRoute role="PUBLIC_USER">
              <PublicDashboard />
            </ProtectedRoute>
          }
        />
        {/* Add more public routes like /public/report, etc. */}

        {/* Zoologist Routes */}
        <Route
          path="/zoologist"
          element={
            <ProtectedRoute role="ZOOLOGIST">
              <ZoologistDashboard />
            </ProtectedRoute>
          }
        />

        {/* Authorized Person Routes */}
        <Route
          path="/authorized"
          element={
            <ProtectedRoute role="AUTHORIZED_PERSON">
              <AuthorizedDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/authorized/profile"
          element={
            <ProtectedRoute role="AUTHORIZED_PERSON">
              <AuthorizedProfile />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;