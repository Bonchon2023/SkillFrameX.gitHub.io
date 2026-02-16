"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Clock, BookOpen } from "lucide-react"; // ไอคอนนาฬิกา และ ไอคอนสมุด
import { Course } from "@/types/schema"; // Import Type สำหรับความปลอดภัยของข้อมูล

// --- ส่วนที่ 1: Type Definition (Props) ---
interface CourseCardProps {
  // รับข้อมูล course และสามารถรับ progress (0-100%) พ่วงมาได้ด้วย
  course: Course & { progress?: number; totalLessons?: number };
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  // --- ส่วนที่ 2: Logic & Data Preparation ---
  // เช็คว่ามีการส่งค่าความคืบหน้ามาไหม (ถ้ามี แสดงว่าเป็นการ์ดในหน้า 'คอร์สของฉัน')
  const hasProgress = typeof course.progress === "number";
  const progress = course.progress || 0;

  // คำนวณจำนวนบทเรียนจากข้อมูลที่มีอยู่
  const lessonCount = course.totalLessons || course.coursesDtl?.length || 0;

  return (
    // ตัวครอบทั้งหมดเป็น Link เพื่อกดเข้าไปดูรายละเอียดคอร์สได้
    <Link href={`/course/${course.id}`} className="group h-full block">
      
      {/* --- ส่วนที่ 3: Card Container (UI/UX) --- */}
      {/* ใช้ Glassmorphism (bg-white/5 backdrop-blur) และมี Hover Effect ยกตัวขึ้น */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden hover:border-secondary/50 hover:shadow-xl hover:shadow-secondary/10 transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col group">

        {/* --- ส่วนที่ 4: Image Section (หน้าปกคอร์ส) --- */}
        <div className="relative aspect-video w-full overflow-hidden bg-slate-800">
          <Image
            src={course.image}
            alt={course.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {/* แผ่นสีดำจางๆ ด้านล่างภาพเพื่อให้ข้อความหัวข้ออ่านง่ายขึ้น */}
          <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent opacity-80"></div>

          {/* Category Badge - ป้ายบอกประเภทคอร์ส (มุมขวาบน) */}
          <div className="absolute top-3 right-3 bg-white/10 backdrop-blur-md px-3 py-1 rounded-lg text-[10px] font-bold text-white border border-white/20 shadow-sm uppercase">
            {course.category}
          </div>
        </div>

        {/* --- ส่วนที่ 5: Content Section (ข้อมูลคอร์ส) --- */}
        <div className="p-5 flex flex-col flex-1">
          {/* ชื่อคอร์ส: มี line-clamp-2 เพื่อจำกัดไม่ให้เกิน 2 บรรทัด */}
          <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-secondary transition-colors min-h-14">
            {course.name}
          </h3>

          {/* เงื่อนไข: ถ้ายังไม่เริ่มเรียน ให้แสดงคำอธิบาย (Description) สั้นๆ */}
          {!hasProgress && (
            <p className="text-slate-400 text-xs mb-4 line-clamp-2 flex-1">
              {course.description}
            </p>
          )}

          {/* --- ส่วนที่ 6: Bottom Info (ข้อมูลส่วนล่าง) --- */}
          <div className="mt-auto pt-4 border-t border-white/10">
            {hasProgress ? (
              
              // 🟢 กรณีที่ 1: กำลังเรียนอยู่ (Show Progress Bar)
              <div className="space-y-2">
                <div className="flex justify-between items-end text-[11px] font-medium">
                  <span className="text-slate-300">
                    <span className="text-white font-bold text-base mr-1">{progress}%</span>
                    Completed
                  </span>
                  <span className="text-secondary flex items-center gap-1">
                    <BookOpen size={12} /> {lessonCount} Lessons
                  </span>
                </div>

                {/* ✅ Rainbow Progress Bar: แถบสีรุ้งแสดงความคืบหน้า */}
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden shadow-inner">
                  <div
                    className="h-full rounded-full transition-all duration-1000 ease-out relative"
                    style={{
                      width: `${progress}%`,
                      // ใช้ CSS Gradient สร้างสีรุ้งจากแดงไปม่วง
                      background: "linear-gradient(90deg, #ef4444, #f97316, #eab308, #22c55e, #3b82f6, #a855f7)"
                    }}
                  >
                    {/* เอฟเฟกต์แสงเงาบนแถบ Progress */}
                    <div className="absolute inset-0 bg-linear-to-b from-white/20 to-transparent"></div>
                  </div>
                </div>
              </div>
            ) : (
              
              // ⚪ กรณีที่ 2: หน้าแรก/ยังไม่เริ่ม (Show Start Learning)
              <div className="flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <BookOpen size={14} className="text-secondary" />
                  <span>{lessonCount} Lessons</span>
                </div>
                <div className="flex items-center gap-1.5 group-hover:text-white transition-colors">
                  <Clock size={14} />
                  <span>Start Learning</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;