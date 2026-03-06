// ── Types ────────────────────────────────────────────

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

// ── API ──────────────────────────────────────────────

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
  getOrdered: (courseId: string): Promise<ClassEntity[]> =>
    apiFetch(`/courses/${courseId}/classes/ordered`),

  getSchedule: (classId: string): Promise<ScheduleDTO> =>
    apiFetch(`/classes/${classId}/schedule`),
};
