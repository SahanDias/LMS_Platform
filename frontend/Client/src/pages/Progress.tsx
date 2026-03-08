import { useState, useEffect, useCallback } from "react";
import { Award, BookOpen, CheckCircle, Clock, Download, Eye, FileText, RotateCcw, Star, Trophy, User, X, ChevronRight, Loader2, AlertCircle } from "lucide-react";
import Header from "@/components/Header";

// ─── DATA LAYER ─────────────────────────────────────────────────────────────

const MOCK_COURSES = [
  {
    id: "c1",
    title: "Introduction to React",
    description: "Master the fundamentals of React including hooks, state management, and component design patterns.",
    category: "Frontend",
    duration: "8 hours",
    lessons: [
      { id: "l1", title: "JSX & Components", content: "JSX is a syntax extension for JavaScript that looks similar to HTML. React components are the building blocks of any React application. A component can be a function or a class. Functional components are simpler and use hooks for state management." },
      { id: "l2", title: "State & Props", content: "State is data that can change over time and triggers re-renders. Props are read-only data passed from parent to child components. The useState hook allows functional components to manage local state. Props enable component reusability and composition." },
      { id: "l3", title: "Hooks Deep Dive", content: "React Hooks let you use state and other React features without writing a class. useEffect handles side effects like data fetching, subscriptions, and DOM manipulation. useContext provides a way to pass data through the component tree. Custom hooks encapsulate reusable logic." },
      { id: "l4", title: "Performance Optimization", content: "React.memo prevents unnecessary re-renders by memoizing components. useMemo caches expensive computations between renders. useCallback memoizes functions to maintain referential equality. Code splitting with React.lazy and Suspense reduces initial bundle size." },
    ],
    completed: true,
    completedDate: "2024-11-15",
    score: 94,
  },
  {
    id: "c2",
    title: "TypeScript Fundamentals",
    description: "Learn TypeScript from the ground up — types, interfaces, generics, and real-world integration.",
    category: "Language",
    duration: "6 hours",
    lessons: [
      { id: "l1", title: "Types & Interfaces", content: "TypeScript adds static typing to JavaScript. Types define the shape of data while interfaces describe object structures. Union types allow a variable to hold multiple types. Type aliases create new names for existing types." },
      { id: "l2", title: "Generics", content: "Generics allow you to create reusable components that work with different types. Type parameters act as placeholders for types that are specified when the generic is used. Constraints limit what types can be used with a generic. Generic functions and classes enable type-safe abstractions." },
      { id: "l3", title: "Advanced Patterns", content: "Utility types like Partial, Required, Pick, and Omit transform existing types. Mapped types create new types by iterating over properties. Conditional types select types based on conditions. Template literal types combine string literals to form new types." },
    ],
    completed: true,
    completedDate: "2024-12-02",
    score: 88,
  },
  {
    id: "c3",
    title: "Node.js & REST APIs",
    description: "Build scalable backend services with Node.js, Express, and RESTful API design principles.",
    category: "Backend",
    duration: "10 hours",
    lessons: [
      { id: "l1", title: "Node.js Basics", content: "Node.js is a JavaScript runtime built on Chrome's V8 engine. It uses an event-driven, non-blocking I/O model that makes it lightweight and efficient. The module system allows code organization and reuse. npm is the package manager for Node.js." },
      { id: "l2", title: "Express Framework", content: "Express is a minimal and flexible Node.js web application framework. Middleware functions handle requests in sequence. Routing defines how an application responds to client requests. Error handling middleware catches and processes errors." },
    ],
    completed: false,
    completedDate: null,
    score: null,
    progress: 45,
  },
  {
    id: "c4",
    title: "CSS & Modern Layouts",
    description: "From Flexbox to Grid — master every layout technique modern web design demands.",
    category: "Frontend",
    duration: "5 hours",
    lessons: [
      { id: "l1", title: "Flexbox Mastery", content: "Flexbox is a one-dimensional layout method for arranging items in rows or columns. The flex container uses display:flex. Flex items grow or shrink based on available space. Alignment properties control both main and cross axes." },
      { id: "l2", title: "CSS Grid", content: "CSS Grid Layout is a two-dimensional layout system for the web. Grid containers define rows and columns with grid-template. Grid items can span multiple tracks. Named grid areas create semantic, readable layouts." },
    ],
    completed: false,
    completedDate: null,
    score: null,
    progress: 20,
  },
];

const MOCK_QUIZZES = [
  {
    id: "q1", courseId: "c1", title: "React Fundamentals Quiz",
    questions: [
      { id: "qq1", text: "What hook is used to manage local state in functional components?", options: ["useRef", "useState", "useEffect", "useReducer"], correct: 1 },
      { id: "qq2", text: "Which method prevents unnecessary re-renders?", options: ["useMemo", "useCallback", "React.memo", "All of the above"], correct: 3 },
      { id: "qq3", text: "What does JSX stand for?", options: ["JavaScript XML", "Java Syntax Extension", "JavaScript Extended", "None of the above"], correct: 0 },
    ],
    passingScore: 70,
    attempts: [{ date: "2024-11-14", score: 94 }],
  },
  {
    id: "q2", courseId: "c2", title: "TypeScript Types Quiz",
    questions: [
      { id: "qq1", text: "What keyword defines a reusable type constraint?", options: ["interface", "type", "generic", "extends"], correct: 2 },
      { id: "qq2", text: "Which utility type makes all properties optional?", options: ["Required", "Readonly", "Partial", "Pick"], correct: 2 },
    ],
    passingScore: 70,
    attempts: [{ date: "2024-12-01", score: 88 }],
  },
];

const MOCK_USER = {
  id: "u1",
  name: "Alex Johnson",
  email: "alex.johnson@example.com",
  avatar: "AJ",
  joinDate: "2024-09-01",
  streak: 12,
  totalPoints: 1840,
};

// ─── SERVICE LAYER ────────────────────────────────────────────────────────────

class UserClient {
  constructor() { this._user = MOCK_USER; }
  async getUser() { return new Promise(r => setTimeout(() => r(this._user), 300)); }
  async updateUser(data) { this._user = { ...this._user, ...data }; return this._user; }
}

class ProgressService {
  constructor() {
    this._courses = MOCK_COURSES;
    this._quizzes = MOCK_QUIZZES;
  }

  async getCourses() {
    return new Promise(r => setTimeout(() => r([...this._courses]), 400));
  }

  async getCourseById(id) {
    return new Promise(r => setTimeout(() => r(this._courses.find(c => c.id === id) ?? null), 200));
  }

  async getCourseQueries() {
    const courses = await this.getCourses();
    return {
      completed: courses.filter(c => c.completed),
      inProgress: courses.filter(c => !c.completed && (c.progress ?? 0) > 0),
      notStarted: courses.filter(c => !c.completed && !(c.progress ?? 0)),
      totalCount: courses.length,
      completedCount: courses.filter(c => c.completed).length,
    };
  }

  async getQuizzes() {
    return new Promise(r => setTimeout(() => r([...this._quizzes]), 350));
  }

  async getQuizzesByCourse(courseId) {
    return new Promise(r =>
      setTimeout(() => r(this._quizzes.filter(q => q.courseId === courseId)), 200)
    );
  }

  async getCertificate(courseId) {
    const course = this._courses.find(c => c.id === courseId);
    if (!course?.completed) return null;
    return {
      id: `cert-${courseId}`,
      courseId,
      courseName: course.title,
      issueDate: course.completedDate,
      score: course.score,
      recipientName: MOCK_USER.name,
    };
  }

  async getAllCertificates() {
    const completed = this._courses.filter(c => c.completed);
    return completed.map(course => ({
      id: `cert-${course.id}`,
      courseId: course.id,
      courseName: course.title,
      issueDate: course.completedDate,
      score: course.score,
      recipientName: MOCK_USER.name,
    }));
  }
}

const userClient = new UserClient();
const progressService = new ProgressService();

// ─── DOCX GENERATOR (browser-side, no server needed) ─────────────────────────

function generateDocxBlob(course) {
  // Build a simple RTF-based "Word-compatible" document as a Blob
  // Real projects would use the `docx` npm library; here we create a valid RTF
  const date = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  let rtf = `{\\rtf1\\ansi\\deff0
{\\fonttbl{\\f0 Arial;}{\\f1 Georgia;}}
{\\colortbl;\\red30\\green64\\blue175;\\red80\\green80\\blue80;\\red240\\green245\\blue255;}
\\paperw12240\\paperh15840\\margl1440\\margr1440\\margt1440\\margb1440
{\\f1\\fs48\\b\\cf1 ${course.title}\\par}
\\par
{\\f0\\fs22\\cf2 Course Content Export \\emdash  Generated ${date}\\par}
\\par
{\\f0\\fs22\\cf2 Category: ${course.category} \\bullet  Duration: ${course.duration}\\par}
\\par
{\\f0\\fs22 ${course.description}\\par}
\\par
{\\f1\\fs32\\b\\cf1 Course Lessons\\par}
\\par
`;

  course.lessons.forEach((lesson, i) => {
    rtf += `{\\f0\\fs26\\b ${i + 1}. ${lesson.title}\\par}\\par`;
    rtf += `{\\f0\\fs22 ${lesson.content}\\par}\\par`;
  });

  if (course.completed) {
    rtf += `{\\f1\\fs28\\b\\cf1 Completion Summary\\par}\\par`;
    rtf += `{\\f0\\fs22 Completed: ${new Date(course.completedDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}\\par}`;
    rtf += `{\\f0\\fs22 Final Score: ${course.score}%\\par}`;
  }

  rtf += `}`;

  return new Blob([rtf], { type: "application/msword" });
}

function generateCertificateSVG(cert) {
  const issued = new Date(cert.issueDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 560" width="800" height="560">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#f0f5ff;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#e8f0fe;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#1e40af" />
      <stop offset="100%" style="stop-color:#3b82f6" />
    </linearGradient>
  </defs>
  <rect width="800" height="560" fill="url(#bg)" rx="16"/>
  <rect x="12" y="12" width="776" height="536" fill="none" stroke="#1e40af" stroke-width="2" rx="12" opacity="0.3"/>
  <rect x="24" y="24" width="752" height="512" fill="none" stroke="#93c5fd" stroke-width="1" rx="8" opacity="0.5"/>
  <rect x="0" y="0" width="800" height="8" fill="url(#accent)" rx="4"/>
  <rect x="0" y="552" width="800" height="8" fill="url(#accent)" rx="4"/>
  <text x="400" y="80" text-anchor="middle" font-family="Georgia, serif" font-size="13" fill="#6b7280" letter-spacing="6">CERTIFICATE OF COMPLETION</text>
  <line x1="200" y1="95" x2="600" y2="95" stroke="#93c5fd" stroke-width="1"/>
  <text x="400" y="160" text-anchor="middle" font-family="Georgia, serif" font-size="18" fill="#374151">This certifies that</text>
  <text x="400" y="220" text-anchor="middle" font-family="Georgia, serif" font-size="38" font-weight="bold" fill="#1e40af">${cert.recipientName}</text>
  <line x1="180" y1="238" x2="620" y2="238" stroke="#1e40af" stroke-width="1.5" opacity="0.4"/>
  <text x="400" y="280" text-anchor="middle" font-family="Georgia, serif" font-size="17" fill="#374151">has successfully completed the course</text>
  <text x="400" y="338" text-anchor="middle" font-family="Georgia, serif" font-size="28" font-weight="bold" fill="#1e3a8a">${cert.courseName}</text>
  <text x="400" y="390" text-anchor="middle" font-family="Georgia, serif" font-size="15" fill="#6b7280">with a score of</text>
  <text x="400" y="430" text-anchor="middle" font-family="Georgia, serif" font-size="46" font-weight="bold" fill="#1e40af">${cert.score}%</text>
  <line x1="120" y1="490" x2="340" y2="490" stroke="#374151" stroke-width="1.5"/>
  <line x1="460" y1="490" x2="680" y2="490" stroke="#374151" stroke-width="1.5"/>
  <text x="230" y="510" text-anchor="middle" font-family="Georgia, serif" font-size="13" fill="#6b7280">Date Issued</text>
  <text x="570" y="510" text-anchor="middle" font-family="Georgia, serif" font-size="13" fill="#6b7280">Certificate ID</text>
  <text x="230" y="528" text-anchor="middle" font-family="Georgia, serif" font-size="12" fill="#374151">${issued}</text>
  <text x="570" y="528" text-anchor="middle" font-family="Georgia, serif" font-size="12" fill="#374151">${cert.id.toUpperCase()}</text>
  <circle cx="400" cy="490" r="22" fill="#1e40af" opacity="0.08"/>
  <text x="400" y="497" text-anchor="middle" font-family="Arial" font-size="20">🏆</text>
</svg>`;
  return new Blob([svg], { type: "image/svg+xml" });
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

const Badge = ({ children, color = "blue" }) => {
  const colors = {
    blue: "bg-blue-100 text-blue-700",
    green: "bg-green-100 text-green-700",
    amber: "bg-amber-100 text-amber-700",
    slate: "bg-slate-100 text-slate-600",
    purple: "bg-purple-100 text-purple-700",
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${colors[color]}`}>
      {children}
    </span>
  );
};

const ScoreRing = ({ score }) => {
  const r = 26, circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const color = score >= 90 ? "#22c55e" : score >= 75 ? "#3b82f6" : "#f59e0b";
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" className="rotate-[-90deg]">
      <circle cx="32" cy="32" r={r} fill="none" stroke="#e2e8f0" strokeWidth="5"/>
      <circle cx="32" cy="32" r={r} fill="none" stroke={color} strokeWidth="5"
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        style={{ transition: "stroke-dasharray 0.8s ease" }}/>
      <text x="32" y="37" textAnchor="middle" fill={color} fontSize="13" fontWeight="700"
        style={{ transform: "rotate(90deg)", transformOrigin: "32px 32px" }}>
        {score}%
      </text>
    </svg>
  );
};

const CertificateModal = ({ cert, onClose }) => {
  const [downloading, setDownloading] = useState(null);
  const issued = new Date(cert.issueDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  const handleDownload = async (type) => {
    setDownloading(type);
    await new Promise(r => setTimeout(r, 600));
    if (type === "cert") {
      const blob = generateCertificateSVG(cert);
      downloadBlob(blob, `Certificate_${cert.courseName.replace(/\s+/g, "_")}.svg`);
    }
    setDownloading(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(15,23,42,0.6)", backdropFilter: "blur(4px)" }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden" style={{ animation: "slideUp 0.25s ease" }}>
        <div className="bg-gradient-to-br from-blue-700 to-blue-500 p-8 text-white text-center relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors">
            <X size={20}/>
          </button>
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
            <Trophy size={32} className="text-white"/>
          </div>
          <p className="text-blue-200 text-sm mb-1 tracking-widest uppercase">Certificate of Completion</p>
          <h2 className="text-2xl font-bold font-serif mb-1">{cert.courseName}</h2>
          <p className="text-blue-100 text-sm">Awarded to {cert.recipientName}</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: "Score", value: `${cert.score}%`, icon: <Star size={16}/> },
              { label: "Issued", value: issued, icon: <Clock size={16}/> },
              { label: "Certificate ID", value: cert.id.toUpperCase(), icon: <Award size={16}/> },
            ].map(item => (
              <div key={item.label} className="bg-slate-50 rounded-xl p-3 text-center">
                <div className="flex items-center justify-center gap-1 text-blue-500 mb-1">{item.icon}</div>
                <p className="text-xs text-slate-500 mb-0.5">{item.label}</p>
                <p className="text-sm font-semibold text-slate-800 leading-tight">{item.value}</p>
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => handleDownload("cert")}
              disabled={!!downloading}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold text-sm transition-colors disabled:opacity-60"
            >
              {downloading === "cert" ? <Loader2 size={16} className="animate-spin"/> : <Download size={16}/>}
              Download Certificate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const CourseCard = ({ course, quizzes, onDownloadDoc, onViewCert }) => {
  const [expanded, setExpanded] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const courseQuizzes = quizzes.filter(q => q.courseId === course.id);

  const handleDocDownload = async () => {
    setDownloading(true);
    await new Promise(r => setTimeout(r, 700));
    const blob = generateDocxBlob(course);
    downloadBlob(blob, `${course.title.replace(/\s+/g, "_")}_Content.doc`);
    setDownloading(false);
  };

  const categoryColors = { Frontend: "blue", Backend: "purple", Language: "amber" };
  const catColor = categoryColors[course.category] ?? "slate";

  return (
    <div className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${course.completed ? "border-green-200 shadow-sm hover:shadow-md" : "border-slate-200 hover:border-blue-200 hover:shadow-sm"}`}>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <Badge color={catColor}>{course.category}</Badge>
              {course.completed && <Badge color="green"><CheckCircle size={11}/> Completed</Badge>}
            </div>
            <h3 className="font-bold text-slate-800 text-base leading-tight">{course.title}</h3>
          </div>
          {course.completed && <ScoreRing score={course.score}/>}
        </div>

        <p className="text-sm text-slate-500 mb-3 line-clamp-2">{course.description}</p>

        <div className="flex items-center gap-3 text-xs text-slate-400 mb-4">
          <span className="flex items-center gap-1"><Clock size={12}/>{course.duration}</span>
          <span className="flex items-center gap-1"><BookOpen size={12}/>{course.lessons.length} lessons</span>
          {courseQuizzes.length > 0 && <span className="flex items-center gap-1"><FileText size={12}/>{courseQuizzes.length} quiz{courseQuizzes.length > 1 ? "zes" : ""}</span>}
        </div>

        {!course.completed && course.progress != null && (
          <div className="mb-4">
            <div className="flex justify-between text-xs text-slate-500 mb-1.5">
              <span>Progress</span><span>{course.progress}%</span>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${course.progress}%` }}/>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={() => setExpanded(e => !e)}
            className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors px-3 py-1.5 bg-blue-50 hover:bg-blue-100 rounded-lg"
          >
            <Eye size={13}/>{expanded ? "Hide" : "View"} Content
          </button>

          {course.completed && (
            <>
              <button
                onClick={handleDocDownload}
                disabled={downloading}
                className="flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-800 transition-colors px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg disabled:opacity-50"
              >
                {downloading ? <Loader2 size={13} className="animate-spin"/> : <Download size={13}/>}
                Word Doc
              </button>
              <button
                onClick={() => onViewCert(course.id)}
                className="flex items-center gap-1.5 text-xs font-medium text-amber-600 hover:text-amber-700 transition-colors px-3 py-1.5 bg-amber-50 hover:bg-amber-100 rounded-lg"
              >
                <Award size={13}/> Certificate
              </button>
            </>
          )}
        </div>
      </div>

      {expanded && (
        <div className="border-t border-slate-100 bg-slate-50 p-5">
          <div className="space-y-3 mb-4">
            {course.lessons.map((lesson, i) => (
              <div key={lesson.id} className="flex gap-3 p-3 bg-white rounded-xl border border-slate-100">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700 mb-1">{lesson.title}</p>
                  <p className="text-xs text-slate-500 leading-relaxed">{lesson.content}</p>
                </div>
              </div>
            ))}
          </div>

          {courseQuizzes.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Quizzes</p>
              {courseQuizzes.map(quiz => (
                <div key={quiz.id} className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100">
                  <div>
                    <p className="text-sm font-medium text-slate-700">{quiz.title}</p>
                    <p className="text-xs text-slate-400">{quiz.questions.length} questions · Passing: {quiz.passingScore}%</p>
                  </div>
                  {quiz.attempts.length > 0 && (
                    <Badge color="green">Best: {Math.max(...quiz.attempts.map(a => a.score))}%</Badge>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const StatCard = ({ icon, label, value, sub, color = "blue" }) => {
  const colors = {
    blue: { bg: "bg-blue-50", icon: "text-blue-500", val: "text-blue-700" },
    green: { bg: "bg-green-50", icon: "text-green-500", val: "text-green-700" },
    amber: { bg: "bg-amber-50", icon: "text-amber-500", val: "text-amber-700" },
    purple: { bg: "bg-purple-50", icon: "text-purple-500", val: "text-purple-700" },
  };
  const c = colors[color];
  return (
    <div className={`${c.bg} rounded-2xl p-5`}>
      <div className={`${c.icon} mb-2`}>{icon}</div>
      <p className={`text-2xl font-bold ${c.val}`}>{value}</p>
      <p className="text-sm font-medium text-slate-700">{label}</p>
      {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
    </div>
  );
};

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function Progress() {
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [courseQueries, setCourseQueries] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedCert, setSelectedCert] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const [userData, coursesData, quizzesData, queriesData, certsData] = await Promise.all([
        userClient.getUser(),
        progressService.getCourses(),
        progressService.getQuizzes(),
        progressService.getCourseQueries(),
        progressService.getAllCertificates(),
      ]);
      setUser(userData);
      setCourses(coursesData);
      setQuizzes(quizzesData);
      setCourseQueries(queriesData);
      setCertificates(certsData);
    } catch (e) {
      setError("Failed to load progress data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const handleViewCert = useCallback(async (courseId) => {
    const cert = await progressService.getCertificate(courseId);
    if (cert) setSelectedCert(cert);
  }, []);

  const filteredCourses = courses.filter(c => {
    if (activeTab === "completed") return c.completed;
    if (activeTab === "in-progress") return !c.completed && (c.progress ?? 0) > 0;
    if (activeTab === "not-started") return !c.completed && !(c.progress ?? 0);
    return true;
  });

  const avgScore = certificates.length > 0
    ? Math.round(certificates.reduce((s, c) => s + c.score, 0) / certificates.length)
    : 0;

  return (
    <div className="min-h-screen bg-slate-50">
          <Header />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;600;700&family=DM+Sans:wght@400;500;600&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
        h1, h2 { font-family: 'Lora', serif; }
        .line-clamp-2 { display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden; }
        @keyframes slideUp { from { opacity:0;transform:translateY(20px); } to { opacity:1;transform:translateY(0); } }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
        .fade-in { animation: fadeIn 0.4s ease; }
      `}</style>


      <main className="max-w-5xl mx-auto px-4 py-8">

        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-slate-400">
            <Loader2 size={32} className="animate-spin text-blue-500"/>
            <p className="text-sm">Loading your progress…</p>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-3 bg-red-50 text-red-700 border border-red-200 rounded-xl p-4 mb-6">
            <AlertCircle size={18}/>
            <p className="text-sm font-medium">{error}</p>
            <button onClick={loadData} className="ml-auto flex items-center gap-1 text-xs bg-red-100 hover:bg-red-200 px-3 py-1.5 rounded-lg transition-colors">
              <RotateCcw size={12}/> Retry
            </button>
          </div>
        )}

        {!loading && !error && (
          <div className="fade-in">
            {/* Page title */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900 mb-1">My Progress</h1>
              <p className="text-slate-500">Track your learning journey, download content, and access certificates.</p>
            </div>

            {/* Stats */}
            {courseQueries && (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard icon={<BookOpen size={20}/>} label="Total Courses" value={courseQueries.totalCount} color="blue"/>
                <StatCard icon={<CheckCircle size={20}/>} label="Completed" value={courseQueries.completedCount} sub={`${Math.round((courseQueries.completedCount / courseQueries.totalCount) * 100)}% completion rate`} color="green"/>
                <StatCard icon={<Award size={20}/>} label="Certificates" value={certificates.length} color="amber"/>
                <StatCard icon={<Star size={20}/>} label="Avg Score" value={avgScore ? `${avgScore}%` : "—"} color="purple"/>
              </div>
            )}

            {/* Certificates strip */}
            {certificates.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-slate-800 mb-4">Earned Certificates</h2>
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {certificates.map(cert => (
                    <button
                      key={cert.id}
                      onClick={() => setSelectedCert(cert)}
                      className="flex-shrink-0 flex items-center gap-3 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-2xl px-5 py-4 hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm hover:shadow-md group"
                    >
                      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                        <Trophy size={20}/>
                      </div>
                      <div className="text-left">
                        <p className="text-xs text-blue-200 mb-0.5">Certificate</p>
                        <p className="font-semibold text-sm leading-tight">{cert.courseName}</p>
                        <p className="text-xs text-blue-200">{cert.score}% · {new Date(cert.issueDate).toLocaleDateString()}</p>
                      </div>
                      <ChevronRight size={16} className="text-white/50 group-hover:translate-x-0.5 transition-transform ml-1"/>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Courses */}
            <div>
              <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                <h2 className="text-xl font-bold text-slate-800">Courses</h2>
                <div className="flex gap-1 bg-white border border-slate-200 rounded-xl p-1">
                  {[
                    { key: "all", label: "All" },
                    { key: "completed", label: "Completed" },
                    { key: "in-progress", label: "In Progress" },
                    { key: "not-started", label: "Not Started" },
                  ].map(tab => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === tab.key ? "bg-blue-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {filteredCourses.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-2xl border border-slate-200">
                  <BookOpen size={40} className="text-slate-300 mb-3"/>
                  <p className="font-semibold text-slate-600">No courses here yet</p>
                  <p className="text-sm text-slate-400">Switch tabs to see other courses</p>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {filteredCourses.map(course => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      quizzes={quizzes}
                      onViewCert={handleViewCert}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {selectedCert && (
        <CertificateModal cert={selectedCert} onClose={() => setSelectedCert(null)}/>
      )}
    </div>
  );
}