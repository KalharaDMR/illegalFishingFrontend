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
import MyReports from "./pages/MyReports"; //  ADDED
import ProtectedRoute from "./components/ProtectedRoute";
import SubmitInvestigation from "./pages/authorized/SubmitInvestigation";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default route */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Auth pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Admin Routes */}

        {/* PUBLIC USER DASHBOARD */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute role="PUBLIC_USER">
              <PublicDashboard />
            </ProtectedRoute>
          }
        />

        {/* Report Form */}
        <Route
          path="/report"
          element={
            <ProtectedRoute role="PUBLIC_USER">
              <IllegalReport />
            </ProtectedRoute>
          }
        />

        {/*  MY REPORTS PAGE */}
        <Route
          path="/my-reports"
          element={
            <ProtectedRoute role="PUBLIC_USER">
              <MyReports />
            </ProtectedRoute>
          }
        />

        {/* ADMIN DASHBOARD */}
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

        <Route
          path="/authorized/submit-investigation/:investigationId"
          element={
            <ProtectedRoute role="AUTHORIZED_PERSON">
              <SubmitInvestigation />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
