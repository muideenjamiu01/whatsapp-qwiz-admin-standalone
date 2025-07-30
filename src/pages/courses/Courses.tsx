"use client"

import { useState } from "react"
import CreateCourse from "./components/create-course"
import CourseSections from "./components/course-sections"
import CourseDetails from "./components/course-details"
import CoursesList from "./components/courses-list"


type Page = "courses" | "create-course" | "course-sections" | "user-management" | "course-details"

export default function Courses() {
  const [currentPage, setCurrentPage] = useState<Page>("courses")
  const [selectedCourseId, setSelectedCourseId] = useState<string>("")

  const handleCreateCourse = () => {
    setCurrentPage("create-course")
  }

  const handleViewCourse = (courseId: string) => {
    setSelectedCourseId(courseId)
    setCurrentPage("course-details")
  }

  const handleEditCourse = (courseId: string) => {
    setSelectedCourseId(courseId)
    setCurrentPage("create-course")
  }

  const handleManageSections = (courseId: string) => {
    setSelectedCourseId(courseId)
    setCurrentPage("course-sections")
  }

  const handleBackToCourses = () => {
    setCurrentPage("courses")
    setSelectedCourseId("")
  }

  const handleSaveCourse = (courseData: any) => {
    console.log("Saving course:", courseData)
    // Here you would typically make an API call to save the course
    setCurrentPage("courses")
  }

  // Navigation component
  const Navigation = () => (
    <div className="bg-white border-b border-gray-200 px-6 py-2">
      <div className="flex space-x-6">
        <button
          onClick={() => setCurrentPage("courses")}
          className={`px-3 py-2 text-sm font-medium rounded-md ${
            currentPage === "courses" ||
            currentPage === "create-course" ||
            currentPage === "course-sections" ||
            currentPage === "course-details"
              ? "bg-blue-100 text-blue-700"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Courses
        </button>
        <button
          onClick={() => setCurrentPage("user-management")}
          className={`px-3 py-2 text-sm font-medium rounded-md ${
            currentPage === "user-management" ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Users
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {currentPage === "courses" && (
        <CoursesList
          onCreateCourse={handleCreateCourse}
          onViewCourse={handleViewCourse}
          onEditCourse={handleEditCourse}
          onManageSections={handleManageSections}
        />
      )}

      {currentPage === "create-course" && <CreateCourse onBack={handleBackToCourses} onSave={handleSaveCourse} />}

      {currentPage === "course-sections" && <CourseSections courseId={selectedCourseId} onBack={handleBackToCourses} />}

      {/* {currentPage === "user-management" && <UserManagement />} */}

      {currentPage === "course-details" && <CourseDetails />}
    </div>
  )
}
