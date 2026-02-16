"use client";

import { useState, useEffect } from 'react';

// --- Custom Hook สำหรับจัดการสถานะการเรียน ---
export function useProgress() {
  
  // --- ส่วนที่ 1: State Management (การจัดการสถานะในหน่วยความจำ) ---
  
  // 1.1 เก็บรายการ ID ของบทเรียนที่เรียนจบแล้ว
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  
  // 1.2 เก็บรายการ ID ของคอร์สที่ผู้ใช้กด "ลงทะเบียน" หรือ "เริ่มเรียน" แล้ว
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>([]); 
  
  // 1.3 ใช้เช็คว่าโหลดข้อมูลจาก LocalStorage เสร็จหรือยัง (ป้องกันปัญหาข้อมูลกระพริบ)
  const [isLoaded, setIsLoaded] = useState(false);

  // --- ส่วนที่ 2: Initialization (การดึงข้อมูลจาก Browser เมื่อเปิดเว็บ) ---
  useEffect(() => {
    // ดึงข้อมูลบทเรียนที่จบแล้วจาก LocalStorage
    const savedProgress = localStorage.getItem('course_progress');
    if (savedProgress) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCompletedLessons(JSON.parse(savedProgress));
      } catch (error) {
        console.error("Error parsing progress:", error);
      }
    }

    // ✅ ดึงข้อมูลการลงทะเบียนคอร์สจาก LocalStorage
    const savedEnrollments = localStorage.getItem('enrolled_courses');
    if (savedEnrollments) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setEnrolledCourses(JSON.parse(savedEnrollments));
      } catch (error) {
        console.error("Error parsing enrollments:", error);
      }
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoaded(true); // บอกคอมโพเนนต์อื่นว่า "ข้อมูลพร้อมใช้งานแล้ว"
  }, []);

  // --- ส่วนที่ 3: Actions (ฟังก์ชันสำหรับเปลี่ยนแปลงข้อมูล) ---

  // 3.1 ฟังก์ชันบันทึกบทเรียนที่เรียนจบ
  const markAsCompleted = (lessonId: string) => {
    if (!completedLessons.includes(lessonId)) {
      const updated = [...completedLessons, lessonId]; // เพิ่ม ID ใหม่เข้าไปใน Array
      setCompletedLessons(updated);
      // บันทึกลง LocalStorage เพื่อให้ปิดคอมแล้วเปิดใหม่ข้อมูลยังอยู่
      localStorage.setItem('course_progress', JSON.stringify(updated));
    }
  };

  // 3.2 ฟังก์ชันลงทะเบียนคอร์สใหม่
  const enrollCourse = (courseId: string) => {
    if (!enrolledCourses.includes(courseId)) {
      const updated = [...enrolledCourses, courseId];
      setEnrolledCourses(updated);
      // บันทึกลง LocalStorage ในชื่อคีย์ 'enrolled_courses'
      localStorage.setItem('enrolled_courses', JSON.stringify(updated));
    }
  };

  // --- ส่วนที่ 4: Return Values (ส่งค่าออกไปให้หน้าอื่นใช้งาน) ---
  return { 
    completedLessons, // รายการบทเรียนที่จบ
    enrolledCourses,  // รายการคอร์สที่ลงทะเบียน
    markAsCompleted,  // ฟังก์ชันกดเรียนจบ
    enrollCourse,     // ฟังก์ชันกดลงทะเบียน
    isLoaded          // สถานะการโหลด
  };
}