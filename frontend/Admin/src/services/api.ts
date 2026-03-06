import { Course, Certification, Quiz, Payment, ClassEntity, ClassesDTO, ScheduleDTO, ReorderItemDTO, ClassStatus } from "@/types";

const API_BASE = "/api/v1/course";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

// --- COURSES 
export const coursesApi = {
  getAll: async (): Promise<Course[]> => {
    const res = await fetch(API_BASE);
    if (!res.ok) throw new Error("Failed to fetch courses");
    return res.json();
  },
  getById: async (id: number): Promise<Course> => {
    const res = await fetch(`${API_BASE}/getCourse/${id}`);
    if (!res.ok) throw new Error("Course not found");
    return res.json();
  },
  create: async (data: Omit<Course, "id" | "createdBy" | "createdAt" | "updatedAt">): Promise<Course> => {
    const res = await fetch(`${API_BASE}/createCourse`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create course");
    return res.json();
  },
  update: async (id: number, data: Partial<Course>): Promise<Course> => {
    const res = await fetch(`${API_BASE}/updateCourse/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update course");
    return res.json();
  },
  delete: async (id: number): Promise<void> => {
    const res = await fetch(`${API_BASE}/deleteCourse/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete course");
  },
};

// --- CERTIFICATIONS ---
let certifications: Certification[] = [
  { id: "cert1", title: "React Developer Certified", courseId: "c1", courseName: "React Masterclass", issuedTo: "John Doe", issuedAt: "2026-01-15", expiresAt: "2027-01-15", status: "active" },
  { id: "cert2", title: "Python Data Analyst", courseId: "c2", courseName: "Python for Data Science", issuedTo: "Jane Smith", issuedAt: "2025-12-01", expiresAt: "2026-12-01", status: "active" },
  { id: "cert3", title: "Cloud Engineer", courseId: "c4", courseName: "DevOps & Cloud Infrastructure", issuedTo: "Mike Johnson", issuedAt: "2025-08-20", expiresAt: "2026-08-20", status: "expired" },
  { id: "cert4", title: "Node.js Backend Expert", courseId: "c5", courseName: "Node.js Backend Development", issuedTo: "Emily Davis", issuedAt: "2025-09-10", expiresAt: null, status: "revoked" },
];

export const certificationsApi = {
  getAll: async (): Promise<Certification[]> => { await delay(300); return [...certifications]; },
  create: async (data: Omit<Certification, "id">): Promise<Certification> => {
    await delay(400);
    const c: Certification = { ...data, id: `cert${Date.now()}` };
    certifications.push(c);
    return c;
  },
  update: async (id: string, data: Partial<Certification>): Promise<Certification> => {
    await delay(400);
    certifications = certifications.map((c) => (c.id === id ? { ...c, ...data } : c));
    return certifications.find((c) => c.id === id)!;
  },
  delete: async (id: string): Promise<void> => { await delay(300); certifications = certifications.filter((c) => c.id !== id); },
};

// --- QUIZZES ---
let quizzes: Quiz[] = [
  { id: "q1", title: "React Hooks Assessment", courseId: "c1", courseName: "React Masterclass", questionsCount: 20, duration: 30, passingScore: 70, status: "active", attemptsCount: 285 },
  { id: "q2", title: "Python Basics Quiz", courseId: "c2", courseName: "Python for Data Science", questionsCount: 15, duration: 20, passingScore: 60, status: "active", attemptsCount: 410 },
  { id: "q3", title: "Design Principles Test", courseId: "c3", courseName: "UI/UX Design Fundamentals", questionsCount: 25, duration: 45, passingScore: 75, status: "inactive", attemptsCount: 0 },
  { id: "q4", title: "Docker & Kubernetes Exam", courseId: "c4", courseName: "DevOps & Cloud Infrastructure", questionsCount: 30, duration: 60, passingScore: 80, status: "active", attemptsCount: 132 },
];

export const quizzesApi = {
  getAll: async (): Promise<Quiz[]> => { await delay(300); return [...quizzes]; },
  create: async (data: Omit<Quiz, "id" | "attemptsCount">): Promise<Quiz> => {
    await delay(400);
    const q: Quiz = { ...data, id: `q${Date.now()}`, attemptsCount: 0 };
    quizzes.push(q);
    return q;
  },
  update: async (id: string, data: Partial<Quiz>): Promise<Quiz> => {
    await delay(400);
    quizzes = quizzes.map((q) => (q.id === id ? { ...q, ...data } : q));
    return quizzes.find((q) => q.id === id)!;
  },
  delete: async (id: string): Promise<void> => { await delay(300); quizzes = quizzes.filter((q) => q.id !== id); },
};

// --- PAYMENTS ---
const payments: Payment[] = [
  { id: "p1", userId: "u1", userName: "John Doe", userEmail: "john@example.com", courseId: "c1", courseName: "React Masterclass", amount: 79.99, currency: "USD", status: "succeeded", stripePaymentId: "pi_3abc123", method: "Visa •••• 4242", createdAt: "2026-02-08T14:30:00Z" },
  { id: "p2", userId: "u2", userName: "Jane Smith", userEmail: "jane@example.com", courseId: "c2", courseName: "Python for Data Science", amount: 89.99, currency: "USD", status: "succeeded", stripePaymentId: "pi_3def456", method: "Mastercard •••• 5555", createdAt: "2026-02-07T09:15:00Z" },
  { id: "p3", userId: "u3", userName: "Mike Johnson", userEmail: "mike@example.com", courseId: "c4", courseName: "DevOps & Cloud Infrastructure", amount: 99.99, currency: "USD", status: "pending", stripePaymentId: "pi_3ghi789", method: "Visa •••• 1234", createdAt: "2026-02-09T16:45:00Z" },
  { id: "p4", userId: "u4", userName: "Emily Davis", userEmail: "emily@example.com", courseId: "c1", courseName: "React Masterclass", amount: 79.99, currency: "USD", status: "failed", stripePaymentId: "pi_3jkl012", method: "Amex •••• 3782", createdAt: "2026-02-06T11:20:00Z" },
  { id: "p5", userId: "u5", userName: "Chris Lee", userEmail: "chris@example.com", courseId: "c5", courseName: "Node.js Backend Development", amount: 69.99, currency: "USD", status: "refunded", stripePaymentId: "pi_3mno345", method: "Visa •••• 9876", createdAt: "2026-02-05T08:00:00Z" },
];

export const paymentsApi = {
  getAll: async (): Promise<Payment[]> => { await delay(300); return [...payments]; },
  getById: async (id: string): Promise<Payment | undefined> => { await delay(200); return payments.find((p) => p.id === id); },
  refund: async (id: string): Promise<Payment> => {
    await delay(500);
    const idx = payments.findIndex((p) => p.id === id);
    if (idx >= 0) payments[idx] = { ...payments[idx], status: "refunded" };
    return payments[idx];
  },
};

// --- DASHBOARD STATS ---
export const dashboardApi = {
  getStats: async () => {
    await delay(300);
    const allCourses = await coursesApi.getAll();
    return {
      totalCourses: allCourses.length,
      totalStudents: 1468,
      totalRevenue: 48750.00,
      activeQuizzes: quizzes.filter((q) => q.status === "active").length,
      recentPayments: payments.slice(0, 5),
      coursesByCategory: [
        { name: "Frontend", count: 1 },
        { name: "Backend", count: 1 },
        { name: "Data Science", count: 1 },
        { name: "Design", count: 1 },
        { name: "DevOps", count: 1 },
      ],
      monthlyRevenue: [
        { month: "Sep", revenue: 5200 },
        { month: "Oct", revenue: 7800 },
        { month: "Nov", revenue: 6400 },
        { month: "Dec", revenue: 9100 },
        { month: "Jan", revenue: 8500 },
        { month: "Feb", revenue: 11750 },
      ],
    };
  },
};

// --- CLASS SCHEDULE SERVICE ---
const CLASS_API = "/class-api/v1";

async function classApiFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${CLASS_API}${url}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message || body?.error || `Request failed (${res.status})`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export const classScheduleApi = {
  create: (dto: ClassesDTO): Promise<ClassEntity> =>
    classApiFetch("/classes/create-class", { method: "POST", body: JSON.stringify(dto) }),

  update: (classId: string, dto: Partial<ClassesDTO>): Promise<ClassEntity> =>
    classApiFetch(`/classes/${classId}`, { method: "PUT", body: JSON.stringify(dto) }),

  delete: (classId: string): Promise<void> =>
    classApiFetch(`/classes/${classId}`, { method: "DELETE" }),

  getByCourse: (courseId: string, status?: ClassStatus): Promise<ClassEntity[]> => {
    const qs = status ? `?status=${status}` : "";
    return classApiFetch(`/courses/${courseId}/classes${qs}`);
  },

  getSchedule: (classId: string): Promise<ScheduleDTO> =>
    classApiFetch(`/classes/${classId}/schedule`),

  updateSchedule: (classId: string, dto: ScheduleDTO): Promise<ScheduleDTO> =>
    classApiFetch(`/classes/${classId}/schedule`, { method: "PUT", body: JSON.stringify(dto) }),

  reorder: (courseId: string, items: ReorderItemDTO[]): Promise<void> =>
    classApiFetch(`/courses/${courseId}/classes/reorder`, { method: "PUT", body: JSON.stringify(items) }),

  getOrdered: (courseId: string): Promise<ClassEntity[]> =>
    classApiFetch(`/courses/${courseId}/classes/ordered`),
};
