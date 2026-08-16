import React, { createContext, useState, useEffect, useContext } from 'react';
import axiosClient from '../api/axiosClient';

interface User {
  id: string;
  email: string;
  roles: string[]; // VD: ['COORDINATOR', 'JUDGE']
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (credentials: any) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Khôi phục phiên đăng nhập khi ứng dụng khởi chạy
  const checkAuth = async () => {
    try {
      const response = await axiosClient.get('/api/auth/me');
      setUser(response.data);
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();

    // Lắng nghe sự kiện 401 từ axiosClient để tự động đăng xuất
    const handleUnauthorized = () => {
      setUser(null);
    };
    window.addEventListener('unauthorized_error', handleUnauthorized);
    
    return () => {
      window.removeEventListener('unauthorized_error', handleUnauthorized);
    };
  }, []);

  const login = async (credentials: any) => {
    // Gọi thẳng /api/auth/login, token sẽ tự chui vào cookie
    await axiosClient.post('/api/auth/login', credentials);
    await checkAuth(); // Lấy lại thông tin user sau khi login thành công
  };

  const logout = async () => {
    try {
      await axiosClient.post('/api/auth/logout');
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
