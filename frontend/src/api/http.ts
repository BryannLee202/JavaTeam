// Lớp gọi BFF bằng fetch, dùng riêng cho eventsApi (bốn tab khu điều phối).
//
// Phần còn lại của ứng dụng đi qua src/api/client.ts (axios). Hai lớp này phải
// gửi kèm cùng một thứ thì backend mới nhận: cookie phiên và token CSRF.

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";

/** Các phương thức làm thay đổi dữ liệu — BFF bắt buộc có token CSRF. */
const MUTATING_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

/** Đọc một cookie theo tên. Trả về null nếu không có. */
function readCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const method = (init?.method ?? "GET").toUpperCase();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((init?.headers as Record<string, string>) ?? {}),
  };

  if (MUTATING_METHODS.has(method)) {
    const csrfToken = readCookie("XSRF-TOKEN");
    if (csrfToken) headers["X-XSRF-TOKEN"] = csrfToken;
  }

  // BFF giữ access token trong cookie httpOnly. Frontend chạy ở cổng 3001 còn
  // BFF ở cổng 4000, nên đây là request khác origin: mặc định của fetch là
  // "same-origin" và sẽ KHÔNG gửi cookie đi — mọi lời gọi trả về 401.
  // Phải đặt "include" cho giống withCredentials: true của axios bên client.ts.
  const res = await fetch(`${BASE_URL}${path}`, {
    credentials: "include",
    ...init,
    headers,
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new ApiError(res.status, body || res.statusText);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export const http = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "POST", body: body ? JSON.stringify(body) : undefined }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "PATCH", body: body ? JSON.stringify(body) : undefined }),
  put: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "PUT", body: body ? JSON.stringify(body) : undefined }),
  del: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};
