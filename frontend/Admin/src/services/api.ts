import { Course, Certification, Quiz, Payment } from "@/types";

const API_BASE = "/api/v1/course";
const PAYMENT_API_BASE = "http://localhost:8080";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

// --- COURSES 
export const coursesApi = {
  getAll: async (): Promise<Course[]> => {
    try {
      const res = await fetch(API_BASE);
      if (!res.ok) throw new Error("Failed to fetch courses");
      return res.json();
    } catch (error) {
      console.warn("Course service unavailable, returning empty array");
      return [];
    }
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
export const paymentsApi = {
  getAll: async (): Promise<Payment[]> => {
    try {
      console.log("Fetching payments from:", `${PAYMENT_API_BASE}/payments`);
      const res = await fetch(`${PAYMENT_API_BASE}/payments`);
      console.log("Response status:", res.status);
      
      if (!res.ok) {
        console.error("Failed to fetch payments. Status:", res.status);
        throw new Error(`Failed to fetch payments: ${res.status}`);
      }
      
      const backendPayments = await res.json();
      console.log("Raw backend data:", backendPayments);
      
      if (!Array.isArray(backendPayments)) {
        console.error("Backend data is not an array:", backendPayments);
        return [];
      }
      
      const mapped = backendPayments.map((p: any) => ({
        id: (p.id ?? 0).toString(),
        userId: (p.id ?? 0).toString(),
        userName: p.studentName || "Unknown",
        userEmail: p.studentEmail || "unknown@example.com",
        courseId: p.course || "unknown",
        courseName: p.course || "Unknown Course",
        amount: p.amount ?? 0,
        currency: p.currency || "USD",
        status: p.status || "unknown",
        stripePaymentId: p.stripeId ||  "Not Available",
        method: p.paymentMethod && p.cardLast4 ? `${p.paymentMethod} •••• ${p.cardLast4}` : "Not Available",
        createdAt: p.createdAt || new Date().toISOString(),
      }));
      
      console.log("Mapped payments:", mapped);
      return mapped;
    } catch (error) {
      console.error("Error fetching payments:", error);
      return [];
    }
  },
  getById: async (id: string): Promise<Payment | undefined> => {
    const all = await paymentsApi.getAll();
    return all.find((p) => p.id === id);
  },
  refund: async (id: string): Promise<Payment> => {
    throw new Error("Refund not implemented yet");
  },
};

// --- DASHBOARD STATS ---
export const dashboardApi = {
  getStats: async () => {
    try {
      console.log("Fetching payment stats from:", `${PAYMENT_API_BASE}/payments/stats`);
      const statsRes = await fetch(`${PAYMENT_API_BASE}/payments/stats`);
      console.log("Stats response status:", statsRes.status);
      
      if (!statsRes.ok) {
        console.error("Failed to fetch stats. Status:", statsRes.status);
        throw new Error("Failed to fetch stats");
      }
      
      const paymentStats = await statsRes.json();
      console.log("Payment stats:", paymentStats);
      
      const allPayments = await paymentsApi.getAll();
      
      console.log("All payments count:", allPayments.length);
      
      // Try to get courses, but don't fail if unavailable
      let allCourses: Course[] = [];
      try {
        allCourses = await coursesApi.getAll();
      } catch (error) {
        console.warn("Course service unavailable");
      }
      
      return {
        totalCourses: allCourses.length,
        totalStudents: allPayments.length,
        totalRevenue: paymentStats.totalRevenue || 0,
        activeQuizzes: quizzes.filter((q) => q.status === "active").length,
        recentPayments: allPayments.slice(0, 5),
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
          { month: "Feb", revenue: paymentStats.totalRevenue || 11750 },
        ],
        paymentStats: paymentStats,
      };
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      return null;
    }
  },
};
