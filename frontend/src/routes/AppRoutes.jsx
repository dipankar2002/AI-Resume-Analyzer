import { Routes, Route } from "react-router-dom";
import { SignIn, SignUp } from "@clerk/react";

import Home from "../pages/Home";
import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import Dashboard from "../pages/dashboard/Dashboard";
import ProtectedRoute from "./ProtectedRoute";

function AppRoutes() {
  return (
    <Routes>
      {/* Home */}
      <Route path="/" element={<Home />} />

      {/* Login */}
      <Route
        path="/login"
        element={
          <AuthLayout>
            <SignIn
              fallbackRedirectUrl="/dashboard"
              signUpUrl="/register"
              signUpForceRedirectUrl="/dashboard"
            />
          </AuthLayout>
        }
      />

      {/* Register */}
      <Route
        path="/register"
        element={
          <AuthLayout>
            <SignUp
              fallbackRedirectUrl="/dashboard"
              signInUrl="/login"
              signInForceRedirectUrl="/dashboard"
            />
          </AuthLayout>
        }
      />

      {/* Dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default AppRoutes;