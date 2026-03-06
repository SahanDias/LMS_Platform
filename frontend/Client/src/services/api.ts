// ── Course Types ─────────────────────────────────────

export interface Course {
  id: number;
  courseCode: string;
  title: string;
  description: string;
  thumbnailImgUrl: string | null;
  price: number;
  passingPercentage: number;
  certificationEnabled: boolean;
  isFree: boolean;
  status: "ACTIVE" | "INACTIVE";
  createdBy: number | null;
  createdAt: string;
  updatedAt: string;
}

// ── Class Types ──────────────────────────────────────

export type ClassStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export interface ClassEntity {
  id: string;
  courseId: number;
  title: string;
  description: string | null;
  status: ClassStatus;
  isFree: boolean | null;
  scheduleStartAt: string | null;
  scheduleEndAt: string | null;
  scheduleOpen: boolean | null;
  position: number | null;
  created_at: string;
  updated_at: string;
}

export interface ScheduleDTO {
  scheduleStartAt: string | null;
  scheduleEndAt: string | null;
  scheduleOpen: boolean | null;
}

// ── Course API ───────────────────────────────────────

const COURSE_API = "/api/v1/course";

function mapCourse(raw: any): Course {
  return { ...raw, isFree: raw.free ?? raw.isFree ?? false };
}

export const coursesApi = {
  getAll: async (): Promise<Course[]> => {
    const res = await fetch(COURSE_API);
    if (!res.ok) throw new Error("Failed to fetch courses");
    const data: any[] = await res.json();
    return data.map(mapCourse);
  },
  getById: async (id: number): Promise<Course> => {
    const res = await fetch(`${COURSE_API}/getCourse/${id}`);
    if (!res.ok) throw new Error("Course not found");
    const raw = await res.json();
    return mapCourse(raw);
  },
};

// ── Class Schedule API ───────────────────────────────

const CLASS_API = "/class-api/v1";

async function apiFetch<T>(url: string): Promise<T> {
  const res = await fetch(`${CLASS_API}${url}`);
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message || body?.error || `Request failed (${res.status})`);
  }
  return res.json();
}

export const classScheduleApi = {
  getAll: (courseId: string): Promise<ClassEntity[]> =>
    apiFetch(`/courses/${courseId}/classes`),

  getOrdered: (courseId: string): Promise<ClassEntity[]> =>
    apiFetch(`/courses/${courseId}/classes/ordered`),

  getSchedule: (classId: string): Promise<ScheduleDTO> =>
    apiFetch(`/classes/${classId}/schedule`),
};
