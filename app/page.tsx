"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation"; // ดึงค่า Parameter จาก URL (เช่น ?search=...)
import CourseCard from "./components/CourseCard";
import HeroSlider from "./components/HeroSlider";
import { Course } from "@/types/schema";
import { getAllCourses, getCategories } from "@/app/service/api"; // ดึงข้อมูลคอร์สและหมวดหมู่จากหลังบ้าน
import { SearchX, Loader2 } from "lucide-react"; // ไอคอนตอนหาไม่เจอ และไอคอนโหลด (Spinner)
import { useProgress } from "@/app/hook/useProgress"; // ติดตามว่าผู้ใช้เรียนถึงไหนแล้ว

// ✅ ส่วนที่ 1: Type Definition (การกำหนดโครงสร้างข้อมูล)
// สร้าง Type ใหม่ที่รวมเอาค่า Course ปกติ + ข้อมูล Progress (ความคืบหน้า) เข้าด้วยกัน
type CourseWithProgress = Course & { progress?: number; totalLessons?: number };

function HomeContent() {
  // --- ส่วนที่ 2: Hooks & States (การจัดการข้อมูลและตัวแปร) ---
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("search")?.toLowerCase() || ""; // เก็บคำค้นหาจาก URL

  const [courses, setCourses] = useState<Course[]>([]); // เก็บรายการคอร์สทั้งหมดที่โหลดมา
  const [categories, setCategories] = useState<string[]>([]); // เก็บรายชื่อหมวดหมู่
  const [selectedCategory, setSelectedCategory] = useState("All"); // หมวดหมู่ที่ผู้ใช้เลือกกด
  const [loading, setLoading] = useState(true); // สถานะการโหลดข้อมูล

  // ดึงข้อมูลการลงทะเบียนเรียนและความสำเร็จของบทเรียนจาก Custom Hook
  const { completedLessons, enrolledCourses } = useProgress();

  // --- ส่วนที่ 3: Data Fetching (การดึงข้อมูลจาก Server) ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // ใช้ Promise.all เพื่อดึงทั้งคอร์สและหมวดหมู่พร้อมกัน (ช่วยให้เว็บเร็วขึ้น)
        const [coursesData, categoriesData] = await Promise.all([
          getAllCourses(),
          getCategories()
        ]);

        setCourses(coursesData || []);
        setCategories(["All", ...(categoriesData || [])]); // เพิ่ม "All" เป็นหมวดหมู่แรกเสมอ
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // --- ส่วนที่ 4: Business Logic (การประมวลผลข้อมูล) ---
  
  // 4.1 คำนวณความก้าวหน้า (Progress) ของแต่ละคอร์สที่ผู้ใช้ "ลงทะเบียนแล้ว"
  const coursesWithProgress: CourseWithProgress[] = courses.map((course) => {
    const isEnrolled = enrolledCourses.includes(course.id); // เช็คว่าผู้ใช้ลงทะเบียนคอร์สนี้หรือยัง

    if (isEnrolled) {
      const totalLessons = course.coursesDtl?.length || 0;
      // นับจำนวนบทเรียนย่อยที่ผู้ใช้เรียนจบแล้ว
      const completedCount = course.coursesDtl?.filter((l) => completedLessons.includes(l.id)).length || 0;
      const progress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

      return { ...course, progress, totalLessons }; // คืนค่าคอร์สพร้อมตัวเลขเปอร์เซ็นต์
    }
    return course;
  });

  // 4.2 ระบบคัดกรอง (Filtering System) - กรองทั้งหมวดหมู่ และคำค้นหา (Search)
  const filteredCourses = coursesWithProgress.filter((course) => {
    const matchesCategory = selectedCategory === "All" || course.category === selectedCategory;

    // เช็คว่าคำค้นหาไปตรงกับ ชื่อ, คำอธิบาย, หมวดหมู่ หรือชื่อบทเรียนย่อยข้างในไหม
    const matchesSearch =
      searchTerm === "" ||
      (course.name?.toLowerCase().includes(searchTerm)) ||
      (course.description?.toLowerCase().includes(searchTerm)) ||
      (course.category?.toLowerCase().includes(searchTerm)) ||
      course.coursesDtl?.some(lesson => lesson.title?.toLowerCase().includes(searchTerm));

    return matchesCategory && matchesSearch;
  });

  // เลือก 5 คอร์สแรกมาทำสไลด์เน้น (Featured)
  const featuredCourses = courses.slice(0, 5);

  return (
    <div className="min-h-screen">
      
      {/* --- ส่วนที่ 5: UI Rendering (การแสดงผล) --- */}

      {/* 5.1 Hero Slider - แสดงสไลด์ถ้าไม่ได้กำลังค้นหา */}
      {!loading && featuredCourses.length > 0 && !searchTerm && (
        <div className="max-w-7xl mx-auto pt-8 px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/10">
            <HeroSlider courses={featuredCourses} />
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* 5.2 Header เมื่อมีการค้นหา */}
        {searchTerm && (
          <div className="text-center mb-12 space-y-4">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
              Explore <span className="text-transparent bg-clip-text bg-linear-to-r from-secondary to-blue-500">SkillFrameX Courses</span>
            </h1>
          </div>
        )}

        {/* 5.3 Category Buttons - ปุ่มเลือกหมวดหมู่คอร์ส */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 border ${
                selectedCategory === category 
                ? "bg-secondary border-secondary text-background" 
                : "bg-white/5 border-white/10 text-slate-400"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* 5.4 Loading State - แสดงไอคอนหมุนตอนโหลดข้อมูล */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-10 h-10 text-secondary animate-spin" />
          </div>
        )}

        {/* 5.5 Course Grid - แสดงผลรายการคอร์สที่กรองแล้ว */}
        {!loading && filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          /* 5.6 Empty State - เมื่อค้นหาแล้วไม่เจอข้อมูล */
          !loading && (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500 bg-white/5 rounded-3xl">
              <SearchX className="w-16 h-16 mb-4 opacity-50" />
              <p className="text-xl font-semibold">No courses found</p>
            </div>
          )
        )}
      </main>
    </div>
  );
}

// Wrapper หลักที่ใช้ Suspense เพื่อรองรับการโหลดคอมโพเนนต์แบบ Asynchronous
export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-900" />}>
      <HomeContent />
    </Suspense>
  );
}