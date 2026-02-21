
// Common ports are 8080, 5000, or 3001.
import { BlogPost, Course } from "@/types/schema";
import dbData from '../data/data.json'; // 

// --------------------------------------------------------
// Course Services
// --------------------------------------------------------

export const getAllCourses = async (): Promise<Course[]> => {
  // return dbData.courses; 
  
  //  (Async)
  return new Promise((resolve) => {
    setTimeout(() => resolve(dbData.courses as Course[]), 100);
  });
};

export const getCategories = async (): Promise<string[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(dbData.categories), 100);
  });
};

export const getCourseById = async (id: string): Promise<Course | null> => {
  // find from local JSON data
  const course = dbData.courses.find((c: any) => c.id === id);
  
  return new Promise((resolve) => {
    setTimeout(() => resolve((course as Course) || null), 100);
  });
};

// --------------------------------------------------------
// Blog Services 
// --------------------------------------------------------

export const getAllBlogs = async (): Promise<BlogPost[]> => {
  console.warn("No blogs data found in local JSON");
  return dbData.blogs;
};

export const getBlogById = async (id: string): Promise<BlogPost | null> => {
   const blog = dbData.blogs.find((b: any) => b.id === id);
   return blog || null;
};
