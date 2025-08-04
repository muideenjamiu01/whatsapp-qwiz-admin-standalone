import { useState } from "react";
import {
  ArrowLeft,
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Save,
  X,
  Move,
  BookOpen,
  FileText,
} from "lucide-react";

import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Badge } from "../../../components/ui/badge";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
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
import { useNavigate, useParams } from "react-router-dom";
import { coursesApi } from "../../../hooks/useCourses";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";


interface CourseModule {
  id: string;
  title: string;
  description: string;
  course_id: string;
  external_quiz_id?: string;
  order: number;
  createdAt: string;
  updatedAt: string;
  sectionsCount?: number;
}

export default function ModuleManagement({  courseTitle }: any) {
  const { id } = useParams<{ id: string }>();
  const [searchTerm, setSearchTerm] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isAddModuleOpen, setIsAddModuleOpen] = useState(false);
 console.log(setPageNumber,setPageSize)
  
  const {
    data: modulesData,
    refetch: refetchModules,
    isLoading,
  } = useQuery({
    queryKey: ["getOverviewCourses", pageNumber, pageSize, searchTerm],
    queryFn: () =>
      coursesApi.getAllModules({
        moduleId: id,
        pageNumber,
        pageSize,
        searchTerm,
      }),
    staleTime: 1000 * 60 * 60,
  });

  const [modules, setModules] = useState<any[]>(modulesData?.data);

  const [editingModule, setEditingModule] = useState<any | null>(null);
  const navigate = useNavigate();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [sectionToDelete, setSectionToDelete] = useState<any | null>(null);
  const [moduleForm, setModuleForm] = useState({
    title: "",
    description: "",
    external_quiz_id: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleAddModule = () => {
    setEditingModule(null);
    setModuleForm({
      title: "",
      description: "",
      external_quiz_id: "",
    });
    setErrors({});
    setIsAddModuleOpen(true);
  };

  const handleEditModule = (module: CourseModule) => {
    setEditingModule(module);
    setModuleForm({
      title: module.title,
      description: module.description,
      external_quiz_id: module.external_quiz_id || "",
    });
    setErrors({});
    setIsAddModuleOpen(true);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!moduleForm.title.trim()) {
      newErrors.title = "Module title is required";
    }

    if (!moduleForm.description.trim()) {
      newErrors.description = "Module description is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveModule = async () => {
    if (!validateForm()) return;
    const payload = {
      title: moduleForm.title, // Use the title from the module form
      description: moduleForm.description, // Use the description from the module form
      course_id: id, // Add the course ID
      external_quiz_id: moduleForm.external_quiz_id, // Use the external quiz ID from the module form
      order: editingModule ? editingModule.order : modules.length + 1, // Use the order value from the form
    };

    try {
      let response;
      if (editingModule) {
        // Update existing module
        response = await coursesApi.updateModule({
          moduleId: editingModule.id, // Use moduleId instead of sectionId
          payload,
        });
        toast.success(response.message || "Module updated successfully");
      } else {
        //  Call create API
        response = await coursesApi.createModule(payload); // Use createModule instead of createSection
        toast.success(response.message || "Module created successfully");
      }
      setIsAddModuleOpen(false);
      setEditingModule(null);
      refetchModules(); // Refetch modules after saving
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save module");
    }
  };

  const handleDeleteModule = (module: any) => {
    setSectionToDelete(module);
    setDeleteModalOpen(true);
  };

  const confirmDeleteModule = async () => {
    if (sectionToDelete) {
      try {
        const deleteModule = await coursesApi.deleteModule({
          moduleId: sectionToDelete?.id,
        });
        toast.success(deleteModule.message || "Course deleted successfully");
        refetchModules(); // Refetch sections after deletion
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Failed to delete module");
      } finally {
        setDeleteModalOpen(false);
        setSectionToDelete(null);
      }
    }
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(modules);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order numbers
    const updatedModules = items.map((module, index) => ({
      ...module,
      order: index + 1,
      updatedAt: new Date().toISOString(),
    }));

    setModules(updatedModules);
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
                  Back to Course
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Course Modules
                  </h1>
                  <p className="text-gray-600">{courseTitle}</p>
                </div>
              </div>
              <Button onClick={handleAddModule}>
                <Plus className="w-4 h-4 mr-2" />
                Add Module
              </Button>
            </div>
          </div>

          <div className="px-6 py-6">
            {/* Search */}
            <div className="flex items-center justify-between mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search modules..."
                  value={searchTerm}
                  onChange={(e: any) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                  type="search"
                />
              </div>
              <div className="text-sm text-gray-600">
                {modulesData?.data?.length} modules total
              </div>
            </div>

            {/* Modules List */}
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="modules">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-4"
                  >
                    {modulesData?.data.length === 0 ? (
                      <div className="text-center py-12">
                        <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          No modules found
                        </h3>
                        <p className="text-gray-600 mb-4">
                          {searchTerm
                            ? "Try adjusting your search criteria"
                            : "Get started by adding your first module"}
                        </p>
                        {!searchTerm && (
                          <Button onClick={handleAddModule}>
                            <Plus className="w-4 h-4 mr-2" />
                            Add Module
                          </Button>
                        )}
                      </div>
                    ) : (
                      modulesData?.data?.map((module: any, index: any) => (
                        <Draggable
                          key={module.id}
                          draggableId={module.id}
                          index={index}
                        >
                          {(provided) => (
                            <Card
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className="hover:shadow-md transition-shadow"
                            >
                              <CardHeader>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-4">
                                    <div
                                      {...provided.dragHandleProps}
                                      className="cursor-move"
                                    >
                                      <Move className="w-5 h-5 text-gray-400" />
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex items-center space-x-2">
                                        <CardTitle className="text-lg">
                                          {module.title}
                                        </CardTitle>
                                        <Badge variant="outline">
                                          Module {module.order}
                                        </Badge>
                                      </div>
                                      <CardDescription className="mt-1">
                                        {module.description}
                                      </CardDescription>
                                    </div>
                                  </div>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="sm">
                                        <MoreHorizontal className="w-4 h-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                      <DropdownMenuItem
                                        onClick={() => handleEditModule(module)}
                                      >
                                        <Edit className="w-4 h-4 mr-2" />
                                        Edit Module
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() =>
                                          navigate(
                                            `/courses/${module?.course_id}/sections`
                                          )
                                        }
                                      >
                                        <FileText className="w-4 h-4 mr-2" />
                                        Manage Sections
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        className="text-red-600"
                                        onClick={() =>
                                          handleDeleteModule(module)
                                        }
                                      >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Delete Module
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </CardHeader>
                              <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  <div className="text-center">
                                    <div className="text-lg font-semibold">
                                      {module.CourseSections?.length || 0}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                      Sections
                                    </div>
                                  </div>
                                  <div className="text-center">
                                    <div className="text-lg font-semibold">
                                      {module.external_quiz_id ? "Yes" : "No"}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                      Quiz Attached
                                    </div>
                                  </div>
                                  <div className="text-center">
                                    <div className="text-sm text-gray-600">
                                      Updated{" "}
                                      {new Date(
                                        module.updatedAt
                                      ).toLocaleDateString()}
                                    </div>
                                  </div>
                                </div>

                                {module.external_quiz_id && (
                                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                                    <div className="flex items-center space-x-2">
                                      <FileText className="w-4 h-4 text-blue-600" />
                                      <span className="text-sm font-medium text-blue-900">
                                        External Quiz
                                      </span>
                                    </div>
                                    <p className="text-sm text-blue-700 mt-1">
                                      Quiz ID: {module.external_quiz_id}
                                    </p>
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          )}
                        </Draggable>
                      ))
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>

            {/* Add/Edit Module Dialog */}
            <Dialog open={isAddModuleOpen} onOpenChange={setIsAddModuleOpen}>
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-xl">
                    {editingModule ? "Edit Module" : "Add New Module"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingModule
                      ? "Update the module details and settings below"
                      : "Create a new module for your course with all necessary details"}
                  </DialogDescription>
                </DialogHeader>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSaveModule();
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
                          htmlFor="moduleTitle"
                          className="text-sm font-medium"
                        >
                          Module Title *
                        </Label>
                        <Input
                          id="moduleTitle"
                          placeholder="e.g., Who We Are"
                          value={moduleForm.title}
                          onChange={(e: any) => {
                            setModuleForm((prev) => ({
                              ...prev,
                              title: e.target.value,
                            }));
                            if (errors.title) {
                              setErrors((prev) => ({ ...prev, title: "" }));
                            }
                          }}
                          className={
                            errors.title
                              ? "border-red-500 focus:border-red-500"
                              : ""
                          }
                        />
                        {errors.title && (
                          <p className="text-sm text-red-600 flex items-center">
                            <span className="mr-1">⚠</span>
                            {errors.title}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="moduleOrder"
                          className="text-sm font-medium"
                        >
                          Module Order
                        </Label>
                        <Input
                          id="moduleOrder"
                          type="number"
                          min="1"
                          placeholder="Auto-assigned"
                          value={
                            editingModule
                              ? editingModule?.order
                              : modules?.length + 1
                          }
                          disabled
                          className="bg-gray-50"
                        />
                        <p className="text-xs text-gray-500">
                          Order is automatically managed. Use drag & drop to
                          reorder.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="moduleDescription"
                        className="text-sm font-medium"
                      >
                        Description *
                      </Label>
                      <Textarea
                        id="moduleDescription"
                        placeholder="Provide a detailed description of what this module covers..."
                        value={moduleForm.description}
                        onChange={(e: any) => {
                          setModuleForm((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }));
                          if (errors.description) {
                            setErrors((prev) => ({ ...prev, description: "" }));
                          }
                        }}
                        rows={4}
                        className={
                          errors.description
                            ? "border-red-500 focus:border-red-500"
                            : ""
                        }
                      />
                      {errors.description && (
                        <p className="text-sm text-red-600 flex items-center">
                          <span className="mr-1">⚠</span>
                          {errors.description}
                        </p>
                      )}
                      <p className="text-xs text-gray-500">
                        This description will be visible to learners and helps
                        them understand the module's purpose.
                      </p>
                    </div>
                  </div>

                  {/* Assessment Settings */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium border-b pb-2">
                      Assessment Settings
                    </h3>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="externalQuizId"
                          className="text-sm font-medium"
                        >
                          External Quiz ID (Optional)
                        </Label>
                        <Input
                          id="externalQuizId"
                          placeholder="e.g., quiz-001, assessment-abc123"
                          value={moduleForm.external_quiz_id}
                          onChange={(e: any) =>
                            setModuleForm((prev) => ({
                              ...prev,
                              external_quiz_id: e.target.value,
                            }))
                          }
                        />
                        <p className="text-xs text-gray-500">
                          Link an external quiz or assessment system to this
                          module. Leave empty if no assessment is required.
                        </p>
                      </div>

                      {moduleForm.external_quiz_id && (
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0">
                              <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
                            </div>
                            <div className="flex-1">
                              <h4 className="text-sm font-medium text-blue-900">
                                Assessment Linked
                              </h4>
                              <p className="text-sm text-blue-700 mt-1">
                                This module will include an assessment with ID:{" "}
                                <code className="bg-blue-100 px-1 rounded">
                                  {moduleForm.external_quiz_id}
                                </code>
                              </p>
                              <p className="text-xs text-blue-600 mt-2">
                                Make sure this ID exists in your external
                                assessment system.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Module Preview */}
                  {(moduleForm.title || moduleForm.description) && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium border-b pb-2">
                        Preview
                      </h3>
                      <div className="p-4 border rounded-lg bg-gray-50">
                        <div className="flex items-center space-x-2 mb-2">
                          <BookOpen className="w-5 h-5 text-gray-600" />
                          <h4 className="font-medium text-gray-900">
                            {moduleForm.title || "Module Title"}
                          </h4>
                          <Badge variant="outline">
                            Module{" "}
                            {editingModule
                              ? editingModule.order
                              : modules.length + 1}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          {moduleForm.description ||
                            "Module description will appear here..."}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>0 sections</span>
                          {moduleForm.external_quiz_id && (
                            <span className="flex items-center">
                              <FileText className="w-3 h-3 mr-1" />
                              Assessment included
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Form Actions */}
                  <div className="flex justify-end space-x-3 pt-6 border-t">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsAddModuleOpen(false);
                        setErrors({});
                      }}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={
                        !moduleForm.title.trim() ||
                        !moduleForm.description.trim()
                      }
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {editingModule ? "Update Module" : "Create Module"}
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
                  <Button variant="destructive" onClick={confirmDeleteModule}>
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
