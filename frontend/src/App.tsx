import { BrowserRouter, Navigate, Route, Routes, useParams } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { JudgePage } from "./pages/judge/JudgePage";
import { NotFoundPage } from "./pages/NotFound";
import EventsPage from "@/pages/EventsPage";
import EventDetailPage from "@/pages/EventDetailPage";
import { DEFAULT_TAB } from "@/pages/tabConfig";
import { ToastContainer } from "./components/Toast";
import "@/styles/global.css";
import { RegisterPage } from "./pages/RegisterPage";
import UsersApprovalPage from "./pages/coordinator/UsersApprovalPage";

// /coordinator/events/:eventId (khong co doan tab) -> nhay ve tab mac dinh.
// Tach thanh component rieng de khong lam roi doan :eventId khi resolve duong dan.
function DefaultTabRedirect() {
  const { eventId } = useParams<{ eventId: string }>();
  return <Navigate to={`/coordinator/events/${eventId}/${DEFAULT_TAB}`} replace />;
}

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

      {/* Cau truc cuoc thi (JAV-12) - chi Coordinator vao duoc */}
      <Route
        path="/coordinator/events"
        element={
          <ProtectedRoute requireRole="COORDINATOR">
            <EventsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/coordinator/events/:eventId"
        element={
          <ProtectedRoute requireRole="COORDINATOR">
            <DefaultTabRedirect />
          </ProtectedRoute>
        }
      />
      <Route
        path="/coordinator/events/:eventId/:tab"
        element={
          <ProtectedRoute requireRole="COORDINATOR">
            <EventDetailPage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFoundPage />} />
	  <Route path="/register" element={<RegisterPage />} />
	  <Route path="/coordinator/users" element={<UsersApprovalPage />} />
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
