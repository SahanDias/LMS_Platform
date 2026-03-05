import { useState } from "react";

const COURSES = [
  { id: 1, title: "React Fundamentals", category: "Frontend", duration: "8h", lessons: 24, enrolled: 312, completed: 198, inProgress: 89, nearCompletion: 25, status: "active", certificateAvailable: true },
  { id: 2, title: "Node.js & REST APIs", category: "Backend", duration: "10h", lessons: 30, enrolled: 245, completed: 134, inProgress: 76, nearCompletion: 35, status: "active", certificateAvailable: true },
  { id: 3, title: "UI/UX Design Principles", category: "Design", duration: "6h", lessons: 18, enrolled: 189, completed: 145, inProgress: 30, nearCompletion: 14, status: "active", certificateAvailable: true },
  { id: 4, title: "Python Data Science", category: "Data", duration: "12h", lessons: 36, enrolled: 278, completed: 89, inProgress: 120, nearCompletion: 69, status: "active", certificateAvailable: true },
  { id: 5, title: "Cloud Architecture", category: "DevOps", duration: "9h", lessons: 27, enrolled: 156, completed: 67, inProgress: 54, nearCompletion: 35, status: "draft", certificateAvailable: false },
  { id: 6, title: "GraphQL Mastery", category: "Backend", duration: "7h", lessons: 21, enrolled: 98, completed: 55, inProgress: 28, nearCompletion: 15, status: "archived", certificateAvailable: true },
];

const QUIZZES = [
  { id: 1, courseId: 1, title: "React Hooks Assessment", questions: 20, status: "active" },
  { id: 2, courseId: 1, title: "Component Lifecycle Quiz", questions: 15, status: "active" },
  { id: 3, courseId: 2, title: "REST API Design Quiz", questions: 25, status: "active" },
  { id: 4, courseId: 3, title: "Color Theory Basics", questions: 18, status: "active" },
  { id: 5, courseId: 4, title: "Pandas & NumPy Essentials", questions: 22, status: "draft" },
  { id: 6, courseId: 5, title: "AWS Services Overview", questions: 30, status: "draft" },
  { id: 7, courseId: 6, title: "GraphQL Schema Design", questions: 16, status: "active" },
];

const USER_PROGRESS = [
  { courseId: 1, progress: 100, completed: true, certificateIssued: true },
  { courseId: 2, progress: 72, completed: false, certificateIssued: false },
  { courseId: 3, progress: 100, completed: true, certificateIssued: false },
  { courseId: 4, progress: 45, completed: false, certificateIssued: false },
  { courseId: 5, progress: 0, completed: false, certificateIssued: false },
  { courseId: 6, progress: 88, completed: false, certificateIssued: false },
];

const CAT_COLORS = {
  Frontend: { bg: "#e8ff4715", color: "#e8ff47", border: "#e8ff4733" },
  Backend:  { bg: "#00d4ff15", color: "#00d4ff", border: "#00d4ff33" },
  Design:   { bg: "#ff6b3515", color: "#ff6b35", border: "#ff6b3533" },
  Data:     { bg: "#a78bfa15", color: "#a78bfa", border: "#a78bfa33" },
  DevOps:   { bg: "#34d39915", color: "#34d399", border: "#34d39933" },
};

const CAT_ICONS = {
  Frontend: "⚛️", Backend: "🔧", Design: "🎨", Data: "📊", DevOps: "☁️",
};

function ProgressRing({ pct, size = 52, stroke = 5, color = "#e8ff47" }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)", flexShrink: 0 }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#1e2a3d" strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color}
        strokeWidth={stroke} strokeLinecap="round"
        strokeDasharray={`${dash} ${circ - dash}`}
        style={{ transition: "stroke-dasharray 0.8s ease" }}
      />
      <text x={size/2} y={size/2} textAnchor="middle" dominantBaseline="central"
        fill={color} fontSize="11" fontWeight="700"
        fontFamily="'DM Mono', monospace"
        style={{ transform: "rotate(90deg)", transformOrigin: `${size/2}px ${size/2}px` }}>
        {pct}%
      </text>
    </svg>
  );
}

export default function UserDashboard({ onBack }) {
  const [activeTab, setActiveTab] = useState("courses");
  const [certModal, setCertModal] = useState(null);
  const [issuedCerts, setIssuedCerts] = useState(
    USER_PROGRESS.filter(p => p.certificateIssued).map(p => p.courseId)
  );

  function getProgress(courseId) {
    return USER_PROGRESS.find(p => p.courseId === courseId) || { progress: 0, completed: false, certificateIssued: false };
  }

  function openCertModal(course) {
    setCertModal({ course, alreadyIssued: issuedCerts.includes(course.id) });
  }

  function downloadCert() {
    if (!certModal) return;
    setIssuedCerts(prev => prev.includes(certModal.course.id) ? prev : [...prev, certModal.course.id]);
    const el = document.createElement("a");
    el.href = `data:text/plain;charset=utf-8,Certificate of Completion%0A%0AThis certifies that a student has successfully completed%0A${certModal.course.title}`;
    el.download = `certificate_${certModal.course.title.replace(/ /g, "_")}.txt`;
    el.click();
    setCertModal(null);
  }

  const activeQuizzes = QUIZZES.filter(q => q.status === "active");
  const completedCount = USER_PROGRESS.filter(p => p.completed).length;
  const avgProgress = Math.round(USER_PROGRESS.reduce((s, p) => s + p.progress, 0) / USER_PROGRESS.length);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0a0e1a", fontFamily: "'DM Mono', monospace", color: "#c8d0e8" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Syne:wght@600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #0a0e1a; }
        ::-webkit-scrollbar-thumb { background: #1e2a3d; border-radius: 3px; }
        .course-card:hover { border-color: #2a3a55 !important; transform: translateY(-1px); }
        .quiz-card:hover { border-color: #2a3a55 !important; background: #111827 !important; }
        .nav-btn:hover { background: #111827 !important; color: #c8d0e8 !important; }
        .cert-btn-active:hover { background: #c8d020 !important; }
        .back-btn:hover { background: #111827 !important; }
      `}</style>

      {/* Sidebar */}
      <aside style={{ width: "230px", background: "#0d1120", borderRight: "1px solid #1e2a3d", display: "flex", flexDirection: "column", padding: "24px 16px", gap: "6px", flexShrink: 0 }}>
        {/* Logo */}
        <div style={{ padding: "0 8px", marginBottom: "24px" }}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "22px", fontWeight: "800", color: "#fff", letterSpacing: "-0.03em" }}>
            Learn<span style={{ color: "#e8ff47" }}>.</span>
          </div>
          <div style={{ fontSize: "10px", color: "#6b7a9a", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: "2px" }}>Student Portal</div>
        </div>

        {/* Nav */}
        <div style={{ fontSize: "10px", color: "#6b7a9a", letterSpacing: "0.1em", textTransform: "uppercase", padding: "0 10px", marginBottom: "6px" }}>Navigation</div>
        {[
          { id: "courses", icon: "📚", label: "My Courses" },
          { id: "quizzes", icon: "📝", label: "Quizzes" },
        ].map(item => (
          <button key={item.id} className="nav-btn"
            onClick={() => setActiveTab(item.id)}
            style={{
              display: "flex", alignItems: "center", gap: "10px",
              padding: "10px 12px", borderRadius: "8px", border: "none", cursor: "pointer",
              fontFamily: "'DM Mono', monospace", fontSize: "12px", textAlign: "left", width: "100%",
              transition: "all 0.15s",
              background: activeTab === item.id ? "#e8ff47" : "transparent",
              color: activeTab === item.id ? "#0a0e1a" : "#6b7a9a",
              fontWeight: activeTab === item.id ? "500" : "400",
            }}>
            <span style={{ fontSize: "15px" }}>{item.icon}</span>
            {item.label}
          </button>
        ))}

        {/* Stats */}
        <div style={{ marginTop: "24px", padding: "16px", background: "#111827", borderRadius: "10px", border: "1px solid #1e2a3d" }}>
          <div style={{ fontSize: "10px", color: "#6b7a9a", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "12px" }}>Your Stats</div>
          {[
            { label: "Enrolled", val: USER_PROGRESS.length, color: "#00d4ff" },
            { label: "Completed", val: completedCount, color: "#34d399" },
            { label: "Certificates", val: issuedCerts.length, color: "#f59e0b" },
            { label: "Avg Progress", val: `${avgProgress}%`, color: "#a78bfa" },
          ].map(s => (
            <div key={s.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <span style={{ color: "#6b7a9a", fontSize: "11px" }}>{s.label}</span>
              <span style={{ color: s.color, fontWeight: "700", fontSize: "13px" }}>{s.val}</span>
            </div>
          ))}
        </div>

        <div style={{ flex: 1 }} />

        {/* Back button */}
        {onBack && (
          <button className="back-btn" onClick={onBack} style={{
            display: "flex", alignItems: "center", gap: "8px", padding: "10px 12px",
            borderRadius: "8px", border: "1px solid #1e2a3d", background: "transparent",
            color: "#6b7a9a", fontFamily: "'DM Mono', monospace", fontSize: "12px",
            cursor: "pointer", transition: "all 0.15s", width: "100%",
          }}>
            ← Back
          </button>
        )}
      </aside>

      {/* Main */}
      <main style={{ flex: 1, overflowY: "auto", padding: "32px 36px" }}>
        {/* Header */}
        <div style={{ marginBottom: "28px", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "26px", fontWeight: "800", color: "#fff", letterSpacing: "-0.03em" }}>
              {activeTab === "courses" ? "My Courses" : "Quizzes"}
            </h1>
            <p style={{ color: "#6b7a9a", fontSize: "12px", marginTop: "4px" }}>
              {activeTab === "courses" ? `${COURSES.length} courses in your learning path` : `${activeQuizzes.length} active quizzes available`}
            </p>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <div style={{ background: "#111827", border: "1px solid #1e2a3d", borderRadius: "8px", padding: "8px 16px", textAlign: "center" }}>
              <div style={{ color: "#34d399", fontSize: "18px", fontWeight: "700" }}>{completedCount}</div>
              <div style={{ color: "#6b7a9a", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Done</div>
            </div>
            <div style={{ background: "#111827", border: "1px solid #1e2a3d", borderRadius: "8px", padding: "8px 16px", textAlign: "center" }}>
              <div style={{ color: "#e8ff47", fontSize: "18px", fontWeight: "700" }}>{avgProgress}%</div>
              <div style={{ color: "#6b7a9a", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Avg</div>
            </div>
          </div>
        </div>

        {/* COURSES TAB */}
        {activeTab === "courses" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "16px" }}>
            {COURSES.map(course => {
              const prog = getProgress(course.id);
              const canDownload = prog.completed && course.certificateAvailable;
              const alreadyIssued = issuedCerts.includes(course.id);
              const cat = CAT_COLORS[course.category] || { bg: "#6b7a9a15", color: "#6b7a9a", border: "#6b7a9a33" };
              const catIcon = CAT_ICONS[course.category] || "📖";
              const progColor = prog.progress === 100 ? "#34d399" : prog.progress > 60 ? "#e8ff47" : prog.progress > 0 ? "#00d4ff" : "#6b7a9a";

              return (
                <div key={course.id} className="course-card" style={{
                  background: "#111827", border: "1px solid #1e2a3d", borderRadius: "14px",
                  padding: "20px", display: "flex", flexDirection: "column", gap: "16px",
                  transition: "all 0.2s", cursor: "default",
                }}>
                  {/* Top row */}
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                        <span style={{ fontSize: "18px" }}>{catIcon}</span>
                        <span style={{ background: cat.bg, color: cat.color, border: `1px solid ${cat.border}`, fontSize: "10px", padding: "2px 8px", borderRadius: "4px", letterSpacing: "0.05em" }}>
                          {course.category}
                        </span>
                        {prog.completed && (
                          <span style={{ background: "#34d39915", color: "#34d399", border: "1px solid #34d39933", fontSize: "10px", padding: "2px 8px", borderRadius: "4px" }}>
                            ✓ Done
                          </span>
                        )}
                      </div>
                      <h3 style={{ color: "#ffffff", fontFamily: "'Syne', sans-serif", fontSize: "15px", fontWeight: "700", lineHeight: 1.3 }}>{course.title}</h3>
                    </div>
                    <ProgressRing pct={prog.progress} color={progColor} />
                  </div>

                  {/* Meta */}
                  <div style={{ display: "flex", gap: "16px" }}>
                    {[
                      { icon: "⏱", val: course.duration },
                      { icon: "📖", val: `${course.lessons} lessons` },
                    ].map((m, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: "5px", color: "#6b7a9a", fontSize: "11px" }}>
                        <span>{m.icon}</span><span>{m.val}</span>
                      </div>
                    ))}
                  </div>

                  {/* Progress bar */}
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                      <span style={{ color: "#6b7a9a", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Progress</span>
                      <span style={{ color: progColor, fontSize: "11px", fontWeight: "700" }}>{prog.progress}%</span>
                    </div>
                    <div style={{ height: "4px", background: "#1e2a3d", borderRadius: "2px", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${prog.progress}%`, background: progColor, borderRadius: "2px", transition: "width 0.8s ease" }} />
                    </div>
                  </div>

                  {/* Certificate button */}
                  <button
                    className={canDownload ? "cert-btn-active" : ""}
                    onClick={() => canDownload && openCertModal(course)}
                    disabled={!canDownload}
                    style={{
                      padding: "10px", borderRadius: "8px", border: "none", cursor: canDownload ? "pointer" : "not-allowed",
                      fontFamily: "'DM Mono', monospace", fontSize: "11px", letterSpacing: "0.05em",
                      fontWeight: "500", textTransform: "uppercase", transition: "all 0.2s",
                      background: canDownload ? "#e8ff47" : "#1e2a3d",
                      color: canDownload ? "#0a0e1a" : "#6b7a9a",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                    }}>
                    {alreadyIssued && canDownload ? "🏅 Re-download Certificate"
                      : canDownload ? "🏅 Download Certificate"
                      : "🔒 Complete to Unlock"}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* QUIZZES TAB */}
        {activeTab === "quizzes" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {activeQuizzes.map(quiz => {
              const course = COURSES.find(c => c.id === quiz.courseId);
              const prog = course ? getProgress(course.id) : null;
              const cat = course ? (CAT_COLORS[course.category] || { bg: "#6b7a9a15", color: "#6b7a9a", border: "#6b7a9a33" }) : null;
              const progColor = prog ? (prog.progress === 100 ? "#34d399" : prog.progress > 60 ? "#e8ff47" : "#00d4ff") : "#6b7a9a";

              return (
                <div key={quiz.id} className="quiz-card" style={{
                  background: "#0d1120", border: "1px solid #1e2a3d", borderRadius: "12px",
                  padding: "18px 22px", display: "flex", alignItems: "center", gap: "18px",
                  transition: "all 0.15s",
                }}>
                  <div style={{ width: "44px", height: "44px", background: cat ? cat.bg : "#1e2a3d", border: `1px solid ${cat ? cat.border : "#1e2a3d"}`, borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", flexShrink: 0 }}>
                    📝
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ color: "#ffffff", fontSize: "14px", fontWeight: "500", marginBottom: "4px" }}>{quiz.title}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      {course && (
                        <span style={{ color: cat.color, fontSize: "11px", background: cat.bg, padding: "2px 8px", borderRadius: "4px", border: `1px solid ${cat.border}` }}>
                          {course.title}
                        </span>
                      )}
                      <span style={{ color: "#6b7a9a", fontSize: "11px" }}>{quiz.questions} questions</span>
                    </div>
                  </div>

                  {prog && (
                    <div style={{ textAlign: "center", marginRight: "8px" }}>
                      <div style={{ color: progColor, fontSize: "16px", fontWeight: "700" }}>{prog.progress}%</div>
                      <div style={{ color: "#6b7a9a", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Course</div>
                    </div>
                  )}

                  <button style={{
                    padding: "9px 20px", borderRadius: "8px",
                    border: "1px solid #00d4ff44", background: "#00d4ff12",
                    color: "#00d4ff", fontFamily: "'DM Mono', monospace", fontSize: "11px",
                    fontWeight: "500", cursor: "pointer", letterSpacing: "0.05em",
                    textTransform: "uppercase", transition: "all 0.15s", flexShrink: 0,
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = "#00d4ff22"; e.currentTarget.style.borderColor = "#00d4ff"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "#00d4ff12"; e.currentTarget.style.borderColor = "#00d4ff44"; }}
                  >
                    Start →
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Certificate Modal */}
      {certModal && (
        <div onClick={() => setCertModal(null)} style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 1000, backdropFilter: "blur(4px)",
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: "#111827", border: "1px solid #1e2a3d", borderRadius: "16px",
            padding: "32px", width: "380px", maxWidth: "90vw",
          }}>
            {/* Medal decoration */}
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <div style={{ fontSize: "52px", marginBottom: "8px" }}>🏅</div>
              <div style={{ color: "#e8ff47", fontFamily: "'Syne', sans-serif", fontSize: "18px", fontWeight: "800" }}>
                {certModal.alreadyIssued ? "Certificate Available" : "Congratulations!"}
              </div>
              <div style={{ color: "#6b7a9a", fontSize: "11px", marginTop: "4px" }}>
                {certModal.alreadyIssued ? "You've already earned this" : "You've completed this course"}
              </div>
            </div>

            {/* Course name */}
            <div style={{ background: "#0a0e1a", border: "1px solid #1e2a3d", borderRadius: "10px", padding: "16px", marginBottom: "20px", textAlign: "center" }}>
              <div style={{ color: "#6b7a9a", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" }}>Course</div>
              <div style={{ color: "#ffffff", fontFamily: "'Syne', sans-serif", fontSize: "16px", fontWeight: "700" }}>{certModal.course.title}</div>
            </div>

            {/* Buttons */}
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => setCertModal(null)} style={{
                flex: 1, padding: "12px", borderRadius: "8px",
                border: "1px solid #1e2a3d", background: "transparent",
                color: "#6b7a9a", fontFamily: "'DM Mono', monospace", fontSize: "12px",
                cursor: "pointer", transition: "all 0.15s",
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "#2a3a55"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "#1e2a3d"}
              >
                Cancel
              </button>
              <button onClick={downloadCert} style={{
                flex: 2, padding: "12px", borderRadius: "8px", border: "none",
                background: "#e8ff47", color: "#0a0e1a",
                fontFamily: "'DM Mono', monospace", fontSize: "12px", fontWeight: "500",
                cursor: "pointer", letterSpacing: "0.04em", transition: "background 0.15s",
              }}
                onMouseEnter={e => e.currentTarget.style.background = "#c8d020"}
                onMouseLeave={e => e.currentTarget.style.background = "#e8ff47"}
              >
                ⬇ Download Certificate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}