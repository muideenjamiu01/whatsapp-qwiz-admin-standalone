"use client"

import { useState } from "react"
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
  Copy,
  Download,
} from "lucide-react"
import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import { Input } from "../../../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table"
import { Progress } from "../../../components/ui/progress"

interface Course {
  id: string
  title: string
  description: string
  status: "active" | "draft" | "archived"
  joinCode: string
  modules: number
  sections: number
  enrolledUsers: number
  completedUsers: number
  completionRate: number
  createdAt: string
  lastUpdated: string
  averageTime: string
}

const mockCourses: Course[] = [
  {
    id: "course-001",
    title: "Access Group Onboarding Experience",
    description: "Comprehensive WhatsApp-based onboarding for Access Holdings staff",
    status: "active",
    joinCode: "AGX2024",
    modules: 2,
    sections: 7,
    enrolledUsers: 156,
    completedUsers: 122,
    completionRate: 78.2,
    createdAt: "2024-01-15",
    lastUpdated: "2024-01-16",
    averageTime: "20m",
  },
  {
    id: "course-002",
    title: "Leadership Development Program",
    description: "Advanced leadership training for senior staff members",
    status: "active",
    joinCode: "LDP2024",
    modules: 3,
    sections: 12,
    enrolledUsers: 45,
    completedUsers: 32,
    completionRate: 71.1,
    createdAt: "2024-01-10",
    lastUpdated: "2024-01-14",
    averageTime: "45m",
  },
  {
    id: "course-003",
    title: "Digital Banking Fundamentals",
    description: "Introduction to digital banking concepts and practices",
    status: "draft",
    joinCode: "DBF2024",
    modules: 4,
    sections: 16,
    enrolledUsers: 0,
    completedUsers: 0,
    completionRate: 0,
    createdAt: "2024-01-12",
    lastUpdated: "2024-01-13",
    averageTime: "0m",
  },
  {
    id: "course-004",
    title: "Compliance Training 2023",
    description: "Annual compliance and regulatory training",
    status: "archived",
    joinCode: "CT2023",
    modules: 2,
    sections: 8,
    enrolledUsers: 234,
    completedUsers: 234,
    completionRate: 100,
    createdAt: "2023-12-01",
    lastUpdated: "2023-12-31",
    averageTime: "30m",
  },
]

const analyticsData = {
  totalCourses: 4,
  activeCourses: 2,
  totalUsers: 435,
  averageCompletion: 82.3,
  monthlyGrowth: 15.2,
  totalCompletions: 388,
}

interface CoursesListProps {
  onCreateCourse: () => void
  onViewCourse: (courseId: string) => void
  onEditCourse: (courseId: string) => void
  onManageSections: (courseId: string) => void
}

export default function CoursesList({
  onCreateCourse,
  onViewCourse,
  onEditCourse,
  onManageSections,
}: CoursesListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid")

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case "draft":
        return <Badge className="bg-yellow-100 text-yellow-800">Draft</Badge>
      case "archived":
        return <Badge className="bg-gray-100 text-gray-800">Archived</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const filteredCourses = mockCourses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || course.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Course Management</h1>
            <p className="text-gray-600">Manage your WhatsApp-based training courses</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
            <Button onClick={onCreateCourse}>
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
              <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.totalCourses}</div>
              <p className="text-xs text-muted-foreground">{analyticsData.activeCourses} active courses</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.totalUsers}</div>
              <p className="text-xs text-muted-foreground">+{analyticsData.monthlyGrowth}% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Completion</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.averageCompletion}%</div>
              <p className="text-xs text-muted-foreground">{analyticsData.totalCompletions} total completions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Growth</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{analyticsData.monthlyGrowth}%</div>
              <p className="text-xs text-muted-foreground">User enrollment growth</p>
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
                onChange={(e:any) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant={viewMode === "grid" ? "default" : "outline"} size="sm" onClick={() => setViewMode("grid")}>
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

        {/* Course Grid View */}
        {viewMode === "grid" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <Card key={course.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{course.title}</CardTitle>
                      <CardDescription className="mt-1">{course.description}</CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => onViewCourse(course.id)}>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEditCourse(course.id)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Course
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onManageSections(course.id)}>
                          <BookOpen className="w-4 h-4 mr-2" />
                          Manage Sections
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy className="w-4 h-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    {getStatusBadge(course.status)}
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm">{course.joinCode}</code>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-lg font-semibold">{course.modules}</div>
                      <div className="text-sm text-gray-600">Modules</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold">{course.sections}</div>
                      <div className="text-sm text-gray-600">Sections</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{course.completionRate}%</span>
                    </div>
                    <Progress value={course.completionRate} className="h-2" />
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>{course.completedUsers} completed</span>
                      <span>{course.enrolledUsers} enrolled</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-4 pt-4 border-t">
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-1" />
                      {course.averageTime}
                    </div>
                    <div className="text-sm text-gray-600">Updated {course.lastUpdated}</div>
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
                    <TableHead>Modules</TableHead>
                    <TableHead>Enrolled</TableHead>
                    <TableHead>Completion</TableHead>
                    <TableHead>Avg. Time</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCourses.map((course) => (
                    <TableRow key={course.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{course.title}</p>
                          <p className="text-sm text-gray-600">{course.description}</p>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(course.status)}</TableCell>
                      <TableCell>
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm">{course.joinCode}</code>
                      </TableCell>
                      <TableCell>{course.modules}</TableCell>
                      <TableCell>{course.enrolledUsers}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Progress value={course.completionRate} className="w-16 h-2" />
                          <span className="text-sm">{course.completionRate}%</span>
                        </div>
                      </TableCell>
                      <TableCell>{course.averageTime}</TableCell>
                      <TableCell className="text-sm text-gray-600">{course.lastUpdated}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => onViewCourse(course.id)}>
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onEditCourse(course.id)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit Course
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onManageSections(course.id)}>
                              <BookOpen className="w-4 h-4 mr-2" />
                              Manage Sections
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Copy className="w-4 h-4 mr-2" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
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

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search or filter criteria"
                : "Get started by creating your first course"}
            </p>
            {!searchTerm && statusFilter === "all" && (
              <Button onClick={onCreateCourse}>
                <Plus className="w-4 h-4 mr-2" />
                Create Course
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
