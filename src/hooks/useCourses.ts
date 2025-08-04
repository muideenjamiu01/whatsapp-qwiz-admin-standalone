// import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";


export interface course {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "admin" | "course" | "guest";
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export const coursesApi = {
  createCourse: (data: any) =>
    api.post("/api/courses", data).then(({ data }) => data),

  getAllCourses: ({ pageNumber, pageSize, searchTerm, status="" }: any) =>
    api
      .get(
        `/api/courses?pageNumber=${pageNumber}&pageSize=${pageSize}&searchTerm=${searchTerm}&status=${status}`
      )
      .then(({ data }) => data),


  getSingleCourse: ({ courseId }: any) =>
    api.get(`/api/courses/${courseId}`).then(({ data }) => data),
  getCourseDetailsOverview: ({ courseId }: any) =>
    api.get(`/api/course-details/${courseId}`).then(({ data }) => data),

  getCourseDetailsModules: ({ courseId }: any) =>
    api.get(`/api/course-details-module-section/${courseId}`).then(({ data }) => data),
  
  getCourseDetailsUsers: ({ courseId }: any) =>
    api.get(`/api/course-details-course-user/${courseId}?pageNumber=2&pageSize=5&searchTerm=john`).then(({ data }) => data),

  updateCourse: ({ courseId, payload}: any) =>
    api.put(`/api/courses/${courseId}`, payload).then(({ data }) => data),

  deleteCourse: ({ courseId }: any) =>
    api.delete(`/api/courses/${courseId}`).then(({ data }) => data),


  //Modules Sections
  createModule: (payload: any) =>
    api.post("/api/modules", payload).then(({ data }) => data),
  getAllModules: ({ moduleId, pageNumber, pageSize,searchTerm }: any) =>
    api.get(`/api/modules?module_id=${moduleId}&pageNumber=${pageNumber}&pageSize=${pageSize}&searchTerm=${searchTerm}`).then(({ data }) => data), 

    getModuleById: ({ moduleId }: any) =>
    api.get(`/api/modules/${moduleId}`).then(({ data }) => data),

  updateModule: ({ moduleId, payload }: any) =>
    api.put(`/api/modules/${moduleId}`, payload).then(({ data }) => data),

  deleteModule: ({ moduleId }: any) =>
    api.delete(`/api/modules/${moduleId}`).then(({ data }) => data),

  //Course Sections
  createSection: (payload: any) =>
    api.post("/api/sections", payload).then(({ data }) => data),
  getAllSections: ({ moduleId, pageNumber, pageSize,searchTerm }: any) =>
    api.get(`/api/sections?course_id=${moduleId}&pageNumber=${pageNumber}&pageSize=${pageSize}&searchTerm=${searchTerm}`).then(({ data }) => data), 

    getSectionById: ({ sectionId }: any) =>
    api.get(`/api/sections/${sectionId}`).then(({ data }) => data),

  updateSection: ({ sectionId, payload }: any) =>
    api.put(`/api/sections/${sectionId}`, payload).then(({ data }) => data),

  deleteSection: ({ sectionId }: any) =>
    api.delete(`/api/sections/${sectionId}`).then(({ data }) => data),

};
