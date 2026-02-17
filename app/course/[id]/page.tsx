"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Clock, BookOpen, CheckCircle, PlayCircle, BarChart, Lock } from "lucide-react"; // เพิ่ม Lock icon
import { getCourseById } from "@/app/service/api";
import { useProgress } from "@/app/hook/useProgress";
import { Course } from "@/types/schema";

export default function CourseDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  // 1. ดึงข้อมูล progress และ enrollment
  const { completedLessons, enrolledCourses, enrollCourse } = useProgress(); // ✅ ดึง enrolledCourses, enrollCourse มาใช้

  useEffect(() => {
    if (id) {
      getCourseById(id)
        .then((data) => {
          setCourse(data);
          // ✅ ย้ายมาไว้ข้างใน .then() เพื่อให้มีตัวแปร data ใช้
          if (data) {
            document.title = `${data.name} - SkillFrameX`;
          }
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Loading...</div>;
  if (!course) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Course not found</div>;

  const totalLessons = course.coursesDtl.length;
  const completedCount = course.coursesDtl.filter(l => completedLessons.includes(l.id)).length;
  const progress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  // ✅ เช็คว่าลงทะเบียนหรือยัง?
  const isEnrolled = enrolledCourses.includes(course.id);

  // ✅ ฟังก์ชันกดปุ่ม Enroll
  const handleEnroll = () => {
    enrollCourse(course.id);
    // อาจจะเด้ง Alert หรือ Toast บอกผู้ใช้หน่อยก็ได้
    alert("Enrolled successfully! Let's start learning.");
  };

  return (
    <div className="min-h-screen">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Link href="/" className="inline-flex items-center text-slate-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft size={20} className="mr-2" /> Back to Courses
        </Link>

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left: Course Info */}
          <div className="lg:col-span-2 space-y-6">
            <span className="inline-block px-3 py-1 bg-secondary/10 text-secondary text-xs font-bold uppercase tracking-wider rounded-full border border-secondary/20">
              {course.category}
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
              {course.name}
            </h1>
            <p className="text-lg text-slate-400 leading-relaxed">
              {course.description}
            </p>

            <div className="flex flex-wrap gap-6 text-sm text-slate-400 border-y border-white/10 py-6">
              <div className="flex items-center gap-2">
                <BookOpen size={18} className="text-secondary" />
                <span>{totalLessons} Lessons</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={18} className="text-secondary" />
                <span>3h 45m Total</span>
              </div>
              <div className="flex items-center gap-2">
                <BarChart size={18} className="text-secondary" />
                <span>Beginner Friendly</span>
              </div>
            </div>

            {/* Rainbow Progress Section (โชว์เฉพาะถ้า Enroll แล้ว) */}
            {isEnrolled && progress > 0 && (
              <div className="bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-md">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white font-bold">Your Progress</span>
                  <span className="text-lg font-bold bg-linear-to-r from-red-400 via-yellow-400 to-green-400 bg-clip-text text-transparent">
                    {progress}% Completed
                  </span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-linear-to-r from-red-500 via-green-500 to-purple-500 bg-size-[200%_200%] animate-gradient-xy transition-all duration-1000 ease-out"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  You&apos;ve finished {completedCount} out of {totalLessons} lessons. Keep going!
                </p>
              </div>
            )}

            {/* Course Content List */}
            <div className="space-y-4 pt-4">
              <h3 className="text-xl font-bold text-white mb-4">Course Content</h3>
              {course.coursesDtl.map((lesson, idx) => {
                const isCompleted = completedLessons.includes(lesson.id);

                //  ถ้ายังไม่ Enroll ให้เป็น Div ธรรมดา (คลิกไม่ได้) และโชว์กุญแจล็อค
                if (!isEnrolled) {
                  return (
                    <div key={lesson.id} className="flex items-center justify-between p-4 rounded-xl border bg-white/5 border-white/10 opacity-60 cursor-not-allowed backdrop-blur-sm">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 bg-white/10 text-slate-500">
                          {idx + 1}
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-400">{lesson.title}</h4>
                          <span className="text-xs text-slate-600">{lesson.duration || "15 min"}</span>
                        </div>
                      </div>
                      <Lock size={20} className="text-slate-600" />
                    </div>
                  )
                }

                // ถ้า Enroll แล้ว ให้เป็น Link ปกติ
                return (
                  <Link
                    key={lesson.id}
                    href={`/course/${course.id}/lesson/${lesson.id}`}
                    className={`flex items-center justify-between p-4 rounded-xl border transition-all group backdrop-blur-sm ${isCompleted
                      ? "bg-white/5 border-green-900/50 hover:border-green-500/50"
                      : "bg-white/5 border-white/10 hover:border-secondary/50 hover:shadow-lg hover:shadow-secondary/10"
                      }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 transition-colors ${isCompleted ? "bg-green-500 text-black" : "bg-white/10 text-slate-400 group-hover:bg-secondary group-hover:text-white"
                        }`}>
                        {isCompleted ? <CheckCircle size={20} /> : idx + 1}
                      </div>
                      <div>
                        <h4 className={`font-semibold transition-colors ${isCompleted ? "text-slate-300" : "text-white group-hover:text-secondary"}`}>
                          {lesson.title}
                        </h4>
                        <span className="text-xs text-slate-500">{lesson.duration || "15 min"}</span>
                      </div>
                    </div>
                    {isCompleted ? (
                      <span className="text-xs font-bold text-green-500 px-3 py-1 bg-green-500/10 rounded-full border border-green-500/20">
                        Completed
                      </span>
                    ) : (
                      <PlayCircle size={24} className="text-slate-600 group-hover:text-secondary transition-colors" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right: Sticky Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/10 group relative aspect-video">
                <Image
                  src={course.image}
                  alt={course.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, 400px"
                />
                <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent opacity-60"></div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center backdrop-blur-md">
                <p className="text-slate-400 mb-6 text-sm">
                  Full lifetime access • Certificate of completion
                </p>

                {/*ปุ่ม Enroll Logic */}
                {isEnrolled ? (
                  <Link
                    href={`/course/${course.id}/lesson/${course.coursesDtl[0]?.id}`}
                    className="block w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all transform hover:-translate-y-1 bg-linear-to-r from-secondary to-blue-600 hover:from-secondary/80 hover:to-blue-500 text-white shadow-secondary/20"
                  >
                    {progress > 0 ? "Continue Learning" : "Start Learning"}
                  </Link>
                ) : (
                  <button
                    onClick={handleEnroll}
                    className="block w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all transform hover:-translate-y-1 bg-white text-background hover:bg-secondary hover:text-white hover:shadow-white/10"
                  >
                    Enroll Now
                  </button>
                )}

              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}