import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";


const COURSES = [
    { id: 1, title: "React Fundamentals", category: "Frontend", duration: "8h", lessons: 24, enrolled: 312, completed: 198, rating: 4.9, status: "active", certificateAvailable: true },
    { id: 2, title: "Node.js & REST APIs", category: "Backend", duration: "10h", lessons: 30, enrolled: 245, completed: 134, rating: 4.8, status: "active", certificateAvailable: true },
    { id: 3, title: "UI/UX Design Principles", category: "Design", duration: "6h", lessons: 18, enrolled: 189, completed: 145, rating: 4.7, status: "active", certificateAvailable: true },
    { id: 4, title: "Python Data Science", category: "Data", duration: "12h", lessons: 36, enrolled: 278, completed: 89, rating: 4.9, status: "active", certificateAvailable: true },
    { id: 5, title: "Cloud Architecture", category: "DevOps", duration: "9h", lessons: 27, enrolled: 156, completed: 67, rating: 4.6, status: "active", certificateAvailable: false },
    { id: 6, title: "GraphQL Mastery", category: "Backend", duration: "7h", lessons: 21, enrolled: 98, completed: 55, rating: 4.8, status: "active", certificateAvailable: true },
];

const CAT_META = {
    Frontend: { color: "#e8ff47", bg: "#e8ff4712", border: "#e8ff4730", icon: "⚛️" },
    Backend: { color: "#00d4ff", bg: "#00d4ff12", border: "#00d4ff30", icon: "🔧" },
    Design: { color: "#ff6b35", bg: "#ff6b3512", border: "#ff6b3530", icon: "🎨" },
    Data: { color: "#a78bfa", bg: "#a78bfa12", border: "#a78bfa30", icon: "📊" },
    DevOps: { color: "#34d399", bg: "#34d39912", border: "#34d39930", icon: "☁️" },
};

const TESTIMONIALS = [
    { name: "Sarah K.", role: "Frontend Dev @ Stripe", text: "Went from zero to job-ready in 3 months. The React course is phenomenal.", avatar: "SK", color: "#e8ff47" },
    { name: "Marcus T.", role: "Data Engineer @ Netflix", text: "Python Data Science course is the best I've taken. Real-world projects made the difference.", avatar: "MT", color: "#a78bfa" },
    { name: "Priya L.", role: "UX Lead @ Figma", text: "The Design Principles course changed how I think about interfaces entirely.", avatar: "PL", color: "#ff6b35" },
];

export default function Home({ onNavigate }) {
    const [activeCategory, setActiveCategory] = useState("All");
    const [scrollY, setScrollY] = useState(0);
    const [counters, setCounters] = useState({ students: 0, courses: 0, completions: 0, rating: 0 });
    const statsRef = useRef(null);
    const [statsVisible, setStatsVisible] = useState(false);

    const totalEnrolled = COURSES.reduce((s, c) => s + c.enrolled, 0);
    const totalCompleted = COURSES.reduce((s, c) => s + c.completed, 0);
    const categories = ["All", ...Array.from(new Set(COURSES.map(c => c.category)))];
    const filteredCourses = activeCategory === "All" ? COURSES : COURSES.filter(c => c.category === activeCategory);

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navigate = useNavigate();


    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
            { threshold: 0.3 }
        );
        if (statsRef.current) observer.observe(statsRef.current);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!statsVisible) return;
        const targets = { students: totalEnrolled, courses: COURSES.length, completions: totalCompleted, rating: 49 };
        const duration = 1600;
        const start = performance.now();
        const animate = (now) => {
            const elapsed = Math.min((now - start) / duration, 1);
            const ease = 1 - Math.pow(1 - elapsed, 3);
            setCounters({
                students: Math.round(ease * targets.students),
                courses: Math.round(ease * targets.courses),
                completions: Math.round(ease * targets.completions),
                rating: Math.round(ease * targets.rating),
            });
            if (elapsed < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }, [statsVisible]);

    return (
        <div style={{ minHeight: "100vh", background: "#080c18", fontFamily: "'DM Mono', monospace", color: "#c8d0e8", overflowX: "hidden" }}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&family=Syne:wght@700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #080c18; }
        ::-webkit-scrollbar-thumb { background: #1e2a3d; border-radius: 3px; }

        @keyframes fadeUp   { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn   { from { opacity:0; } to { opacity:1; } }
        @keyframes pulse    { 0%,100%{opacity:1;transform:scale(1);} 50%{opacity:0.5;transform:scale(0.95);} }
        @keyframes orbit    { from{transform:rotate(0deg) translateX(110px) rotate(0deg);} to{transform:rotate(360deg) translateX(110px) rotate(-360deg);} }
        @keyframes orbit2   { from{transform:rotate(120deg) translateX(140px) rotate(-120deg);} to{transform:rotate(480deg) translateX(140px) rotate(-480deg);} }
        @keyframes orbit3   { from{transform:rotate(240deg) translateX(90px) rotate(-240deg);} to{transform:rotate(600deg) translateX(90px) rotate(-600deg);} }
        @keyframes glow     { 0%,100%{box-shadow:0 0 20px rgba(232,255,71,0.3);} 50%{box-shadow:0 0 50px rgba(232,255,71,0.6);} }
        @keyframes marquee  { from{transform:translateX(0);} to{transform:translateX(-50%);} }
        @keyframes shimmer  { 0%{background-position:-400px 0;} 100%{background-position:400px 0;} }
        @keyframes float    { 0%,100%{transform:translateY(0px);} 50%{transform:translateY(-8px);} }

        .hero-tag { animation: fadeUp 0.7s ease 0.1s both; }
        .hero-h1  { animation: fadeUp 0.7s ease 0.2s both; }
        .hero-sub { animation: fadeUp 0.7s ease 0.35s both; }
        .hero-cta { animation: fadeUp 0.7s ease 0.5s both; }
        .hero-badges { animation: fadeUp 0.7s ease 0.65s both; }

        .course-card { transition: all 0.28s cubic-bezier(0.34,1.56,0.64,1); cursor: pointer; }
        .course-card:hover { transform: translateY(-6px) scale(1.01) !important; }

        .nav-link { transition: color 0.2s; color: #6b7a9a; font-size: 12px; letter-spacing: 0.06em; text-transform: uppercase; cursor: pointer; padding: 4px 0; border: none; background: transparent; font-family: 'DM Mono', monospace; }
        .nav-link:hover { color: #e8ff47; }

        .cat-btn { transition: all 0.2s; cursor: pointer; border: none; font-family: 'DM Mono', monospace; font-size: 11px; letter-spacing: 0.06em; text-transform: uppercase; padding: 7px 16px; border-radius: 20px; }

        .feat-card { transition: all 0.25s ease; }
        .feat-card:hover { transform: translateY(-4px); }

        .cta-btn-primary { transition: all 0.2s; }
        .cta-btn-primary:hover { background: #c8d020 !important; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(232,255,71,0.3); }
        .cta-btn-secondary { transition: all 0.2s; }
        .cta-btn-secondary:hover { border-color: #e8ff47 !important; color: #e8ff47 !important; background: rgba(232,255,71,0.05) !important; }

        .testimonial-card { transition: all 0.25s ease; }
        .testimonial-card:hover { transform: translateY(-4px); border-color: #2a3a55 !important; }

        .stars { color: #f59e0b; font-size: 12px; letter-spacing: 2px; }
      `}</style>

            {/* ── NAVBAR ──────────────────────────────────────────── */}
            <nav style={{
                position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
                background: scrollY > 40 ? "rgba(8,12,24,0.96)" : "transparent",
                backdropFilter: scrollY > 40 ? "blur(16px)" : "none",
                borderBottom: scrollY > 40 ? "1px solid #1e2a3d" : "1px solid transparent",
                transition: "all 0.3s ease",
                padding: "0 48px", height: "68px",
                display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
                {/* Logo */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: "34px", height: "34px", background: "#e8ff47", borderRadius: "9px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "17px", animation: "glow 3s ease-in-out infinite" }}>⚡</div>
                    <span style={{ fontFamily: "'Syne', sans-serif", fontSize: "18px", fontWeight: "800", color: "#fff", letterSpacing: "-0.02em" }}>
                        EduLearn<span style={{ color: "#e8ff47" }}>.</span>
                    </span>
                </div>

                {/* Nav links */}
                <div style={{ display: "flex", gap: "32px", alignItems: "center" }}>
                    {["Courses", "Features", "Testimonials"].map(l => (
                        <button key={l} className="nav-link">{l}</button>
                    ))}
                </div>

                {/* CTA buttons */}
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <button
                        className="cta-btn-secondary"
                        onClick={() => navigate("/user/dashboard")}
                        style={{ padding: "8px 18px", borderRadius: "8px", border: "1px solid #1e2a3d", background: "transparent", color: "#c8d0e8", fontFamily: "'DM Mono', monospace", fontSize: "11px", letterSpacing: "0.06em", textTransform: "uppercase", cursor: "pointer" }}>
                        Student
                    </button>
                    <button
                        className="cta-btn-primary"
                        onClick={() => navigate("/admin/dashboard")}
                        style={{ padding: "8px 18px", borderRadius: "8px", border: "none", background: "#e8ff47", color: "#080c18", fontFamily: "'DM Mono', monospace", fontSize: "11px", fontWeight: "500", letterSpacing: "0.06em", textTransform: "uppercase", cursor: "pointer" }}>
                        Admin →
                    </button>
                </div>
            </nav>

            {/* ── HERO ────────────────────────────────────────────── */}
            <section style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", padding: "100px 48px 60px", overflow: "hidden" }}>
                {/* Grid bg */}
                <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(232,255,71,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(232,255,71,0.025) 1px, transparent 1px)", backgroundSize: "72px 72px", pointerEvents: "none" }} />
                {/* Radial glow top-right */}
                <div style={{ position: "absolute", top: "-150px", right: "-100px", width: "700px", height: "700px", background: "radial-gradient(circle, rgba(232,255,71,0.07) 0%, transparent 65%)", pointerEvents: "none" }} />
                {/* Radial glow bottom-left */}
                <div style={{ position: "absolute", bottom: "-100px", left: "-80px", width: "500px", height: "500px", background: "radial-gradient(circle, rgba(0,212,255,0.055) 0%, transparent 65%)", pointerEvents: "none" }} />

                <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", gap: "48px", flexWrap: "wrap" }}>

                    {/* Left: Text */}
                    <div style={{ maxWidth: "620px", flex: "1 1 400px" }}>
                        {/* Live badge */}
                        <div className="hero-tag" style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#e8ff4710", border: "1px solid #e8ff4730", borderRadius: "20px", padding: "6px 14px", marginBottom: "32px" }}>
                            <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#e8ff47", animation: "pulse 2s infinite", display: "inline-block" }} />
                            <span style={{ color: "#e8ff47", fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase" }}>1,278 students learning right now</span>
                        </div>

                        <h1 className="hero-h1" style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(44px, 6vw, 76px)", fontWeight: "800", color: "#fff", letterSpacing: "-0.04em", lineHeight: "1.02", marginBottom: "24px" }}>
                            Level Up Your<br />
                            <span style={{ color: "#e8ff47", position: "relative", display: "inline-block" }}>
                                Tech Career
                                <span style={{ position: "absolute", bottom: "-4px", left: 0, right: 0, height: "3px", background: "linear-gradient(90deg, #e8ff47, transparent)", borderRadius: "2px" }} />
                            </span>
                            <br />
                            <span style={{ color: "#6b7a9a", fontSize: "0.7em", fontStyle: "normal" }}>with real projects</span>
                        </h1>

                        <p className="hero-sub" style={{ color: "#8892a8", fontSize: "15px", lineHeight: "1.8", maxWidth: "500px", marginBottom: "36px" }}>
                            World-class courses in Frontend, Backend, Design, Data & DevOps.
                            Structured learning paths, hands-on projects, and industry certificates
                            that get you hired.
                        </p>

                        <div className="hero-cta" style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "44px" }}>
                            <button
                                className="cta-btn-primary"
                                onClick={() => onNavigate && onNavigate("user")}
                                style={{ padding: "15px 36px", borderRadius: "10px", border: "none", background: "#e8ff47", color: "#080c18", fontFamily: "'Syne', sans-serif", fontSize: "15px", fontWeight: "800", letterSpacing: "-0.01em", cursor: "pointer" }}>
                                Start Learning Free →
                            </button>
                            <button
                                className="cta-btn-secondary"
                                onClick={() => onNavigate && onNavigate("admin")}
                                style={{ padding: "15px 36px", borderRadius: "10px", border: "1px solid #1e2a3d", background: "transparent", color: "#c8d0e8", fontFamily: "'Syne', sans-serif", fontSize: "15px", fontWeight: "700", cursor: "pointer" }}>
                                View Admin Panel
                            </button>
                        </div>

                        {/* Trust badges */}
                        <div className="hero-badges" style={{ display: "flex", gap: "24px", alignItems: "center", flexWrap: "wrap" }}>
                            {[
                                { icon: "🏅", text: "Certificates included" },
                                { icon: "⚡", text: "Self-paced learning" },
                                { icon: "🎯", text: "Project-based" },
                            ].map((b, i) => (
                                <div key={i} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                    <span style={{ fontSize: "14px" }}>{b.icon}</span>
                                    <span style={{ color: "#6b7a9a", fontSize: "11px", letterSpacing: "0.04em" }}>{b.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Orbital visual */}
                    <div style={{ position: "relative", width: "320px", height: "320px", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", animation: "float 5s ease-in-out infinite" }}>
                        {/* Outer ring */}
                        <div style={{ position: "absolute", width: "300px", height: "300px", border: "1px solid rgba(232,255,71,0.12)", borderRadius: "50%" }} />
                        <div style={{ position: "absolute", width: "220px", height: "220px", border: "1px dashed rgba(0,212,255,0.1)", borderRadius: "50%" }} />
                        {/* Center hub */}
                        <div style={{ width: "80px", height: "80px", background: "linear-gradient(135deg, #e8ff47, #c8d020)", borderRadius: "20px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "36px", boxShadow: "0 0 60px rgba(232,255,71,0.4), 0 0 120px rgba(232,255,71,0.15)", zIndex: 2 }}>⚡</div>
                        {/* Orbiting nodes */}
                        {[
                            { emoji: "⚛️", anim: "orbit 8s linear infinite", color: CAT_META.Frontend.color },
                            { emoji: "📊", anim: "orbit2 11s linear infinite", color: CAT_META.Data.color },
                            { emoji: "🔧", anim: "orbit3 7s linear infinite", color: CAT_META.Backend.color },
                        ].map((node, i) => (
                            <div key={i} style={{ position: "absolute", width: "44px", height: "44px", background: "#111827", border: `1px solid ${node.color}44`, borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", animation: node.anim, boxShadow: `0 0 16px ${node.color}22` }} >
                                {node.emoji}
                            </div>
                        ))}
                        {/* Floating mini cards */}
                        <div style={{ position: "absolute", top: "-10px", right: "-40px", background: "#111827", border: "1px solid #1e2a3d", borderRadius: "10px", padding: "10px 14px", whiteSpace: "nowrap", boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }}>
                            <div style={{ color: "#34d399", fontSize: "13px", fontWeight: "700" }}>+312 enrolled</div>
                            <div style={{ color: "#6b7a9a", fontSize: "10px" }}>React Fundamentals</div>
                        </div>
                        <div style={{ position: "absolute", bottom: "-10px", left: "-40px", background: "#111827", border: "1px solid #1e2a3d", borderRadius: "10px", padding: "10px 14px", whiteSpace: "nowrap", boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }}>
                            <div style={{ color: "#e8ff47", fontSize: "13px", fontWeight: "700" }}>4.9 ★ rating</div>
                            <div style={{ color: "#6b7a9a", fontSize: "10px" }}>Top-rated courses</div>
                        </div>
                    </div>
                </div>

                {/* Scroll indicator */}
                <div style={{ position: "absolute", bottom: "32px", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", opacity: 0.4 }}>
                    <span style={{ fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#6b7a9a" }}>Scroll</span>
                    <div style={{ width: "1px", height: "32px", background: "linear-gradient(to bottom, #6b7a9a, transparent)" }} />
                </div>
            </section>

            {/* ── MARQUEE TICKER ───────────────────────────────────── */}
            <div style={{ borderTop: "1px solid #1e2a3d", borderBottom: "1px solid #1e2a3d", background: "#0d1120", padding: "12px 0", overflow: "hidden" }}>
                <div style={{ display: "flex", animation: "marquee 22s linear infinite", width: "max-content" }}>
                    {[...Array(2)].map((_, rep) => (
                        <div key={rep} style={{ display: "flex", gap: "0" }}>
                            {["React Fundamentals", "Node.js & REST APIs", "Python Data Science", "UI/UX Design", "Cloud Architecture", "GraphQL Mastery", "Data Engineering", "DevOps Pipelines"].map((item, i) => (
                                <span key={i} style={{ padding: "0 28px", color: i % 2 === 0 ? "#6b7a9a" : "#e8ff4760", fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", borderRight: "1px solid #1e2a3d", whiteSpace: "nowrap" }}>
                                    {i % 2 === 0 ? "✦" : "◆"} {item}
                                </span>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* ── STATS ────────────────────────────────────────────── */}
            <section ref={statsRef} style={{ padding: "80px 48px", borderBottom: "1px solid #1e2a3d" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1px", background: "#1e2a3d", border: "1px solid #1e2a3d", borderRadius: "16px", overflow: "hidden" }}>
                    {[
                        { value: counters.students, suffix: "+", label: "Students Enrolled", icon: "👥", color: "#e8ff47" },
                        { value: counters.courses, suffix: "", label: "Expert Courses", icon: "📚", color: "#00d4ff" },
                        { value: counters.completions, suffix: "+", label: "Courses Completed", icon: "🎓", color: "#34d399" },
                        { value: (counters.rating / 10).toFixed(1), suffix: " ★", label: "Average Rating", icon: "⭐", color: "#f59e0b" },
                    ].map((s, i) => (
                        <div key={i} style={{ background: "#0d1120", padding: "40px 32px", display: "flex", flexDirection: "column", gap: "8px", position: "relative", overflow: "hidden" }}>
                            <div style={{ fontSize: "26px", marginBottom: "4px" }}>{s.icon}</div>
                            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "42px", fontWeight: "800", color: s.color, letterSpacing: "-0.04em", lineHeight: 1 }}>
                                {s.value}{s.suffix}
                            </div>
                            <div style={{ color: "#6b7a9a", fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase" }}>{s.label}</div>
                            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "2px", background: `linear-gradient(90deg, ${s.color}40, transparent)` }} />
                        </div>
                    ))}
                </div>
            </section>

            {/* ── COURSES ──────────────────────────────────────────── */}
            <section style={{ padding: "80px 48px", borderBottom: "1px solid #1e2a3d" }}>
                <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "40px", flexWrap: "wrap", gap: "20px" }}>
                    <div>
                        <div style={{ color: "#e8ff47", fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "10px" }}>// Our Curriculum</div>
                        <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: "800", color: "#fff", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
                            Courses Built for<br />Real-World Outcomes
                        </h2>
                    </div>
                    <button
                        onClick={() => onNavigate && onNavigate("user")}
                        style={{ padding: "10px 22px", borderRadius: "8px", border: "1px solid #e8ff4740", background: "#e8ff4710", color: "#e8ff47", fontFamily: "'DM Mono', monospace", fontSize: "11px", cursor: "pointer", letterSpacing: "0.06em", textTransform: "uppercase", transition: "all 0.2s" }}
                        onMouseEnter={e => e.currentTarget.style.background = "#e8ff4720"}
                        onMouseLeave={e => e.currentTarget.style.background = "#e8ff4710"}>
                        Browse All →
                    </button>
                </div>

                {/* Category filter */}
                <div style={{ display: "flex", gap: "8px", marginBottom: "32px", flexWrap: "wrap" }}>
                    {categories.map(cat => {
                        const isActive = activeCategory === cat;
                        const meta = cat !== "All" ? CAT_META[cat] : null;
                        return (
                            <button key={cat} className="cat-btn"
                                onClick={() => setActiveCategory(cat)}
                                style={{
                                    background: isActive ? (meta ? meta.color : "#e8ff47") : "transparent",
                                    color: isActive ? "#080c18" : "#6b7a9a",
                                    border: isActive ? "none" : "1px solid #1e2a3d",
                                    fontWeight: isActive ? "500" : "400",
                                }}>
                                {cat !== "All" && meta?.icon + " "}{cat}
                            </button>
                        );
                    })}
                </div>

                {/* Course cards grid */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "16px" }}>
                    {filteredCourses.map((course, idx) => {
                        const cat = CAT_META[course.category] || CAT_META.Backend;
                        const completionRate = Math.round((course.completed / course.enrolled) * 100);
                        return (
                            <div key={course.id} className="course-card"
                                onClick={() => onNavigate && onNavigate("user")}
                                style={{ background: "#0d1120", border: "1px solid #1e2a3d", borderRadius: "16px", padding: "24px", animation: `fadeUp 0.5s ease ${idx * 60}ms both`, display: "flex", flexDirection: "column", gap: "16px" }}>

                                {/* Header */}
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                    <div style={{ width: "48px", height: "48px", background: cat.bg, border: `1px solid ${cat.border}`, borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px" }}>
                                        {cat.icon}
                                    </div>
                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "6px" }}>
                                        <span style={{ background: cat.bg, color: cat.color, border: `1px solid ${cat.border}`, fontSize: "10px", padding: "3px 10px", borderRadius: "20px", letterSpacing: "0.05em" }}>
                                            {course.category}
                                        </span>
                                        {course.certificateAvailable && (
                                            <span style={{ color: "#f59e0b", fontSize: "10px", display: "flex", alignItems: "center", gap: "3px" }}>🏅 Cert</span>
                                        )}
                                    </div>
                                </div>

                                {/* Title */}
                                <div>
                                    <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "17px", fontWeight: "700", color: "#fff", lineHeight: 1.3, marginBottom: "6px" }}>{course.title}</h3>
                                    <div className="stars">{"★".repeat(Math.round(course.rating))}{"☆".repeat(5 - Math.round(course.rating))}</div>
                                </div>

                                {/* Meta row */}
                                <div style={{ display: "flex", gap: "16px" }}>
                                    {[{ icon: "⏱", v: course.duration }, { icon: "📖", v: `${course.lessons} lessons` }].map((m, i) => (
                                        <span key={i} style={{ color: "#6b7a9a", fontSize: "11px", display: "flex", alignItems: "center", gap: "5px" }}>{m.icon} {m.v}</span>
                                    ))}
                                </div>

                                {/* Completion bar */}
                                <div>
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                                        <span style={{ color: "#6b7a9a", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.07em" }}>Completion Rate</span>
                                        <span style={{ color: cat.color, fontSize: "11px", fontWeight: "700" }}>{completionRate}%</span>
                                    </div>
                                    <div style={{ height: "4px", background: "#1e2a3d", borderRadius: "2px" }}>
                                        <div style={{ height: "100%", width: `${completionRate}%`, background: `linear-gradient(90deg, ${cat.color}, ${cat.color}99)`, borderRadius: "2px" }} />
                                    </div>
                                </div>

                                {/* Footer */}
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "12px", borderTop: "1px solid #1e2a3d" }}>
                                    <span style={{ color: "#6b7a9a", fontSize: "11px" }}>👥 {course.enrolled.toLocaleString()} enrolled</span>
                                    <span style={{ color: cat.color, fontSize: "11px", fontWeight: "500" }}>Start →</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* ── FEATURES ─────────────────────────────────────────── */}
            <section style={{ padding: "80px 48px", borderBottom: "1px solid #1e2a3d", background: "#0a0e1a" }}>
                <div style={{ textAlign: "center", marginBottom: "56px" }}>
                    <div style={{ color: "#00d4ff", fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "12px" }}>// Why EduLearn</div>
                    <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: "800", color: "#fff", letterSpacing: "-0.03em" }}>
                        Everything You Need<br />to Succeed
                    </h2>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px", maxWidth: "1100px", margin: "0 auto" }}>
                    {[
                        { icon: "⚡", title: "Structured Learning Paths", desc: "Curated sequences that take you from beginner to job-ready without wasted time.", color: "#e8ff47", n: "01" },
                        { icon: "🏅", title: "Industry Certificates", desc: "Download verified certificates upon completion to showcase on your resume and LinkedIn.", color: "#f59e0b", n: "02" },
                        { icon: "📊", title: "Progress Tracking", desc: "Real-time dashboards and analytics keep you motivated and show exactly where you stand.", color: "#00d4ff", n: "03" },
                        { icon: "🎯", title: "Project-Based Learning", desc: "Every course includes hands-on projects that simulate real workplace challenges.", color: "#34d399", n: "04" },
                        { icon: "🔁", title: "Lifetime Access", desc: "Purchase once and revisit any time. Content is continuously updated as tech evolves.", color: "#a78bfa", n: "05" },
                        { icon: "💬", title: "Active Community", desc: "Join thousands of learners in discussions, code reviews, and peer feedback.", color: "#ff6b35", n: "06" },
                    ].map((f, i) => (
                        <div key={i} className="feat-card"
                            style={{ background: "#0d1120", border: "1px solid #1e2a3d", borderRadius: "14px", padding: "28px", position: "relative", overflow: "hidden" }}
                            onMouseEnter={e => e.currentTarget.style.borderColor = f.color + "55"}
                            onMouseLeave={e => e.currentTarget.style.borderColor = "#1e2a3d"}>
                            <div style={{ position: "absolute", top: "16px", right: "18px", fontFamily: "'Syne', sans-serif", fontSize: "32px", fontWeight: "800", color: f.color + "10", letterSpacing: "-0.04em" }}>{f.n}</div>
                            <div style={{ fontSize: "28px", marginBottom: "14px" }}>{f.icon}</div>
                            <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "15px", fontWeight: "700", color: "#fff", marginBottom: "8px", lineHeight: 1.3 }}>{f.title}</h3>
                            <p style={{ color: "#6b7a9a", fontSize: "12px", lineHeight: "1.7" }}>{f.desc}</p>
                            <div style={{ position: "absolute", bottom: 0, left: 0, width: "0", height: "2px", background: f.color, transition: "width 0.3s ease" }}
                                onMouseEnter={e => e.currentTarget.style.width = "100%"}
                            />
                        </div>
                    ))}
                </div>
            </section>

            {/* ── TESTIMONIALS ─────────────────────────────────────── */}
            <section style={{ padding: "80px 48px", borderBottom: "1px solid #1e2a3d" }}>
                <div style={{ textAlign: "center", marginBottom: "52px" }}>
                    <div style={{ color: "#a78bfa", fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "12px" }}>// Student Stories</div>
                    <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: "800", color: "#fff", letterSpacing: "-0.03em" }}>
                        What Our Graduates Say
                    </h2>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px", maxWidth: "1000px", margin: "0 auto" }}>
                    {TESTIMONIALS.map((t, i) => (
                        <div key={i} className="testimonial-card"
                            style={{ background: "#0d1120", border: "1px solid #1e2a3d", borderRadius: "16px", padding: "28px", display: "flex", flexDirection: "column", gap: "16px" }}>
                            {/* Stars */}
                            <div className="stars">★★★★★</div>
                            {/* Quote */}
                            <p style={{ color: "#c8d0e8", fontSize: "13px", lineHeight: "1.7", fontStyle: "italic", flex: 1 }}>"{t.text}"</p>
                            {/* Author */}
                            <div style={{ display: "flex", alignItems: "center", gap: "12px", paddingTop: "16px", borderTop: "1px solid #1e2a3d" }}>
                                <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: t.color + "20", border: `1px solid ${t.color}44`, display: "flex", alignItems: "center", justifyContent: "center", color: t.color, fontSize: "13px", fontWeight: "700", flexShrink: 0 }}>
                                    {t.avatar}
                                </div>
                                <div>
                                    <div style={{ color: "#fff", fontSize: "13px", fontWeight: "500" }}>{t.name}</div>
                                    <div style={{ color: "#6b7a9a", fontSize: "11px", marginTop: "2px" }}>{t.role}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── CTA BANNER ───────────────────────────────────────── */}
            <section style={{ padding: "80px 48px" }}>
                <div style={{ position: "relative", background: "linear-gradient(135deg, #0f1928 0%, #0d1120 50%, #0a1520 100%)", border: "1px solid #1e2a3d", borderRadius: "24px", padding: "64px 56px", overflow: "hidden", textAlign: "center" }}>
                    {/* Background effects */}
                    <div style={{ position: "absolute", top: "-80px", left: "50%", transform: "translateX(-50%)", width: "600px", height: "300px", background: "radial-gradient(ellipse, rgba(232,255,71,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg, transparent, #e8ff4740, transparent)" }} />

                    <div style={{ position: "relative" }}>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#e8ff4710", border: "1px solid #e8ff4730", borderRadius: "20px", padding: "6px 16px", marginBottom: "24px" }}>
                            <span style={{ color: "#e8ff47", fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase" }}>🚀 Join {totalEnrolled.toLocaleString()}+ learners today</span>
                        </div>
                        <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(32px, 5vw, 56px)", fontWeight: "800", color: "#fff", letterSpacing: "-0.04em", lineHeight: 1.05, marginBottom: "16px" }}>
                            Ready to Start<br />Your Journey?
                        </h2>
                        <p style={{ color: "#6b7a9a", fontSize: "14px", maxWidth: "420px", margin: "0 auto 40px", lineHeight: "1.7" }}>
                            Pick a course, track your progress, and earn certificates that get you noticed by top tech companies.
                        </p>
                        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
                            <button
                                className="cta-btn-primary"
                                onClick={() => navigate("/user/dashboard")}
                                style={{ padding: "16px 40px", borderRadius: "12px", border: "none", background: "#e8ff47", color: "#080c18", fontFamily: "'Syne', sans-serif", fontSize: "16px", fontWeight: "800", letterSpacing: "-0.01em", cursor: "pointer" }}>
                                Go to Student Dashboard →
                            </button>
                            <button
                                className="cta-btn-secondary"
                                   onClick={() => navigate("/admin/dashboard")}
                                style={{ padding: "16px 40px", borderRadius: "12px", border: "1px solid #1e2a3d", background: "transparent", color: "#c8d0e8", fontFamily: "'Syne', sans-serif", fontSize: "16px", fontWeight: "700", cursor: "pointer" }}>
                                Admin Panel
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── FOOTER ───────────────────────────────────────────── */}
            <footer style={{ borderTop: "1px solid #1e2a3d", padding: "40px 48px 32px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "32px", marginBottom: "32px" }}>
                    <div style={{ maxWidth: "260px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                            <div style={{ width: "30px", height: "30px", background: "#e8ff47", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px" }}>⚡</div>
                            <span style={{ fontFamily: "'Syne', sans-serif", fontSize: "16px", fontWeight: "800", color: "#fff", letterSpacing: "-0.02em" }}>EduLearn<span style={{ color: "#e8ff47" }}>.</span></span>
                        </div>
                        <p style={{ color: "#6b7a9a", fontSize: "12px", lineHeight: "1.7" }}>World-class tech education for the next generation of developers, designers, and data scientists.</p>
                    </div>
                    <div style={{ display: "flex", gap: "48px", flexWrap: "wrap" }}>
                        {[
                            { title: "Platform", links: ["Courses", "Certificates", "Quizzes", "Progress"] },
                            { title: "Dashboards", links: ["Student View", "Admin Panel", "Analytics"] },
                        ].map((col, i) => (
                            <div key={i}>
                                <div style={{ color: "#fff", fontSize: "12px", fontWeight: "500", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "14px" }}>{col.title}</div>
                                {col.links.map(l => (
                                    <div key={l} style={{ color: "#6b7a9a", fontSize: "12px", marginBottom: "8px", cursor: "pointer", transition: "color 0.2s" }}
                                        onMouseEnter={e => e.currentTarget.style.color = "#e8ff47"}
                                        onMouseLeave={e => e.currentTarget.style.color = "#6b7a9a"}>
                                        {l}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
                <div style={{ borderTop: "1px solid #1e2a3d", paddingTop: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
                    <span style={{ color: "#6b7a9a", fontSize: "11px" }}>© 2025 EduLearn. All rights reserved.</span>
                    <div style={{ display: "flex", gap: "20px" }}>
                        {["Privacy", "Terms", "Contact"].map(l => (
                            <span key={l} style={{ color: "#6b7a9a", fontSize: "11px", cursor: "pointer", transition: "color 0.2s" }}
                                onMouseEnter={e => e.currentTarget.style.color = "#c8d0e8"}
                                onMouseLeave={e => e.currentTarget.style.color = "#6b7a9a"}>
                                {l}
                            </span>
                        ))}
                    </div>
                </div>
            </footer>
        </div>
    );
}