// กำหนดโครงสร้างข้อมูลให้ตรงกับ db.json
export interface Lesson {
  id: string;
  title: string;
  duration: string; // ใน db.json เป็น string เช่น "30 min"
}

export interface Course {
  id: string;
  name: string; // db.json ใช้ name แทน title
  description: string;
  category: string;
  image: string;
  coursesDtl: Lesson[]; // db.json ใช้ key นี้
}

export interface Category {
  name: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  image: string;
  tags: string[];
}