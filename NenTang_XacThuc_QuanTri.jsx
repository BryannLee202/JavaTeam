import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Menu, X, Home, Users, Settings, LogOut, LayoutDashboard, 
  ChevronRight, Search, Bell, Shield, Trophy, UsersRound
} from 'lucide-react';


/* =========================================================================
   1. CẤU HÌNH API & AXIOS (Theo chuẩn BFF của Seal Hackathon)
   ========================================================================= */


// Hàm tiện ích đọc cookie để lấy CSRF Token
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

// --- MÔ PHỎNG AXIOS (Thay thế bằng cấu hình thực tế bên dưới khi ghép code) ---
const mockApi = {
  get: async (url) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (url === '/api/auth/me') {
          const userStr = localStorage.getItem('seal_user_mock');
          if (userStr) resolve({ data: JSON.parse(userStr) });
          else reject({ response: { status: 401 } });
        }
      }, 500);
    });
  },
  post: async (url, data) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (url === '/api/auth/login') {
          if (data.email === 'coordinator@seal.com' && data.password === '123456') {
            const user = { id: 'uuid-1', email: data.email, roles: ['COORDINATOR'], full_name: 'Trưởng BTC' };
            localStorage.setItem('seal_user_mock', JSON.stringify(user));
            resolve({ data: user }); // BFF trả về user, JWT lưu ngầm trong cookie httpOnly
          } else if (data.email === 'judge@seal.com' && data.password === '123456') {
            const user = { id: 'uuid-2', email: data.email, roles: ['JUDGE'], full_name: 'Giám khảo A' };
            localStorage.setItem('seal_user_mock', JSON.stringify(user));
            resolve({ data: user });
          } else {
            reject({ response: { data: { message: 'Sai email hoặc mật khẩu' } } });
          }
        }
      }, 800);
    });
  },
  postLogout: async () => {
    localStorage.removeItem('seal_user_mock');
    return Promise.resolve();
  }
};

/* 
// CẤU HÌNH AXIOS THỰC TẾ (Copy vào dự án thật)
const api = axios.create({
  baseURL: import.meta.env.VITE_BFF_URL || '/api',
  withCredentials: true, // Bắt buộc để gửi cookie httpOnly (JWT)
});

// Thêm CSRF Token vào các request thay đổi dữ liệu
api.interceptors.request.use((config) => {
  if (['post', 'put', 'patch', 'delete'].includes(config.method)) {
    const csrfToken = getCookie('XSRF-TOKEN');
    if (csrfToken) {
      config.headers['X-XSRF-TOKEN'] = csrfToken;
    }
  }
  return config;
});
*/

/* =========================================================================
   2. AUTH CONTEXT (Quản lý trạng thái đăng nhập)
   ========================================================================= */
const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Chạy khi load ứng dụng để kiểm tra phiên đăng nhập từ BFF
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // api.get('/api/auth/me')
        const response = await mockApi.get('/api/auth/me');
        setUser(response.data);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    // api.post('/api/auth/login', { email, password })
    const response = await mockApi.post('/api/auth/login', { email, password });
    setUser(response.data);
    return response.data;
  };

  const logout = async () => {
    try {
      // await api.post('/api/auth/logout');
      await mockApi.postLogout();
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, setUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

/* =========================================================================
   3. BẢO VỆ ROUTE (Xử lý role Coordinator, Judge, v.v.)
   ========================================================================= */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Kiểm tra user có ít nhất 1 role khớp với allowedRoles không
  const hasRequiredRole = allowedRoles ? allowedRoles.some(role => user.roles.includes(role)) : true;

  if (!hasRequiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

/* =========================================================================
   4. CÁC TRANG & GIAO DIỆN
   ========================================================================= */

// --- Trang Đăng Nhập ---
const LoginPage = () => {
  const [email, setEmail] = useState('coordinator@seal.com');
  const [password, setPassword] = useState('123456');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const userData = await login(email, password);
      if (userData.roles.includes('COORDINATOR')) {
        navigate(from === '/' ? '/coordinator' : from, { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại. Kiểm tra lại kết nối.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-slate-100">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-blue-600 rounded-xl flex items-center justify-center">
            <Trophy className="text-white h-8 w-8" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-slate-900">
            SEAL Hackathon
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Đăng nhập hệ thống quản trị <br/> 
            (Test: <span className="font-semibold text-blue-600">coordinator@seal.com / 123456</span>)
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-200">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Email</label>
              <input
                type="email" required
                className="mt-1 block w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
                value={email} onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Mật khẩu</label>
              <input
                type="password" required
                className="mt-1 block w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
                value={password} onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <button
            type="submit" disabled={isLoading}
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors`}
          >
            {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
          </button>
        </form>
      </div>
    </div>
  );
};

// --- Layout dành cho Coordinator (Quản trị viên) ---
const CoordinatorLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 bg-slate-900 w-64 text-slate-300 transition-transform duration-300 ease-in-out z-20 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0`}>
        <div className="flex items-center justify-between p-4 h-16 border-b border-slate-800">
          <div className="flex items-center gap-2 text-white">
            <Trophy className="text-blue-500" size={24} />
            <span className="text-lg font-bold tracking-wide">SEAL ADMIN</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        </div>
        
        <nav className="p-4 space-y-1">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 mt-4">Quản lý cuộc thi</div>
          <Link to="/coordinator" className="flex items-center gap-3 p-3 rounded-lg bg-blue-600/10 text-blue-500 font-medium transition-colors">
            <LayoutDashboard size={20} /> Tổng quan (Events)
          </Link>
          <Link to="/coordinator/teams" className="flex items-center gap-3 p-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
            <UsersRound size={20} /> Quản lý Đội thi (Teams)
          </Link>
          
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 mt-6">Hệ thống</div>
          <Link to="/coordinator/users" className="flex items-center gap-3 p-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
            <Users size={20} /> Người dùng & Phân quyền
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-10 border-b border-slate-200">
          <div className="flex items-center">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden text-slate-500 hover:text-slate-700 mr-4">
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-semibold text-slate-800 hidden sm:block">Coordinator Dashboard</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 border-l pl-4 border-slate-200">
              <div className="flex flex-col items-end hidden sm:flex">
                <span className="text-sm font-semibold text-slate-700">{user?.full_name}</span>
                <span className="text-xs text-blue-600 font-medium">{user?.roles.join(', ')}</span>
              </div>
              <div className="h-9 w-9 rounded-full bg-blue-100 text-blue-700 border border-blue-200 flex items-center justify-center font-bold">
                {user?.full_name?.charAt(0)}
              </div>
              <button onClick={handleLogout} className="text-slate-400 hover:text-red-500 transition-colors ml-2 p-2 rounded-lg hover:bg-red-50" title="Đăng xuất">
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </header>

        {/* Cửa sổ con cho các route Coordinator */}
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
           <CoordinatorDashboardContent />
        </main>
      </div>
      
      {/* Overlay cho mobile sidebar */}
      {sidebarOpen && <div className="fixed inset-0 bg-slate-900/50 z-10 md:hidden backdrop-blur-sm" onClick={() => setSidebarOpen(false)}></div>}
    </div>
  );
};

// --- Nội dung trang Tổng quan Quản trị ---
const CoordinatorDashboardContent = () => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Quản lý Sự kiện (Events)</h2>
          <p className="text-sm text-slate-500 mt-1">Quản lý cấu trúc cuộc thi, Tracks, Rounds và Tiêu chí.</p>
        </div>
        <button className="bg-blue-600 px-4 py-2 rounded-lg text-sm font-medium text-white hover:bg-blue-700 shadow-sm transition-all active:scale-95">
          + Tạo sự kiện mới
        </button>
      </div>

      {/* Thống kê nhanh */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { title: 'Sự kiện đang chạy', value: '1', desc: 'SEAL Hackathon 2026', color: 'border-blue-500' },
          { title: 'Tổng số Đội', value: '42', desc: 'Trên 3 hạng mục', color: 'border-indigo-500' },
          { title: 'Bài nộp (Round 1)', value: '38', desc: 'Đã đóng cổng', color: 'border-emerald-500' },
          { title: 'Giám khảo', value: '12', desc: 'Đã phân công', color: 'border-amber-500' },
        ].map((stat, idx) => (
          <div key={idx} className={`bg-white overflow-hidden shadow-sm rounded-xl border border-slate-200 border-l-4 ${stat.color}`}>
            <div className="p-5">
              <dt className="text-sm font-medium text-slate-500 truncate">{stat.title}</dt>
              <dd className="mt-2 text-3xl font-bold text-slate-900">{stat.value}</dd>
              <dd className="mt-1 text-sm text-slate-500">{stat.desc}</dd>
            </div>
          </div>
        ))}
      </div>

      {/* Danh sách Event mô phỏng */}
      <div className="bg-white shadow-sm rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <h3 className="text-lg font-semibold text-slate-800">Danh sách Sự kiện (Hackathon Event)</h3>
        </div>
        <div className="divide-y divide-slate-200">
          <div className="p-6 hover:bg-slate-50 transition-colors">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-lg font-bold text-blue-600 flex items-center gap-2">
                  SEAL Global Hackathon 2026 
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">Active</span>
                </h4>
                <p className="text-sm text-slate-500 mt-1">Sự kiện chính - Bắt đầu: 01/08/2026</p>
                
                <div className="flex gap-4 mt-4">
                  <div className="flex items-center gap-1.5 text-sm font-medium text-slate-600 bg-slate-100 px-3 py-1.5 rounded-md">
                    <span className="text-indigo-600 font-bold">3</span> Tracks
                  </div>
                  <div className="flex items-center gap-1.5 text-sm font-medium text-slate-600 bg-slate-100 px-3 py-1.5 rounded-md">
                    <span className="text-indigo-600 font-bold">2</span> Rounds
                  </div>
                  <div className="flex items-center gap-1.5 text-sm font-medium text-slate-600 bg-slate-100 px-3 py-1.5 rounded-md">
                    Hiệu chuẩn RBL: <span className="text-emerald-600 font-bold">Bật</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                 <button className="text-sm px-4 py-2 border border-slate-300 rounded-lg font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                   Cấu hình Vòng thi
                 </button>
                 <button className="text-sm px-4 py-2 bg-slate-900 rounded-lg font-medium text-white hover:bg-slate-800 transition-colors">
                   Phân công Giám khảo
                 </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Trang chủ công khai (Landing Page) ---
const LandingPage = () => {
  const { user, logout } = useAuth();
  
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
             <Trophy className="text-blue-600 h-8 w-8" />
             <span className="text-2xl font-black text-slate-900 tracking-tight">SEAL</span>
          </div>
          <div>
            {user ? (
              <div className="flex items-center gap-6">
                <span className="text-slate-600 font-medium hidden sm:block">Xin chào, {user.full_name}</span>
                {user.roles.includes('COORDINATOR') && (
                  <Link to="/coordinator" className="text-blue-600 hover:text-blue-800 font-bold bg-blue-50 px-4 py-2 rounded-lg transition-colors">Vào Admin</Link>
                )}
                <button onClick={logout} className="text-slate-500 hover:text-slate-900 font-medium transition-colors">
                  Đăng xuất
                </button>
              </div>
            ) : (
              <Link to="/login" className="bg-slate-900 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-slate-800 transition shadow-md">
                Đăng nhập hệ thống
              </Link>
            )}
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center justify-center text-center">
        <h2 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight">
          Nền tảng Quản lý <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Hackathon Chuyên nghiệp</span>
        </h2>
        <p className="mt-6 text-xl text-slate-500 max-w-3xl">
          Quản lý đăng ký đội, nộp bài, phân công giám khảo, chấm điểm theo tiêu chí, xếp hạng và công bố kết quả. Mọi thứ được xử lý tự động và bảo mật.
        </p>
        {!user && (
           <div className="mt-10">
             <Link to="/login" className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
                Bắt đầu ngay
             </Link>
           </div>
        )}
      </main>
    </div>
  );
};

// --- Trang Không Có Quyền ---
const UnauthorizedPage = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
    <Shield className="text-red-500 h-24 w-24 mb-6" />
    <h1 className="text-5xl font-black text-slate-900 mb-4">403</h1>
    <h2 className="text-2xl font-bold text-slate-700 mb-2">Quyền truy cập bị từ chối</h2>
    <p className="text-slate-500 mb-8 max-w-md text-center">Tài khoản của bạn không có vai trò phù hợp (VD: Coordinator) để xem khu vực này. Token của bạn hợp lệ nhưng phạm vi truy cập bị giới hạn.</p>
    <Link to="/" className="text-blue-600 font-semibold hover:underline bg-blue-50 px-6 py-3 rounded-lg">Quay về trang chủ</Link>
  </div>
);

/* =========================================================================
   5. BỘ ĐỊNH TUYẾN CHÍNH (ROUTER)
   ========================================================================= */
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* Protected Route cho Nhóm Quản trị (Coordinator) */}
          <Route 
            path="/coordinator/*" 
            element={
              <ProtectedRoute allowedRoles={['COORDINATOR']}>
                <CoordinatorLayout />
              </ProtectedRoute>
            } 
          />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}