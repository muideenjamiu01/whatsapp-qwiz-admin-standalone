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

export const coursesApi = {
  createUser: (data: any) =>
    api.post("/api/users", data).then(({ data }) => data),

  getAllCourses: ({ pageNumber, pageSize, searchTerm, status="" }: any) =>
    api
      .get(
        `/api/courses?pageNumber=${pageNumber}&pageSize=${pageSize}&searchTerm=${searchTerm}&status=${status}`
      )
      .then(({ data }) => data),

  getAccounts: () => api.get(`/qwizfun/bank/accounts`).then(({ data }) => data),

  getSingleUser: ({ userId }: any) =>
    api.get(`/api/users/${userId}`).then(({ data }) => data),
  updateUser: ({ userId, data }: any) =>
    api.put(`/api/users/${userId}`, data).then(({ data }) => data),

  deleteUser: ({ userId }: any) =>
    api.delete(`/api/users/${userId}`).then(({ data }) => data),
};
