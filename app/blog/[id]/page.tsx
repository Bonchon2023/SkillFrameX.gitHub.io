"use client"; // ระบุว่าเป็น Client Component เพื่อใช้งาน Hooks ต่างๆ เช่น useParams, useEffect

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // Hook สำหรับดึงค่า ID จาก URL (เช่น /blog/123)
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, User, Tag } from "lucide-react"; // ไอคอนจากไลบรารี lucide-react
import { getBlogById } from "@/app/service/api"; // ฟังก์ชันเรียก API ดึงบทความตาม ID
import { BlogPost } from "@/types/schema";

export default function BlogDetailPage() {
  // --- ส่วนที่ 1: Routing & State (การรับค่าจาก URL และจัดการสถานะ) ---
  const params = useParams(); // ดึง ID ของบทความจาก URL
  const [blog, setBlog] = useState<BlogPost | null>(null); // เก็บข้อมูลบทความที่ดึงมาได้
  const [loading, setLoading] = useState(true); // จัดการสถานะการรอข้อมูล

  // --- ส่วนที่ 2: Fetch Specific Data (การดึงข้อมูลเฉพาะบทความนั้นๆ) ---
  useEffect(() => {
    if (params.id) {
      // เรียกใช้ API โดยส่ง ID เข้าไป เพื่อดึงเนื้อหาตัวเต็ม
      getBlogById(params.id as string)
        .then(setBlog)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [params.id]); // จะทำงานซ้ำหาก ID ใน URL เปลี่ยนไป

  // --- ส่วนที่ 3: Safety Checks (การตรวจสอบข้อมูล) ---
  if (loading) return <div className="text-center text-white mt-20">Loading...</div>;
  if (!blog) return <div className="text-center text-white mt-20">Article not found</div>;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200">
      
      <main className="max-w-4xl mx-auto px-4 py-10">
        {/* 3.1 Back Button: ปุ่มย้อนกลับไปยังหน้ารวมบทความ */}
        <Link href="/blog" className="inline-flex items-center text-slate-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft size={20} className="mr-2" /> Back to Blog
        </Link>

        {/* --- ส่วนที่ 4: Hero Image (ภาพหน้าปกขนาดใหญ่) --- */}
        <div className="relative h-100 w-full rounded-2xl overflow-hidden mb-8 shadow-2xl border border-slate-700">
          <Image 
            src={blog.image} 
            alt={blog.title} 
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 900px"
          />
        </div>

        {/* --- ส่วนที่ 5: Meta Data Section (ข้อมูลรายละเอียดบทความ) --- */}
        <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400 mb-6 border-b border-slate-800 pb-6">
          <span className="flex items-center gap-2"><Calendar size={16} className="text-cyan-400" /> {blog.date}</span>
          <span className="flex items-center gap-2"><User size={16} className="text-cyan-400" /> {blog.author}</span>
          <div className="flex gap-2">
            {/* แสดง Tags ทั้งหมดของบทความนี้ */}
            {blog.tags.map(tag => (
              <span key={tag} className="flex items-center gap-1 bg-slate-800 px-3 py-1 rounded-full text-cyan-200">
                <Tag size={12} /> {tag}
              </span>
            ))}
          </div>
        </div>

        {/* --- ส่วนที่ 6: Content Section (เนื้อหาบทความตัวเต็ม) --- */}
        {/* ใช้ prose class จาก tailwind-typography เพื่อจัดการการแสดงผล text ให้อ่านง่าย */}
        <article className="prose prose-invert prose-lg max-w-none">
          <h1 className="text-4xl font-bold text-white mb-6">{blog.title}</h1>
          <p className="text-lg text-slate-300 leading-relaxed mb-6 font-medium">
            {blog.excerpt}
          </p>
          <div className="text-slate-300 leading-relaxed space-y-4">
             {/* แสดงผลเนื้อหาหลักที่มาจาก Database */}
             {blog.content}
             
             {/* เนื้อหาจำลองเพื่อทดสอบ Layout ของหน้าเว็บ */}
             <p>Lorem ipsum...</p>
          </div>
        </article>

        {/* --- ส่วนที่ 7: Call to Action (CTA - ส่วนปิดท้ายเพื่อการตลาด) --- */}
        {/* ใช้เพื่อดึงดูดผู้อ่านให้เข้าไปดูหน้าคอร์สเรียนต่อ (Tie-in) */}
        <div className="mt-16 bg-linear-to-r from-cyan-900/40 to-blue-900/40 border border-cyan-500/30 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-2">Want to learn more about this topic?</h3>
          <p className="text-slate-300 mb-6">Check out our comprehensive courses...</p>
          <Link href="/" className="px-8 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-full font-bold transition-all shadow-lg shadow-cyan-600/20">
            Explore Courses
          </Link>
        </div>

      </main>
    </div>
  );
}