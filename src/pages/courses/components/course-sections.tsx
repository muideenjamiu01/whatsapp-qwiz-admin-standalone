"use client"

import { useState } from "react"
import {
  ArrowLeft,
  Plus,
  Search,
  MoreHorizontal,
  Video,
  ImageIcon,
  FileText,
  Edit,
  Trash2,
  Eye,
  Move,
  Copy,
  Save,
  X,
} from "lucide-react"
import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import { Textarea } from "../../../components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../../components/ui/dialog"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"

interface Section {
  id: string
  title: string
  description?: string
  order: number
  mediaType?: "video" | "image" | "text" | "audio"
  mediaUrl?: string
  content?: string
  moduleId: string
  status: "active" | "draft"
  estimatedTime: string
  completionRate: number
}

interface Module {
  id: string
  title: string
  description: string
  order: number
  sections: Section[]
}

const mockModules: Module[] = [
  {
    id: "module-001",
    title: "Who We Are",
    description: "Introduction to Access Group's history, identity, and achievements",
    order: 1,
    sections: [
      {
        id: "section-001",
        title: "Where We've Been",
        description: "A journey through Access Group's history",
        order: 1,
        mediaType: "video",
        mediaUrl: "https://example.com/video1.mp4",
        moduleId: "module-001",
        status: "active",
        estimatedTime: "3 mins",
        completionRate: 95.5,
      },
      {
        id: "section-002",
        title: "Where It All Began",
        description: "The founding story of Access Group",
        order: 2,
        mediaType: "video",
        mediaUrl: "https://example.com/video2.mp4",
        moduleId: "module-001",
        status: "active",
        estimatedTime: "2.5 mins",
        completionRate: 92.3,
      },
    ],
  },
  {
    id: "module-002",
    title: "Our Culture",
    description: "Understanding Access Group's vision, mission, and core values",
    order: 2,
    sections: [
      {
        id: "section-003",
        title: "What We Are Aiming For (Vision)",
        description: "Access Group's vision for the future",
        order: 1,
        mediaType: "video",
        mediaUrl: "https://example.com/video3.mp4",
        moduleId: "module-002",
        status: "active",
        estimatedTime: "2 mins",
        completionRate: 88.7,
      },
    ],
  },
]

interface CourseSectionsProps {
  courseId: string
  onBack: () => void
}

export default function CourseSections({ courseId, onBack }: CourseSectionsProps) {
  const [modules, setModules] = useState<Module[]>(mockModules)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedModule, setSelectedModule] = useState<string>("all")
  const [isAddSectionOpen, setIsAddSectionOpen] = useState(false)
  const [editingSection, setEditingSection] = useState<Section | null>(null)

const [sectionForm, setSectionForm] = useState<{
  title: string
  description: string
  mediaType: "video" | "image" | "text" | "audio"
  mediaUrl: string
  content: string
  moduleId: string
  estimatedTime: string
}>({
  title: "",
  description: "",
  mediaType: "video",
  mediaUrl: "",
  content: "",
  moduleId: "",
  estimatedTime: "",
})

  const getMediaIcon = (mediaType: string) => {
    switch (mediaType) {
      case "video":
        return <Video className="w-4 h-4" />
      case "image":
        return <ImageIcon className="w-4 h-4" />
      case "audio":
        return <FileText className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case "draft":
        return <Badge className="bg-yellow-100 text-yellow-800">Draft</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const handleAddSection = () => {
    setEditingSection(null)
    setSectionForm({
      title: "",
      description: "",
      mediaType: "video",
      mediaUrl: "",
      content: "",
      moduleId: modules[0]?.id || "",
      estimatedTime: "",
    })
    setIsAddSectionOpen(true)
  }

 const handleEditSection = (section: Section) => {
  setEditingSection(section)
  setSectionForm({
    title: section.title,
    description: section.description || "",
    mediaType: section.mediaType ?? "video", // Provide a default value if section.mediaType is undefined
    mediaUrl: section.mediaUrl || "",
    content: section.content || "",
    moduleId: section.moduleId,
    estimatedTime: section.estimatedTime,
  })
  setIsAddSectionOpen(true)
}

  const handleSaveSection = () => {
    if (editingSection) {
      // Update existing section
      setModules((prev) =>
        prev.map((module) => ({
          ...module,
          sections: module.sections.map((section) =>
            section.id === editingSection.id ? { ...section, ...sectionForm } : section,
          ),
        })),
      )
    } else {
      // Add new section
      const newSection: Section = {
        id: `section-${Date.now()}`,
        ...sectionForm,
        order: modules.find((m) => m.id === sectionForm.moduleId)?.sections.length || 0 + 1,
        status: "draft",
        completionRate: 0,
      }

      setModules((prev) =>
        prev.map((module) =>
          module.id === sectionForm.moduleId ? { ...module, sections: [...module.sections, newSection] } : module,
        ),
      )
    }

    setIsAddSectionOpen(false)
    setEditingSection(null)
  }

  const handleDeleteSection = (sectionId: string) => {
    setModules((prev) =>
      prev.map((module) => ({
        ...module,
        sections: module.sections.filter((section) => section.id !== sectionId),
      })),
    )
  }

  const onDragEnd = (result: any) => {
    if (!result.destination) return

    const { source, destination } = result

    // Handle reordering within the same module
    if (source.droppableId === destination.droppableId) {
      const moduleId = source.droppableId
      setModules((prev) =>
        prev.map((module) => {
          if (module.id === moduleId) {
            const newSections = Array.from(module.sections)
            const [reorderedSection] = newSections.splice(source.index, 1)
            newSections.splice(destination.index, 0, reorderedSection)

            // Update order numbers
            return {
              ...module,
              sections: newSections.map((section, index) => ({
                ...section,
                order: index + 1,
              })),
            }
          }
          return module
        }),
      )
    }
  }

  const filteredModules = modules
    .map((module) => ({
      ...module,
      sections: module.sections.filter((section) => {
        const matchesSearch = section.title.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesModule = selectedModule === "all" || module.id === selectedModule
        return matchesSearch && matchesModule
      }),
    }))
    .filter((module) => selectedModule === "all" || module.id === selectedModule || module.sections.length > 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Courses
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Course Sections</h1>
              <p className="text-gray-600">Manage modules and sections for your course</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add Module
            </Button>
            <Button onClick={handleAddSection}>
              <Plus className="w-4 h-4 mr-2" />
              Add Section
            </Button>
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        {/* Filters */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search sections..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Select value={selectedModule} onValueChange={setSelectedModule}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Modules</SelectItem>
                {modules.map((module) => (
                  <SelectItem key={module.id} value={module.id}>
                    {module.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Modules and Sections */}
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="space-y-8">
            {filteredModules.map((module) => (
              <Card key={module.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <span>{module.title}</span>
                        <Badge variant="outline">Module {module.order}</Badge>
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
                  <Droppable droppableId={module.id}>
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                        {module.sections.length === 0 ? (
                          <div className="text-center py-8 text-gray-500">
                            <FileText className="w-8 h-8 mx-auto mb-2" />
                            <p>No sections in this module</p>
                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-2 bg-transparent"
                              onClick={handleAddSection}
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Add First Section
                            </Button>
                          </div>
                        ) : (
                          module.sections.map((section, index) => (
                            <Draggable key={section.id} draggableId={section.id} index={index}>
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  className="flex items-center justify-between p-4 border rounded-lg bg-white hover:shadow-sm transition-shadow"
                                >
                                  <div className="flex items-center space-x-4">
                                    <div {...provided.dragHandleProps} className="cursor-move">
                                      <Move className="w-4 h-4 text-gray-400" />
                                    </div>
                                    <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full">
                                      {getMediaIcon(section?.mediaType ?? "video")}
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex items-center space-x-2">
                                        <h4 className="font-medium">{section.title}</h4>
                                        {getStatusBadge(section.status)}
                                      </div>
                                      <p className="text-sm text-gray-600">
                                        {section.mediaType} • {section.estimatedTime}
                                      </p>
                                      {section.description && (
                                        <p className="text-sm text-gray-500 mt-1">{section.description}</p>
                                      )}
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
                                        <DropdownMenuItem onClick={() => handleEditSection(section)}>
                                          <Edit className="w-4 h-4 mr-2" />
                                          Edit Section
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                          <Copy className="w-4 h-4 mr-2" />
                                          Duplicate
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                          className="text-red-600"
                                          onClick={() => handleDeleteSection(section.id)}
                                        >
                                          <Trash2 className="w-4 h-4 mr-2" />
                                          Delete
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))
                        )}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </CardContent>
              </Card>
            ))}
          </div>
        </DragDropContext>

        {/* Add/Edit Section Dialog */}
        <Dialog open={isAddSectionOpen} onOpenChange={setIsAddSectionOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingSection ? "Edit Section" : "Add New Section"}</DialogTitle>
              <DialogDescription>
                {editingSection ? "Update the section details below" : "Create a new section for your course module"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sectionTitle">Section Title *</Label>
                  <Input
                    id="sectionTitle"
                    placeholder="e.g., Where We've Been"
                    value={sectionForm.title}
                    onChange={(e) => setSectionForm((prev) => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="moduleSelect">Module *</Label>
                  <Select
                    value={sectionForm.moduleId}
                    onValueChange={(value) => setSectionForm((prev) => ({ ...prev, moduleId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select module" />
                    </SelectTrigger>
                    <SelectContent>
                      {modules.map((module) => (
                        <SelectItem key={module.id} value={module.id}>
                          {module.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sectionDescription">Description</Label>
                <Textarea
                  id="sectionDescription"
                  placeholder="Brief description of this section..."
                  value={sectionForm.description}
                  onChange={(e) => setSectionForm((prev) => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="mediaType">Media Type</Label>
                  <Select
                    value={sectionForm.mediaType}
                    onValueChange={(value: any) => setSectionForm((prev) => ({ ...prev, mediaType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="image">Image</SelectItem>
                      <SelectItem value="audio">Audio</SelectItem>
                      <SelectItem value="text">Text</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estimatedTime">Estimated Time</Label>
                  <Input
                    id="estimatedTime"
                    placeholder="e.g., 3 mins"
                    value={sectionForm.estimatedTime}
                    onChange={(e) => setSectionForm((prev) => ({ ...prev, estimatedTime: e.target.value }))}
                  />
                </div>
              </div>

              {sectionForm.mediaType !== "text" && (
                <div className="space-y-2">
                  <Label htmlFor="mediaUrl">Media URL</Label>
                  <Input
                    id="mediaUrl"
                    placeholder="https://example.com/media.mp4"
                    value={sectionForm.mediaUrl}
                    onChange={(e) => setSectionForm((prev) => ({ ...prev, mediaUrl: e.target.value }))}
                  />
                </div>
              )}

              {sectionForm.mediaType === "text" && (
                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    placeholder="Enter the text content for this section..."
                    value={sectionForm.content}
                    onChange={(e) => setSectionForm((prev) => ({ ...prev, content: e.target.value }))}
                    rows={6}
                  />
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setIsAddSectionOpen(false)}>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={handleSaveSection}>
                  <Save className="w-4 h-4 mr-2" />
                  {editingSection ? "Update Section" : "Add Section"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
