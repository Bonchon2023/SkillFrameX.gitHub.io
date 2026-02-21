"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { User, BookOpen, Target, PlayCircle, CheckCircle } from "lucide-react";
import { getAllCourses } from "@/app/service/api";
import { Course } from "@/types/schema";
import { useProgress } from "@/app/hook/useProgress";
import CourseCard from "@/app/components/CourseCard";

interface CourseWithProgress extends Course {
    progress: number;
    completedCount: number;
    totalLessons: number;
}

export default function AccountPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"learning" | "completed">("learning");

    const { completedLessons, enrolledCourses } = useProgress();

    useEffect(() => {
        document.title = "My Account - SkillFrameX";
        getAllCourses()
            .then(setCourses)
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="min-h-screen bg-background text-foreground flex items-center justify-center">Loading profile...</div>;

    // --- Logic Progress ---
    const myEnrolledCourses = courses.filter((course: Course) => enrolledCourses.includes(course.id));

    // calculate progress and total completed lessons for each course
    const processedCourses: CourseWithProgress[] = myEnrolledCourses.map((course: Course) => {
        const totalLessons = course.coursesDtl.length;
        const completedCount = course.coursesDtl.filter((l: { id: string }) => completedLessons.includes(l.id)).length;
        const progress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

        return { ...course, progress, completedCount, totalLessons };
    });

    const inProgressCourses = processedCourses.filter((c) => c.progress < 100);
    const completedCoursesList = processedCourses.filter((c) => c.progress === 100);
    const totalCertificates = completedCoursesList.length;
    const totalLessonsDone = completedLessons.length;

    // --- Data Pie Chart ---
    const categoryCounts: Record<string, number> = {};
    myEnrolledCourses.forEach((c: Course) => {
        categoryCounts[c.category] = (categoryCounts[c.category] || 0) + 1;
    });
    const totalEnrolled = myEnrolledCourses.length;
    const pieColors = ["#1d526d", "#689ea1", "#22c55e", "#f3f0ed", "#94a3b8"];
    const pieData = Object.keys(categoryCounts).map((cat, index) => ({
        name: cat,
        value: Math.round((categoryCounts[cat] / totalEnrolled) * 100),
        color: pieColors[index % pieColors.length]
    }));

    return (
        <div className="min-h-screen bg-background text-foreground pb-20 font-sans">

            {/* --- Banner Section --- */}
            <div className="relative h-40 md:h-48 w-full overflow-hidden bg-linear-to-r from-primary to-background">
                <div className="absolute inset-0 opacity-30">
                    <svg className="w-full h-full text-secondary/50" viewBox="0 0 1440 320" preserveAspectRatio="none">
                        <path fill="currentColor" fillOpacity="0.5" d="M0,160L48,176C96,192,192,224,288,224C384,224,480,192,576,165.3C672,139,768,117,864,128C960,139,1056,181,1152,197.3C1248,213,1344,203,1392,197.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                    </svg>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10 space-y-8">

                {/* --- Profile Header Card --- */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl relative pt-14 md:pt-6 backdrop-blur-md">

                    <div className="absolute left-1/2 -translate-x-1/2 md:left-8 md:translate-x-0 -top-12 md:-top-16 w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-background bg-slate-200 overflow-hidden shadow-lg z-20">
                        <div className="w-full h-full flex items-center justify-center bg-slate-300 text-slate-600">
                            <User className="w-12 h-12 md:w-16 md:h-16" />
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-6 md:pl-40">
                        <div className="flex flex-col items-center md:items-start md:w-1/3 pt-2">
                            <div className="flex items-center gap-2">
                                <span className="bg-yellow-500/20 text-yellow-500 text-[10px] font-bold px-2 py-0.5 rounded-full border border-yellow-500/30">
                                    Student
                                </span>
                            </div>
                            <h1 className="text-xl md:text-2xl font-bold mt-1 text-white text-center md:text-left">Student User</h1>
                            <p className="text-slate-400 text-sm">student@skillframex.com</p>
                        </div>

                        <div className="flex-1 flex flex-col justify-end mt-4 md:mt-0">
                            <div className="grid grid-cols-3 gap-2 md:flex md:gap-8 items-center mb-6 pb-6 border-b border-white/10">
                                <div className="flex flex-col md:flex-row items-center gap-1.5 text-secondary">
                                    <BookOpen size={18} /> <span className="font-bold text-white text-sm md:text-base">{totalLessonsDone} Lessons</span>
                                </div>
                                <div className="flex flex-col md:flex-row items-center gap-1.5 text-green-500">
                                    <CheckCircle size={18} /> <span className="font-bold text-white text-sm md:text-base">{totalCertificates} Certs</span>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 justify-center md:justify-start">
                                <div className="p-2 bg-primary/30 rounded-lg text-secondary shrink-0">
                                    <Target size={20} />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 font-bold uppercase mb-1">Current Goal</p>
                                    <p className="text-sm font-medium text-white max-w-md">
                                        &quot;Become a Full Stack Developer by the end of 2026&quot;
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- Charts Section --- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Left: Lessons Activity */}
                    <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg flex flex-col h-85 backdrop-blur-md">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-white">Lesson Activity</h3>
                                <p className="text-xs text-slate-400">Lessons completed per month</p>
                            </div>
                            <div className="text-right">
                                <span className="text-2xl font-bold text-secondary">{totalLessonsDone}</span>
                                <p className="text-[10px] text-slate-500 uppercase">Total</p>
                            </div>
                        </div>

                        <div className="relative flex-1 w-full pb-8 min-h-0">
                            <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                                <defs>
                                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="var(--secondary)" stopOpacity="0.5" />
                                        <stop offset="100%" stopColor="var(--secondary)" stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                                <line x1="0" y1="25" x2="100" y2="25" stroke="#334155" strokeWidth="0.5" strokeDasharray="2" vectorEffect="non-scaling-stroke" />
                                <line x1="0" y1="50" x2="100" y2="50" stroke="#334155" strokeWidth="0.5" strokeDasharray="2" vectorEffect="non-scaling-stroke" />
                                <line x1="0" y1="75" x2="100" y2="75" stroke="#334155" strokeWidth="0.5" strokeDasharray="2" vectorEffect="non-scaling-stroke" />

                                <path d="M0,80 C20,70 30,20 50,40 S80,60 100,30 V100 H0 Z" fill="url(#chartGradient)" />
                                <path d="M0,80 C20,70 30,20 50,40 S80,60 100,30" fill="none" stroke="var(--secondary)" strokeWidth="2" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
                            </svg>

                            <div className="absolute bottom-0 left-0 w-full flex justify-between text-[10px] text-slate-500 px-1">
                                <span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span><span>Jan</span><span>Feb</span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Interested Categories */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg flex flex-col h-85 backdrop-blur-md">
                        <h3 className="text-lg font-bold text-white mb-4">Interests</h3>
                        <div className="flex-1 flex flex-col items-center justify-center min-h-0">
                            {pieData.length > 0 ? (
                                <>
                                    <div className="w-36 h-36 rounded-full relative shrink-0"
                                        style={{
                                            background: `conic-gradient(${pieData.map((d, i, arr) => {
                                                const prevSum = arr.slice(0, i).reduce((acc, curr) => acc + curr.value, 0);
                                                return `${d.color} ${prevSum}% ${prevSum + d.value}%`;
                                            }).join(', ')})`
                                        }}
                                    >
                                        <div className="absolute inset-[15%] bg-background rounded-full flex items-center justify-center flex-col">
                                            <span className="text-2xl font-bold text-white">{totalEnrolled}</span>
                                            <span className="text-[9px] text-slate-400 uppercase">Courses</span>
                                        </div>
                                    </div>

                                    <div className="w-full mt-6 space-y-2 overflow-y-auto pr-1 custom-scrollbar" style={{ maxHeight: '100px' }}>
                                        {pieData.map((cat, i) => (
                                            <div key={i} className="flex items-center gap-2 text-[11px]">
                                                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }}></div>
                                                <span className="text-slate-300 truncate flex-1">{cat.name}</span>
                                                <span className="text-slate-500">{cat.value}%</span>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <div className="text-center text-slate-500 text-sm">No data available</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* --- Courses Section --- */}
                <div>
                    <div className="flex items-center gap-6 border-b border-white/10 mb-6 overflow-x-auto pb-1 scrollbar-hide">
                        <button
                            onClick={() => setActiveTab("learning")}
                            className={`pb-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap px-1 ${activeTab === "learning" ? "border-yellow-500 text-yellow-500" : "border-transparent text-slate-400 hover:text-white"}`}
                        >
                            <PlayCircle size={16} /> Continue Learning
                        </button>
                        <button
                            onClick={() => setActiveTab("completed")}
                            className={`pb-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap px-1 ${activeTab === "completed" ? "border-green-500 text-green-500" : "border-transparent text-slate-400 hover:text-white"}`}
                        >
                            <CheckCircle size={16} /> Completed Courses
                        </button>
                    </div>

                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 mb-6 flex items-start gap-3 text-xs text-yellow-500/80">
                        <span className="bg-yellow-500 text-black font-bold w-4 h-4 flex items-center justify-center rounded text-[10px] mt-0.5 shrink-0">!</span>
                        <span>Courses with incomplete progress may be archived if inactive for more than 3 months.</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {activeTab === "learning" ? (
                            inProgressCourses.length > 0 ? (
                                // ✅ 2. เรียกใช้ CourseCard โดยส่งค่า course ที่มี progress เข้าไป
                                inProgressCourses.map((course) => <CourseCard key={course.id} course={course} />)
                            ) : (
                                <EmptyState message="No active courses." linkText="Browse Courses" />
                            )
                        ) : (
                            completedCoursesList.length > 0 ? (
                                completedCoursesList.map((course) => <CourseCard key={course.id} course={course} />)
                            ) : (
                                <EmptyState message="No completed courses yet." linkText="Keep learning!" />
                            )
                        )}
                    </div>
                </div>

            </main>
        </div>
    );
}

// --- Sub-components ---

const EmptyState = ({ message, linkText }: { message: string; linkText: string }) => (
    <div className="col-span-full py-12 text-center border border-dashed border-white/10 rounded-xl bg-white/5">
        <p className="text-slate-400 mb-4">{message}</p>
        <Link href="/" className="text-secondary text-sm font-bold hover:underline">
            {linkText}
        </Link>
    </div>
);