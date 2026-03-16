const API_BASE = "/api/v1/auth";

export interface AuthUser {
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  token: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export async function loginUser(data: LoginData): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Login failed");
  }
  return res.json();
}

export async function registerUser(data: RegisterData): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || Object.values(err).join(", ") || "Registration failed");
  }
  return res.json();
}

export function saveAuth(user: AuthUser) {
  localStorage.setItem("auth_user", JSON.stringify(user));
}

export function getAuth(): AuthUser | null {
  const stored = localStorage.getItem("auth_user");
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function clearAuth() {
  localStorage.removeItem("auth_user");
}

export function getAuthHeader(): Record<string, string> {
  const user = getAuth();
  if (!user?.token) return {};
  return { Authorization: `Bearer ${user.token}` };
}
