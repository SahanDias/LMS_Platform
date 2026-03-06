export interface Course {
  id: number;
  courseCode: string;
  title: string;
  description: string;
  thumbnailImgUrl: string;
  price: number;
  passingPercentage: number;
  certificationEnabled: boolean;
  isFree: boolean;
  status: "ACTIVE" | "INACTIVE";
  createdBy: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface Certification {
  id: string;
  title: string;
  courseId: string;
  courseName: string;
  issuedTo: string;
  issuedAt: string;
  expiresAt: string | null;
  status: "active" | "expired" | "revoked";
}

export interface Quiz {
  id: string;
  title: string;
  courseId: string;
  courseName: string;
  questionsCount: number;
  duration: number;
  passingScore: number;
  status: "active" | "inactive";
  attemptsCount: number;
}

export interface Payment {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  courseId: string;
  courseName: string;
  amount: number;
  currency: string;
  status: "succeeded" | "pending" | "failed" | "refunded";
  stripePaymentId: string;
  method: string;
  createdAt: string;
}

// ── Class Schedule Service ────────────────────────────

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

export interface ClassesDTO {
  courseId: number;
  title: string;
  description?: string;
  status?: ClassStatus;
  isFree?: boolean;
  position?: number;
}

export interface ScheduleDTO {
  scheduleStartAt: string | null;
  scheduleEndAt: string | null;
  scheduleOpen: boolean | null;
}

export interface ReorderItemDTO {
  classId: string;
  position: number;
}
