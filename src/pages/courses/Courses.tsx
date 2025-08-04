"use client";

import { useState } from "react";
import CreateCourse from "./components/create-course";
import CoursesList from "./components/courses-list";
import { useQuery } from "@tanstack/react-query";
import { coursesApi } from "../../hooks/useCourses";
import { useNavigate } from "react-router";



export default function Courses() {
  const navigate = useNavigate();
 

  const [searchTerm, setSearchTerm] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [statusFilter, setStatusFilter] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);


  const {
    data: courses,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["getAllCourses", pageNumber, pageSize, searchTerm, statusFilter],
    queryFn: () =>
      coursesApi.getAllCourses({
        pageNumber,
        pageSize,
        searchTerm,
        status: statusFilter,
      }),
    staleTime: 1000 * 60 * 60,
  });

  const handleCreateCourse = () => {
    navigate("/courses/create");
  };

  const handlePageChange = (page: number) => {
    // Handle page change logic here
    setPageNumber(page);
  };

  if (showCreateForm) {
    return (
      <CreateCourse
        refetch={refetch}
        onSave={() => {
          setShowCreateForm(false);
          refetch();
        }}
      />
    );
  }
  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#005F6A]"></div>
        </div>
      ) : (
        <div className="min-h-screen bg-gray-50">
          <CoursesList
            response={{
              data: {
                courses: courses?.data.courses,
                statistics: courses?.data.statistics,
              },
              meta: courses,
            }}
            onCreateCourse={handleCreateCourse}
            onViewCourse={(id) => navigate(`/courses/${id}`)}
            onManageSections={(id) => navigate(`/courses/${id}/sections`)}
            onManageModules={(id) => navigate(`/courses/${id}/modules`)}
            onPageChange={handlePageChange}
            refetch={refetch}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            pageNumber={pageNumber}
            setPageNumber={setPageNumber}
            pageSize={pageSize}
            setPageSize={setPageSize}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />
        </div>
      )}
    </>
  );
}
