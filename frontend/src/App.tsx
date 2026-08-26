import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { JudgePage } from "./pages/judge/JudgePage";
import { NotFoundPage } from "./pages/NotFound";
import { ToastContainer } from "./components/Toast";

function RootRedirect() {
  const { user, loading } = useAuth();
  if (loading) {
    return <div className="empty-state">Đang tải...</div>;
  }
  return <Navigate to={user ? "/app" : "/login"} replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/judge"
        element={
          <ProtectedRoute requireRole="JUDGE">
            <JudgePage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastContainer />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
