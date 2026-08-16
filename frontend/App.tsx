import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import CoordinatorLayout from './layouts/CoordinatorLayout';

// Mock các trang để import
const LoginPage = () => <div>Trang Đăng Nhập (Cần dựng form)</div>;
const LandingPage = () => <div>Trang Chủ Công Khai</div>;
const UnauthorizedPage = () => <div>Bạn không có quyền truy cập trang này</div>;
const EventDashboard = () => <div>Quản lý Hackathon Events</div>;
const UserManagement = () => <div>Quản lý và Duyệt Người Dùng</div>;

function App() {
  return (
    <Routes>
      {/* VÙNG CÔNG KHAI */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* VÙNG ĐẶC QUYỀN: Chỉ dành cho Coordinator */}
      <Route element={<ProtectedRoute allowedRoles={['COORDINATOR']} />}>
        <Route element={<CoordinatorLayout />}>
          <Route path="/admin/events" element={<EventDashboard />} />
          <Route path="/admin/users" element={<UserManagement />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
