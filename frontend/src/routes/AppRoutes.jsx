import { Routes, Route } from "react-router-dom";
import { SignIn, SignUp } from "@clerk/react";

import Home from "../pages/Home";
import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";

import Dashboard from "../pages/dashboard/Dashboard";
import UploadResume from "../pages/dashboard/UploadResume";
import ResumeAnalysis from "../pages/analysis/ResumeAnalysis";
import MyResumes from "../pages/resumes/MyResumes";
import JobMatches from "../pages/jobs/JobMatches";
import JobRecommendations from "../pages/recommendations/JobRecommendations";
import JobDetails from "../pages/jobs/JobDetails";

import ProtectedRoute from "./ProtectedRoute";

function AppRoutes() {
  return (
    <Routes>
      {/* Home */}
      <Route
        path="/"
        element={<Home />}
      />

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

      {/* Upload Resume */}
      <Route
        path="/dashboard/upload"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <UploadResume />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* My Resumes */}
      <Route
        path="/resumes"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <MyResumes />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Resume Analysis */}
      <Route
        path="/analysis/:resumeId"
        element={<ResumeAnalysis />}
      />

      {/* Job Matches */}
      <Route
        path="/jobs"
        element={
          <ProtectedRoute>
            <JobMatches />
          </ProtectedRoute>
        }
      />

      <Route
        path="/jobs/:jobId"
        element={
          <ProtectedRoute>
            <JobDetails />
          </ProtectedRoute>
        }
      />

      {/* Job Recommendations */}
      <Route
        path="/recommendations"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <JobRecommendations />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default AppRoutes;