"use client"

import { useState } from "react"
import {
  ArrowLeft,
  Users,
  BookOpen,
  Clock,
  CheckCircle,
  MoreHorizontal,
  Plus,
  Search,
  Download,
  Eye,
  Edit,
  Trash2,
  Video,
  ImageIcon,
  FileText,
} from "lucide-react"
import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import { Progress } from "../../../components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import { Input } from "../../../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table"
import { Avatar, AvatarFallback } from "../../../components/ui/avatar"

// Mock data based on the documentation
const courseData = {
  id: "course-001",
  title: "Access Group Onboarding Experience",
  description: "A comprehensive WhatsApp-based onboarding experience for Access Holdings staff",
  status: "active",
  joinCode: "AGX2024",
  totalModules: 2,
  totalSections: 7,
  totalUsers: 156,
  completionRate: 78.5,
  createdAt: "2024-01-15",
  lastUpdated: "2024-01-16",
}

const modules = [
  {
    id: "module-001",
    title: "Who We Are",
    description: "Introduction to Access Group's history, identity, and achievements",
    order: 1,
    status: "active",
    sections: 4,
    completedSections: 3,
    enrolledUsers: 156,
    completedUsers: 134,
    averageCompletionTime: "12 mins",
  },
  {
    id: "module-002",
    title: "Our Culture",
    description: "Understanding Access Group's vision, mission, and core values",
    order: 2,
    status: "active",
    sections: 3,
    completedSections: 2,
    enrolledUsers: 134,
    completedUsers: 105,
    averageCompletionTime: "8 mins",
  },
]

const sections = [
  {
    id: "section-001",
    title: "Where We've Been",
    moduleId: "module-001",
    order: 1,
    mediaType: "video",
    mediaUrl: "https://example.com/video1.mp4",
    status: "active",
    completionRate: 95.5,
    averageTime: "3 mins",
  },
  {
    id: "section-002",
    title: "Where It All Began",
    moduleId: "module-001",
    order: 2,
    mediaType: "video",
    mediaUrl: "https://example.com/video2.mp4",
    status: "active",
    completionRate: 92.3,
    averageTime: "2.5 mins",
  },
  {
    id: "section-003",
    title: "Where Everyone Fits In",
    moduleId: "module-001",
    order: 3,
    mediaType: "video",
    mediaUrl: "https://example.com/video3.mp4",
    status: "active",
    completionRate: 88.7,
    averageTime: "3.5 mins",
  },
  {
    id: "section-004",
    title: "What We've Achieved So Far",
    moduleId: "module-001",
    order: 4,
    mediaType: "video",
    mediaUrl: "https://example.com/video4.mp4",
    status: "active",
    completionRate: 85.9,
    averageTime: "3 mins",
  },
]

const recentUsers = [
  {
    id: "user-001",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@accessholdings.com",
    staffId: "AGX1234",
    grade: "AVP",
    opco: "Access Nigeria",
    currentModule: "Our Culture",
    progress: 65,
    lastActive: "2 hours ago",
    status: "active",
  },
  {
    id: "user-002",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@accessholdings.com",
    staffId: "AGX5678",
    grade: "VP",
    opco: "Access Ghana",
    currentModule: "Who We Are",
    progress: 100,
    lastActive: "1 day ago",
    status: "completed",
  },
  {
    id: "user-003",
    firstName: "Michael",
    lastName: "Johnson",
    email: "michael.johnson@accessholdings.com",
    staffId: "AGX9012",
    grade: "Manager",
    opco: "Access Kenya",
    currentModule: "Who We Are",
    progress: 25,
    lastActive: "3 hours ago",
    status: "active",
  },
]

export default function CourseDetails() {
  const [activeTab, setActiveTab] = useState("overview")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  const getMediaIcon = (mediaType: string) => {
    switch (mediaType) {
      case "video":
        return <Video className="w-4 h-4" />
      case "image":
        return <ImageIcon className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800">Completed</Badge>
      case "paused":
        return <Badge className="bg-yellow-100 text-yellow-800">Paused</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Courses
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{courseData.title}</h1>
              <p className="text-gray-600">{courseData.description}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
            <Button size="sm">
              <Edit className="w-4 h-4 mr-2" />
              Edit Course
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Modules</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{courseData.totalModules}</div>
              <p className="text-xs text-muted-foreground">{courseData.totalSections} sections total</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Enrolled Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{courseData.totalUsers}</div>
              <p className="text-xs text-muted-foreground">+12 from last week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{courseData.completionRate}%</div>
              <p className="text-xs text-muted-foreground">+5.2% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">20m</div>
              <p className="text-xs text-muted-foreground">Per user completion</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="modules">Modules & Sections</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
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
                    {getStatusBadge(courseData.status)}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Join Code:</span>
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm">{courseData.joinCode}</code>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Created:</span>
                    <span className="text-sm">{courseData.createdAt}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Last Updated:</span>
                    <span className="text-sm">{courseData.lastUpdated}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Module Progress */}
              <Card>
                <CardHeader>
                  <CardTitle>Module Progress</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {modules.map((module) => (
                    <div key={module.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{module.title}</span>
                        <span className="text-sm text-gray-600">
                          {Math.round((module.completedUsers / module.enrolledUsers) * 100)}%
                        </span>
                      </div>
                      <Progress value={(module.completedUsers / module.enrolledUsers) * 100} className="h-2" />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{module.completedUsers} completed</span>
                        <span>{module.enrolledUsers} enrolled</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent User Activity</CardTitle>
                <CardDescription>Latest user interactions with the course</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarFallback>
                            {user.firstName[0]}
                            {user.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-sm text-gray-600">
                            {user.staffId} • {user.opco}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{user.currentModule}</p>
                        <p className="text-xs text-gray-600">{user.progress}% complete</p>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(user.status)}
                        <p className="text-xs text-gray-600 mt-1">{user.lastActive}</p>
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
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Module
              </Button>
            </div>

            <div className="space-y-6">
              {modules.map((module) => (
                <Card key={module.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center space-x-2">
                          <span>{module.title}</span>
                          {getStatusBadge(module.status)}
                        </CardTitle>
                        <CardDescription>{module.description}</CardDescription>
                      </div>
                      <DropdownMenu>
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
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold">{module.sections}</div>
                        <div className="text-sm text-gray-600">Sections</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">{module.enrolledUsers}</div>
                        <div className="text-sm text-gray-600">Enrolled</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">{module.averageCompletionTime}</div>
                        <div className="text-sm text-gray-600">Avg. Time</div>
                      </div>
                    </div>

                    {/* Sections */}
                    <div className="space-y-3">
                      <h4 className="font-medium">Sections</h4>
                      {sections
                        .filter((section) => section.moduleId === module.id)
                        .map((section) => (
                          <div key={section.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full">
                                {getMediaIcon(section.mediaType)}
                              </div>
                              <div>
                                <p className="font-medium">{section.title}</p>
                                <p className="text-sm text-gray-600">
                                  {section.mediaType} • {section.averageTime}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-4">
                              <div className="text-right">
                                <p className="text-sm font-medium">{section.completionRate}%</p>
                                <p className="text-xs text-gray-600">completion</p>
                              </div>
                              <DropdownMenu>
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
                              </DropdownMenu>
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
                    value={searchTerm}
                    onChange={(e:any) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                  </SelectContent>
                </Select>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add User
                </Button>
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
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className="text-xs">
                                {user.firstName[0]}
                                {user.lastName[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">
                                {user.firstName} {user.lastName}
                              </p>
                              <p className="text-sm text-gray-600">{user.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{user.staffId}</TableCell>
                        <TableCell>{user.grade}</TableCell>
                        <TableCell>{user.opco}</TableCell>
                        <TableCell>{user.currentModule}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Progress value={user.progress} className="w-16 h-2" />
                            <span className="text-sm">{user.progress}%</span>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(user.status)}</TableCell>
                        <TableCell className="text-sm text-gray-600">{user.lastActive}</TableCell>
                        <TableCell>
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
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
