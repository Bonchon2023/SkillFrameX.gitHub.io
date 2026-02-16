"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, PlayCircle } from "lucide-react";
import { Course } from "@/types/schema";

// --- ส่วนที่ 1: Props Interface ---
// รับข้อมูลอาร์เรย์ของคอร์ส (courses) มาจาก Component Parent
interface HeroSliderProps {
  courses: Course[];
}

export default function HeroSlider({ courses }: HeroSliderProps) {
  // --- ส่วนที่ 2: State Management ---
  // ใช้ currentIndex เพื่อบอกว่าตอนนี้เรากำลังดูสไลด์ที่เท่าไหร่ (เริ่มที่ 0)
  const [currentIndex, setCurrentIndex] = useState(0);

  // --- ส่วนที่ 3: Navigation Logic (ฟังก์ชันการเลื่อน) ---
  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? courses.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  // ใช้ useCallback เพื่อจำกัดการสร้างฟังก์ชันใหม่ ช่วยเรื่อง Performance
  const nextSlide = useCallback(() => {
    if (courses.length === 0) return;
    setCurrentIndex((prevIndex) => {
      const isLastSlide = prevIndex === courses.length - 1;
      return isLastSlide ? 0 : prevIndex + 1;
    });
  }, [courses.length]);

  // --- ส่วนที่ 4: Auto-slide Side Effect ---
  // ตั้งเวลาให้สไลด์เลื่อนเองทุกๆ 5 วินาที (5000ms)
  useEffect(() => {
    if (courses.length === 0) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    // ต้องมี Cleanup Function เพื่อล้าง Timer เมื่อ Component ถูกปิด ป้องกัน Memory Leak
    return () => clearInterval(timer);
  }, [nextSlide, courses.length]);

  // --- ส่วนที่ 5: Rendering Logic ---
  // ถ้าไม่มีข้อมูล ไม่แสดงผลอะไรเลย
  if (!courses || courses.length === 0) return null;

  return (
    <div className="relative w-full h-125 md:h-150 group overflow-hidden bg-background">
      
      {/* 5.1: Slider Container - ใช้ translateX เพื่อเลื่อนสไลด์ในแนวนอน */}
      <div
        className="w-full h-full flex transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {courses.map((course) => (
          <div key={course.id} className="w-full h-full shrink-0 relative">
            
            {/* 5.2: Background Image & Overlays - การแต่งภาพพื้นหลังให้นุ่มนวล */}
            <div className="absolute inset-0">
              <Image
                src={course.image}
                alt={course.name}
                fill
                className="object-cover opacity-50"
                priority // ช่วยให้โหลดภาพใน Hero Section เร็วขึ้น
              />
              {/* ไล่เฉดสีดำจากล่างขึ้นบน และจากซ้ายไปขวา เพื่อให้ตัวหนังสืออ่านง่าย */}
              <div className="absolute inset-0 bg-linear-to-t from-background via-background/60 to-transparent"></div>
              <div className="absolute inset-0 bg-linear-to-r from-background via-background/40 to-transparent"></div>
            </div>

            {/* 5.3: Hero Content - ส่วนของข้อความและปุ่ม Call to Action */}
            <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
              <div className="max-w-2xl space-y-6 animate-fadeIn">
                <span className="inline-block px-3 py-1 rounded-full bg-secondary/20 text-secondary border border-secondary/30 text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                  Featured Course
                </span>
                <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight drop-shadow-lg">
                  {course.name}
                </h1>
                <p className="text-lg md:text-xl text-slate-300 line-clamp-2 drop-shadow-md">
                  {course.description}
                </p>
                <div className="pt-4">
                  <Link
                    href={`/course/${course.id}`}
                    className="inline-flex items-center gap-3 bg-secondary hover:bg-secondary/80 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg shadow-secondary/30 transition-all transform hover:-translate-y-1"
                  >
                    <PlayCircle size={24} />
                    Start Learning Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 5.4: Navigation Arrows - ปุ่มลูกศรซ้าย-ขวา (แสดงเมื่อเอาเมาส์มาวาง) */}
      <button onClick={prevSlide} className="absolute top-1/2 left-4 -translate-y-1/2 p-3 rounded-full bg-black/30 hover:bg-secondary text-white opacity-0 group-hover:opacity-100 z-20 cursor-pointer transition-all">
        <ChevronLeft size={30} />
      </button>

      <button onClick={nextSlide} className="absolute top-1/2 right-4 -translate-y-1/2 p-3 rounded-full bg-black/30 hover:bg-secondary text-white opacity-0 group-hover:opacity-100 z-20 cursor-pointer transition-all">
        <ChevronRight size={30} />
      </button>

      {/* 5.5: Dots Navigation - จุดบอกตำแหน่งสไลด์ด้านล่าง */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
        {courses.map((_, slideIndex) => (
          <div
            key={slideIndex}
            onClick={() => setCurrentIndex(slideIndex)}
            className={`cursor-pointer w-3 h-3 rounded-full transition-all duration-300 ${
              currentIndex === slideIndex ? "bg-secondary w-8" : "bg-slate-500 hover:bg-slate-400"
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
}