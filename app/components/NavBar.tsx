"use client"; // ระบุว่าเป็น Client Component เพื่อให้ใช้ Hook อย่าง useState และ useEffect ได้

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Menu, X, SquareCode } from "lucide-react"; // นำเข้าไอคอนจาก Library

// --- ส่วนที่ 1: Main Logic Component (NavBarContent) ---
function NavBarContent() {
  // Hooks สำหรับจัดการ Routing และดึงค่าจาก URL (Query Parameters)
  const router = useRouter();
  const searchParams = useSearchParams();

  // --- ส่วนที่ 2: State Management (การจัดการสถานะภายใน) ---
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || ""); // เก็บค่าคำค้นหา
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // จัดการการเปิด/ปิดเมนูบนมือถือ

  // --- ส่วนที่ 3: Side Effects (การดึงข้อมูลจาก URL มาอัปเดต State) ---
  useEffect(() => {
    const query = searchParams.get("search");
    if (query && query !== searchTerm) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSearchTerm(query);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // --- ส่วนที่ 4: Event Handlers (ฟังก์ชันจัดการการพิมพ์ค้นหา) ---
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value; // ดึงค่าที่พิมพ์เข้ามา
    setSearchTerm(value); // อัปเดต State ของ searchTerm เพื่อให้แสดงใน Input

    // ทำการเปลี่ยน URL ทันทีเมื่อมีการพิมพ์ (Real-time Search Sync)
    if (value.trim() === "") {
      router.push("/");
    } else {
      router.push(`/?search=${encodeURIComponent(value)}`); // อัปเดต URL ด้วยค่าที่เข้ารหัสเพื่อความปลอดภัย
    }
  };

  // --- ส่วนที่ 5: UI Rendering (JSX) ---
  return (
    <nav className="sticky top-0 z-50 w-full bg-background/60 backdrop-blur-xl border-b border-white/10 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* ✅ 5.1: Logo Section - แสดงชื่อแบรนด์และลิงก์กลับหน้าแรก */}
          <Link href="/" className="flex items-center gap-2 group"> 
            <div className="bg-secondary/10 p-2 rounded-lg group-hover:bg-secondary/20 transition-colors">
              <SquareCode className="h-6 w-6 text-secondary" />
            </div>
            <span className="text-xl font-bold bg-linear-to-r from-white to-slate-400 bg-clip-text text-transparent">
              SkillFrameX
            </span>
          </Link>

          {/* 5.2: Desktop Search Bar - ช่องค้นหาสำหรับหน้าจอคอมพิวเตอร์ */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400 group-focus-within:text-secondary transition-colors" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Search for courses..."
                className="block w-full pl-10 pr-3 py-2 border border-white/10 rounded-full leading-5 bg-white/5 text-slate-300 placeholder-slate-500 focus:outline-none focus:bg-white/10 focus:ring-1 focus:ring-secondary focus:border-secondary sm:text-sm transition-all shadow-sm backdrop-blur-sm"
              />
            </div>
          </div>

          {/* 5.3: Desktop Navigation Menu - เมนูหลัก (Home, Blog, Account) */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/" className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-white/5">
              Home
            </Link>
            <Link href="/blog" className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-white/5">
              Blog
            </Link>
            <Link href="/account">
              <div className="h-8 w-8 rounded-full bg-linear-to-tr from-secondary to-blue-500 p-px cursor-pointer hover:scale-110 transition-transform shadow-lg shadow-secondary/20">
                <div className="h-full w-full rounded-full bg-background flex items-center justify-center text-xs font-bold text-secondary">
                  ME
                </div>
              </div>
            </Link>
          </div>

          {/* 5.4: Mobile Menu Controls - ปุ่มเปิดเมนูสำหรับมือถือ */}
          <div className="md:hidden flex items-center gap-4">
            <Link href="/account">
              <div className="h-8 w-8 rounded-full bg-linear-to-tr from-secondary to-blue-500 p-px cursor-pointer hover:scale-110 transition-transform">
                <div className="h-full w-full rounded-full bg-background flex items-center justify-center text-xs font-bold text-secondary">
                  ME
                </div>
              </div>
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-400 hover:text-white p-2 hover:bg-white/5 rounded-full transition-colors"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* 5.5: Mobile Menu Dropdown - ส่วนเมนูที่จะแสดงออกมาเมื่อกดปุ่ม Menu บนมือถือ */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-xl border-b border-white/10 shadow-xl">
          <div className="px-4 pt-4 pb-2">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search..."
              className="block w-full pl-4 pr-3 py-2 border border-white/10 rounded-lg bg-white/5 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-secondary text-base"
            />
          </div>
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-white bg-white/10"
            >
              Home
            </Link>
            <Link
              href="/blog"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
            >
              Blog
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

// --- ส่วนที่ 6: Export Wrapper (NavBar) ---
// ใช้ Suspense ครอบ เพื่อป้องกันปัญหาเวลาทำ Server Side Rendering กับ useSearchParams
export default function NavBar() {
  return (
    <Suspense fallback={<nav className="sticky top-0 z-50 w-full bg-background/60 backdrop-blur-xl border-b border-white/10 shadow-lg h-16"></nav>}>
      <NavBarContent />
    </Suspense>
  );
}