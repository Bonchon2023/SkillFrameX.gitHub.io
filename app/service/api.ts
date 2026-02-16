// Check this URL! It must match your backend server's address.
// Common ports are 8080, 5000, or 3001.

import { BlogPost } from "@/types/schema";
import dbData from '../data/data.json'; // 

// --------------------------------------------------------
// Course Services
// --------------------------------------------------------

export const getAllCourses = async () => {
  // จำลองการรอข้อมูลนิดหน่อย (Optional) หรือ return เลยก็ได้
  // return dbData.courses; 
  
  // ถ้าอยากให้เหมือนโหลดจริง (Async)
  return new Promise((resolve) => {
    setTimeout(() => resolve(dbData.courses), 100);
  });
};

export const getCategories = async () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(dbData.categories), 100);
  });
};

export const getCourseById = async (id: string) => {
  // ค้นหาข้อมูลจาก Array โดยตรง
  const course = dbData.courses.find((c: any) => c.id === id);
  
  return new Promise((resolve) => {
    setTimeout(() => resolve(course || null), 100);
  });
};

// --------------------------------------------------------
// Blog Services 
// (คำเตือน: ใน db.json ของคุณยังไม่มีข้อมูล "blogs" ต้องเพิ่มก่อนนะครับ)
// --------------------------------------------------------

export const getAllBlogs = async (): Promise<BlogPost[]> => {
  // ถ้าใน json มี blogs ให้ใช้บรรทัดนี้: return dbData.blogs;
  console.warn("No blogs data found in local JSON");
  return []; 
};

export const getBlogById = async (id: string): Promise<BlogPost | null> => {
   // ถ้ามีข้อมูล blogs
   // const blog = dbData.blogs.find((b: any) => b.id === id);
   // return blog || null;
   return null;
};
// {// If you are using Next.js API routes, use '/api'
// const API_URL = "http://localhost:3005"; 

// //  Course Services (ฟังก์ชันจัดการข้อมูลคอร์สเรียน) ---
// // ดึงคอร์สทั้งหมด: ใช้แสดงในหน้าแรกหรือหน้ารวมคอร์ส
// export const getAllCourses = async () => {
//   try {
//     const response = await fetch(`${API_URL}/courses`);

//     if (!response.ok) {
//       throw new Error(`HTTP error! Status: ${response.status}`);
//     }

//     return await response.json();
//   } catch (error) {
//     console.error("Failed to fetch courses:", error);
//     // Return an empty array so the app doesn't crash
//     return [];
//   }
// };
// //ดึงหมวดหมู่: ใช้สำหรับสร้างปุ่ม Filter (เช่น Web, Design, Marketing)
// export const getCategories = async () => {
//   try {
//     const response = await fetch(`${API_URL}/categories`);

//     if (!response.ok) {
//       throw new Error(`HTTP error! Status: ${response.status}`);
//     }

//     return await response.json();
//   } catch (error) {
//     console.error("Failed to fetch categories:", error);
//     return [];
//   }
// };

// // ดึงข้อมูลคอร์สตาม ID: ใช้ในหน้ารายละเอียดคอร์ส (Course Detail) 
// // เพื่อดึงบทเรียนย่อย (lessons) มาแสดงผล
//   export const getCourseById = async (id: string) => {
//   try {
//     const response = await fetch(`${API_URL}/courses/${id}`);
//     if (!response.ok) throw new Error("Failed to fetch course");
//     return await response.json();
//   } catch (error) {
//     console.error(`Error fetching course ${id}:`, error);
//     return null;
//   }
// };

// // Blog Services (ฟังก์ชันจัดการบทความ) 
// // ดึงบทความทั้งหมด: ใช้แสดงในหน้า Blog Listing
// export const getAllBlogs = async (): Promise<BlogPost[]> => {
//   const res = await fetch(`${API_URL}/blogs`, { cache: "no-store" }); 
//   // cache: "no-store" คือการบอกว่าไม่ต้องจำค่าเก่า (Fetch ใหม่ทุกครั้ง)
//   // เหมาะสำหรับข้อมูลที่อัปเดตบ่อยๆ เช่น ข่าวสารหรือบทความใหม่
//   if (!res.ok) throw new Error("Failed to fetch blogs");
//   return res.json();
// };

// // ดึงบทความตาม ID: ใช้แสดงในหน้า Blog Detail สำหรับอ่านเนื้อหาเต็ม
// export const getBlogById = async (id: string): Promise<BlogPost> => {
//   const res = await fetch(`${API_URL}/blogs/${id}`, { cache: "no-store" });
//   if (!res.ok) throw new Error("Failed to fetch blog post");
//   return res.json();
// };
// }