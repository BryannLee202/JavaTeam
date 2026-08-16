import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Đang tải cấu hình hệ thống...</div>;
  }

  // Chưa đăng nhập -> đuổi về trang login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Đã đăng nhập nhưng không có role phù hợp -> chặn lại
  if (allowedRoles && !allowedRoles.some(role => user.roles.includes(role))) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Hợp lệ -> cho phép render các component con bên trong
  return <Outlet />;
}
