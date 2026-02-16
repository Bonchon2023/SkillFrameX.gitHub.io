"use client";

import React from "react";
import Link from "next/link";
// นำเข้าไอคอนโซเชียลและสัญลักษณ์ต่างๆ
import { GraduationCap, Facebook, Twitter, Instagram, Github, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    // กำหนด Footer ให้มีเส้นขอบบน (border-t) เพื่อแยกออกจากเนื้อหาหลักอย่างชัดเจน
    <footer className="bg-background text-slate-300 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* --- ส่วนที่ 1: Grid Layout (แบ่งเป็น 4 คอลัมน์บนจอใหญ่) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">

          {/* 1.1 Brand Info: แสดงโลโก้และสโลแกนของเว็บไซต์ */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 group w-fit">
              <div className="bg-secondary/10 p-2 rounded-lg group-hover:bg-secondary/20 transition-colors">
                <GraduationCap className="h-6 w-6 text-secondary" />
              </div>
              <span className="text-xl font-bold bg-linear-to-r from-white to-slate-400 bg-clip-text text-transparent">
                SkillFrameX
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Empowering developers and designers with world-class online courses. 
              Master new skills and advance your career today.
            </p>
          </div>

          {/* 1.2 Quick Links: เมนูทางลัดเพื่อเข้าถึงหน้าสำคัญได้รวดเร็ว */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-secondary transition-colors">Home</Link></li>
              <li><Link href="/blog" className="hover:text-secondary transition-colors">Blog & Articles</Link></li>
              <li><Link href="/account" className="hover:text-secondary transition-colors">My Learning</Link></li>
              <li><Link href="#" className="hover:text-secondary transition-colors">All Courses</Link></li>
            </ul>
          </div>

          {/* 1.3 Support & Contact: ข้อมูลการช่วยเหลือและนโยบายต่างๆ */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="hover:text-secondary transition-colors">Help Center</Link></li>
              <li><Link href="#" className="hover:text-secondary transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-secondary transition-colors">Privacy Policy</Link></li>
              <li className="flex items-center gap-2 text-slate-400 mt-4">
                <Mail size={16} className="text-secondary" /> support@skillframex.com
              </li>
            </ul>
          </div>

          {/* 1.4 Newsletter & Social: ส่วนเชื่อมต่อกับโซเชียลมีเดีย */}
          <div>
            <h3 className="text-white font-semibold mb-4">Stay Connected</h3>
            <p className="text-sm text-slate-400 mb-4">
              Join our community to get the latest updates and free tutorials.
            </p>
            <div className="flex gap-4">
              {/* ตกแต่งปุ่มโซเชียลด้วย Glassmorphism เล็กน้อย */}
              {[Facebook, Twitter, Instagram, Github].map((Icon, index) => (
                <a key={index} href="#" className="p-2 bg-white/5 rounded-full hover:bg-secondary/20 hover:text-secondary transition-all border border-white/10">
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* --- ส่วนที่ 2: Bottom Bar (Copyright & Location) --- */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>© 2024 SkillFrameX. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="flex items-center gap-1">
              <MapPin size={12} /> Bangkok, Thailand
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}