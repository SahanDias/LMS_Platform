import { useState, useEffect, useRef } from "react";

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

// ─── DonutChart ──────────────────────────────────────────────
function DonutChart({ segments }) {
  const total = segments.reduce((s, g) => s + g.value, 0);
  const colors = ["#e8ff47", "#00d4ff", "#ff6b35"];
  const r = 70, cx = 90, cy = 90, stroke = 22;
  const circ = 2 * Math.PI * r;

  let offset = 0;
  const arcs = segments.map((seg, i) => {
    const pct = seg.value / total;
    const dash = pct * circ;
    const arc = { pct, dash, offset, color: colors[i], label: seg.label, value: seg.value };
    offset += dash;
    return arc;
  });

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "28px" }}>
      <svg width="180" height="180" viewBox="0 0 180 180">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1e2433" strokeWidth={stroke} />
        {arcs.map((a, i) => (
          <circle
            key={i}
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={a.color}
            strokeWidth={stroke}
            strokeDasharray={`${a.dash} ${circ - a.dash}`}
            strokeDashoffset={-a.offset + circ * 0.25}
            style={{ transition: "stroke-dasharray 1s ease" }}
          />
        ))}
        <text x={cx} y={cy - 8} textAnchor="middle" fill="#ffffff" fontSize="22" fontWeight="700" fontFamily="'DM Mono', monospace">{total}</text>
        <text x={cx} y={cy + 12} textAnchor="middle" fill="#6b7a9a" fontSize="10" fontFamily="'DM Mono', monospace">STUDENTS</text>
      </svg>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {arcs.map((a, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "10px", height: "10px", borderRadius: "2px", background: a.color, flexShrink: 0 }} />
            <div>
              <div style={{ color: "#c8d0e8", fontSize: "12px", fontFamily: "'DM Mono', monospace", lineHeight: 1 }}>{a.label}</div>
              <div style={{ color: a.color, fontSize: "18px", fontWeight: "700", fontFamily: "'DM Mono', monospace" }}>{a.value}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── EnrollmentBar ───────────────────────────────────────────
function EnrollmentBar({ course, max }) {
  const pct = (course.enrolled / max) * 100;
  const catColors = { Frontend: "#e8ff47", Backend: "#00d4ff", Design: "#ff6b35", Data: "#a78bfa", DevOps: "#34d399" };
  const color = catColors[course.category] || "#6b7a9a";
  return (
    <div style={{ marginBottom: "14px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "5px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ color: "#c8d0e8", fontSize: "13px", fontFamily: "'DM Mono', monospace" }}>{course.title}</span>
          <span style={{ background: color + "22", color: color, fontSize: "10px", padding: "2px 7px", borderRadius: "3px", fontFamily: "'DM Mono', monospace", border: `1px solid ${color}44` }}>{course.category}</span>
        </div>
        <span style={{ color: color, fontSize: "13px", fontFamily: "'DM Mono', monospace", fontWeight: "700" }}>{course.enrolled}</span>
      </div>
      <div style={{ height: "5px", background: "#1e2433", borderRadius: "3px", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: "3px", transition: "width 1s ease" }} />
      </div>
    </div>
  );
}

// ─── StatCard ────────────────────────────────────────────────
function StatCard({ icon, value, label, accent }) {
  return (
    <div style={{
      background: "#111827",
      border: "1px solid #1e2a3d",
      borderRadius: "10px",
      padding: "18px 20px",
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      position: "relative",
      overflow: "hidden",
      transition: "border-color 0.2s",
    }}
      onMouseEnter={e => e.currentTarget.style.borderColor = accent || "#e8ff4766"}
      onMouseLeave={e => e.currentTarget.style.borderColor = "#1e2a3d"}
    >
      <div style={{ fontSize: "22px" }}>{icon}</div>
      <div style={{ color: accent || "#e8ff47", fontSize: "26px", fontWeight: "700", fontFamily: "'DM Mono', monospace", lineHeight: 1 }}>{value.toLocaleString()}</div>
      <div style={{ color: "#6b7a9a", fontSize: "11px", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</div>
      <div style={{ position: "absolute", top: 0, right: 0, width: "60px", height: "60px", background: (accent || "#e8ff47") + "08", borderRadius: "0 10px 0 60px" }} />
    </div>
  );
}

// ─── StatusBadge ─────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    active: { bg: "#00d4ff18", color: "#00d4ff", label: "Active", dot: "#00d4ff" },
    draft: { bg: "#f59e0b18", color: "#f59e0b", label: "Draft", dot: "#f59e0b" },
    archived: { bg: "#6b7a9a18", color: "#6b7a9a", label: "Archived", dot: "#6b7a9a" },
  };
  const s = map[status] || map.archived;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", background: s.bg, color: s.color, fontSize: "11px", padding: "3px 9px", borderRadius: "20px", fontFamily: "'DM Mono', monospace", border: `1px solid ${s.dot}33` }}>
      <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: s.dot, display: "inline-block" }} />
      {s.label}
    </span>
  );
}

// ─── Main Component ──────────────────────────────────────────
export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  const totalEnrolled = COURSES.reduce((s, c) => s + c.enrolled, 0);
  const totalCompleted = COURSES.reduce((s, c) => s + c.completed, 0);
  const totalInProgress = COURSES.reduce((s, c) => s + c.inProgress, 0);
  const totalNearCompletion = COURSES.reduce((s, c) => s + c.nearCompletion, 0);
  const certIssued = COURSES.filter(c => c.certificateAvailable).reduce((s, c) => s + c.completed, 0);
  const statusCounts = {
    active: COURSES.filter(c => c.status === "active").length,
    draft: COURSES.filter(c => c.status === "draft").length,
    archived: COURSES.filter(c => c.status === "archived").length,
  };
  const maxEnrolled = Math.max(...COURSES.map(c => c.enrolled));

  const stats = [
    { icon: "📚", value: COURSES.length, label: "Total Courses", accent: "#e8ff47" },
    { icon: "📝", value: QUIZZES.length, label: "Total Quizzes", accent: "#a78bfa" },
    { icon: "✅", value: statusCounts.active, label: "Active Courses", accent: "#00d4ff" },
    { icon: "👥", value: totalEnrolled, label: "Enrolled Students", accent: "#34d399" },
    { icon: "🎓", value: totalCompleted, label: "Completions", accent: "#e8ff47" },
    { icon: "⏳", value: totalInProgress, label: "In Progress", accent: "#00d4ff" },
    { icon: "🔥", value: totalNearCompletion, label: "Near Completion", accent: "#ff6b35" },
    { icon: "🏅", value: certIssued, label: "Certificates Issued", accent: "#f59e0b" },
  ];

  const tabs = ["overview", "courses", "quizzes"];

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0e1a",
      color: "#c8d0e8",
      fontFamily: "'DM Mono', monospace",
      padding: "0",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Syne:wght@600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; } 
        ::-webkit-scrollbar-track { background: #0a0e1a; }
        ::-webkit-scrollbar-thumb { background: #1e2a3d; border-radius: 3px; }
        table { border-collapse: collapse; width: 100%; }
        th { text-align: left; }
        tr:hover td { background: #111827 !important; }
      `}</style>

      {/* Header */}
      <div style={{ borderBottom: "1px solid #1e2a3d", padding: "20px 36px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#0a0e1a" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{ width: "36px", height: "36px", background: "#e8ff47", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>⚡</div>
          <div>
            <div style={{ color: "#ffffff", fontSize: "16px", fontFamily: "'Syne', sans-serif", fontWeight: "800", letterSpacing: "-0.02em" }}>EduAdmin</div>
            <div style={{ color: "#6b7a9a", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase" }}>Learning Platform</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#34d399", animation: "pulse 2s infinite" }} />
          <span style={{ color: "#34d399", fontSize: "11px", letterSpacing: "0.05em" }}>System Online</span>
        </div>
      </div>

      <div style={{ padding: "32px 36px" }}>
        {/* Page title */}
        <div style={{ marginBottom: "28px" }}>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "28px", fontWeight: "800", color: "#ffffff", letterSpacing: "-0.03em" }}>
            Admin Dashboard
          </h1>
          <p style={{ color: "#6b7a9a", fontSize: "12px", marginTop: "4px" }}>Platform analytics & course management</p>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "4px", marginBottom: "28px", background: "#111827", padding: "4px", borderRadius: "10px", width: "fit-content", border: "1px solid #1e2a3d" }}>
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "8px 22px",
                borderRadius: "7px",
                border: "none",
                cursor: "pointer",
                fontFamily: "'DM Mono', monospace",
                fontSize: "12px",
                textTransform: "uppercase",
                letterSpacing: "0.07em",
                fontWeight: "500",
                transition: "all 0.2s",
                background: activeTab === tab ? "#e8ff47" : "transparent",
                color: activeTab === tab ? "#0a0e1a" : "#6b7a9a",
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div>
            {/* Stats Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "12px", marginBottom: "28px" }}>
              {stats.map((s, i) => <StatCard key={i} {...s} />)}
            </div>

            {/* Charts Row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              {/* Enrollment Chart */}
              <div style={{ background: "#111827", border: "1px solid #1e2a3d", borderRadius: "12px", padding: "24px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
                  <div>
                    <h3 style={{ color: "#ffffff", fontFamily: "'Syne', sans-serif", fontWeight: "700", fontSize: "14px" }}>Enrollment by Course</h3>
                    <p style={{ color: "#6b7a9a", fontSize: "11px", marginTop: "2px" }}>Total students enrolled</p>
                  </div>
                  <span style={{ color: "#e8ff47", fontSize: "20px", fontFamily: "'DM Mono', monospace", fontWeight: "700" }}>{totalEnrolled.toLocaleString()}</span>
                </div>
                {COURSES.map(c => <EnrollmentBar key={c.id} course={c} max={maxEnrolled} />)}
              </div>

              {/* Donut Chart */}
              <div style={{ background: "#111827", border: "1px solid #1e2a3d", borderRadius: "12px", padding: "24px" }}>
                <div style={{ marginBottom: "20px" }}>
                  <h3 style={{ color: "#ffffff", fontFamily: "'Syne', sans-serif", fontWeight: "700", fontSize: "14px" }}>Progress Breakdown</h3>
                  <p style={{ color: "#6b7a9a", fontSize: "11px", marginTop: "2px" }}>Student completion stages</p>
                </div>
                <DonutChart
                  segments={[
                    { value: totalCompleted, label: "Completed" },
                    { value: totalInProgress, label: "In Progress" },
                    { value: totalNearCompletion, label: "Near Completion" },
                  ]}
                />

                {/* Course Status Summary */}
                <div style={{ display: "flex", gap: "12px", marginTop: "24px", paddingTop: "20px", borderTop: "1px solid #1e2a3d" }}>
                  {[
                    { label: "Active", count: statusCounts.active, color: "#00d4ff" },
                    { label: "Draft", count: statusCounts.draft, color: "#f59e0b" },
                    { label: "Archived", count: statusCounts.archived, color: "#6b7a9a" },
                  ].map((s, i) => (
                    <div key={i} style={{ flex: 1, textAlign: "center", background: "#0a0e1a", borderRadius: "8px", padding: "12px", border: `1px solid ${s.color}33` }}>
                      <div style={{ color: s.color, fontSize: "22px", fontWeight: "700", fontFamily: "'DM Mono', monospace" }}>{s.count}</div>
                      <div style={{ color: "#6b7a9a", fontSize: "10px", marginTop: "2px", textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* COURSES TAB */}
        {activeTab === "courses" && (
          <div style={{ background: "#111827", border: "1px solid #1e2a3d", borderRadius: "12px", overflow: "hidden" }}>
            <div style={{ padding: "20px 24px", borderBottom: "1px solid #1e2a3d", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <h3 style={{ color: "#ffffff", fontFamily: "'Syne', sans-serif", fontWeight: "700", fontSize: "14px" }}>Course Library</h3>
                <p style={{ color: "#6b7a9a", fontSize: "11px", marginTop: "2px" }}>{COURSES.length} courses total</p>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                {["active", "draft", "archived"].map(s => (
                  <span key={s} style={{ fontSize: "11px", color: "#6b7a9a", fontFamily: "'DM Mono', monospace" }}>
                    {statusCounts[s]} {s}
                  </span>
                ))}
              </div>
            </div>
            <table>
              <thead>
                <tr style={{ borderBottom: "1px solid #1e2a3d" }}>
                  {["Course", "Category", "Duration", "Lessons", "Enrolled", "Completed", "In Progress", "Near Done", "Status", "Cert"].map(h => (
                    <th key={h} style={{ padding: "12px 16px", color: "#6b7a9a", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: "500", background: "#0a0e1a" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COURSES.map((c, i) => {
                  const catColors = { Frontend: "#e8ff47", Backend: "#00d4ff", Design: "#ff6b35", Data: "#a78bfa", DevOps: "#34d399" };
                  const cc = catColors[c.category] || "#6b7a9a";
                  return (
                    <tr key={c.id} style={{ borderBottom: "1px solid #1e2a3d" }}>
                      <td style={{ padding: "14px 16px", color: "#ffffff", fontSize: "13px", fontWeight: "500" }}>{c.title}</td>
                      <td style={{ padding: "14px 16px" }}>
                        <span style={{ color: cc, fontSize: "11px", background: cc + "15", padding: "3px 8px", borderRadius: "4px", border: `1px solid ${cc}33` }}>{c.category}</span>
                      </td>
                      <td style={{ padding: "14px 16px", color: "#6b7a9a", fontSize: "12px" }}>{c.duration}</td>
                      <td style={{ padding: "14px 16px", color: "#c8d0e8", fontSize: "12px" }}>{c.lessons}</td>
                      <td style={{ padding: "14px 16px", color: "#e8ff47", fontSize: "13px", fontWeight: "700" }}>{c.enrolled}</td>
                      <td style={{ padding: "14px 16px", color: "#34d399", fontSize: "13px" }}>{c.completed}</td>
                      <td style={{ padding: "14px 16px", color: "#00d4ff", fontSize: "13px" }}>{c.inProgress}</td>
                      <td style={{ padding: "14px 16px", color: "#ff6b35", fontSize: "13px" }}>{c.nearCompletion}</td>
                      <td style={{ padding: "14px 16px" }}><StatusBadge status={c.status} /></td>
                      <td style={{ padding: "14px 16px", textAlign: "center", color: c.certificateAvailable ? "#f59e0b" : "#2a3245", fontSize: "16px" }}>
                        {c.certificateAvailable ? "🏅" : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* QUIZZES TAB */}
        {activeTab === "quizzes" && (
          <div style={{ background: "#111827", border: "1px solid #1e2a3d", borderRadius: "12px", overflow: "hidden" }}>
            <div style={{ padding: "20px 24px", borderBottom: "1px solid #1e2a3d", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <h3 style={{ color: "#ffffff", fontFamily: "'Syne', sans-serif", fontWeight: "700", fontSize: "14px" }}>Quiz Registry</h3>
                <p style={{ color: "#6b7a9a", fontSize: "11px", marginTop: "2px" }}>{QUIZZES.length} quizzes across all courses</p>
              </div>
              <div style={{ display: "flex", gap: "12px" }}>
                <span style={{ fontSize: "11px", color: "#00d4ff" }}>{QUIZZES.filter(q => q.status === "active").length} active</span>
                <span style={{ fontSize: "11px", color: "#f59e0b" }}>{QUIZZES.filter(q => q.status === "draft").length} draft</span>
              </div>
            </div>
            <div style={{ padding: "8px 0" }}>
              {QUIZZES.map((q) => {
                const course = COURSES.find(c => c.id === q.courseId);
                const catColors = { Frontend: "#e8ff47", Backend: "#00d4ff", Design: "#ff6b35", Data: "#a78bfa", DevOps: "#34d399" };
                const cc = course ? (catColors[course.category] || "#6b7a9a") : "#6b7a9a";
                return (
                  <div key={q.id} style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "14px 24px",
                    borderBottom: "1px solid #1e2a3d",
                    gap: "16px",
                    transition: "background 0.15s",
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = "#0a0e1a"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <div style={{ width: "36px", height: "36px", background: cc + "18", border: `1px solid ${cc}44`, borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", flexShrink: 0 }}>📝</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: "#ffffff", fontSize: "13px", fontWeight: "500" }}>{q.title}</div>
                      <div style={{ color: "#6b7a9a", fontSize: "11px", marginTop: "2px" }}>
                        {course ? (
                          <span>
                            <span style={{ color: cc }}>{course.title}</span>
                            <span style={{ margin: "0 6px", color: "#2a3245" }}>·</span>
                            <span>{course.category}</span>
                          </span>
                        ) : "—"}
                      </div>
                    </div>
                    <div style={{ textAlign: "center", marginRight: "12px" }}>
                      <div style={{ color: "#a78bfa", fontSize: "18px", fontWeight: "700", fontFamily: "'DM Mono', monospace" }}>{q.questions}</div>
                      <div style={{ color: "#6b7a9a", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Questions</div>
                    </div>
                    <StatusBadge status={q.status} />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
