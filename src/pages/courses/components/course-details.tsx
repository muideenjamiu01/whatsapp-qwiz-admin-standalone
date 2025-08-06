"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Users,
  BookOpen,
  Clock,
  CheckCircle,
  MoreHorizontal,
  Search,
  Eye,
  Edit,
  Trash2,
  Video,
  ImageIcon,
  FileText,
} from "lucide-react";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Progress } from "../../../components/ui/progress";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs";
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
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
import { coursesApi } from "../../../hooks/useCourses";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../../components/ui/pagination";

export default function CourseDetails() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [statusFilter, setStatusFilter] = useState("");

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not set";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  console.warn(setPageNumber, setPageSize, setStatusFilter, setSearchTerm);

  const { data: overviewData, isLoading } = useQuery({
    queryKey: [
      "getOverviewCourses",
      pageNumber,
      pageSize,
      searchTerm,
      statusFilter,
    ],
    queryFn: () =>
      coursesApi.getCourseDetailsOverview({
        courseId: id,
        pageNumber,
        pageSize,
        searchTerm,
        status: statusFilter,
      }),
    staleTime: 1000 * 60 * 10,
  });

  const { data: users } = useQuery({
    queryKey: ["getUsersCourses", pageNumber, pageSize, userSearchTerm],
    queryFn: () =>
      coursesApi.getCourseDetailsUsers({
        courseId: id,
        pageNumber,
        pageSize,
        searchTerm: userSearchTerm,
      }),
    staleTime: 1000 * 60 * 10,
  });

  const { data: modulesData } = useQuery({
    queryKey: [
      "getCourseModules",
      pageNumber,
      pageSize,
      searchTerm,
      statusFilter,
    ],
    queryFn: () =>
      coursesApi.getCourseDetailsModules({
        courseId: id,
        pageNumber,
        pageSize,
        searchTerm,
        status: statusFilter,
      }),
    staleTime: 1000 * 60 * 10,
  });

  const getMediaIcon = (mediaType: string) => {
    switch (mediaType) {
      case "video":
        return <Video className="w-4 h-4" />;
      case "image":
        return <ImageIcon className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800">Completed</Badge>;
      case "paused":
        return <Badge className="bg-yellow-100 text-yellow-800">Paused</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handlePreviousPage = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
    }
  };

  const handleNextPage = () => {
    if (pageNumber < users?.meta.totalPages) {
      setPageNumber(pageNumber + 1);
    }
  };

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#005F6A]"></div>
        </div>
      ) : (
        <div className="min-h-screen bg-gray-50">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/courses")}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Courses
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {overviewData?.data?.courseInfo?.title}
                  </h1>
                  <p className="text-gray-600">
                    {overviewData?.data?.courseInfo?.description}
                  </p>
                </div>
              </div>
              {/* <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
            <Button size="sm">
              <Edit className="w-4 h-4 mr-2" />
              Edit Course
            </Button>
          </div> */}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="px-6 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Modules
                  </CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {overviewData?.data?.overview?.totalModules}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {overviewData?.data?.overview?.totalSections} sections total
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Enrolled Users
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {overviewData?.data?.overview?.enrolledUsers}
                  </div>
                  {/* <p className="text-xs text-muted-foreground">
                +12 from last week
              </p> */}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Completion Rate
                  </CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {overviewData?.data?.overview?.completionRate}
                  </div>
                  {/* <p className="text-xs text-muted-foreground">
                {overviewData?.data?.overview?.completionRate} from last month
              </p> */}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Avg. Time
                  </CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {overviewData?.data?.overview?.avgCompletionTime}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Per user completion
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="space-y-6"
            >
              <TabsList className="grid w-fit mx-auto grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="modules">Modules & Sections</TabsTrigger>
                <TabsTrigger value="users">Users</TabsTrigger>
                {/* <TabsTrigger value="analytics">Analytics</TabsTrigger> */}
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Course Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Course Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Status:</span>
                        {getStatusBadge(overviewData?.data?.courseInfo.status)}
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Join Code:</span>
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                          {overviewData?.data?.courseInfo.joinCode}
                        </code>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Created:</span>
                        <span className="text-sm">
                          {formatDate(overviewData?.data?.courseInfo.createdAt)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">
                          Last Updated:
                        </span>
                        <span className="text-sm">
                          {formatDate(overviewData?.data?.courseInfo.updatedAt)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Module Progress */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Module Progress</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {overviewData?.data?.moduleProgress?.map(
                        (module: any) => (
                          <div key={module.id} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">
                                {module.title}
                              </span>
                              <span className="text-sm text-gray-600">
                                {module?.percentage}
                                {/* {Math.round(
                            (module.completedUsers / module.enrolledUsers) * 100
                          )} */}
                                %
                              </span>
                            </div>
                            <Progress
                              value={
                                module?.percentage
                                // (module.completedUsers / module.enrolledUsers) * 100
                              }
                              className="h-2"
                            />
                            <div className="flex justify-between text-xs text-gray-500">
                              <span>{module.completed} completed</span>
                              <span>{module.enrolled} enrolled</span>
                            </div>
                          </div>
                        )
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent User Activity</CardTitle>
                    <CardDescription>
                      Latest user interactions with the course
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {overviewData?.data?.recentActivity.map((user: any) => (
                        <div
                          key={user.id}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div className="flex items-center space-x-4">
                            <Avatar>
                              <AvatarFallback>{user.name[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-sm text-gray-600">
                                {user.tag} • {user.opco}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-600">
                              {user.score}
                            </p>
                          </div>
                          <div className="text-right">
                            {getStatusBadge(user.status)}
                            <p className="text-xs text-gray-600 mt-1">
                              {user.timeAgo}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="modules" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Modules & Sections</h2>
                  {/* <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Module
              </Button> */}
                </div>

                <div className="space-y-6">
                  {modulesData?.data?.map((module: any) => (
                    <Card key={module.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="flex items-center space-x-2">
                              <span>{module.title}</span>
                              {getStatusBadge(module.status)}
                            </CardTitle>
                            <CardDescription>
                              {module.description}
                            </CardDescription>
                          </div>
                          {/* <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Module
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Plus className="w-4 h-4 mr-2" />
                            Add Section
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Module
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu> */}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                          <div className="text-center">
                            <div className="text-2xl font-bold">
                              {module.sectionCount}
                            </div>
                            <div className="text-sm text-gray-600">
                              Sections
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold">
                              {module.enrolledCount}
                            </div>
                            <div className="text-sm text-gray-600">
                              Enrolled
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold">
                              {module.avgTime}
                            </div>
                            <div className="text-sm text-gray-600">
                              Avg. Time
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold">
                              {module.completedCount}
                            </div>
                            <div className="text-sm text-gray-600">
                              Completion Count
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold">
                              {module.completionRate}
                            </div>
                            <div className="text-sm text-gray-600">
                              Completion Rate
                            </div>
                          </div>
                        </div>

                        {/* Sections */}
                        <div className="space-y-3">
                          <h4 className="font-medium">Sections</h4>
                          {module.sections?.map((section: any) => (
                            <div
                              key={section.id}
                              className="flex items-center justify-between p-3 border rounded-lg"
                            >
                              <div className="flex items-center space-x-3">
                                <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full">
                                  {getMediaIcon(section.mediaType)}
                                </div>
                                <div>
                                  <p className="font-medium">{section.title}</p>
                                  <p className="text-sm text-gray-600">
                                    {section.mediaType} •{" "}
                                    {section.estimated_duration}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-4">
                                <div className="text-right">
                                  <p className="text-sm font-medium">
                                    {section.completion_rate}%
                                  </p>
                                  <p className="text-xs text-gray-600">
                                    completion
                                  </p>
                                </div>
                                {/* <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <MoreHorizontal className="w-4 h-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent>
                                    <DropdownMenuItem>
                                      <Eye className="w-4 h-4 mr-2" />
                                      Preview
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Edit className="w-4 h-4 mr-2" />
                                      Edit Section
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="text-red-600">
                                      <Trash2 className="w-4 h-4 mr-2" />
                                      Delete Section
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu> */}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="users" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Course Users</h2>
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Search users..."
                        value={userSearchTerm}
                        onChange={(e: any) => setUserSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                        type="search"
                      />
                    </div>
                    <Select
                      value={filterStatus}
                      onValueChange={setFilterStatus}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder=" Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Draft">Draft</SelectItem>
                      </SelectContent>
                    </Select>
                    {/* <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add User
                </Button> */}
                  </div>
                </div>

                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User</TableHead>
                          <TableHead>Staff ID</TableHead>
                          <TableHead>Grade</TableHead>
                          <TableHead>OPCO</TableHead>
                          <TableHead>Current Module</TableHead>
                          <TableHead>Progress</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Last Active</TableHead>
                          {/* <TableHead></TableHead> */}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users?.data?.map((user: any) => (
                          <TableRow key={user.id}>
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <Avatar className="w-8 h-8">
                                  <AvatarFallback className="text-xs">
                                    {user.name[0]}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">{user.name}</p>
                                  <p className="text-sm text-gray-600">
                                    {user.email}
                                  </p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{user.staffId}</TableCell>
                            <TableCell>{user.grade}</TableCell>
                            <TableCell>{user.opco}</TableCell>
                            <TableCell>{user.currentModule}</TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Progress
                                  value={user.progress}
                                  className="w-16 h-2"
                                />
                                <span className="text-sm">{user.progress}</span>
                              </div>
                            </TableCell>
                            <TableCell>{getStatusBadge(user.status)}</TableCell>
                            <TableCell className="text-sm text-gray-600">
                              {user.lastActive}
                            </TableCell>
                            {/* <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                  <DropdownMenuItem>
                                    <Eye className="w-4 h-4 mr-2" />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit User
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-red-600">
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Remove User
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell> */}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
                {/* Pagination */}
                {users?.meta?.totalResults > 0 &&
                  users?.meta?.totalResults > 10 && (
                    <div className="mt-6">
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious
                              onClick={handlePreviousPage}
                              size={"sm"}
                              className={pageNumber === 1 ? "disabled" : ""}
                            />
                          </PaginationItem>
                          {Array.from(
                            { length: users?.meta.totalPages },
                            (_, i) => i + 1
                          ).map((page) => (
                            <PaginationItem key={page}>
                              <PaginationLink
                                size={"sm"}
                                isActive={page === pageNumber}
                                onClick={() => setPageNumber(page)}
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          ))}
                          <PaginationItem>
                            <PaginationNext
                              onClick={handleNextPage}
                              className={
                                pageNumber === users?.meta.totalPages
                                  ? "disabled"
                                  : ""
                              }
                              size={"sm"}
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>
                  )}
                {users?.data?.length === 0 && (
                  <div className="text-center py-12">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No users found
                    </h3>
                  </div>
                )}
              </TabsContent>

              {/* <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Completion Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    Chart placeholder - Completion trends over time
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>User Engagement</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    Chart placeholder - User engagement metrics
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Module Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    Chart placeholder - Module completion rates
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Assessment Scores</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    Chart placeholder - Assessment performance
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent> */}
            </Tabs>
          </div>
        </div>
      )}
    </>
  );
}
