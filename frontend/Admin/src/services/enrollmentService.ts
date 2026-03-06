/**
 * Enrollment Service API client.
 * Connects to the enrollment-service backend (default: http://localhost:8082).
 */

const ENROLLMENT_API_BASE = import.meta.env.VITE_ENROLLMENT_API_URL || "";

// ─── Types (aligned with backend DTOs) ─────────────────────────────────────

export type EnrollmentStatus =
  | "PENDING"
  | "ACTIVE"
  | "COMPLETED"
  | "DROPPED"
  | "SUSPENDED"
  | "CANCELLED";

export interface EnrollmentDTO {
  id: number;
  studentId: number;
  courseId: number;
  classId: string;
  paymentId: number | null;
  status: EnrollmentStatus;
  enrollmentDate: string;
  deadlineDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEnrollmentRequest {
  studentId: number;
  courseId: number;
  classId: string;
  paymentId: number;
  deadlineDate?: string | null;
}

export interface UpdateEnrollmentStatusRequest {
  status: EnrollmentStatus;
}

export interface TransferClassRequest {
  targetClassId: string;
}

export interface ExtendDeadlineRequest {
  newDeadlineDate: string;
}

export interface BulkEnrollmentRequest {
  enrollments: CreateEnrollmentRequest[];
}

export interface WaitlistDTO {
  id: number;
  studentId: number;
  courseId: number;
  classId: string;
  position: number;
  holdPaymentStatus: boolean;
  createdAt: string;
}

export interface CreateWaitlistRequest {
  studentId: number;
  courseId: number;
  classId: string;
  holdPaymentStatus: boolean;
}

// ─── Catalog (Course & Class from enrollment-service proxy) ─────────────────

export interface CourseResponse {
  id: number;
  courseCode?: string;
  title: string;
  description?: string;
  thumbnailImgUrl?: string;
  price?: number;
  passingPercentage?: number;
  certificationEnabled?: boolean;
  status?: string;
  createdBy?: number;
  createdAt?: string;
  updatedAt?: string;
  /** Required for Class Service: classes by course use UUID */
  uuid?: string;
}

export interface ClassResponse {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  status?: string;
  isFree?: boolean;
  scheduleStartAt?: string;
  scheduleEndAt?: string;
  scheduleOpen?: boolean;
  position?: number;
}

export const catalogApi = {
  getCourses: () => request<CourseResponse[]>("/api/catalog/courses"),
  getCourseById: (courseId: number) =>
    request<CourseResponse>(`/api/catalog/courses/${courseId}`),
  getClassesByCourse: (courseId: number) =>
    request<ClassResponse[]>(`/api/catalog/courses/${courseId}/classes`),
};

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

// ─── Helpers ───────────────────────────────────────────────────────────────

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${ENROLLMENT_API_BASE}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  if (res.status === 204) return undefined as T;
  const text = await res.text();
  if (!res.ok) {
    let message = res.statusText;
    try {
      const json = text ? JSON.parse(text) : {};
      message = json.message || json.error || message;
    } catch {
      if (text) message = text;
    }
    throw new Error(message);
  }
  return text ? JSON.parse(text) : undefined;
}

function pageParams(page = 0, size = 50, sort?: string) {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("size", String(size));
  if (sort) params.set("sort", sort);
  return "?" + params.toString();
}

// ─── Enrollment API ───────────────────────────────────────────────────────

export const enrollmentApi = {
  create: (body: CreateEnrollmentRequest) =>
    request<EnrollmentDTO>("/api/enrollments", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  bulk: (body: BulkEnrollmentRequest, page = 0, size = 50) =>
    request<PageResponse<EnrollmentDTO>>(
      "/api/enrollments/bulk" + pageParams(page, size),
      {
        method: "POST",
        body: JSON.stringify(body),
      }
    ),

  getById: (id: number) =>
    request<EnrollmentDTO>(`/api/enrollments/${id}`),

  getByStudent: (studentId: number, page = 0, size = 50) =>
    request<PageResponse<EnrollmentDTO>>(
      `/api/enrollments/student/${studentId}` + pageParams(page, size)
    ),

  getByCourse: (courseId: number, page = 0, size = 50) =>
    request<PageResponse<EnrollmentDTO>>(
      `/api/enrollments/course/${courseId}` + pageParams(page, size)
    ),

  updateStatus: (id: number, body: UpdateEnrollmentStatusRequest) =>
    request<EnrollmentDTO>(`/api/enrollments/${id}/status`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  transfer: (id: number, body: TransferClassRequest) =>
    request<EnrollmentDTO>(`/api/enrollments/${id}/transfer`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  extendDeadline: (id: number, body: ExtendDeadlineRequest) =>
    request<EnrollmentDTO>(`/api/enrollments/${id}/extend-deadline`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  cancel: (id: number) =>
    request<void>(`/api/enrollments/${id}`, { method: "DELETE" }),
};

// ─── Waitlist API ──────────────────────────────────────────────────────────

export const waitlistApi = {
  create: (body: CreateWaitlistRequest) =>
    request<WaitlistDTO>("/api/waitlist", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  getByStudent: (studentId: number) =>
    request<WaitlistDTO[]>(`/api/waitlist/${studentId}`),

  remove: (id: number) =>
    request<void>(`/api/waitlist/${id}`, { method: "DELETE" }),
};

/**
 * Fetches enrollments for multiple courses and returns a single merged list.
 * Use when the backend does not expose a "get all enrollments" endpoint.
 */
export async function fetchAllEnrollmentsForCourses(
  courseIds: number[],
  pageSize = 100
): Promise<EnrollmentDTO[]> {
  const results = await Promise.all(
    courseIds.map((courseId) =>
      enrollmentApi.getByCourse(courseId, 0, pageSize)
    )
  );
  const byId = new Map<number, EnrollmentDTO>();
  for (const page of results) {
    for (const e of page.content) byId.set(e.id, e);
  }
  return Array.from(byId.values());
}
