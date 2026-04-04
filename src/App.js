import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Signup from "./pages/Signup";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import PublicDashboard from "./pages/PublicDashboard";
import ZoologistDashboard from "./pages/ZoologistDashboard";
import AuthorizedDashboard from "./pages/AuthorizedDashboard";
import AuthorizedProfile from "./pages/AuthorizedUserProfile";
import IllegalReport from "./pages/IllegalReport";
import MyReports from "./pages/MyReports";
import Notifications from "./pages/Notifications";
import PublicUserProfile from "./pages/PublicUserProfile";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default route */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Auth pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* PUBLIC USER DASHBOARD */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute role="PUBLIC_USER">
              <PublicDashboard />
            </ProtectedRoute>
          }
        />

        {/* Alias */}
        <Route
          path="/public"
          element={
            <ProtectedRoute role="PUBLIC_USER">
              <PublicDashboard />
            </ProtectedRoute>
          }
        />

        {/* Report */}
        <Route
          path="/report"
          element={
            <ProtectedRoute role="PUBLIC_USER">
              <IllegalReport />
            </ProtectedRoute>
          }
        />

        {/* Alias for old path */}
        <Route
          path="/public/report"
          element={
            <ProtectedRoute role="PUBLIC_USER">
              <IllegalReport />
            </ProtectedRoute>
          }
        />

        {/* My Reports */}
        <Route
          path="/my-reports"
          element={
            <ProtectedRoute role="PUBLIC_USER">
              <MyReports />
            </ProtectedRoute>
          }
        />

        {/* Alias */}
        <Route
          path="/public/my-reports"
          element={
            <ProtectedRoute role="PUBLIC_USER">
              <MyReports />
            </ProtectedRoute>
          }
        />

        {/* Notifications */}
        <Route
          path="/notifications"
          element={
            <ProtectedRoute role="PUBLIC_USER">
              <Notifications />
            </ProtectedRoute>
          }
        />

        {/* Public User Profile */}
        <Route
          path="/public/profile"
          element={
            <ProtectedRoute role="PUBLIC_USER">
              <PublicUserProfile />
            </ProtectedRoute>
          }
        />

        {/* ADMIN */}
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

        {/* ZOOLOGIST */}
        <Route
          path="/zoologist"
          element={
            <ProtectedRoute role="ZOOLOGIST">
              <ZoologistDashboard />
            </ProtectedRoute>
          }
        />

        {/* AUTHORIZED */}
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