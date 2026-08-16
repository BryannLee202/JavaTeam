import axios from 'axios';

// Đảm bảo bạn có file .env chứa VITE_BFF_URL=http://localhost:4001
const baseURL = import.meta.env.VITE_BFF_URL || 'http://localhost:4001';

const axiosClient = axios.create({
  baseURL,
  // Bắt buộc để trình duyệt tự động gửi và nhận cookie httpOnly từ BFF
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor Request: Lấy CSRF token từ cookie và nhét vào header
axiosClient.interceptors.request.use((config) => {
  // Hàm đọc giá trị cookie theo tên
  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
    return null;
  };

  // Đối với các method thay đổi dữ liệu, bắt buộc gửi kèm XSRF-TOKEN
  if (config.method && ['post', 'put', 'patch', 'delete'].includes(config.method.toLowerCase())) {
    const csrfToken = getCookie('XSRF-TOKEN');
    if (csrfToken) {
      config.headers['X-XSRF-TOKEN'] = csrfToken;
    }
  }
  return config;
});

// Interceptor Response: Bắt lỗi 401 toàn cục
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Bắn ra một event tùy chỉnh để AuthContext bắt được và log out user
      window.dispatchEvent(new Event('unauthorized_error'));
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
