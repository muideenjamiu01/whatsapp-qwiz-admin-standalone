import { useState } from "react";
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
  Save,
  X,
  BookOpen,
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
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";

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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { coursesApi } from "../../../hooks/useCourses";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";


interface Section {
  id: string;
  title: string;
  order: number;
  media_type?: "video" | "image" | "text" | "audio";
  media_url?: string;
  content?: string;
  module_id: string;
  status: "active" | "draft";
  estimatedTime: string;
  completionRate: number;
  createdAt?: string;
  updatedAt?: string;
  description: string;
}

interface Module {
  id: string;
  title: string;
  description: string;
  order: number;
  sections: Section[];
}

const mockModules: Module[] = [
  {
    id: "module-001",
    title: "Who We Are",
    description:
      "Introduction to Access Group's history, identity, and achievements",
    order: 1,
    sections: [
      {
        id: "section-001",
        title: "Where We've Been",
        description: "A journey through Access Group's history",
        order: 1,
        media_type: "video",
        media_url: "https://example.com/video1.mp4",
        module_id: "module-001",
        status: "active",
        estimatedTime: "3 mins",
        completionRate: 95.5,
      },
      {
        id: "section-002",
        title: "Where It All Began",
        description: "The founding story of Access Group",
        order: 2,
        media_type: "video",
        media_url: "https://example.com/video2.mp4",
        module_id: "module-001",
        status: "active",
        estimatedTime: "2.5 mins",
        completionRate: 92.3,
      },
    ],
  },
  {
    id: "module-002",
    title: "Our Culture",
    description:
      "Understanding Access Group's vision, mission, and core values",
    order: 2,
    sections: [
      {
        id: "section-003",
        title: "What We Are Aiming For (Vision)",
        description: "Access Group's vision for the future",
        order: 1,
        media_type: "video",
        media_url: "https://example.com/video3.mp4",
        module_id: "module-002",
        status: "active",
        estimatedTime: "2 mins",
        completionRate: 88.7,
      },
    ],
  },
];

export default function CourseSections() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [modules, setModules] = useState<Module[]>(mockModules);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddSectionOpen, setIsAddSectionOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [moduleId, setModuleId] = useState<string>("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [sectionToDelete, setSectionToDelete] = useState<Section | null>(null);
  const [sectionForm, setSectionForm] = useState<{
    title: string;
    description?: string;
    media_type: "video" | "image" | "text" | "audio";
    media_url: string;
    content: string;
    module_id: string;
    estimatedTime: string;
  }>({
    title: "",
    media_type: "video",
    media_url: "",
    content: "",
    module_id: "",
    estimatedTime: "",
  });

  console.log(setPageNumber,setPageSize)

  const {
    data: sectionsData,
    isLoading,
    refetch: refetchSections,
  } = useQuery({
    queryKey: ["getOverviewCourses", pageNumber, pageSize, searchTerm],
    queryFn: () =>
      coursesApi.getAllModules({
        course_id: id,
        pageNumber,
        pageSize,
        searchTerm,
      }),
    staleTime: 1000 * 60 * 60,
  });

  const getMediaIcon = (media_type: string) => {
    switch (media_type) {
      case "video":
        return <Video className="w-4 h-4" />;
      case "image":
        return <ImageIcon className="w-4 h-4" />;
      case "audio":
        return <FileText className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  // const getStatusBadge = (status: string) => {
  //   switch (status) {
  //     case "Published":
  //       return <Badge className="bg-green-100 text-green-800">Active</Badge>;
  //     case "Draft":
  //       return <Badge className="bg-yellow-100 text-yellow-800">Draft</Badge>;
  //     default:
  //       return <Badge variant="secondary">{status}</Badge>;
  //   }
  // };

  const handleAddSection = (module: any) => {
    setEditingSection(null);
    setModuleId(module?.id || "");
    setSectionForm({
      title: "",
      description: "",
      media_type: "video",
      media_url: "",
      content: "",
      module_id: module?.id || "",
      estimatedTime: "",
    });
    setIsAddSectionOpen(true);
  };

  const handleEditSection = (section: Section) => {
    setEditingSection(section);
    setSectionForm({
      title: section.title,
      description: section.description || "",
      media_type: section.media_type ?? "video", // Provide a default value if section.media_type is undefined
      media_url: section.media_url || "",
      content: section.content || "",
      module_id: section.module_id,
      estimatedTime: section.estimatedTime,
    });
    setIsAddSectionOpen(true);
  };

  const computedOrder = editingSection
    ? editingSection.order
    : (modules.find((m) => m.id === sectionForm.module_id)?.sections.length ||
        0) + 1;

  const handleSaveSection = async () => {
    const payload = {
      title: sectionForm.title,
      order: computedOrder,
      media_type: sectionForm.media_type || "video",
      media_url: sectionForm.media_url,
      module_id: moduleId,
      estimated_duration: sectionForm.estimatedTime,
    };

    try {
      let response;

      if (editingSection) {
        //  Call update API
        response = await coursesApi.updateSection({
          sectionId: editingSection.id,
          payload,
        });
        toast.success(response.message || "Section updated successfully");
      } else {
        //  Call create API
        response = await coursesApi.createSection(payload);
        toast.success(response.message || "User created successfully");
      }
      setIsAddSectionOpen(false);
      setEditingSection(null);
      refetchSections(); // Refetch sections after saving
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save section");
    }
  };

  const handleDeleteSection = (section: any) => {
    setSectionToDelete(section);
    setDeleteModalOpen(true);
  };

  const confirmDeleteSection = async () => {
    if (sectionToDelete) {
      try {
        const deleteSection = await coursesApi.deleteSection({
          sectionId: sectionToDelete?.id,
        });
        toast.success(deleteSection.message || "Course deleted successfully");
        refetchSections(); // Refetch sections after deletion
      } catch (err: any) {
        toast.error(err || "Failed to delete section");
      } finally {
        setDeleteModalOpen(false);
        setSectionToDelete(null);
      }
    }
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination } = result;

    // Handle reordering within the same module
    if (source.droppableId === destination.droppableId) {
      const module_id = source.droppableId;
      setModules((prev) =>
        prev.map((module) => {
          if (module.id === module_id) {
            const newSections = Array.from(module.sections);
            const [reorderedSection] = newSections.splice(source.index, 1);
            newSections.splice(destination.index, 0, reorderedSection);

            // Update order numbers
            return {
              ...module,
              sections: newSections.map((section, index) => ({
                ...section,
                order: index + 1,
              })),
            };
          }
          return module;
        })
      );
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
                    Course Sections
                  </h1>
                  <p className="text-gray-600">
                    Manage modules and sections for your course
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                {/* <Button variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add Module
            </Button> */}
                {/* <Button onClick={handleAddSection}>
              <Plus className="w-4 h-4 mr-2" />
              Add Section
            </Button> */}
              </div>
            </div>
          </div>

          <div className="px-6 py-6">
            {/* Filters */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="relative ">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search sections..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                {/* <Select value={selectedModule} onValueChange={setSelectedModule}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Modules</SelectItem>
                {sectionsData?.data.map((module: any) => (
                  <SelectItem key={module.id} value={module.id}>
                    {module.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select> */}
              </div>
            </div>

            {/* Modules and Sections */}
            <DragDropContext onDragEnd={onDragEnd}>
              <div className="space-y-8">
                {sectionsData?.data?.map((module: any) => (
                  <Card key={module.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="flex items-center space-x-2">
                            <span>{module.title}</span>
                            <Badge variant="outline">
                              Module {module.order}
                            </Badge>
                          </CardTitle>
                          <CardDescription>
                            {module.description}
                          </CardDescription>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            {/* <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Module
                        </DropdownMenuItem> */}
                            <DropdownMenuItem
                              onClick={() => {
                                handleAddSection(module);
                              }}
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Add Section
                            </DropdownMenuItem>
                            {/* <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteModule(module)}>
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Module
                        </DropdownMenuItem> */}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Droppable droppableId={module.id}>
                        {(provided) => (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="space-y-3"
                          >
                            {module?.CourseSections?.length === 0 ? (
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
                              module?.CourseSections?.map(
                                (section: any, index: any) => (
                                  <Draggable
                                    key={section.id}
                                    draggableId={section.id}
                                    index={index}
                                  >
                                    {(provided) => (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        className="flex items-center justify-between p-4 border rounded-lg bg-white hover:shadow-sm transition-shadow"
                                      >
                                        <div className="flex items-center space-x-4">
                                          <div
                                            {...provided.dragHandleProps}
                                            className="cursor-move"
                                          >
                                            <Move className="w-4 h-4 text-gray-400" />
                                          </div>
                                          <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full">
                                            {getMediaIcon(
                                              section?.media_type ?? "video"
                                            )}
                                          </div>
                                          <div className="flex-1">
                                            <div className="flex items-center space-x-2">
                                              <h4 className="font-medium">
                                                {section.title}
                                              </h4>
                                              {/* {getStatusBadge(section.status)} */}
                                            </div>
                                            <p className="text-sm text-gray-600">
                                              {section.media_type} •{" "}
                                              {section.estimated_duration}
                                            </p>
                                            {/* {section.description && (
                                          <p className="text-sm text-gray-500 mt-1">
                                            {section.description}
                                          </p>
                                        )} */}
                                          </div>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                          {/* <div className="text-right">
                                        <p className="text-sm font-medium">
                                          {section.completionRate}%
                                        </p>
                                        <p className="text-xs text-gray-600">
                                          completion
                                        </p>
                                      </div> */}
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
                                              <DropdownMenuItem
                                                onClick={() =>
                                                  handleEditSection(section)
                                                }
                                              >
                                                <Edit className="w-4 h-4 mr-2" />
                                                Edit Section
                                              </DropdownMenuItem>

                                              <DropdownMenuItem
                                                className="text-red-600"
                                                onClick={() =>
                                                  handleDeleteSection(section)
                                                }
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
                                )
                              )
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
            {/* Add/Edit Section Dialog */}
            <Dialog open={isAddSectionOpen} onOpenChange={setIsAddSectionOpen}>
              <DialogContent className="!max-w-[900px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-xl">
                    {editingSection ? "Update Section" : "Add New Section"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingSection
                      ? "Update the section details and media content below"
                      : "Create a new section with media content for your course module"}
                  </DialogDescription>
                </DialogHeader>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSaveSection();
                  }}
                  className="space-y-6"
                >
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium border-b pb-2">
                      Basic Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="sectionTitle"
                          className="text-sm font-medium"
                        >
                          Section Title *
                        </Label>
                        <Input
                          id="sectionTitle"
                          placeholder="e.g., Where We've Been"
                          value={sectionForm.title}
                          onChange={(e) =>
                            setSectionForm((prev) => ({
                              ...prev,
                              title: e.target.value,
                            }))
                          }
                          className="focus:ring-2 focus:ring-blue-500"
                        />
                        <p className="text-xs text-gray-500">
                          Choose a clear, descriptive title that explains what
                          this section covers.
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="sectionOrder"
                          className="text-sm font-medium"
                        >
                          Section Order
                        </Label>
                        <Input
                          id="sectionOrder"
                          type="number"
                          min="1"
                          placeholder="Auto-assigned"
                          value={computedOrder}
                          // value={
                          //   editingSection
                          //     ? editingSection.order
                          //     : (modules.find((m) => m.id === sectionForm.module_id)?.sections.length || 0) + 1
                          // }
                          disabled
                          className="bg-gray-50"
                        />
                        <p className="text-xs text-gray-500">
                          Order within the selected module. Use drag & drop to
                          reorder sections.
                        </p>
                      </div>
                    </div>
                    {!editingSection && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label
                            htmlFor="moduleSelect"
                            className="text-sm font-medium"
                          >
                            Module *
                          </Label>
                          <Select
                            value={sectionForm.module_id}
                            onValueChange={(value) =>
                              setSectionForm((prev) => ({
                                ...prev,
                                module_id: value,
                              }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a module" />
                            </SelectTrigger>
                            <SelectContent>
                              {modules.map((module) => (
                                <SelectItem key={module.id} value={module.id}>
                                  <div className="flex items-center space-x-2">
                                    <BookOpen className="w-4 h-4" />
                                    <span>{module.title}</span>
                                    <Badge variant="outline" className="ml-2">
                                      {module.sections.length} sections
                                    </Badge>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {sectionForm.module_id && (
                            <p className="text-xs text-gray-500">
                              This section will be added to:{" "}
                              {
                                modules.find(
                                  (m) => m.id === sectionForm.module_id
                                )?.title
                              }
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="estimatedTime">Estimated Time</Label>
                          <Input
                            id="estimatedTime"
                            placeholder="e.g., 3 mins"
                            value={sectionForm.estimatedTime}
                            onChange={(e) =>
                              setSectionForm((prev) => ({
                                ...prev,
                                estimatedTime: e.target.value,
                              }))
                            }
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Media Content */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium border-b pb-2">
                      Media Content
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="media_type"
                          className="text-sm font-medium"
                        >
                          Media Type *
                        </Label>
                        <Select
                          value={sectionForm.media_type}
                          onValueChange={(value: any) => {
                            setSectionForm((prev) => ({
                              ...prev,
                              media_type: value,
                              media_url: value === "text" ? "" : prev.media_url,
                            }));
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="video">
                              <div className="flex items-center space-x-2">
                                <Video className="w-4 h-4" />
                                <span>Video</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="image">
                              <div className="flex items-center space-x-2">
                                <ImageIcon className="w-4 h-4" />
                                <span>Image</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="audio">
                              <div className="flex items-center space-x-2">
                                <FileText className="w-4 h-4" />
                                <span>Audio</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="text">
                              <div className="flex items-center space-x-2">
                                <FileText className="w-4 h-4" />
                                <span>Text Only</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {sectionForm.media_type !== "text" && (
                        <div className="space-y-2">
                          <Label
                            htmlFor="media_url"
                            className="text-sm font-medium"
                          >
                            Media URL *
                          </Label>
                          <Input
                            id="media_url"
                            type="url"
                            placeholder={`https://example.com/media.${
                              sectionForm.media_type === "video"
                                ? "mp4"
                                : sectionForm.media_type === "audio"
                                ? "mp3"
                                : "jpg"
                            }`}
                            value={sectionForm.media_url}
                            onChange={(e) =>
                              setSectionForm((prev) => ({
                                ...prev,
                                media_url: e.target.value,
                              }))
                            }
                          />
                          <p className="text-xs text-gray-500">
                            Provide a direct URL to your{" "}
                            {sectionForm.media_type} file. Ensure it's
                            accessible and properly formatted.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Media Type Specific Instructions */}
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          {getMediaIcon(sectionForm.media_type)}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-blue-900 mb-2">
                            {sectionForm.media_type.charAt(0).toUpperCase() +
                              sectionForm.media_type.slice(1)}{" "}
                            Guidelines
                          </h4>
                          {sectionForm.media_type === "video" && (
                            <div className="text-sm text-blue-700 space-y-1">
                              <p>• Recommended formats: MP4, WebM</p>
                              <p>
                                • Keep videos under 10 minutes for better
                                engagement
                              </p>
                              <p>
                                • Ensure good audio quality and clear visuals
                              </p>
                              <p>
                                • Consider adding captions for accessibility
                              </p>
                            </div>
                          )}
                          {sectionForm.media_type === "image" && (
                            <div className="text-sm text-blue-700 space-y-1">
                              <p>• Recommended formats: JPG, PNG, WebP</p>
                              <p>
                                • Optimal size: 1200x800 pixels or similar ratio
                              </p>
                              <p>
                                • Keep file size under 2MB for faster loading
                              </p>
                              <p>• Use high-quality, relevant images</p>
                            </div>
                          )}
                          {sectionForm.media_type === "audio" && (
                            <div className="text-sm text-blue-700 space-y-1">
                              <p>• Recommended formats: MP3, WAV</p>
                              <p>• Keep audio clips under 5 minutes</p>
                              <p>• Ensure clear audio quality</p>
                              <p>• Consider providing transcripts</p>
                            </div>
                          )}
                          {sectionForm.media_type === "text" && (
                            <div className="text-sm text-blue-700 space-y-1">
                              <p>
                                • Text-only sections don't require media URLs
                              </p>
                              <p>
                                • Content will be delivered as WhatsApp messages
                              </p>
                              <p>• Keep text concise and engaging</p>
                              <p>• Use bullet points for better readability</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* URL Validation */}
                    {sectionForm.media_url &&
                      sectionForm.media_type !== "text" && (
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">
                            Media Preview
                          </Label>
                          <div className="p-3 border rounded-lg bg-gray-50">
                            <div className="flex items-center space-x-2 text-sm">
                              {getMediaIcon(sectionForm.media_type)}
                              <span className="font-medium">URL:</span>
                              <code className="bg-white px-2 py-1 rounded text-xs break-all">
                                {sectionForm.media_url}
                              </code>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                              Make sure this URL is publicly accessible and
                              returns the correct media type.
                            </p>
                          </div>
                        </div>
                      )}
                  </div>

                  {/* Section Preview */}
                  {sectionForm.title && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium border-b pb-2">
                        Preview
                      </h3>
                      <div className="p-4 border rounded-lg bg-gray-50">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center justify-center w-8 h-8 bg-white rounded-full border">
                              {getMediaIcon(sectionForm.media_type)}
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">
                                {sectionForm.title}
                              </h4>
                              <p className="text-sm text-gray-600 capitalize">
                                {sectionForm.media_type} content
                              </p>
                            </div>
                          </div>
                          <Badge variant="outline">
                            Section{" "}
                            {editingSection
                              ? editingSection.order
                              : (modules.find(
                                  (m) => m.id === sectionForm.module_id
                                )?.sections.length || 0) + 1}
                          </Badge>
                        </div>

                        {sectionForm.module_id && (
                          <div className="text-xs text-gray-500 flex items-center">
                            <BookOpen className="w-3 h-3 mr-1" />
                            Module:{" "}
                            {
                              modules.find(
                                (m) => m.id === sectionForm.module_id
                              )?.title
                            }
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Form Actions */}
                  <div className="flex justify-end space-x-3 pt-6 border-t">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsAddSectionOpen(false)}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={
                        !sectionForm.title.trim() ||
                        !sectionForm.module_id ||
                        (sectionForm.media_type !== "text" &&
                          !sectionForm.media_url.trim())
                      }
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {editingSection ? "Update Section" : "Create Section"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>

            {/*confirm delete modal */}
            <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete User</DialogTitle>
                </DialogHeader>
                <p>
                  Are you sure you want to delete {sectionToDelete?.title} ?
                </p>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setDeleteModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={confirmDeleteSection}>
                    Delete
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      )}
    </>
  );
}
