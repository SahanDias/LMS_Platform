import { useState, useEffect, useCallback } from "react";
import {
  enrollmentApi,
  waitlistApi,
  catalogApi,
  fetchAllEnrollmentsForCourses,
  type EnrollmentDTO,
  type EnrollmentStatus,
  type WaitlistDTO,
  type CourseResponse,
  type ClassResponse,
} from "@/services/enrollmentService";

// No dummy courses: enrollment uses only real courses from the catalog API (course service).
// When catalog is empty or fails, the UI shows a message to start the course service.

/** Display row: API enrollment + labels from courses/classes */
export type EnrollmentRow = EnrollmentDTO & {
  courseName?: string;
  classLabel?: string;
  instructor?: string;
  studentName?: string;
  studentEmail?: string;
  paymentStatus?: string;
  paymentAmount?: number;
  progress?: number;
  enrolledAt?: string;
  deadline?: string;
  lastAccessed?: string;
};

function enrollmentDtoToRow(
  dto: EnrollmentDTO,
  courses: CourseResponse[],
  classesByCourse: Record<number, ClassResponse[]>
): EnrollmentRow {
  const course = courses.find((c) => c.id === dto.courseId);
  const classes = dto.courseId ? (classesByCourse[dto.courseId] || []) : [];
  const cls = classes.find((c) => c.id === dto.classId);
  const enrollDate = dto.enrollmentDate?.slice(0, 10);
  const deadDate = dto.deadlineDate?.slice(0, 10);
  return {
    ...dto,
    courseName: course?.title,
    classLabel: cls?.title,
    instructor: undefined,
    studentName: `Student ${dto.studentId}`,
    studentEmail: "",
    paymentStatus: dto.status === "PENDING" ? "PENDING" : "PAID",
    paymentAmount: course?.price,
    progress: 0,
    enrolledAt: enrollDate,
    deadline: deadDate ?? "—",
    lastAccessed: "—",
  };
}

/** Fallback waitlist when backend has no "get all" (get by student only) */
const FALLBACK_WAITLIST: (WaitlistDTO & { studentName?: string; studentEmail?: string; courseName?: string; classLabel?: string; joinedAt?: string; estimatedDays?: number; holdPayment?: boolean; holdAmount?: number | null })[] = [];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  ACTIVE:    { color: "#22C55E", bg: "#052e16", label: "Active" },
  PENDING:   { color: "#F59E0B", bg: "#451a03", label: "Pending" },
  COMPLETED: { color: "#3B82F6", bg: "#0c1a3a", label: "Completed" },
  SUSPENDED: { color: "#A855F7", bg: "#2e1065", label: "Suspended" },
  DROPPED:   { color: "#EF4444", bg: "#2d0a0a", label: "Dropped" },
  CANCELLED: { color: "#6B7280", bg: "#1c1c1c", label: "Cancelled" },
};
const PAYMENT_CONFIG = {
  PAID:     { color: "#22C55E", label: "Paid" },
  PENDING:  { color: "#F59E0B", label: "Pending" },
  FAILED:   { color: "#EF4444", label: "Failed" },
  REFUNDED: { color: "#6B7280", label: "Refunded" },
};

const Badge = ({ status, type = "status" }) => {
  const cfg = type === "status" ? STATUS_CONFIG[status] : PAYMENT_CONFIG[status];
  if (!cfg) return null;
  return (
    <span style={{ background: cfg.bg || "transparent", color: cfg.color, border: `1px solid ${cfg.color}40`, borderRadius: 5, padding: "2px 9px", fontSize: 11, fontWeight: 600, fontFamily: "'DM Mono', monospace", whiteSpace: "nowrap" }}>
      {cfg.label || status}
    </span>
  );
};

const ProgressBar = ({ value, color = "#22C55E" }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
    <div style={{ flex: 1, height: 5, background: "#1e1e2e", borderRadius: 99 }}>
      <div style={{ width: `${value}%`, height: "100%", background: value === 100 ? "#3B82F6" : color, borderRadius: 99, transition: "width 0.6s ease" }} />
    </div>
    <span style={{ color: "#6B7280", fontSize: 11, fontFamily: "'DM Mono', monospace", minWidth: 30 }}>{value}%</span>
  </div>
);

const StatCard = ({ label, value, sub, color = "#F1F5F9" }) => (
  <div style={{ background: "#0d0d14", border: "1px solid #1a1a2e", borderRadius: 10, padding: "16px 20px", flex: 1 }}>
    <p style={{ color: "#4B5563", fontSize: 11, fontFamily: "'DM Mono', monospace", letterSpacing: 1, marginBottom: 6 }}>{label}</p>
    <p style={{ color: color || "#F1F5F9", fontSize: 26, fontWeight: 800, fontFamily: "'Fraunces', serif", lineHeight: 1 }}>{value}</p>
    {sub && <p style={{ color: "#374151", fontSize: 11, marginTop: 5, fontFamily: "'DM Mono', monospace" }}>{sub}</p>}
  </div>
);

// ─── MODALS ───────────────────────────────────────────────────────────────────
const Overlay = ({ children, onClose }) => (
  <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
    <div onClick={e => e.stopPropagation()} style={{ background: "#0d0d14", border: "1px solid #1a1a2e", borderRadius: 14, width: "100%", maxWidth: 540, maxHeight: "85vh", overflowY: "auto" }}>
      {children}
    </div>
  </div>
);

const ModalHeader = ({ title, sub, icon, onClose }) => (
  <div style={{ padding: "22px 26px 16px", borderBottom: "1px solid #1a1a2e", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
        <span style={{ fontSize: 18 }}>{icon}</span>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 19, fontWeight: 700, color: "#F1F5F9" }}>{title}</h2>
      </div>
      {sub && <p style={{ color: "#4B5563", fontSize: 12, fontFamily: "'DM Mono', monospace" }}>{sub}</p>}
    </div>
    <button onClick={onClose} style={{ background: "none", border: "none", color: "#374151", cursor: "pointer", fontSize: 20, lineHeight: 1 }}>✕</button>
  </div>
);

const Field = ({ label, children }) => (
  <div style={{ marginBottom: 16 }}>
    <label style={{ display: "block", color: "#4B5563", fontSize: 11, fontFamily: "'DM Mono', monospace", letterSpacing: 1, marginBottom: 6 }}>{label}</label>
    {children}
  </div>
);

const Input = ({ value, onChange, placeholder = "", type = "text" }) => (
  <input type={type} value={value} onChange={onChange} placeholder={placeholder}
    style={{ width: "100%", background: "#07070f", border: "1px solid #1a1a2e", borderRadius: 7, padding: "9px 12px", color: "#E2E8F0", fontSize: 13, fontFamily: "'DM Mono', monospace", outline: "none" }} />
);

const Select = ({ value, onChange, children }) => (
  <select value={value} onChange={onChange}
    style={{ width: "100%", background: "#07070f", border: "1px solid #1a1a2e", borderRadius: 7, padding: "9px 12px", color: "#E2E8F0", fontSize: 13, fontFamily: "'DM Mono', monospace", outline: "none" }}>
    {children}
  </select>
);

const Btn = ({ onClick, children, variant = "primary", disabled = false }) => {
  const styles = {
    primary: { background: "#4F46E5", color: "#fff", border: "none" },
    secondary: { background: "transparent", color: "#6B7280", border: "1px solid #1a1a2e" },
    danger: { background: "#7f1d1d", color: "#FCA5A5", border: "1px solid #EF444440" },
    success: { background: "#052e16", color: "#4ADE80", border: "1px solid #22C55E40" },
    warning: { background: "#451a03", color: "#FCD34D", border: "1px solid #F59E0B40" },
  };
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ ...styles[variant], borderRadius: 8, padding: "9px 18px", fontSize: 13, fontFamily: "'DM Mono', monospace", cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1, transition: "opacity 0.15s" }}>
      {children}
    </button>
  );
};

// ─── ENROLL STUDENT MODAL ────────────────────────────────────────────────────
const EnrollModal = ({ onClose, onEnroll, toast, courses, classesByCourse }) => {
  const courseList = courses ?? [];
  const getClasses = (cid: number) => (classesByCourse && classesByCourse[cid]) ?? [];

  const [step, setStep] = useState(1);
  const [studentId, setStudentId] = useState<number>(1);
  const [name, setName] = useState(""); const [email, setEmail] = useState("");
  const [courseId, setCourseId] = useState<number | "">(""); const [classId, setClassId] = useState<string>("");
  const [paymentId, setPaymentId] = useState<number>(1);
  const [deadlineDate, setDeadlineDate] = useState("");
  const [payment, setPayment] = useState("CARD"); const [loading, setLoading] = useState(false);

  const course = courseList.find(c => c.id === courseId);
  const classes = courseId !== "" ? getClasses(Number(courseId)) : [];
  const cls = classes.find(c => c.id === classId);
  const isFull = false;

  const steps = ["Student", "Course & Class", "Payment", "Confirm"];

  const submit = async () => {
    if (courseId === "" || !classId) return;
    setLoading(true);
    try {
      if (isFull) {
        await waitlistApi.create({
          studentId,
          courseId: Number(courseId),
          classId,
          holdPaymentStatus: true,
        });
        toast("⏳ Added to waitlist — class is full");
      } else {
        const created = await enrollmentApi.create({
          studentId,
          courseId: Number(courseId),
          classId,
          paymentId,
          deadlineDate: deadlineDate || undefined,
        });
        onEnroll(enrollmentDtoToRow(created, courseList, classesByCourse ?? {}));
        toast("✅ Student enrolled successfully");
      }
      onClose();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Enrollment failed";
      toast("❌ " + msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Overlay onClose={onClose}>
      <ModalHeader title="Enroll Student" sub="enrollStudent() — validates → reserves → pays → initialises progress" icon="＋" onClose={onClose} />
      
      {/* Step indicator */}
      <div style={{ padding: "16px 26px 0", display: "flex", gap: 0 }}>
        {steps.map((s, i) => (
          <div key={s} style={{ flex: 1, display: "flex", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <div style={{ width: 22, height: 22, borderRadius: "50%", background: i + 1 <= step ? "#4F46E5" : "#1a1a2e", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: i + 1 <= step ? "#fff" : "#374151", fontFamily: "'DM Mono', monospace", flexShrink: 0 }}>{i + 1}</div>
              <span style={{ color: i + 1 === step ? "#A5B4FC" : "#374151", fontSize: 10, fontFamily: "'DM Mono', monospace", whiteSpace: "nowrap" }}>{s}</span>
            </div>
            {i < steps.length - 1 && <div style={{ flex: 1, height: 1, background: i + 1 < step ? "#4F46E5" : "#1a1a2e", margin: "0 8px" }} />}
          </div>
        ))}
      </div>

      <div style={{ padding: "20px 26px" }}>
        {step === 1 && (
          <>
            <Field label="STUDENT ID (required by API)">
              <Input type="number" value={studentId} onChange={e => setStudentId(Number(e.target.value) || 1)} placeholder="1" />
            </Field>
            <Field label="STUDENT NAME (display only)"><Input value={name} onChange={e => setName(e.target.value)} placeholder="Full name" /></Field>
            <Field label="EMAIL ADDRESS (display only)"><Input value={email} onChange={e => setEmail(e.target.value)} placeholder="student@email.com" type="email" /></Field>
          </>
        )}
        {step === 2 && (
          <>
            <Field label="SELECT COURSE">
              {courseList.length === 0 ? (
                <div style={{ background: "#1a1a2e", border: "1px solid #374151", borderRadius: 8, padding: "14px 16px", color: "#F59E0B", fontSize: 12, fontFamily: "'DM Mono', monospace" }}>
                  No courses available. Ensure the course service is running (e.g. http://localhost:8081) and the enrollment service can reach it.
                </div>
              ) : (
                <Select value={courseId === "" ? "" : String(courseId)} onChange={e => { const v = e.target.value; setCourseId(v === "" ? "" : Number(v)); setClassId(""); }}>
                  <option value="">— Choose a course —</option>
                  {courseList.map(c => <option key={c.id} value={c.id}>{c.title} (${c.price ?? "—"})</option>)}
                </Select>
              )}
            </Field>
            {courseId !== "" && (
              <Field label="SELECT CLASS SESSION">
                <Select value={classId} onChange={e => setClassId(e.target.value)}>
                  <option value="">— Choose a session —</option>
                  {classes.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                </Select>
              </Field>
            )}
            {classId && !isFull && (
              <div style={{ background: "#052e16", border: "1px solid #22C55E30", borderRadius: 8, padding: "10px 14px", marginTop: 8 }}>
                <p style={{ color: "#4ADE80", fontSize: 12, fontFamily: "'DM Mono', monospace" }}>✓ Proceed to payment</p>
              </div>
            )}
          </>
        )}
        {step === 3 && (
          <>
            <Field label="PAYMENT ID (from Payment Service)">
              <Input type="number" value={paymentId} onChange={e => setPaymentId(Number(e.target.value) || 1)} placeholder="1" />
            </Field>
            <Field label="DEADLINE (optional)">
              <Input type="date" value={deadlineDate} onChange={e => setDeadlineDate(e.target.value)} />
            </Field>
            <Field label="PAYMENT METHOD">
              <Select value={payment} onChange={e => setPayment(e.target.value)}>
                <option value="CARD">Credit / Debit Card</option>
                <option value="INVOICE">Invoice (Institutional)</option>
                <option value="VOUCHER">Voucher Code</option>
              </Select>
            </Field>
            {course && (
              <div style={{ background: "#07070f", border: "1px solid #1a1a2e", borderRadius: 8, padding: "14px 16px", marginTop: 4 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ color: "#6B7280", fontSize: 12, fontFamily: "'DM Mono', monospace" }}>Course fee</span>
                  <span style={{ color: "#E2E8F0", fontSize: 12, fontFamily: "'DM Mono', monospace" }}>${course.price}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 8, borderTop: "1px solid #1a1a2e" }}>
                  <span style={{ color: "#A5B4FC", fontSize: 13, fontFamily: "'DM Mono', monospace", fontWeight: 700 }}>Total</span>
                  <span style={{ color: "#A5B4FC", fontSize: 13, fontFamily: "'DM Mono', monospace", fontWeight: 700 }}>${course.price}</span>
                </div>
              </div>
            )}
          </>
        )}
        {step === 4 && (
          <div style={{ background: "#07070f", border: "1px solid #1a1a2e", borderRadius: 10, padding: "16px" }}>
            <p style={{ color: "#4B5563", fontSize: 10, letterSpacing: 2, fontFamily: "'DM Mono', monospace", marginBottom: 12 }}>ENROLLMENT SUMMARY</p>
            {[["Student ID", String(studentId)], ["Student", name || "—"], ["Email", email || "—"], ["Course", course?.title], ["Class", cls?.title], ["Payment ID", String(paymentId)], ["Payment", payment], ["Amount", `$${course?.price ?? "—"}`]].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid #1a1a2e" }}>
                <span style={{ color: "#4B5563", fontSize: 12, fontFamily: "'DM Mono', monospace" }}>{k}</span>
                <span style={{ color: "#E2E8F0", fontSize: 12, fontFamily: "'DM Mono', monospace" }}>{v || "—"}</span>
              </div>
            ))}
            <div style={{ marginTop: 12, display: "flex", gap: 6, flexWrap: "wrap" }}>
              {["validateCourse()", "reserveSeat()", "processPayment()", "initProgress()"].map((fn, i) => (
                <span key={fn} style={{ background: "#0d0d14", border: "1px solid #1a1a2e", borderRadius: 5, padding: "3px 9px", fontSize: 10, color: "#4F46E5", fontFamily: "'DM Mono', monospace" }}>
                  {i + 1}. {fn}
                </span>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20 }}>
          <Btn variant="secondary" onClick={step > 1 ? () => setStep(s => s - 1) : onClose}>{step > 1 ? "← Back" : "Cancel"}</Btn>
          {step < 4
            ? <Btn onClick={() => setStep(s => s + 1)} disabled={step === 1 && !studentId || step === 2 && (courseId === "" || classId === "") || step === 3 && !paymentId}>Next →</Btn>
            : <Btn onClick={submit} disabled={loading}>{loading ? "Processing..." : isFull ? "Join Waitlist" : "Confirm Enroll"}</Btn>
          }
        </div>
      </div>
    </Overlay>
  );
};

// ─── BULK ENROLL MODAL ───────────────────────────────────────────────────────
const BulkEnrollModal = ({ onClose, toast, onBulkSuccess, courses, classesByCourse }) => {
  const courseList = courses ?? [];
  const getClasses = (cid: number) => (classesByCourse && classesByCourse[cid]) ?? [];

  const [file, setFile] = useState<string | null>(null);
  const [courseId, setCourseId] = useState<number>(courseList[0]?.id ?? 0);
  const [classId, setClassId] = useState<string>(courseList[0] ? (getClasses(courseList[0].id)[0]?.id ?? "") : "");
  const [studentIds, setStudentIds] = useState("1,2,3");
  const [paymentId, setPaymentId] = useState(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: number; failed: number; batchId: string; totalEnrolled: number } | null>(null);

  const runBulk = async () => {
    if (!classId) return;
    setLoading(true);
    try {
      const ids = studentIds.split(/[\s,]+/).map((s) => parseInt(s.trim(), 10)).filter((n) => !isNaN(n));
      const enrollments = ids.map((studentId) => ({
        studentId,
        courseId,
        classId,
        paymentId,
      }));
      const page = await enrollmentApi.bulk({ enrollments }, 0, 50);
      const success = page.content.length;
      const failed = Math.max(0, enrollments.length - success);
      setResult({
        success,
        failed,
        batchId: `BATCH-${Date.now()}`,
        totalEnrolled: success,
      });
      onBulkSuccess?.(page.content);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Bulk enroll failed";
      toast("❌ " + msg);
    } finally {
      setLoading(false);
    }
  };

  const classes = getClasses(courseId);

  return (
    <Overlay onClose={onClose}>
      <ModalHeader title="Bulk Enroll" sub="bulkEnroll() — batch enrollment with partial failure handling" icon="⊞" onClose={onClose} />
      <div style={{ padding: "20px 26px" }}>
        {!result ? (
          <>
            <Field label="TARGET COURSE">
              {courseList.length === 0 ? (
                <div style={{ background: "#1a1a2e", border: "1px solid #374151", borderRadius: 8, padding: "14px 16px", color: "#F59E0B", fontSize: 12, fontFamily: "'DM Mono', monospace" }}>
                  No courses available. Start the course service (e.g. http://localhost:8081).
                </div>
              ) : (
                <Select value={String(courseId)} onChange={e => { const cid = Number(e.target.value); setCourseId(cid); setClassId(getClasses(cid)[0]?.id ?? ""); }}>
                  {courseList.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                </Select>
              )}
            </Field>
            <Field label="CLASS SESSION">
              <Select value={classId} onChange={e => setClassId(e.target.value)}>
                {classes.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
              </Select>
            </Field>
            <Field label="STUDENT IDs (comma-separated)">
              <Input value={studentIds} onChange={e => setStudentIds(e.target.value)} placeholder="1, 2, 3" />
            </Field>
            <Field label="PAYMENT ID (same for all in this batch)">
              <Input type="number" value={paymentId} onChange={e => setPaymentId(Number(e.target.value) || 1)} />
            </Field>
            <Field label="STUDENT CSV FILE (optional)">
              <div style={{ border: "2px dashed #1a1a2e", borderRadius: 8, padding: "28px", textAlign: "center", cursor: "pointer" }}
                onClick={() => setFile(file ? null : "students_batch.csv")}>
                {file
                  ? <p style={{ color: "#4ADE80", fontSize: 13, fontFamily: "'DM Mono', monospace" }}>📄 {file}</p>
                  : <p style={{ color: "#374151", fontSize: 12, fontFamily: "'DM Mono', monospace" }}>Click to attach CSV<br /><span style={{ fontSize: 10 }}>studentId, name, email, classId</span></p>}
              </div>
            </Field>
            <div style={{ background: "#07070f", border: "1px solid #1a1a2e", borderRadius: 8, padding: "12px 14px", marginBottom: 16 }}>
              <p style={{ color: "#4B5563", fontSize: 11, fontFamily: "'DM Mono', monospace" }}>ℹ Processed in chunks of 50 · Partial success is reported</p>
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <Btn variant="secondary" onClick={onClose}>Cancel</Btn>
              <Btn onClick={runBulk} disabled={loading || !studentIds.trim() || !classId || courseList.length === 0}>{loading ? "Processing batch..." : "Start Bulk Enroll"}</Btn>
            </div>
          </>
        ) : (
          <>
            <div style={{ background: "#052e16", border: "1px solid #22C55E30", borderRadius: 10, padding: "20px", marginBottom: 16, textAlign: "center" }}>
              <p style={{ color: "#4ADE80", fontSize: 28, fontFamily: "'Fraunces', serif", fontWeight: 800 }}>{result.success} / {result.success + result.failed}</p>
              <p style={{ color: "#4ADE80", fontSize: 12, fontFamily: "'DM Mono', monospace" }}>students enrolled successfully</p>
            </div>
            {[["Batch ID", result.batchId], ["Enrolled", result.success], ["Failed", result.failed], ["Dead-letter queue", `${result.failed} records`]].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #1a1a2e" }}>
                <span style={{ color: "#4B5563", fontSize: 12, fontFamily: "'DM Mono', monospace" }}>{k}</span>
                <span style={{ color: "#E2E8F0", fontSize: 12, fontFamily: "'DM Mono', monospace" }}>{v}</span>
              </div>
            ))}
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 18 }}>
              <Btn variant="secondary" onClick={() => { toast("📥 Failure report downloaded"); onClose(); }}>Download Failures</Btn>
              <Btn onClick={onClose}>Done</Btn>
            </div>
          </>
        )}
      </div>
    </Overlay>
  );
};

// ─── STATUS UPDATE MODAL ─────────────────────────────────────────────────────
const StatusModal = ({ enrollment, onClose, onUpdate, toast, courses, classesByCourse }) => {
  const courseList = courses ?? [];
  const TRANSITIONS: Record<string, string[]> = { PENDING: ["ACTIVE", "CANCELLED"], ACTIVE: ["COMPLETED", "DROPPED", "SUSPENDED"], SUSPENDED: ["ACTIVE", "CANCELLED"], DROPPED: [], COMPLETED: [], CANCELLED: [] };
  const valid = TRANSITIONS[enrollment.status] || [];
  const [newStatus, setNewStatus] = useState(valid[0] || "");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    try {
      const updated = await enrollmentApi.updateStatus(Number(enrollment.id), { status: newStatus as EnrollmentStatus });
      onUpdate(enrollment.id, newStatus, enrollmentDtoToRow(updated, courseList, classesByCourse ?? {}));
      const msgs: Record<string, string> = { COMPLETED: "🎓 Enrollment marked as completed", DROPPED: "📤 Student dropped — refund initiated", SUSPENDED: "⏸ Enrollment suspended", ACTIVE: "▶ Enrollment reactivated", CANCELLED: "🚫 Enrollment cancelled" };
      toast(msgs[newStatus] || "✅ Status updated");
      onClose();
    } catch (err) {
      toast("❌ " + (err instanceof Error ? err.message : "Update failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Overlay onClose={onClose}>
      <ModalHeader title="Update Status" sub={`updateEnrollmentStatus() — ${enrollment.studentName}`} icon="⇄" onClose={onClose} />
      <div style={{ padding: "20px 26px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, padding: "12px 14px", background: "#07070f", borderRadius: 8, border: "1px solid #1a1a2e" }}>
          <span style={{ color: "#4B5563", fontSize: 12, fontFamily: "'DM Mono', monospace" }}>Current:</span>
          <Badge status={enrollment.status} />
          <span style={{ color: "#1a1a2e", fontSize: 16 }}>→</span>
          {newStatus && <Badge status={newStatus} />}
        </div>

        {valid.length === 0
          ? <div style={{ background: "#07070f", border: "1px solid #1a1a2e", borderRadius: 8, padding: "16px", textAlign: "center" }}>
              <p style={{ color: "#374151", fontSize: 13, fontFamily: "'DM Mono', monospace" }}>No valid transitions from {enrollment.status}</p>
            </div>
          : <>
              <Field label="NEW STATUS">
                <Select value={newStatus} onChange={e => setNewStatus(e.target.value)}>
                  {valid.map(s => <option key={s} value={s}>{s}</option>)}
                </Select>
              </Field>
              <Field label="REASON (OPTIONAL)"><Input value={reason} onChange={e => setReason(e.target.value)} placeholder="e.g. Medical leave, payment dispute..." /></Field>
              {newStatus === "DROPPED" && (
                <div style={{ background: "#2d0a0a", border: "1px solid #EF444430", borderRadius: 8, padding: "10px 14px", marginBottom: 12 }}>
                  <p style={{ color: "#FCA5A5", fontSize: 12, fontFamily: "'DM Mono', monospace" }}>⚠ This will trigger a refund via Payment Service and archive progress</p>
                </div>
              )}
              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                <Btn variant="secondary" onClick={onClose}>Cancel</Btn>
                <Btn variant={newStatus === "DROPPED" || newStatus === "CANCELLED" ? "danger" : "primary"} onClick={submit} disabled={loading}>
                  {loading ? "Updating..." : `Set ${newStatus}`}
                </Btn>
              </div>
            </>
        }
      </div>
    </Overlay>
  );
};

// ─── TRANSFER MODAL ──────────────────────────────────────────────────────────
const TransferModal = ({ enrollment, onClose, onTransfer, toast, courses, classesByCourse }) => {
  const courseList = courses ?? [];
  const classes = (classesByCourse && classesByCourse[enrollment.courseId]) ?? [];
  const available = classes.filter((c: ClassResponse) => c.id !== enrollment.classId);
  const [classId, setClassId] = useState<string>(available[0]?.id ?? "");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!classId) return;
    setLoading(true);
    try {
      const updated = await enrollmentApi.transfer(Number(enrollment.id), { targetClassId: classId });
      onTransfer?.(enrollment.id, enrollmentDtoToRow(updated, courseList, classesByCourse ?? {}));
      toast("🔀 Enrollment transferred to new class session");
      onClose();
    } catch (err) {
      toast("❌ " + (err instanceof Error ? err.message : "Transfer failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Overlay onClose={onClose}>
      <ModalHeader title="Transfer Class" sub={`transferEnrollment() — ${enrollment.studentName}`} icon="⇌" onClose={onClose} />
      <div style={{ padding: "20px 26px" }}>
        <div style={{ background: "#07070f", border: "1px solid #1a1a2e", borderRadius: 8, padding: "12px 14px", marginBottom: 16 }}>
          <p style={{ color: "#4B5563", fontSize: 11, fontFamily: "'DM Mono', monospace", marginBottom: 3 }}>CURRENT CLASS</p>
          <p style={{ color: "#E2E8F0", fontSize: 13, fontFamily: "'DM Mono', monospace" }}>{enrollment.classLabel}</p>
        </div>
        <Field label="TRANSFER TO">
          <Select value={classId} onChange={e => setClassId(e.target.value)}>
            {available.map((c: ClassResponse) => <option key={c.id} value={c.id}>{c.title}</option>)}
          </Select>
        </Field>
        <div style={{ background: "#07070f", border: "1px solid #1a1a2e", borderRadius: 8, padding: "10px 14px", marginBottom: 16 }}>
          <p style={{ color: "#4B5563", fontSize: 11, fontFamily: "'DM Mono', monospace" }}>ℹ Seat released from current class · Progress migrated · Fee difference applied if applicable</p>
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <Btn variant="secondary" onClick={onClose}>Cancel</Btn>
          <Btn onClick={submit} disabled={loading || !classId}>{loading ? "Transferring..." : "Transfer"}</Btn>
        </div>
      </div>
    </Overlay>
  );
};

// ─── EXTEND DEADLINE MODAL ───────────────────────────────────────────────────
const ExtendModal = ({ enrollment, onClose, onExtend, toast, courses, classesByCourse }) => {
  const courseList = courses ?? [];
  const [newDate, setNewDate] = useState(""); const [reason, setReason] = useState("MEDICAL"); const [loading, setLoading] = useState(false);
  const submit = async () => {
    if (!newDate) return;
    setLoading(true);
    try {
      const updated = await enrollmentApi.extendDeadline(Number(enrollment.id), { newDeadlineDate: newDate });
      onExtend?.(enrollment.id, enrollmentDtoToRow(updated, courseList, classesByCourse ?? {}));
      toast("📅 Deadline extended successfully");
      onClose();
    } catch (err) {
      toast("❌ " + (err instanceof Error ? err.message : "Extend failed"));
    } finally {
      setLoading(false);
    }
  };
  return (
    <Overlay onClose={onClose}>
      <ModalHeader title="Extend Deadline" sub={`extendEnrollmentDeadline() — ${enrollment.studentName}`} icon="📅" onClose={onClose} />
      <div style={{ padding: "20px 26px" }}>
        <div style={{ background: "#07070f", border: "1px solid #1a1a2e", borderRadius: 8, padding: "12px 14px", marginBottom: 16 }}>
          <span style={{ color: "#4B5563", fontSize: 11, fontFamily: "'DM Mono', monospace" }}>CURRENT DEADLINE: </span>
          <span style={{ color: "#F59E0B", fontSize: 12, fontFamily: "'DM Mono', monospace" }}>{enrollment.deadline}</span>
        </div>
        <Field label="NEW DEADLINE"><Input type="date" value={newDate} onChange={e => setNewDate(e.target.value)} /></Field>
        <Field label="REASON">
          <Select value={reason} onChange={e => setReason(e.target.value)}>
            <option value="MEDICAL">Medical Leave</option>
            <option value="HARDSHIP">Financial Hardship</option>
            <option value="MILITARY">Military Service</option>
            <option value="ACADEMIC">Academic Appeal</option>
          </Select>
        </Field>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <Btn variant="secondary" onClick={onClose}>Cancel</Btn>
          <Btn onClick={submit} disabled={!newDate || loading}>{loading ? "Extending..." : "Extend Deadline"}</Btn>
        </div>
      </div>
    </Overlay>
  );
};

// ─── CANCEL MODAL ────────────────────────────────────────────────────────────
const CancelModal = ({ enrollment, onClose, onDelete, toast }) => {
  const [confirm, setConfirm] = useState(""); const [loading, setLoading] = useState(false);
  const ok = confirm.toLowerCase() === "cancel";
  const submit = async () => {
    setLoading(true);
    try {
      await enrollmentApi.cancel(Number(enrollment.id));
      onDelete(enrollment.id);
      toast("🚫 Enrollment cancelled — refund initiated where applicable");
      onClose();
    } catch (err) {
      toast("❌ " + (err instanceof Error ? err.message : "Cancel failed"));
    } finally {
      setLoading(false);
    }
  };
  return (
    <Overlay onClose={onClose}>
      <ModalHeader title="Cancel Enrollment" sub={`cancelEnrollment() — soft delete, preserves audit record`} icon="✕" onClose={onClose} />
      <div style={{ padding: "20px 26px" }}>
        <div style={{ background: "#2d0a0a", border: "1px solid #EF444430", borderRadius: 8, padding: "14px", marginBottom: 16 }}>
          <p style={{ color: "#FCA5A5", fontSize: 13, fontFamily: "'DM Mono', monospace", marginBottom: 8 }}>This will:</p>
          {["Soft-delete the enrollment (record kept for audit)", "Release the reserved class seat", "Initiate refund per cancellation policy", "Archive progress snapshot to cold storage"].map(s => (
            <p key={s} style={{ color: "#9CA3AF", fontSize: 12, fontFamily: "'DM Mono', monospace", padding: "3px 0" }}>• {s}</p>
          ))}
        </div>
        <Field label='TYPE "cancel" TO CONFIRM'><Input value={confirm} onChange={e => setConfirm(e.target.value)} placeholder='cancel' /></Field>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <Btn variant="secondary" onClick={onClose}>Back</Btn>
          <Btn variant="danger" onClick={submit} disabled={!ok || loading}>{loading ? "Cancelling..." : "Cancel Enrollment"}</Btn>
        </div>
      </div>
    </Overlay>
  );
};

// ─── DETAIL PANEL ────────────────────────────────────────────────────────────
const DetailPanel = ({ enrollment, onClose, onStatusModal, onTransfer, onExtend, onCancel, courses }) => {
  const [tab, setTab] = useState("overview");
  const tabs = ["overview", "course", "payment", "progress"];
  const courseList = courses ?? [];
  const course = courseList.find(c => c.id === enrollment.courseId);

  return (
    <div style={{ width: 360, flexShrink: 0, background: "#0a0a12", borderLeft: "1px solid #1a1a2e", display: "flex", flexDirection: "column", overflowY: "auto" }}>
      {/* Header */}
      <div style={{ padding: "18px 20px", borderBottom: "1px solid #1a1a2e", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <p style={{ color: "#4B5563", fontSize: 10, letterSpacing: 2, fontFamily: "'DM Mono', monospace", marginBottom: 4 }}>getEnrollmentById()</p>
          <p style={{ color: "#F1F5F9", fontSize: 15, fontFamily: "'Fraunces', serif", fontWeight: 700 }}>{enrollment.studentName}</p>
          <p style={{ color: "#374151", fontSize: 11, fontFamily: "'DM Mono', monospace" }}>{enrollment.studentEmail}</p>
        </div>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "#374151", cursor: "pointer", fontSize: 18 }}>✕</button>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid #1a1a2e" }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: "10px 4px", background: "none", border: "none", borderBottom: `2px solid ${tab === t ? "#4F46E5" : "transparent"}`, color: tab === t ? "#A5B4FC" : "#374151", fontSize: 10, fontFamily: "'DM Mono', monospace", cursor: "pointer", textTransform: "capitalize" }}>{t}</button>
        ))}
      </div>

      <div style={{ flex: 1, padding: "16px 20px" }}>
        {tab === "overview" && (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <Badge status={enrollment.status} />
              <span style={{ color: "#1a1a2e", fontSize: 12 }}>·</span>
              <Badge status={enrollment.paymentStatus} type="payment" />
            </div>
            {[["Enrollment ID", enrollment.id], ["Course", enrollment.courseName], ["Class", enrollment.classLabel], ["Enrolled", enrollment.enrolledAt], ["Deadline", enrollment.deadline], ["Last Accessed", enrollment.lastAccessed]].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #111" }}>
                <span style={{ color: "#4B5563", fontSize: 11, fontFamily: "'DM Mono', monospace" }}>{k}</span>
                <span style={{ color: "#9CA3AF", fontSize: 11, fontFamily: "'DM Mono', monospace", textAlign: "right", maxWidth: 180 }}>{v}</span>
              </div>
            ))}
          </>
        )}
        {tab === "course" && (
          <>
            <p style={{ color: "#4B5563", fontSize: 10, letterSpacing: 2, fontFamily: "'DM Mono', monospace", marginBottom: 12 }}>COURSE SERVICE DATA</p>
            {course && [
              ["Title", course.title],
              ["Code", course.courseCode],
              ["Description", course.description ? (course.description.length > 60 ? course.description.slice(0, 60) + "…" : course.description) : "—"],
              ["Status", course.status],
              ["Price", course.price != null ? `$${course.price}` : "—"],
              ["Passing %", course.passingPercentage != null ? `${course.passingPercentage}%` : "—"],
              ["Certification", course.certificationEnabled ? "Yes" : "No"],
            ].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #111" }}>
                <span style={{ color: "#4B5563", fontSize: 11, fontFamily: "'DM Mono', monospace" }}>{k}</span>
                <span style={{ color: "#9CA3AF", fontSize: 11, fontFamily: "'DM Mono', monospace" }}>{v ?? "—"}</span>
              </div>
            ))}
          </>
        )}
        {tab === "payment" && (
          <>
            <p style={{ color: "#4B5563", fontSize: 10, letterSpacing: 2, fontFamily: "'DM Mono', monospace", marginBottom: 12 }}>PAYMENT SERVICE DATA</p>
            {[
              { key: "Status", label: "Status", value: <Badge status={enrollment.paymentStatus} type="payment" /> },
              { key: "Amount", label: "Amount", value: `$${enrollment.paymentAmount ?? "—"}` },
              { key: "Method", label: "Method", value: "Credit Card ****4829" },
              { key: "Transaction", label: "Transaction", value: "TXN-" + String(enrollment.id) },
              { key: "Receipt", label: "Receipt", value: "RCP-2025-0" + Math.floor(Math.random() * 900 + 100) },
            ].map((item) => (
              <div key={item.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #111" }}>
                <span style={{ color: "#4B5563", fontSize: 11, fontFamily: "'DM Mono', monospace" }}>{item.label}</span>
                <span style={{ color: "#9CA3AF", fontSize: 11, fontFamily: "'DM Mono', monospace" }}>{item.value}</span>
              </div>
            ))}
            {enrollment.paymentStatus === "FAILED" && (
              <div style={{ marginTop: 12 }}>
                <p style={{ color: "#4B5563", fontSize: 10, letterSpacing: 2, fontFamily: "'DM Mono', monospace", marginBottom: 8 }}>WEBHOOK EVENTS (updatePaymentStatus)</p>
                {[{ event: "payment.failed", time: "3 weeks ago" }, { event: "payment.retry_scheduled", time: "3 weeks ago" }, { event: "payment.retry_failed", time: "2 weeks ago" }].map(e => (
                  <div key={e.event} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}>
                    <span style={{ color: "#EF4444", fontSize: 10, fontFamily: "'DM Mono', monospace" }}>{e.event}</span>
                    <span style={{ color: "#374151", fontSize: 10, fontFamily: "'DM Mono', monospace" }}>{e.time}</span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
        {tab === "progress" && (
          <>
            <p style={{ color: "#4B5563", fontSize: 10, letterSpacing: 2, fontFamily: "'DM Mono', monospace", marginBottom: 12 }}>PROGRESS SERVICE DATA</p>
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <p style={{ color: "#F1F5F9", fontSize: 42, fontFamily: "'Fraunces', serif", fontWeight: 800 }}>{enrollment.progress}%</p>
              <p style={{ color: "#4B5563", fontSize: 11, fontFamily: "'DM Mono', monospace" }}>Completion</p>
            </div>
            <ProgressBar value={enrollment.progress} />
            <div style={{ marginTop: 16 }}>
              {[["Modules Completed", `${Math.floor(enrollment.progress / 10)} / 10`], ["Assignments", `${Math.floor(enrollment.progress / 14)} / 7`], ["Quizzes Passed", `${Math.floor(enrollment.progress / 25)} / 4`], ["Last Accessed", enrollment.lastAccessed]].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid #111" }}>
                  <span style={{ color: "#4B5563", fontSize: 11, fontFamily: "'DM Mono', monospace" }}>{k}</span>
                  <span style={{ color: "#9CA3AF", fontSize: 11, fontFamily: "'DM Mono', monospace" }}>{v}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Actions */}
      <div style={{ padding: "14px 20px", borderTop: "1px solid #1a1a2e", display: "flex", flexDirection: "column", gap: 8 }}>
        <p style={{ color: "#4B5563", fontSize: 10, letterSpacing: 2, fontFamily: "'DM Mono', monospace", marginBottom: 4 }}>ACTIONS</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7 }}>
          <button onClick={() => onStatusModal(enrollment)} style={{ background: "#07070f", border: "1px solid #1a1a2e", borderRadius: 7, padding: "8px 10px", color: "#9CA3AF", fontSize: 11, fontFamily: "'DM Mono', monospace", cursor: "pointer", textAlign: "left" }}>⇄ Update Status</button>
          <button onClick={() => onTransfer(enrollment)} style={{ background: "#07070f", border: "1px solid #1a1a2e", borderRadius: 7, padding: "8px 10px", color: "#9CA3AF", fontSize: 11, fontFamily: "'DM Mono', monospace", cursor: "pointer", textAlign: "left" }}>⇌ Transfer Class</button>
          <button onClick={() => onExtend(enrollment)} style={{ background: "#07070f", border: "1px solid #1a1a2e", borderRadius: 7, padding: "8px 10px", color: "#9CA3AF", fontSize: 11, fontFamily: "'DM Mono', monospace", cursor: "pointer", textAlign: "left" }}>📅 Extend Deadline</button>
          <button onClick={() => onCancel(enrollment)} style={{ background: "#07070f", border: "1px solid #EF444420", borderRadius: 7, padding: "8px 10px", color: "#EF4444", fontSize: 11, fontFamily: "'DM Mono', monospace", cursor: "pointer", textAlign: "left" }}>✕ Cancel</button>
        </div>
      </div>
    </div>
  );
};

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function EnrollmentPage() {
  const [enrollments, setEnrollments] = useState<EnrollmentRow[]>([]);
  const [waitlist, setWaitlist] = useState<(WaitlistDTO & { studentName?: string; studentEmail?: string; courseName?: string; classLabel?: string; joinedAt?: string; estimatedDays?: number; holdPayment?: boolean; holdAmount?: number | null })[]>(FALLBACK_WAITLIST);
  const [view, setView] = useState("enrollments");
  const [selected, setSelected] = useState<EnrollmentRow | null>(null);
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState< string | { type: string; data: EnrollmentRow } | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [courses, setCourses] = useState<CourseResponse[]>([]);
  const [classesByCourse, setClassesByCourse] = useState<Record<number, ClassResponse[]>>({});
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const toast = useCallback((msg: string) => { setToastMsg(msg); setTimeout(() => setToastMsg(null), 3500); }, []);

  const [catalogLoadError, setCatalogLoadError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setCatalogLoadError(null);
      try {
        const list = await catalogApi.getCourses();
        setCourses(list ?? []);
        const byCourse: Record<number, ClassResponse[]> = {};
        for (const c of list ?? []) {
          try {
            const classes = await catalogApi.getClassesByCourse(c.id);
            byCourse[c.id] = classes ?? [];
          } catch {
            byCourse[c.id] = [];
          }
        }
        setClassesByCourse(byCourse);
        if (!list?.length) setCatalogLoadError("No courses returned. Ensure the course service is running (e.g. http://localhost:8081).");
      } catch (err) {
        setCourses([]);
        setClassesByCourse({});
        const msg = err instanceof Error ? err.message : "Could not load courses. Check that the enrollment service (port 8082) and course service (port 8081) are running.";
        setCatalogLoadError(msg);
      }
    })();
  }, []);

  const refetchEnrollments = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    const courseIds = courses.map((c) => c.id);
    try {
      const list = await fetchAllEnrollmentsForCourses(courseIds);
      setEnrollments(list.map((dto) => enrollmentDtoToRow(dto, courses, classesByCourse)));
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Failed to load enrollments");
      setEnrollments([]);
    } finally {
      setLoading(false);
    }
  }, [courses, classesByCourse]);

  useEffect(() => {
    refetchEnrollments();
  }, [refetchEnrollments]);

  const filtered = enrollments.filter(e => {
    const matchStatus = filter === "ALL" || e.status === filter;
    const matchSearch = !search || e.studentName.toLowerCase().includes(search.toLowerCase()) || e.courseName.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const stats = {
    active: enrollments.filter(e => e.status === "ACTIVE").length,
    pending: enrollments.filter(e => e.status === "PENDING").length,
    waitlisted: waitlist.length,
    completed: enrollments.filter(e => e.status === "COMPLETED").length,
  };

  return (
    <div style={{ fontFamily: "'DM Mono', monospace", background: "#07070f", minHeight: "100vh", color: "#9CA3AF", display: "flex", flexDirection: "column" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:4px;height:4px;}
        ::-webkit-scrollbar-thumb{background:#1a1a2e;border-radius:2px;}
        .row-hover{transition:background 0.12s;cursor:pointer;}
        .row-hover:hover{background:#0d0d18 !important;}
        .act-btn{background:none;border:1px solid #1a1a2e;border-radius:6px;padding:5px 10px;color:#4B5563;font-size:10px;font-family:'DM Mono',monospace;cursor:pointer;transition:all 0.15s;}
        .act-btn:hover{border-color:#374151;color:#9CA3AF;}
      `}</style>

      {/* Toast */}
      {toastMsg && (
        <div style={{ position: "fixed", top: 20, right: 20, zIndex: 999, background: "#0d0d18", border: "1px solid #1a1a2e", borderRadius: 10, padding: "12px 18px", color: "#E2E8F0", fontSize: 13, fontFamily: "'DM Mono', monospace", boxShadow: "0 8px 32px rgba(0,0,0,0.5)", maxWidth: 380 }}>
          {toastMsg}
        </div>
      )}

      {/* Modals */}
      {modal === "enroll" && <EnrollModal onClose={() => setModal(null)} onEnroll={(row) => { setEnrollments(prev => [...prev, row]); }} toast={toast} courses={courses} classesByCourse={classesByCourse} />}
      {modal === "bulk" && <BulkEnrollModal onClose={() => setModal(null)} toast={toast} onBulkSuccess={(content) => setEnrollments(prev => [...prev, ...content.map((dto) => enrollmentDtoToRow(dto, courses, classesByCourse))])} courses={courses} classesByCourse={classesByCourse} />}
      {modal && typeof modal === "object" && modal.type === "status" && <StatusModal enrollment={modal.data} onClose={() => setModal(null)} onUpdate={(id, s, updated) => setEnrollments(prev => prev.map(e => e.id === id ? (updated ?? { ...e, status: s }) : e))} toast={toast} courses={courses} classesByCourse={classesByCourse} />}
      {modal && typeof modal === "object" && modal.type === "transfer" && <TransferModal enrollment={modal.data} onClose={() => setModal(null)} onTransfer={(id, updated) => setEnrollments(prev => prev.map(e => e.id === id ? updated : e))} toast={toast} courses={courses} classesByCourse={classesByCourse} />}
      {modal && typeof modal === "object" && modal.type === "extend" && <ExtendModal enrollment={modal.data} onClose={() => setModal(null)} onExtend={(id, updated) => setEnrollments(prev => prev.map(e => e.id === id ? updated : e))} toast={toast} courses={courses} classesByCourse={classesByCourse} />}
      {modal && typeof modal === "object" && modal.type === "cancel" && <CancelModal enrollment={modal.data} onClose={() => setModal(null)} onDelete={(id) => { setEnrollments(prev => prev.map(e => e.id === id ? { ...e, status: "CANCELLED" } : e)); setSelected(null); }} toast={toast} />}

      {/* Top Header */}
      <div style={{ background: "#04040a", borderBottom: "1px solid #1a1a2e", padding: "16px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#4F46E5", boxShadow: "0 0 10px #4F46E5" }} />
          <div>
            <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 18, fontWeight: 800, color: "#F1F5F9", lineHeight: 1 }}>Enrollment Service</h1>
            <p style={{ color: "#374151", fontSize: 10, letterSpacing: 1, marginTop: 2 }}>LMS · Admin Dashboard</p>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setModal("bulk")} className="act-btn" style={{ padding: "8px 14px" }}>⊞ Bulk Enroll</button>
          <button onClick={() => setModal("enroll")} style={{ background: "#4F46E5", border: "none", borderRadius: 8, padding: "8px 18px", color: "#fff", fontSize: 12, fontFamily: "'DM Mono', monospace", cursor: "pointer" }}>＋ Enroll Student</button>
        </div>
      </div>

      {catalogLoadError && (
        <div style={{ margin: "0 28px 12px", background: "#451a03", border: "1px solid #F59E0B40", borderRadius: 8, padding: "12px 16px" }}>
          <p style={{ color: "#FCD34D", fontSize: 12, fontFamily: "'DM Mono', monospace" }}>⚠ {catalogLoadError}</p>
        </div>
      )}

      {/* Stat Cards */}
      <div style={{ display: "flex", gap: 12, padding: "18px 28px", flexShrink: 0 }}>
        <StatCard label="ACTIVE" value={stats.active} sub="currently enrolled" color="#22C55E" />
        <StatCard label="PENDING" value={stats.pending} sub="awaiting payment" color="#F59E0B" />
        <StatCard label="WAITLISTED" value={stats.waitlisted} sub="queued for seats" color="#A855F7" />
        <StatCard label="COMPLETED" value={stats.completed} sub="finished courses" color="#3B82F6" />
        <StatCard label="TOTAL" value={enrollments.length} sub="all time enrollments" />
      </div>

      {/* View Tabs */}
      <div style={{ display: "flex", gap: 0, padding: "0 28px", borderBottom: "1px solid #1a1a2e", flexShrink: 0 }}>
        {[["enrollments", "All Enrollments"], ["waitlist", "Waitlist"], ["courses", "By Course"]].map(([v, l]) => (
          <button key={v} onClick={() => { setView(v); setSelected(null); }} style={{ padding: "12px 20px", background: "none", border: "none", borderBottom: `2px solid ${view === v ? "#4F46E5" : "transparent"}`, color: view === v ? "#A5B4FC" : "#374151", fontSize: 12, fontFamily: "'DM Mono', monospace", cursor: "pointer" }}>{l}</button>
        ))}
      </div>

      {/* Body */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        <div style={{ flex: 1, overflow: "auto", padding: "20px 28px" }}>

          {view === "enrollments" && (
            <>
              {loadError && (
                <div style={{ background: "#2d0a0a", border: "1px solid #EF444440", borderRadius: 8, padding: "12px 16px", marginBottom: 16 }}>
                  <p style={{ color: "#FCA5A5", fontSize: 12 }}>{loadError}</p>
                  <button onClick={refetchEnrollments} style={{ marginTop: 8, padding: "6px 12px", background: "#1a1a2e", border: "1px solid #374151", borderRadius: 6, color: "#E2E8F0", fontSize: 11, cursor: "pointer" }}>Retry</button>
                </div>
              )}
              {/* Filters */}
              <div style={{ display: "flex", gap: 10, marginBottom: 16, alignItems: "center", flexWrap: "wrap" }}>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search student or course..." style={{ background: "#0d0d14", border: "1px solid #1a1a2e", borderRadius: 7, padding: "8px 14px", color: "#E2E8F0", fontSize: 12, fontFamily: "'DM Mono', monospace", outline: "none", width: 240 }} />
                <div style={{ display: "flex", gap: 6 }}>
                  {["ALL", "ACTIVE", "PENDING", "COMPLETED", "SUSPENDED", "DROPPED", "CANCELLED"].map(s => (
                    <button key={s} onClick={() => setFilter(s)} style={{ background: filter === s ? "#1a1a2e" : "transparent", border: `1px solid ${filter === s ? "#374151" : "#111"}`, borderRadius: 6, padding: "5px 12px", color: filter === s ? (STATUS_CONFIG[s]?.color || "#F1F5F9") : "#374151", fontSize: 10, fontFamily: "'DM Mono', monospace", cursor: "pointer" }}>{s}</button>
                  ))}
                </div>
                <span style={{ marginLeft: "auto", color: "#374151", fontSize: 11 }}>{filtered.length} records</span>
              </div>

              {/* Table */}
              <div style={{ background: "#0a0a12", border: "1px solid #1a1a2e", borderRadius: 10, overflow: "hidden" }}>
                <div style={{ display: "grid", gridTemplateColumns: "2fr 2fr 1fr 1fr 100px 90px 100px", padding: "10px 16px", borderBottom: "1px solid #1a1a2e", background: "#07070f" }}>
                  {["STUDENT", "COURSE", "CLASS", "PROGRESS", "STATUS", "PAYMENT", "ACTIONS"].map(h => (
                    <span key={h} style={{ color: "#374151", fontSize: 9, letterSpacing: 2 }}>{h}</span>
                  ))}
                </div>
                {loading && (
                  <div style={{ padding: "40px", textAlign: "center" }}>
                    <p style={{ color: "#4B5563", fontSize: 13 }}>Loading enrollments...</p>
                  </div>
                )}
                {!loading && filtered.length === 0 && (
                  <div style={{ padding: "40px", textAlign: "center" }}>
                    <p style={{ color: "#374151", fontSize: 13 }}>No enrollments found</p>
                  </div>
                )}
                {!loading && filtered.map((e) => (
                  <div key={e.id} className="row-hover" onClick={() => setSelected(selected?.id === e.id ? null : e)}
                    style={{ display: "grid", gridTemplateColumns: "2fr 2fr 1fr 1fr 100px 90px 100px", padding: "12px 16px", borderBottom: "1px solid #0d0d16", background: selected?.id === e.id ? "#0d0d18" : "transparent", alignItems: "center", gap: 8 }}>
                    <div>
                      <p style={{ color: "#E2E8F0", fontSize: 12, marginBottom: 2 }}>{e.studentName}</p>
                      <p style={{ color: "#374151", fontSize: 10 }}>{e.studentEmail}</p>
                    </div>
                    <div>
                      <p style={{ color: "#9CA3AF", fontSize: 11, marginBottom: 2 }}>{e.courseName}</p>
                      <p style={{ color: "#374151", fontSize: 10 }}>{e.instructor}</p>
                    </div>
                    <p style={{ color: "#4B5563", fontSize: 10, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{(e.classLabel || "").split("—")[0]}</p>
                    <ProgressBar value={e.progress} />
                    <Badge status={e.status} />
                    <Badge status={e.paymentStatus} type="payment" />
                    <div style={{ display: "flex", gap: 5 }} onClick={ev => ev.stopPropagation()}>
                      <button className="act-btn" onClick={() => setModal({ type: "status", data: e })} title="Update Status">⇄</button>
                      <button className="act-btn" onClick={() => setModal({ type: "cancel", data: e })} title="Cancel" style={{ color: "#7f1d1d" }}>✕</button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {view === "waitlist" && (
            <>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <p style={{ color: "#374151", fontSize: 11 }}>createWaitlistEntry() · getWaitlistPosition() · removeFromWaitlist()</p>
              </div>
              <div style={{ background: "#0a0a12", border: "1px solid #1a1a2e", borderRadius: 10, overflow: "hidden" }}>
                <div style={{ display: "grid", gridTemplateColumns: "40px 2fr 2fr 80px 100px 120px 100px", padding: "10px 16px", borderBottom: "1px solid #1a1a2e", background: "#07070f" }}>
                  {["POS", "STUDENT", "COURSE / CLASS", "HOLD", "AMOUNT", "JOINED", "ACTIONS"].map(h => (
                    <span key={h} style={{ color: "#374151", fontSize: 9, letterSpacing: 2 }}>{h}</span>
                  ))}
                </div>
                {waitlist.map(w => (
                  <div key={w.id} className="row-hover" style={{ display: "grid", gridTemplateColumns: "40px 2fr 2fr 80px 100px 120px 100px", padding: "14px 16px", borderBottom: "1px solid #0d0d16", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#1a1a2e", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ color: "#A855F7", fontSize: 12, fontWeight: 700 }}>#{w.position}</span>
                    </div>
                    <div>
                      <p style={{ color: "#E2E8F0", fontSize: 12, marginBottom: 2 }}>{w.studentName}</p>
                      <p style={{ color: "#374151", fontSize: 10 }}>{w.studentEmail}</p>
                    </div>
                    <div>
                      <p style={{ color: "#9CA3AF", fontSize: 11, marginBottom: 2 }}>{w.courseName}</p>
                      <p style={{ color: "#374151", fontSize: 10 }}>{w.classLabel.split("—")[0]}</p>
                    </div>
                    <span style={{ color: w.holdPayment ? "#4ADE80" : "#374151", fontSize: 11 }}>{w.holdPayment ? "✓ Hold" : "No hold"}</span>
                    <span style={{ color: "#9CA3AF", fontSize: 11 }}>{w.holdAmount ? `$${w.holdAmount}` : "—"}</span>
                    <div>
                      <p style={{ color: "#9CA3AF", fontSize: 11 }}>{w.joinedAt}</p>
                      <p style={{ color: "#4B5563", fontSize: 10 }}>~{w.estimatedDays} days wait</p>
                    </div>
                    <div style={{ display: "flex", gap: 5 }}>
                      <button className="act-btn" onClick={() => { toast("✅ Student promoted from waitlist to enrollment"); setWaitlist(prev => prev.filter(x => x.id !== w.id)); }} title="Promote">↑ Enroll</button>
                      <button className="act-btn" onClick={() => { toast("🗑 Removed from waitlist"); setWaitlist(prev => prev.filter(x => x.id !== w.id)); }} style={{ color: "#7f1d1d" }} title="Remove">✕</button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {view === "courses" && (
            <>
              <p style={{ color: "#374151", fontSize: 11, marginBottom: 16 }}>getEnrollmentsByCourse() — enrollment summary per course</p>
              {courses.length === 0 ? (
                <div style={{ background: "#1a1a2e", border: "1px solid #374151", borderRadius: 10, padding: "24px", color: "#9CA3AF", fontSize: 13, fontFamily: "'DM Mono', monospace" }}>
                  No courses in catalog. Load courses by ensuring the course service is running (e.g. http://localhost:8081).
                </div>
              ) : (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                {courses.map(course => {
                  const courseEnrollments = enrollments.filter(e => e.courseId === course.id);
                  const active = courseEnrollments.filter(e => e.status === "ACTIVE").length;
                  const avgProgress = courseEnrollments.length ? Math.round(courseEnrollments.reduce((s, e) => s + e.progress, 0) / courseEnrollments.length) : 0;
                  const revenue = courseEnrollments.filter(e => e.paymentStatus === "PAID").reduce((s, e) => s + e.paymentAmount, 0);
                  return (
                    <div key={course.id} style={{ background: "#0a0a12", border: "1px solid #1a1a2e", borderRadius: 10, padding: "18px 20px" }}>
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
                        <div>
                          <p style={{ color: "#F1F5F9", fontSize: 14, fontFamily: "'Fraunces', serif", fontWeight: 700, marginBottom: 3 }}>{course.title}</p>
                          <p style={{ color: "#374151", fontSize: 11 }}>
                            {("instructor" in course ? String(course.instructor) : (course.courseCode || "Course"))}
                            {" · "}
                            {("duration" in course ? String(course.duration) : (course.status || "Active"))}
                          </p>
                        </div>
                        <span style={{ background: "#1a1a2e", borderRadius: 5, padding: "3px 10px", color: "#6B7280", fontSize: 10 }}>
                          {"category" in course ? String(course.category) : (course.status || "N/A")}
                        </span>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 14 }}>
                        {[["Total", courseEnrollments.length], ["Active", active], ["Revenue", `$${revenue}`]].map(([k, v]) => (
                          <div key={k} style={{ background: "#07070f", borderRadius: 7, padding: "8px 10px" }}>
                            <p style={{ color: "#374151", fontSize: 9, letterSpacing: 1, marginBottom: 3 }}>{k}</p>
                            <p style={{ color: "#E2E8F0", fontSize: 15, fontFamily: "'Fraunces', serif", fontWeight: 700 }}>{v}</p>
                          </div>
                        ))}
                      </div>
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                          <span style={{ color: "#374151", fontSize: 10 }}>Avg. Progress</span>
                          <span style={{ color: "#9CA3AF", fontSize: 10 }}>{avgProgress}%</span>
                        </div>
                        <ProgressBar value={avgProgress} />
                      </div>
                      <div style={{ marginTop: 12, display: "flex", gap: 5, flexWrap: "wrap" }}>
                        {Object.entries(STATUS_CONFIG).map(([s, cfg]) => {
                          const count = courseEnrollments.filter(e => e.status === s).length;
                          if (count === 0) return null;
                          return <span key={s} style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}30`, borderRadius: 4, padding: "2px 8px", fontSize: 10 }}>{s}: {count}</span>;
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
              )}
            </>
          )}
        </div>

        {/* Detail Panel */}
        {selected && (
          <DetailPanel
            enrollment={selected}
            onClose={() => setSelected(null)}
            onStatusModal={(e) => setModal({ type: "status", data: e })}
            onTransfer={(e) => setModal({ type: "transfer", data: e })}
            onExtend={(e) => setModal({ type: "extend", data: e })}
            onCancel={(e) => setModal({ type: "cancel", data: e })}
            courses={courses}
          />
        )}
      </div>
    </div>
  );
}