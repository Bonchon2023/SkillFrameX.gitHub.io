import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/NavBar";
import Footer from "./components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SkillFrameX", // เปลี่ยนชื่อที่แสดงบน Tab
  description: "SkillFrameX Online Learning Platform", // คำอธิบายเว็บไซต์สำหรับการทำ SEO
  icons: {
    icon: "/favicon.ico", // ระบุตำแหน่งไฟล์ไอคอน (ปกติ Next.js จะหาใน folder app/ หรือ public/ อัตโนมัติ แต่ระบุไว้เพื่อความชัวร์)
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
