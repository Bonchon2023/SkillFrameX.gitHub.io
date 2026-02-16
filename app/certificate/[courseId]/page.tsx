"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Printer } from "lucide-react";
import { getCourseById } from "@/app/service/api";
import { useProgress } from "@/app/hook/useProgress";
import { Course } from "@/types/schema";

export default function CertificatePage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const { completedLessons, isLoaded } = useProgress();
  const certificateRef = useRef<HTMLDivElement>(null);
  const [certId, setCertId] = useState("");

  useEffect(() => {
    if (courseId) {
      getCourseById(courseId)
        .then(setCourse)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [courseId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCertId(Date.now().toString().slice(-6));
  }, []);

  // Security Check: ถ้ายังเรียนไม่จบ ดีดกลับไปหน้าคอร์ส
  useEffect(() => {
    if (isLoaded && course) {
      const totalLessons = course.coursesDtl.length;
      const completedCount = course.coursesDtl.filter(l => completedLessons.includes(l.id)).length;
      const progress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

      if (progress < 100) {
        alert("You must complete the course to get the certificate!");
        router.push(`/course/${courseId}`);
      }
    }
  }, [isLoaded, course, completedLessons, courseId, router]);

  const handlePrint = () => {
    window.print();
  };

  if (loading || !course) return <div className="min-h-screen bg-background flex items-center justify-center text-foreground">Generating Certificate...</div>;

  return (
    <div className="min-h-screen bg-background text-foreground p-8 print:p-0 print:bg-white">
      {/* Navigation (ซ่อนเวลา Print) */}
      <div className="max-w-4xl mx-auto mb-8 flex justify-between items-center print:hidden">
        <Link href="/account" className="flex items-center text-slate-400 hover:text-white transition-colors">
          <ArrowLeft size={20} className="mr-2" /> Back to Dashboard
        </Link>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-lg shadow-secondary/20"
        >
          <Printer size={18} /> Print Certificate
        </button>
      </div>

      {/* Certificate Container */}
      <div className="max-w-4xl mx-auto bg-white text-black p-10 rounded-xl shadow-2xl relative overflow-hidden print:shadow-none print:w-full print:max-w-none print:h-screen print:rounded-none" ref={certificateRef}>
        {/* Border Design */}
        <div className="absolute inset-4 border-4 border-double border-slate-200 pointer-events-none"></div>
        <div className="absolute top-0 left-0 w-32 h-32 bg-linear-to-br from-secondary/20 to-blue-500/20 rounded-br-full"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-linear-to-tl from-secondary/20 to-blue-500/20 rounded-tl-full"></div>

        <div className="relative z-10 text-center py-16 space-y-8">
          {/* Logo */}
          <div className="flex justify-center items-center gap-2 mb-8">
            <div className="bg-background p-2 rounded-lg">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg>
            </div>
            <span className="text-2xl font-bold tracking-wider text-background">SKILLFRAMEX</span>
          </div>

          <h1 className="text-5xl font-serif text-slate-800 uppercase tracking-widest">Certificate</h1>
          <p className="text-xl text-slate-500 font-serif italic">of Completion</p>

          <div className="py-8">
            <p className="text-slate-500 mb-2">This is to certify that</p>
            <h2 className="text-4xl font-bold text-secondary mb-2 font-serif">Student User</h2>
            <div className="w-64 h-0.5 bg-slate-300 mx-auto"></div>
          </div>

          <div>
            <p className="text-slate-500 mb-4">has successfully completed the course</p>
            <h3 className="text-3xl font-bold text-slate-800 max-w-2xl mx-auto leading-tight">
              {course.name}
            </h3>
          </div>

          <div className="flex justify-around items-end pt-16 px-16">
            <div className="text-center">
              <div className="text-lg font-medium text-slate-800 border-t border-slate-300 pt-2 px-8">
                {new Date().toLocaleDateString()}
              </div>
              <p className="text-xs text-slate-500 uppercase tracking-wider mt-1">Date</p>
            </div>

            {/* Seal */}
            <div className="relative">
              <div className="w-24 h-24 bg-linear-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg border-4 border-yellow-200">
                <span className="text-xs text-center leading-tight">OFFICIAL<br />CERTIFIED</span>
              </div>
            </div>

            <div className="text-center">
              <div className="font-signature text-2xl text-slate-800 border-t border-slate-300 pt-2 px-8">
                SkillFrameX Team
              </div>
              <p className="text-xs text-slate-500 uppercase tracking-wider mt-1">Instructor</p>
            </div>
          </div>

          <div className="text-xs text-slate-300 mt-8">
            Certificate ID: SFX-{course.id}-{certId}
          </div>
        </div>
      </div>
    </div>
  );
}