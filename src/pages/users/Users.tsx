"use client";

import { useState } from "react";
import { Plus, Users, Upload } from "lucide-react";
import { Button } from "../../components/ui/button";
import { UserAnalyticsCards } from "./components/UserAnalyticsCards";
import { UserFilters } from "./components/UserFilters";
import { Card, CardContent } from "../../components/ui/card";
import { UserTable } from "./components/UserTable";
import { UserFormDialog } from "./components/UserFormDialog";
import { useQuery } from "@tanstack/react-query";
import { useBulkUploadUsers, userApi } from "../../hooks/useUsers";
import { toast } from "sonner";
import { coursesApi } from "../../hooks/useCourses";
import { BulkUploadSheet } from "./components/BulkUploadSheet";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../components/ui/pagination";

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  staff_id: string;
  grade: string;
  opco: string;
  function: string;
  createdAt: string;
  totalCourses: string;
  completedCourses: string;
  coursesStatus: string;
  unit?: string;
}

export default function UserManagementPage() {
  const { mutate: bulkUploadUsers } = useBulkUploadUsers();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [opcoFilter, setOpcoFilter] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [functionFilter, setFunctionFilter] = useState("");
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [userForm, setUserForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    staffId: "",
    grade: "",
    opco: "",
    gender: "",
    function: "",
    unit: "",
    courseId: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
console.log(setPageSize)

  const {
    data,
    isLoading: isLoadingUsers,
    refetch,
  } = useQuery({
    queryKey: [
      "getAllUsers",
      pageNumber,
      pageSize,
      searchTerm,
      opcoFilter,
      functionFilter,
    ],
    queryFn: () =>
      userApi.getAllUsers({
        searchTerm,
        pageNumber,
        pageSize,
        statusFilter,
        opco: opcoFilter,
        func: functionFilter,
      }),
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  const { data: courses } = useQuery({
    queryKey: ["getAllCourses", pageNumber, pageSize, searchTerm, statusFilter],
    queryFn: () =>
      coursesApi.getAllCourses({
        searchTerm,
        pageNumber,
        pageSize,
        statusFilter,
      }),
    staleTime: 1000 * 60 * 60,
  });

  const handleBulkUpload = (file: File) => {
    const courseId = "bf87530a-e41d-48e4-836f-2fb56762a2d1"; // use actual courseId if applicable

    bulkUploadUsers(
      { file, courseId },
      {
        onSuccess: () => {
          toast.success("Bulk upload successful");
          setIsBulkUploadOpen(false);
        },
        onError: () => {
          toast.error("Failed to upload CSV");
        },
      }
    );
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!userForm.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!userForm.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!userForm.email.trim()) newErrors.email = "Email is required";
    if (!userForm.staffId.trim()) newErrors.staffId = "Staff ID is required";
    if (!userForm.phoneNumber.trim())
      newErrors.phoneNumber = "Phone number is required";

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (userForm.email && !emailRegex.test(userForm.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSaveUser = async () => {
    if (!validateForm()) return;

    // Build payload for API
    const payload = {
      first_name: userForm.firstName,
      last_name: userForm.lastName,
      email: userForm.email,
      phone_number: userForm.phoneNumber,
      grade: userForm.grade,
      opco: userForm.opco,
      gender: userForm.gender,
      staff_id: userForm.staffId,
      function: userForm.function,
      unit: userForm.unit,
      course_id: userForm.courseId,
      status: "Active", // or from form if you add a status field
    };

    try {
      let response;

      if (editingUser) {
        //  Call update API
        response = await userApi.updateUser({
          userId: editingUser.id,
          payload,
        });
        toast.success(response.message || "User updated successfully");
      } else {
        //  Call create API
        response = await userApi.createUser(payload);
        toast.success(response.message || "User created successfully");
      }

      setIsAddUserOpen(false);
      setEditingUser(null);
      refetch();
    } catch (error) {
      toast.error("Failed to save user");
      console.error(error);
    }
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setUserForm({
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      staffId: "",
      grade: "",
      opco: "",
      gender: "",
      function: "",
      unit: "",
      courseId: "",
    });
    setErrors({});
    setIsAddUserOpen(true);
  };
  const handleEditUser = (user: User) => {
    setEditingUser(user);
    console.log(user, "user id");

    setUserForm({
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      phoneNumber: "",
      staffId: user.staff_id,
      grade: user.grade,
      opco: user.opco,
      gender: "",
      function: user.function,
      unit: user.unit ?? "",
      courseId: "", // Ensure courseId is included
    });

    setErrors({});
    setIsAddUserOpen(true);
  };

  const handleBulkAction = () => {
    // switch (action) {
    //   case "activate":
    //     setUsers((prev:any) =>
    //       prev.map((user:any) =>
    //         selectedUsers.includes(user.id)
    //           ? { ...user, status: "active" as const }
    //           : user
    //       )
    //     );
    //     break;
    //   case "deactivate":
    //     setUsers((prev) =>
    //       prev.map((user) =>
    //         selectedUsers.includes(user.id)
    //           ? { ...user, status: "inactive" as const }
    //           : user
    //       )
    //     );
    //     break;
    //   case "delete":
    //     setUsers((prev) =>
    //       prev.filter((user) => !selectedUsers.includes(user.id))
    //     );
    //     break;
    // }
    // setSelectedUsers([]);
  };

  const handlePreviousPage = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
    }
  };

  const handleNextPage = () => {
    if (pageNumber < data?.data?.meta.totalPages) {
      setPageNumber(pageNumber + 1);
    }
  };

  return (
    <>
      {isLoadingUsers ? (
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#005F6A]"></div>
        </div>
      ) : (
        <div className="min-h-screen bg-gray-50">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  User Management
                </h1>
                <p className="text-gray-600">
                  Manage course participants and their access
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <label className="relative cursor-pointer">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsBulkUploadOpen(true)}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Bulk Upload
                  </Button>
                </label>

                {/* <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Users
            </Button> */}
                <Button
                  onClick={handleAddUser}
                  className="bg-[#005F6A] hover:bg-[#004954] text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add User
                </Button>
              </div>
            </div>
          </div>

          <div className="px-6 py-6">
            <UserAnalyticsCards data={data?.data?.statistics} />

            <UserFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              uniqueStatus={data?.data?.filters?.status}
              opcoFilter={opcoFilter}
              setOpcoFilter={setOpcoFilter}
              selectedUsers={selectedUsers}
              handleBulkAction={handleBulkAction}
              uniqueOpcos={data?.data?.filters?.opcos}
              uniqueFunctions={data?.data?.filters?.functions}
              functionFilter={functionFilter}
              setFunctionFilter={setFunctionFilter}
            />

            <Card>
              <CardContent className="p-0">
                <UserTable
                  users={data?.data?.users}
                  selectedUsers={selectedUsers}
                  setSelectedUsers={setSelectedUsers}
                  handleEditUser={handleEditUser}
                  refetch={refetch}
                />
              </CardContent>
              {/* Pagination */}
              {data?.meta?.totalResults > 0 &&
                data?.meta?.totalResults > 10 && (
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
                          { length: data?.meta.totalPages },
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
                              pageNumber === data?.meta.totalPages
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
            </Card>

            {data?.data?.users?.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No users found
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || statusFilter !== "all" || opcoFilter !== "all"
                    ? "Try adjusting your search or filter criteria"
                    : "Get started by adding your first user"}
                </p>
                {!searchTerm &&
                  statusFilter === "all" &&
                  opcoFilter === "all" && (
                    <Button onClick={handleAddUser}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add User
                    </Button>
                  )}
              </div>
            )}

            <UserFormDialog
              open={isAddUserOpen}
              onOpenChange={setIsAddUserOpen}
              editingUser={!!editingUser}
              userForm={userForm}
              setUserForm={setUserForm}
              errors={errors}
              handleSaveUser={handleSaveUser}
              courses={courses?.data?.courses}
            />
          </div>
          <BulkUploadSheet
            open={isBulkUploadOpen}
            onOpenChange={setIsBulkUploadOpen}
            onFileUpload={handleBulkUpload}
          />
        </div>
      )}
    </>
  );
}
