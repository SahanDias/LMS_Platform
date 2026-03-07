import { useState, useEffect, useCallback, ReactNode } from "react";
import {
    Award, BookOpen, CheckCircle, Clock, Download, Eye, FileText,
    RotateCcw, Star, Trophy, X, ChevronRight, Loader2, AlertCircle,
    Users, BarChart2, Shield, Trash2, PlusCircle, Edit3, Search,
    Filter, TrendingUp, AlertTriangle, ChevronDown, Save, Bell,
    ToggleLeft, ToggleRight, UserCheck, UserX, Sliders
} from "lucide-react";
import AdminSidebar from "@/components/AdminSidebar";
import AdminLayout from "@/components/AdminLayout";
// ─── TYPES ────────────────────────────────────────────────────────────────────

interface Course {
    id: string;
    title: string;
    category: string;
    duration: string;
    description: string;
    lessons: { id: string; title: string }[];
    published: boolean;
    enrollments: number;
    avgScore: number;
    passingRate: number;
}

interface User {
    id: string;
    name: string;
    email: string;
    avatar: string;
    role: "student" | "instructor";
    joinDate: string;
    streak: number;
    totalPoints: number;
    completedCourses: number;
    active: boolean;
}

interface Quiz {
    id: string;
    courseId: string;
    title: string;
    questions: number;
    passingScore: number;
    attempts: number;
    avgScore: number;
}

interface OverviewStats {
    totalUsers: number;
    activeUsers: number;
    totalCourses: number;
    publishedCourses: number;
    totalEnrollments: number;
    avgPlatformScore: number;
    certificatesIssued: number;
    weeklyGrowth: number;
}

interface ActivityItem {
    id: number;
    type: "enrollment" | "completion" | "quiz" | "signup";
    user: string;
    target: string;
    time: string;
    icon: "enroll" | "complete" | "quiz" | "signup";
    score?: number;
}

interface PlatformSettings {
    requireApproval: boolean;
    emailNotifications: boolean;
    publicLeaderboard: boolean;
    autoIssue: boolean;
    minPassScore: number;
    maxAttempts: number;
}

// ─── SHARED MOCK DATA ─────────────────────────────────────────────────────────

const MOCK_COURSES: Course[] = [
    {
        id: "c1", title: "Introduction to React", category: "Frontend", duration: "8 hours",
        description: "Master the fundamentals of React including hooks, state management, and component design patterns.",
        lessons: [
            { id: "l1", title: "JSX & Components" }, { id: "l2", title: "State & Props" },
            { id: "l3", title: "Hooks Deep Dive" }, { id: "l4", title: "Performance Optimization" },
        ],
        published: true, enrollments: 142, avgScore: 87, passingRate: 91,
    },
    {
        id: "c2", title: "TypeScript Fundamentals", category: "Language", duration: "6 hours",
        description: "Learn TypeScript from the ground up — types, interfaces, generics, and real-world integration.",
        lessons: [
            { id: "l1", title: "Types & Interfaces" }, { id: "l2", title: "Generics" },
            { id: "l3", title: "Advanced Patterns" },
        ],
        published: true, enrollments: 98, avgScore: 82, passingRate: 88,
    },
    {
        id: "c3", title: "Node.js & REST APIs", category: "Backend", duration: "10 hours",
        description: "Build scalable backend services with Node.js, Express, and RESTful API design principles.",
        lessons: [
            { id: "l1", title: "Node.js Basics" }, { id: "l2", title: "Express Framework" },
        ],
        published: true, enrollments: 74, avgScore: 79, passingRate: 83,
    },
    {
        id: "c4", title: "CSS & Modern Layouts", category: "Frontend", duration: "5 hours",
        description: "From Flexbox to Grid — master every layout technique modern web design demands.",
        lessons: [
            { id: "l1", title: "Flexbox Mastery" }, { id: "l2", title: "CSS Grid" },
        ],
        published: false, enrollments: 31, avgScore: 74, passingRate: 77,
    },
];

const MOCK_USERS: User[] = [
    { id: "u1", name: "Alex Johnson", email: "alex.johnson@example.com", avatar: "AJ", role: "student", joinDate: "2024-09-01", streak: 12, totalPoints: 1840, completedCourses: 2, active: true },
    { id: "u2", name: "Maria Santos", email: "maria.santos@example.com", avatar: "MS", role: "student", joinDate: "2024-10-15", streak: 5, totalPoints: 960, completedCourses: 1, active: true },
    { id: "u3", name: "Kai Nakamura", email: "kai.nakamura@example.com", avatar: "KN", role: "student", joinDate: "2024-08-20", streak: 0, totalPoints: 320, completedCourses: 0, active: false },
    { id: "u4", name: "Priya Mehta", email: "priya.mehta@example.com", avatar: "PM", role: "instructor", joinDate: "2024-07-01", streak: 30, totalPoints: 5200, completedCourses: 4, active: true },
    { id: "u5", name: "Omar Hassan", email: "omar.hassan@example.com", avatar: "OH", role: "student", joinDate: "2024-11-03", streak: 8, totalPoints: 740, completedCourses: 1, active: true },
    { id: "u6", name: "Chen Wei", email: "chen.wei@example.com", avatar: "CW", role: "student", joinDate: "2024-09-28", streak: 3, totalPoints: 450, completedCourses: 0, active: true },
];

const MOCK_QUIZZES: Quiz[] = [
    { id: "q1", courseId: "c1", title: "React Fundamentals Quiz", questions: 3, passingScore: 70, attempts: 186, avgScore: 84 },
    { id: "q2", courseId: "c2", title: "TypeScript Types Quiz", questions: 2, passingScore: 70, attempts: 121, avgScore: 79 },
];

const MOCK_ACTIVITY: ActivityItem[] = [
    { id: 1, type: "enrollment", user: "Maria Santos", target: "Node.js & REST APIs", time: "2 min ago", icon: "enroll" },
    { id: 2, type: "completion", user: "Alex Johnson", target: "TypeScript Fundamentals", time: "1 hr ago", icon: "complete" },
    { id: 3, type: "quiz", user: "Omar Hassan", target: "React Fundamentals Quiz", time: "3 hr ago", icon: "quiz", score: 91 },
    { id: 4, type: "signup", user: "Chen Wei", target: "Platform", time: "5 hr ago", icon: "signup" },
    { id: 5, type: "completion", user: "Priya Mehta", target: "CSS & Modern Layouts", time: "1 day ago", icon: "complete" },
    { id: 6, type: "enrollment", user: "Kai Nakamura", target: "Introduction to React", time: "2 days ago", icon: "enroll" },
];

// ─── ADMIN SERVICE ────────────────────────────────────────────────────────────

class AdminService {
    private _courses: Course[];
    private _users: User[];
    private _quizzes: Quiz[];

    constructor() {
        this._courses = MOCK_COURSES.map(c => ({ ...c }));
        this._users = MOCK_USERS.map(u => ({ ...u }));
        this._quizzes = MOCK_QUIZZES.map(q => ({ ...q }));
    }

    async getOverviewStats(): Promise<OverviewStats> {
        return new Promise(r => setTimeout(() => r({
            totalUsers: this._users.length,
            activeUsers: this._users.filter(u => u.active).length,
            totalCourses: this._courses.length,
            publishedCourses: this._courses.filter(c => c.published).length,
            totalEnrollments: this._courses.reduce((s, c) => s + c.enrollments, 0),
            avgPlatformScore: Math.round(this._courses.reduce((s, c) => s + c.avgScore, 0) / this._courses.length),
            certificatesIssued: 47,
            weeklyGrowth: 12,
        }), 400));
    }

    async getCourses(): Promise<Course[]> {
        return new Promise(r => setTimeout(() => r([...this._courses]), 300));
    }

    async getUsers(): Promise<User[]> {
        return new Promise(r => setTimeout(() => r([...this._users]), 350));
    }

    async getQuizzes(): Promise<Quiz[]> {
        return new Promise(r => setTimeout(() => r([...this._quizzes]), 300));
    }

    async getActivity(): Promise<ActivityItem[]> {
        return new Promise(r => setTimeout(() => r([...MOCK_ACTIVITY]), 200));
    }

    async toggleCoursePublished(id: string): Promise<Course | undefined> {
        return new Promise(r => setTimeout(() => {
            const course = this._courses.find(c => c.id === id);
            if (course) course.published = !course.published;
            r(course);
        }, 300));
    }

    async toggleUserActive(id: string): Promise<User | undefined> {
        return new Promise(r => setTimeout(() => {
            const user = this._users.find(u => u.id === id);
            if (user) user.active = !user.active;
            r(user);
        }, 300));
    }

    async deleteCourse(id: string): Promise<boolean> {
        return new Promise(r => setTimeout(() => {
            this._courses = this._courses.filter(c => c.id !== id);
            r(true);
        }, 400));
    }
}

const adminService = new AdminService();

// ─── SHARED UI COMPONENTS ─────────────────────────────────────────────────────

type BadgeColor = "blue" | "green" | "amber" | "slate" | "purple" | "red" | "indigo";

const Badge = ({ children, color = "blue" }: { children: ReactNode; color?: BadgeColor }) => {
    const colors: Record<BadgeColor, string> = {
        blue: "bg-blue-100 text-blue-700",
        green: "bg-emerald-100 text-emerald-700",
        amber: "bg-amber-100 text-amber-700",
        slate: "bg-slate-100 text-slate-600",
        purple: "bg-violet-100 text-violet-700",
        red: "bg-red-100 text-red-600",
        indigo: "bg-indigo-100 text-indigo-700",
    };
    return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${colors[color]}`}>
            {children}
        </span>
    );
};

type StatColor = "blue" | "green" | "amber" | "purple" | "indigo";

interface StatCardProps {
    icon: ReactNode;
    label: string;
    value: string | number;
    sub?: string;
    color?: StatColor;
    trend?: number;
}

const StatCard = ({ icon, label, value, sub, color = "blue", trend }: StatCardProps) => {
    const colors: Record<StatColor, { bg: string; border: string; icon: string; val: string }> = {
        blue: { bg: "bg-blue-50", border: "border-blue-100", icon: "text-blue-500", val: "text-blue-700" },
        green: { bg: "bg-emerald-50", border: "border-emerald-100", icon: "text-emerald-500", val: "text-emerald-700" },
        amber: { bg: "bg-amber-50", border: "border-amber-100", icon: "text-amber-500", val: "text-amber-700" },
        purple: { bg: "bg-violet-50", border: "border-violet-100", icon: "text-violet-500", val: "text-violet-700" },
        indigo: { bg: "bg-indigo-50", border: "border-indigo-100", icon: "text-indigo-500", val: "text-indigo-700" },
    };
    const c = colors[color];
    return (
        <div className={`${c.bg} border ${c.border} rounded-2xl p-5 relative overflow-hidden`}>
            <div className={`${c.icon} mb-3`}>{icon}</div>
            <p className={`text-3xl font-bold ${c.val} tabular-nums`}>{value}</p>
            <p className="text-sm font-medium text-slate-600 mt-0.5">{label}</p>
            {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
            {trend != null && (
                <div className="absolute top-4 right-4 flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">
                    <TrendingUp size={10} /> +{trend}%
                </div>
            )}
        </div>
    );
};

const SectionHeader = ({
    title, sub, action,
}: { title: string; sub?: string; action?: ReactNode }) => (
    <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div>
            <h2 className="text-xl font-bold text-slate-800">{title}</h2>
            {sub && <p className="text-sm text-slate-400 mt-0.5">{sub}</p>}
        </div>
        {action}
    </div>
);

const MiniBar = ({ value, max = 100, color = "#3b82f6" }: { value: number; max?: number; color?: string }) => (
    <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${(value / max) * 100}%`, background: color }} />
    </div>
);

const ActivityFeed = ({ items }: { items: ActivityItem[] }) => {
    const icons: Record<ActivityItem["icon"], { bg: string; icon: ReactNode }> = {
        enroll: { bg: "bg-blue-100", icon: <BookOpen size={13} className="text-blue-600" /> },
        complete: { bg: "bg-emerald-100", icon: <CheckCircle size={13} className="text-emerald-600" /> },
        quiz: { bg: "bg-amber-100", icon: <FileText size={13} className="text-amber-600" /> },
        signup: { bg: "bg-violet-100", icon: <Users size={13} className="text-violet-600" /> },
    };
    return (
        <div className="space-y-3">
            {items.map((item, i) => {
                const ic = icons[item.icon];
                return (
                    <div
                        key={item.id}
                        className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors"
                        style={{ animation: `fadeIn 0.3s ease ${i * 0.06}s both` }}
                    >
                        <div className={`w-7 h-7 rounded-full ${ic.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                            {ic.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-slate-700">
                                <span className="font-semibold">{item.user}</span>
                                {item.type === "enrollment" && <> enrolled in <span className="text-blue-600">{item.target}</span></>}
                                {item.type === "completion" && <> completed <span className="text-emerald-600">{item.target}</span></>}
                                {item.type === "quiz" && <> scored <span className="text-amber-600">{item.score}%</span> on {item.target}</>}
                                {item.type === "signup" && <> joined the platform</>}
                            </p>
                        </div>
                        <span className="text-xs text-slate-400 flex-shrink-0">{item.time}</span>
                    </div>
                );
            })}
        </div>
    );
};

const ConfirmDialog = ({
    message, onConfirm, onCancel,
}: { message: string; onConfirm: () => void; onCancel: () => void }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: "rgba(15,23,42,0.55)", backdropFilter: "blur(4px)" }}>
        <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm" style={{ animation: "slideUp 0.2s ease" }}>
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                    <AlertTriangle size={18} className="text-red-600" />
                </div>
                <p className="font-semibold text-slate-800">Confirm Action</p>
            </div>
            <p className="text-sm text-slate-500 mb-6">{message}</p>
            <div className="flex gap-3">
                <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
                <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors">Delete</button>
            </div>
        </div>
    </div>
);

const EditCourseModal = ({
    course, onClose, onSave,
}: { course: Course; onClose: () => void; onSave: (c: Course) => void }) => {
    const [form, setForm] = useState({
        title: course.title,
        description: course.description,
        category: course.category,
        duration: course.duration,
    });
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        setSaving(true);
        await new Promise(r => setTimeout(r, 500));
        onSave({ ...course, ...form });
        setSaving(false);
        onClose();
    };

    const fields: { label: string; key: keyof typeof form }[] = [
        { label: "Title", key: "title" },
        { label: "Category", key: "category" },
        { label: "Duration", key: "duration" },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(15,23,42,0.55)", backdropFilter: "blur(4px)" }}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden" style={{ animation: "slideUp 0.2s ease" }}>
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <h3 className="font-bold text-slate-800 text-lg">Edit Course</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors"><X size={18} /></button>
                </div>
                <div className="p-6 space-y-4">
                    {fields.map(field => (
                        <div key={field.key}>
                            <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">{field.label}</label>
                            <input
                                type="text"
                                value={form[field.key]}
                                onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                            />
                        </div>
                    ))}
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Description</label>
                        <textarea
                            value={form.description}
                            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                            rows={3}
                            className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all resize-none"
                        />
                    </div>
                </div>
                <div className="px-6 pb-6 flex gap-3">
                    <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                        {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─── TAB: OVERVIEW ────────────────────────────────────────────────────────────

const OverviewTab = ({ stats, activity }: { stats: OverviewStats; activity: ActivityItem[] }) => (
    <div className="space-y-8 fade-in">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={<Users size={22} />} label="Total Users" value={stats.totalUsers} sub={`${stats.activeUsers} active`} color="blue" trend={stats.weeklyGrowth} />
            <StatCard icon={<BookOpen size={22} />} label="Courses" value={stats.totalCourses} sub={`${stats.publishedCourses} published`} color="indigo" />
            <StatCard icon={<TrendingUp size={22} />} label="Enrollments" value={stats.totalEnrollments} color="green" />
            <StatCard icon={<Award size={22} />} label="Certificates" value={stats.certificatesIssued} sub={`Avg score ${stats.avgPlatformScore}%`} color="amber" />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6">
                <SectionHeader title="Course Performance" sub="Enrollment and pass-rate breakdown" />
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide border-b border-slate-100">
                                <th className="pb-3">Course</th>
                                <th className="pb-3 text-right">Enrolled</th>
                                <th className="pb-3 text-right">Avg Score</th>
                                <th className="pb-3 text-right hidden sm:table-cell">Pass Rate</th>
                                <th className="pb-3 text-right hidden md:table-cell">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {MOCK_COURSES.map((c, i) => (
                                <tr key={c.id} className="border-b border-slate-50 last:border-0"
                                    style={{ animation: `fadeIn 0.3s ease ${i * 0.07}s both` }}>
                                    <td className="py-3">
                                        <p className="font-medium text-slate-700">{c.title}</p>
                                        <p className="text-xs text-slate-400">{c.category}</p>
                                    </td>
                                    <td className="py-3 text-right font-semibold text-slate-600">{c.enrollments}</td>
                                    <td className="py-3 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <MiniBar value={c.avgScore} color={c.avgScore >= 85 ? "#22c55e" : c.avgScore >= 75 ? "#3b82f6" : "#f59e0b"} />
                                            <span className="font-semibold text-slate-600 w-10 text-right">{c.avgScore}%</span>
                                        </div>
                                    </td>
                                    <td className="py-3 text-right text-slate-600 hidden sm:table-cell">{c.passingRate}%</td>
                                    <td className="py-3 text-right hidden md:table-cell">
                                        <Badge color={c.published ? "green" : "slate"}>{c.published ? "Live" : "Draft"}</Badge>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <SectionHeader title="Recent Activity" />
                <ActivityFeed items={activity} />
            </div>
        </div>
    </div>
);

// ─── TAB: COURSES ─────────────────────────────────────────────────────────────

const CoursesTab = ({
    courses, setCourses,
}: { courses: Course[]; setCourses: React.Dispatch<React.SetStateAction<Course[]>> }) => {
    const [search, setSearch] = useState("");
    const [toggling, setToggling] = useState<string | null>(null);
    const [deleting, setDeleting] = useState<string | null>(null);
    const [editingCourse, setEditingCourse] = useState<Course | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<Course | null>(null);

    const categoryColors: Record<string, BadgeColor> = { Frontend: "blue", Backend: "purple", Language: "amber" };

    const filtered = courses.filter(c =>
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.category.toLowerCase().includes(search.toLowerCase())
    );

    const handleToggle = async (id: string) => {
        setToggling(id);
        const updated = await adminService.toggleCoursePublished(id);
        if (updated) setCourses(cs => cs.map(c => c.id === id ? { ...c, published: updated.published } : c));
        setToggling(null);
    };

    const handleDelete = async (id: string) => {
        setDeleting(id);
        await adminService.deleteCourse(id);
        setCourses(cs => cs.filter(c => c.id !== id));
        setDeleting(null);
        setConfirmDelete(null);
    };

    const handleSaveEdit = (updated: Course) => {
        setCourses(cs => cs.map(c => c.id === updated.id ? updated : c));
    };

    return (
        <div className="fade-in">
            <SectionHeader
                title="Course Management"
                sub={`${courses.length} courses · ${courses.filter(c => c.published).length} published`}
                action={
                    <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors">
                        <PlusCircle size={15} /> New Course
                    </button>
                }
            />

            <div className="relative mb-5">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search courses…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all bg-white"
                />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                {filtered.map((course, i) => (
                    <div key={course.id} className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-sm transition-all"
                        style={{ animation: `fadeIn 0.3s ease ${i * 0.07}s both` }}>
                        <div className="flex items-start justify-between gap-3 mb-3">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2 flex-wrap">
                                    <Badge color={categoryColors[course.category] ?? "slate"}>{course.category}</Badge>
                                    <Badge color={course.published ? "green" : "slate"}>{course.published ? "Live" : "Draft"}</Badge>
                                </div>
                                <h3 className="font-bold text-slate-800 text-base leading-tight">{course.title}</h3>
                            </div>
                        </div>

                        <p className="text-sm text-slate-500 mb-3 line-clamp-2">{course.description}</p>

                        <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                            {([
                                { label: "Enrolled", value: String(course.enrollments) },
                                { label: "Avg Score", value: `${course.avgScore}%` },
                                { label: "Pass Rate", value: `${course.passingRate}%` },
                            ] as const).map(stat => (
                                <div key={stat.label} className="bg-slate-50 rounded-xl py-2">
                                    <p className="text-sm font-bold text-slate-700">{stat.value}</p>
                                    <p className="text-xs text-slate-400">{stat.label}</p>
                                </div>
                            ))}
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                            <button
                                onClick={() => handleToggle(course.id)}
                                disabled={toggling === course.id}
                                className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50 ${course.published
                                        ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                    }`}
                            >
                                {toggling === course.id
                                    ? <Loader2 size={12} className="animate-spin" />
                                    : course.published ? <ToggleRight size={13} /> : <ToggleLeft size={13} />}
                                {course.published ? "Unpublish" : "Publish"}
                            </button>
                            <button
                                onClick={() => setEditingCourse(course)}
                                className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                            >
                                <Edit3 size={12} /> Edit
                            </button>
                            <button
                                onClick={() => setConfirmDelete(course)}
                                disabled={deleting === course.id}
                                className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors disabled:opacity-50 ml-auto"
                            >
                                {deleting === course.id ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {editingCourse && (
                <EditCourseModal
                    course={editingCourse}
                    onClose={() => setEditingCourse(null)}
                    onSave={handleSaveEdit}
                />
            )}
            {confirmDelete && (
                <ConfirmDialog
                    message={`Delete "${confirmDelete.title}"? This cannot be undone and will remove all enrollments.`}
                    onConfirm={() => handleDelete(confirmDelete.id)}
                    onCancel={() => setConfirmDelete(null)}
                />
            )}
        </div>
    );
};

// ─── TAB: USERS ───────────────────────────────────────────────────────────────

type RoleFilter = "all" | "student" | "instructor";

const UsersTab = ({
    users, setUsers,
}: { users: User[]; setUsers: React.Dispatch<React.SetStateAction<User[]>> }) => {
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
    const [toggling, setToggling] = useState<string | null>(null);

    const filtered = users.filter(u => {
        const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
        const matchRole = roleFilter === "all" || u.role === roleFilter;
        return matchSearch && matchRole;
    });

    const handleToggleActive = async (id: string) => {
        setToggling(id);
        const updated = await adminService.toggleUserActive(id);
        if (updated) setUsers(us => us.map(u => u.id === id ? { ...u, active: updated.active } : u));
        setToggling(null);
    };

    const roleFilters: RoleFilter[] = ["all", "student", "instructor"];
    const tableHeaders = ["User", "Role", "Courses", "Points", "Streak", "Status", "Actions"];

    return (
        <div className="fade-in">
            <SectionHeader
                title="User Management"
                sub={`${users.length} users · ${users.filter(u => u.active).length} active`}
                action={
                    <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors">
                        <PlusCircle size={15} /> Invite User
                    </button>
                }
            />

            <div className="flex gap-3 mb-5 flex-wrap">
                <div className="relative flex-1 min-w-48">
                    <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search users…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all bg-white"
                    />
                </div>
                <div className="flex gap-1 bg-white border border-slate-200 rounded-xl p-1">
                    {roleFilters.map(role => (
                        <button
                            key={role}
                            onClick={() => setRoleFilter(role)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${roleFilter === role ? "bg-blue-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                        >
                            {role}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50">
                                {tableHeaders.map(h => (
                                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide first:pl-5 last:pr-5 last:text-right">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((user, i) => (
                                <tr key={user.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60 transition-colors"
                                    style={{ animation: `fadeIn 0.25s ease ${i * 0.05}s both` }}>
                                    <td className="px-4 py-3 pl-5">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${user.active ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-400"}`}>
                                                {user.avatar}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-700">{user.name}</p>
                                                <p className="text-xs text-slate-400">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <Badge color={user.role === "instructor" ? "purple" : "blue"}>{user.role}</Badge>
                                    </td>
                                    <td className="px-4 py-3 text-slate-600 font-medium">{user.completedCourses}</td>
                                    <td className="px-4 py-3 text-slate-600 font-medium">{user.totalPoints.toLocaleString()}</td>
                                    <td className="px-4 py-3 text-slate-600">{user.streak > 0 ? `🔥 ${user.streak}d` : "—"}</td>
                                    <td className="px-4 py-3">
                                        <Badge color={user.active ? "green" : "red"}>{user.active ? "Active" : "Inactive"}</Badge>
                                    </td>
                                    <td className="px-4 py-3 pr-5 text-right">
                                        <button
                                            onClick={() => handleToggleActive(user.id)}
                                            disabled={toggling === user.id}
                                            className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50 ${user.active
                                                    ? "bg-red-50 text-red-500 hover:bg-red-100"
                                                    : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                                                }`}
                                        >
                                            {toggling === user.id
                                                ? <Loader2 size={11} className="animate-spin" />
                                                : user.active ? <UserX size={11} /> : <UserCheck size={11} />}
                                            {user.active ? "Suspend" : "Restore"}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-4 py-12 text-center text-slate-400 text-sm">
                                        No users match your search
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

// ─── TAB: QUIZZES ─────────────────────────────────────────────────────────────

const QuizzesTab = ({ quizzes }: { quizzes: Quiz[] }) => (
    <div className="fade-in">
        <SectionHeader
            title="Quiz Management"
            sub={`${quizzes.length} quizzes across ${new Set(quizzes.map(q => q.courseId)).size} courses`}
            action={
                <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors">
                    <PlusCircle size={15} /> New Quiz
                </button>
            }
        />

        <div className="grid gap-4 sm:grid-cols-2">
            {quizzes.map((quiz, i) => {
                const course = MOCK_COURSES.find(c => c.id === quiz.courseId);
                return (
                    <div key={quiz.id} className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-sm transition-all"
                        style={{ animation: `fadeIn 0.3s ease ${i * 0.08}s both` }}>
                        <div className="flex items-start justify-between gap-3 mb-4">
                            <div>
                                <p className="text-xs text-slate-400 mb-1">{course?.title ?? "Unknown Course"}</p>
                                <h3 className="font-bold text-slate-800">{quiz.title}</h3>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                                <FileText size={18} className="text-amber-600" />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                            {([
                                { label: "Questions", value: String(quiz.questions) },
                                { label: "Attempts", value: String(quiz.attempts) },
                                { label: "Avg Score", value: `${quiz.avgScore}%` },
                            ] as const).map(stat => (
                                <div key={stat.label} className="bg-slate-50 rounded-xl py-2.5">
                                    <p className="text-base font-bold text-slate-700">{stat.value}</p>
                                    <p className="text-xs text-slate-400">{stat.label}</p>
                                </div>
                            ))}
                        </div>

                        <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                            <span>Passing threshold</span>
                            <span className="font-semibold">{quiz.passingScore}%</span>
                        </div>
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mb-4">
                            <div className="h-full bg-amber-400 rounded-full" style={{ width: `${quiz.passingScore}%` }} />
                        </div>

                        <div className="flex gap-2">
                            <button className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">
                                <Edit3 size={12} /> Edit Questions
                            </button>
                            <button className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">
                                <BarChart2 size={12} /> View Stats
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    </div>
);

// ─── TAB: SETTINGS ────────────────────────────────────────────────────────────

const SettingsTab = () => {
    const [settings, setSettings] = useState<PlatformSettings>({
        requireApproval: false,
        emailNotifications: true,
        publicLeaderboard: true,
        autoIssue: true,
        minPassScore: 70,
        maxAttempts: 3,
    });
    const [saved, setSaved] = useState(false);

    const handleSave = async () => {
        await new Promise(r => setTimeout(r, 500));
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const Toggle = ({
        field, label, sub,
    }: { field: keyof Pick<PlatformSettings, "requireApproval" | "emailNotifications" | "publicLeaderboard" | "autoIssue">; label: string; sub?: string }) => (
        <div className="flex items-center justify-between py-4 border-b border-slate-100 last:border-0">
            <div>
                <p className="text-sm font-semibold text-slate-700">{label}</p>
                {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
            </div>
            <button
                onClick={() => setSettings(s => ({ ...s, [field]: !s[field] }))}
                className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${settings[field] ? "bg-blue-600" : "bg-slate-200"}`}
            >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${settings[field] ? "translate-x-5" : "translate-x-0"}`} />
            </button>
        </div>
    );

    const numericFields: { label: string; field: "minPassScore" | "maxAttempts"; min: number; max: number }[] = [
        { label: "Minimum passing score (%)", field: "minPassScore", min: 0, max: 100 },
        { label: "Max quiz attempts", field: "maxAttempts", min: 1, max: 10 },
    ];

    return (
        <div className="fade-in max-w-2xl">
            <SectionHeader title="Platform Settings" sub="Configure global learning platform behavior" />

            <div className="space-y-5">
                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Shield size={16} className="text-blue-500" />
                        <h3 className="font-bold text-slate-700">Access &amp; Enrollment</h3>
                    </div>
                    <Toggle field="requireApproval" label="Require enrollment approval" sub="Admins must approve each student enrollment" />
                    <Toggle field="publicLeaderboard" label="Public leaderboard" sub="Show student rankings publicly on the platform" />
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Bell size={16} className="text-amber-500" />
                        <h3 className="font-bold text-slate-700">Notifications</h3>
                    </div>
                    <Toggle field="emailNotifications" label="Email notifications" sub="Send automated emails on completions and milestones" />
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Award size={16} className="text-emerald-500" />
                        <h3 className="font-bold text-slate-700">Certificates &amp; Quizzes</h3>
                    </div>
                    <Toggle field="autoIssue" label="Auto-issue certificates" sub="Automatically generate certificates on course completion" />

                    <div className="pt-4 grid sm:grid-cols-2 gap-4">
                        {numericFields.map(input => (
                            <div key={input.field}>
                                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">{input.label}</label>
                                <input
                                    type="number"
                                    value={settings[input.field]}
                                    min={input.min}
                                    max={input.max}
                                    onChange={e => setSettings(s => ({ ...s, [input.field]: Number(e.target.value) }))}
                                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    onClick={handleSave}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all ${saved ? "bg-emerald-500 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"}`}
                >
                    {saved ? <CheckCircle size={15} /> : <Save size={15} />}
                    {saved ? "Saved!" : "Save Settings"}
                </button>
            </div>
        </div>
    );
};

// ─── MAIN ADMIN PAGE ──────────────────────────────────────────────────────────

type TabKey = "overview" | "courses" | "users" | "quizzes" | "settings";

interface TabConfig {
    key: TabKey;
    label: string;
    icon: ReactNode;
    count?: number;
}

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState<TabKey>("overview");
    const [stats, setStats] = useState<OverviewStats | null>(null);
    const [courses, setCourses] = useState<Course[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [activity, setActivity] = useState<ActivityItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadData = useCallback(async () => {
        setLoading(true); setError(null);
        try {
            const [statsData, coursesData, usersData, quizzesData, activityData] = await Promise.all([
                adminService.getOverviewStats(),
                adminService.getCourses(),
                adminService.getUsers(),
                adminService.getQuizzes(),
                adminService.getActivity(),
            ]);
            setStats(statsData);
            setCourses(coursesData);
            setUsers(usersData);
            setQuizzes(quizzesData);
            setActivity(activityData);
        } catch {
            setError("Failed to load admin data. Please try again.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { loadData(); }, [loadData]);

    const tabs: TabConfig[] = [
        { key: "overview", label: "Overview", icon: <BarChart2 size={15} /> },
        { key: "courses", label: "Courses", icon: <BookOpen size={15} />, count: courses.length },
        { key: "users", label: "Users", icon: <Users size={15} />, count: users.length },
        { key: "quizzes", label: "Quizzes", icon: <FileText size={15} />, count: quizzes.length },
        { key: "settings", label: "Settings", icon: <Sliders size={15} /> },
    ];

    return (
        <div>

            <AdminLayout>
                <div className="min-h-screen bg-slate-50">
                    <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;600;700&family=DM+Sans:wght@400;500;600&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
        h1, h2 { font-family: 'Lora', serif; }
        .line-clamp-2 { display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden; }
        @keyframes slideUp { from { opacity:0;transform:translateY(16px); } to { opacity:1;transform:translateY(0); } }
        @keyframes fadeIn  { from { opacity:0; } to { opacity:1; } }
        .fade-in { animation: fadeIn 0.35s ease both; }
      `}</style>


                    {/* Admin sub-header nav */}
                    <div className="bg-white border-b border-slate-200">
                        <div className="max-w-6xl mx-auto px-4">
                            <div className="flex items-center gap-1 overflow-x-auto">
                                {tabs.map(tab => (
                                    <button
                                        key={tab.key}
                                        onClick={() => setActiveTab(tab.key)}
                                        className={`flex items-center gap-2 px-4 py-4 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${activeTab === tab.key
                                                ? "border-blue-600 text-blue-600"
                                                : "border-transparent text-slate-500 hover:text-slate-700"
                                            }`}
                                    >
                                        {tab.icon}
                                        {tab.label}
                                        {tab.count != null && (
                                            <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${activeTab === tab.key ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-500"}`}>
                                                {tab.count}
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <main className="max-w-6xl mx-auto px-4 py-8">
                        {loading && (
                            <div className="flex flex-col items-center justify-center py-24 gap-3 text-slate-400">
                                <Loader2 size={32} className="animate-spin text-blue-500" />
                                <p className="text-sm">Loading admin dashboard…</p>
                            </div>
                        )}

                        {error && (
                            <div className="flex items-center gap-3 bg-red-50 text-red-700 border border-red-200 rounded-xl p-4 mb-6">
                                <AlertCircle size={18} />
                                <p className="text-sm font-medium">{error}</p>
                                <button onClick={loadData} className="ml-auto flex items-center gap-1 text-xs bg-red-100 hover:bg-red-200 px-3 py-1.5 rounded-lg transition-colors">
                                    <RotateCcw size={12} /> Retry
                                </button>
                            </div>
                        )}

                        {!loading && !error && stats && (
                            <>
                                {activeTab === "overview" && <OverviewTab stats={stats} activity={activity} />}
                                {activeTab === "courses" && <CoursesTab courses={courses} setCourses={setCourses} />}
                                {activeTab === "users" && <UsersTab users={users} setUsers={setUsers} />}
                                {activeTab === "quizzes" && <QuizzesTab quizzes={quizzes} />}
                                {activeTab === "settings" && <SettingsTab />}
                            </>
                        )}
                    </main>
                </div>

            </AdminLayout>
        </div>

    );
}