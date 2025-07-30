import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "admin" | "user" | "guest";
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export const userApi = {
  createUser: (data: any) =>
    api.post("/api/users", data).then(({ data }) => data),

  getAllUsers: ({ pageNumber, pageSize, searchTerm, opco, func }: any) =>
    api
      .get(
        `/api/users?pageNumber=${pageNumber}&pageSize=${pageSize}&searchTerm=${searchTerm}&opco=${opco}&function=${func}`
      )
      .then(({ data }) => data),

  getSingleUser: ({ userId }: any) =>
    api.get(`/api/users/${userId}`).then(({ data }) => data),
  updateUser: ({ userId, payload }: any) =>
    api.put(`/api/users/${userId}`, payload).then(({ data }) => data),

  deleteUser: ({ userId }: any) =>
    api.delete(`/api/users/${userId}`).then(({ data }) => data),

  bulkUploadUsers: ({ file, courseId }: { file: File; courseId: string }) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("course_id", courseId);

    return api
      .post("/api/users/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(({ data }) => data);
  },
};

export const useBulkUploadUsers = () => {
  return useMutation({
    mutationFn: userApi.bulkUploadUsers,
  })
}