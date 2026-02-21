"use client"; // ระบุว่าเป็น Client Component เพื่อให้สามารถใช้งาน Hooks อย่าง useEffect และ useState ได้

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, User, ArrowRight } from "lucide-react";
import { getAllBlogs } from "@/app/service/api";
import { BlogPost } from "@/types/schema";

export default function BlogPage() {
  // --- ส่วนที่ 1: State Management (การจัดการสถานะภายใน) ---
  // blogs: ใช้เก็บอาเรย์ของบทความที่ดึงมาจากฐานข้อมูล
  const [blogs, setBlogs] = useState<BlogPost[]>([]); 
  // loading: ใช้เช็คสถานะว่ากำลังดึงข้อมูลอยู่หรือไม่ เพื่อแสดงผลหน้า Loading
  const [loading, setLoading] = useState(true); 

  // --- ส่วนที่ 2: Data Fetching (ส่วนเชื่อมต่อข้อมูลหลังบ้าน) ---
  useEffect(() => {
    // ฟังก์ชันนี้จะทำงานทันทีที่หน้าเว็บโหลดขึ้นมา (Mounting)
    getAllBlogs()
      .then(setBlogs) // เมื่อดึงข้อมูลสำเร็จ ให้อัปเดตค่าลงใน state blogs
      .catch((err) => console.error(err)) // หากเกิดข้อผิดพลาด ให้แสดงใน console
      .finally(() => setLoading(false)); // เมื่อทำงานเสร็จสิ้น (ไม่ว่าจะสำเร็จหรือพลาด) ให้ปิดหน้า Loading
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200">
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* --- ส่วนที่ 3: Page Header --- */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Our <span className="text-cyan-400">Latest Articles</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Stay updated with the latest trends in web development, design, and career advice.
          </p>
        </div>

        {/* --- ส่วนที่ 4: Conditional Rendering (การแสดงผลตามเงื่อนไข) --- */}
        {/* ถ้าสถานะ loading เป็นจริง ให้แสดงข้อความแจ้งเตือนผู้ใช้ */}
        {loading && <div className="text-center text-white">Loading articles...</div>}

        {/* --- ส่วนที่ 5: Blog Grid (ส่วนแสดงผลรายการบทความ) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* ใช้การ .map() เพื่อวนลูปสร้างการ์ดบทความตามจำนวนข้อมูลที่มีใน blogs */}
          {blogs.map((blog) => (
            <article key={blog.id} className="bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 hover:border-cyan-500/50 transition-all hover:-translate-y-1 hover:shadow-xl group flex flex-col h-full">
              
              {/* 5.1 Image & Tags Section (ส่วนรูปภาพและป้ายกำกับ) */}
              <div className="h-48 overflow-hidden relative">
                <Image 
                  src={blog.image} 
                  alt={blog.title} 
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                {/* วนลูปแสดง Tags ของบทความนั้น ๆ */}
                <div className="absolute top-4 left-4 flex gap-2">
                  {blog.tags.map(tag => (
                    <span key={tag} className="bg-slate-900/80 backdrop-blur-sm text-cyan-400 text-xs font-bold px-2 py-1 rounded-md">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* 5.2 Content Details (ส่วนเนื้อหาและข้อมูลรายละเอียด) */}
              <div className="p-6 flex flex-col flex-1">
                {/* ข้อมูล Meta (วันที่และผู้เขียน) */}
                <div className="flex items-center gap-4 text-xs text-slate-400 mb-3">
                  <span className="flex items-center gap-1"><Calendar size={12} /> {blog.date}</span>
                  <span className="flex items-center gap-1"><User size={12} /> {blog.author}</span>
                </div>
                
                {/* หัวข้อเรื่องและบทคัดย่อ (Excerpt) */}
                <h2 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-cyan-400 transition-colors">
                  {blog.title}
                </h2>
                <p className="text-slate-400 text-sm mb-4 line-clamp-3 flex-1">
                  {blog.excerpt}
                </p>
                <Link 
                  href={`/blog/${blog.id}`} 
                  className="inline-flex items-center text-cyan-400 font-semibold text-sm hover:text-cyan-300 transition-colors mt-auto"
                >
                  Read Article <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

            </article>
          ))}
        </div>
      </main>
    </div>
  );
}