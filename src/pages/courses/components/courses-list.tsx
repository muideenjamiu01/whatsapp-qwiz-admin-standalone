"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  MoreHorizontal,
  Users,
  BookOpen,
  Clock,
  TrendingUp,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Input } from "../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../../components/ui/pagination";
import { toast } from "sonner";
import { coursesApi } from "../../../hooks/useCourses";
import CreateCourse from "./create-course";


interface Course {
  id: string;
  title: string;
  description: string;
  status: "Published" | "Draft" | "Archived";
  join_code: string;
  category: string;
  difficulty_level: string;
  estimated_duration: string;
  max_enrollments: number | null;
  start_date: string | null;
  end_date: string | null;
  createdAt: string;
  updatedAt: string;
}

interface Statistics {
  completionRate?: string;
  totalCompletions: string;
  monthlyGrowth: number;
  totalCourses: number;
  activeCourses: number;
  totalUsers?: number;
  testListers: number;
}

interface Meta {
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalResults: number;
}

interface CoursesResponse {
  data: {
    courses: Course[];
    statistics: Statistics;
  };
  meta: Meta;
}

interface CoursesListProps {
  onCreateCourse: () => void;
  onViewCourse: (courseId: string) => void;
  onManageSections: (courseId: string) => void;
  onManageModules: (courseId: string) => void;
  onPageChange: (page: number) => void;
  response: CoursesResponse;
  refetch: () => void;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  pageNumber: number;
  pageSize: number;
  setPageNumber: (value: number) => void;
  setPageSize: (value: number) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
}

export default function CoursesList({
  onCreateCourse,
  onViewCourse,
  onManageModules,
  onManageSections,
  onPageChange,
  response,
  refetch,
  searchTerm,
  setSearchTerm,
  pageNumber,
  pageSize,
  setPageNumber,
  setPageSize,
  statusFilter,
  setStatusFilter,
}: CoursesListProps) {
  // const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<null | Course>(null);
  const [courseToDelete, setCourseToDelete] = useState<{
    title: string;
    id: string;
  } | null>(null);

  console.log(setPageNumber,setPageSize, pageNumber,
  pageSize,)

  const { data, meta } = response;
  const { courses, statistics } = data;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Published":
        return <Badge className="bg-green-100 text-green-800">Published</Badge>;
      case "Draft":
        return <Badge className="bg-yellow-100 text-yellow-800">Draft</Badge>;
      case "Archived":
        return <Badge className="bg-gray-100 text-gray-800">Archived</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not set";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const getDurationInMinutes = (duration: string) => {
    if (!duration) return "0m";
    return duration.includes("minutes")
      ? duration.replace("minutes", "m")
      : duration.includes("minute")
      ? duration.replace("minute", "m")
      : duration;
  };

  const handlePreviousPage = () => {
    if (meta.pageNumber > 1) {
      onPageChange(meta.pageNumber - 1);
    }
  };

  const handleNextPage = () => {
    if (meta.pageNumber < meta.totalPages) {
      onPageChange(meta.pageNumber + 1);
    }
  };

  const handleDeleteClick = (course: any) => {
    setCourseToDelete(course);
    setDeleteModalOpen(true);
  };

  const confirmDeleteUser = async () => {
    if (courseToDelete) {
      try {
        const deleteUser = await coursesApi.deleteCourse({
          courseId: courseToDelete?.id,
        });
        toast.success(deleteUser.message || "Course deleted successfully");
        refetch(); // Refetch users after deletion
      } catch (err) {
        toast.error("Failed to delete user");
      } finally {
        setDeleteModalOpen(false);
        setCourseToDelete(null);
      }
    }
  };

  const handleEditCourse = (course: any) => {
    setEditingCourse(course);
    // navigate(`/courses/update/${course.id}`);
    
  };
  const handleSaveSuccess = () => {
    setEditingCourse(null);
    refetch();
  };

  if (editingCourse) {
    return (
      <CreateCourse
        courseToEdit={editingCourse}
        onSave={handleSaveSuccess}
        refetch={refetch}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Course Management
            </h1>
            <p className="text-gray-600">
              Manage your WhatsApp-based training courses
            </p>
          </div>
          <div className="flex items-center space-x-3">
            {/* <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button> */}
            <Button onClick={onCreateCourse} className="bg-[#005F6A] hover:bg-[#004954] text-white">
              <Plus className="w-4 h-4 mr-2" />
              Create Course
            </Button>
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Courses
              </CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statistics?.totalCourses}
              </div>
              <p className="text-xs text-muted-foreground">
                {statistics?.activeCourses} active courses
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Test Listers
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statistics?.testListers}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Avg. Completion
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statistics?.completionRate
                  ? `${parseFloat(statistics?.completionRate).toFixed(2)}%`
                  : "0%"}
              </div>
              <p className="text-xs text-muted-foreground">
                {statistics?.totalCompletions} total completions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Monthly Growth
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                +{statistics?.monthlyGrowth}%
              </div>
              <p className="text-xs text-muted-foreground">
                User enrollment growth
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Published">Published</SelectItem>
                <SelectItem value="Draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              Grid
            </Button>
            <Button
              variant={viewMode === "table" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("table")}
            >
              Table
            </Button>
          </div>
        </div>

        {/* You can reuse your grid and table rendering code here using `courses` */}
        {/* Course Grid View */}
        {viewMode === "grid" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses?.map((course: any) => (
              <Card
                key={course.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{course.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {course.description}
                      </CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={() => onViewCourse(course.id)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleEditCourse(course)}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Course
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onManageSections(course.id)}
                        >
                          <BookOpen className="w-4 h-4 mr-2" />
                          Manage Sections
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onManageModules(course.id)}
                        >
                          <BookOpen className="w-4 h-4 mr-2" />
                          Manage Modules
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDeleteClick(course)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    {getStatusBadge(course.status)}
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                      {course.join_code}
                    </code>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-sm font-semibold">
                        {course.category || "No category"}
                      </div>
                      <div className="text-sm text-gray-600">Category</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-semibold">
                        {course.difficulty_level || "Not set"}
                      </div>
                      <div className="text-sm text-gray-600">Level</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Duration</span>
                      <span>
                        {getDurationInMinutes(course.estimated_duration)}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>Starts: {formatDate(course.start_date)}</span>
                      <span>Ends: {formatDate(course.end_date)}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-4 pt-4 border-t">
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-1" />
                      Created {formatDate(course.createdAt)}
                    </div>
                    <div className="text-sm text-gray-600">
                      Updated {formatDate(course.updatedAt)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        {/* Course Table View */}
        {viewMode === "table" && (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Course</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Join Code</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {courses?.map((course) => (
                    <TableRow key={course.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{course.title}</p>
                          <p className="text-sm text-gray-600">
                            {course.description}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(course.status)}</TableCell>
                      <TableCell>
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                          {course.join_code}
                        </code>
                      </TableCell>
                      <TableCell>{course.category || "-"}</TableCell>
                      <TableCell>{course.difficulty_level || "-"}</TableCell>
                      <TableCell>
                        {getDurationInMinutes(course.estimated_duration)}
                      </TableCell>
                      <TableCell>{formatDate(course.start_date)}</TableCell>
                      <TableCell>{formatDate(course.end_date)}</TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {formatDate(course.updatedAt)}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem
                              onClick={() => onViewCourse(course.id)}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleEditCourse(course)}
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Edit Course
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => onManageSections(course.id)}
                            >
                              <BookOpen className="w-4 h-4 mr-2" />
                              Manage Sections
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => onManageModules(course.id)}
                            >
                              <BookOpen className="w-4 h-4 mr-2" />
                              Manage Sections
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDeleteClick(course)}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Pagination */}
        {meta?.totalResults > 0 && (
          <div className="mt-6">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    size="default"
                    onClick={handlePreviousPage}
                    // disabled={meta.pageNumber === 1}
                  />
                </PaginationItem>
                {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        size="default"
                        isActive={page === meta.pageNumber}
                        onClick={() => onPageChange(page)}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}
                <PaginationItem>
                  <PaginationNext
                    size="default"
                    onClick={handleNextPage}
                    className={
                      meta.pageNumber === meta.totalPages ? "disabled" : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Course</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete {courseToDelete?.title} ?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteUser}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
