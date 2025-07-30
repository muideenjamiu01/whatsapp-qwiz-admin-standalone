"use client";

import { useRef, useState } from "react";
import { Plus, Users, Download, Upload } from "lucide-react";
import { Button } from "../../components/ui/button";
import { UserAnalyticsCards } from "./components/UserAnalyticsCards";
import { UserFilters } from "./components/UserFilters";
import { Card, CardContent } from "../../components/ui/card";
import { UserTable } from "./components/UserTable";
import { UserFormDialog } from "./components/UserFormDialog";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useBulkUploadUsers, userApi } from "../../hooks/useUsers";
import { toast } from "sonner";
import { coursesApi } from "../../hooks/useCourses";

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

const mockUsers: User[] = [
  {
    id: "user-001",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@accessholdings.com",
    phoneNumber: "+234-801-234-5678",
    staffId: "AGX1234",
    grade: "AVP",
    opco: "Access Nigeria",
    gender: "Male",
    function: "Technology",
    unit: "Engineering",
    status: "active",
    enrolledCourses: 3,
    completedCourses: 2,
    lastActive: "2 hours ago",
    createdAt: "2024-01-15",
    courseId: "123",
  },
  {
    id: "user-002",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@accessholdings.com",
    phoneNumber: "+233-20-123-4567",
    staffId: "AGX5678",
    grade: "VP",
    opco: "Access Ghana",
    gender: "Female",
    function: "Operations",
    unit: "Customer Service",
    status: "active",
    enrolledCourses: 2,
    completedCourses: 2,
    lastActive: "1 day ago",
    createdAt: "2024-01-10",
    courseId: "456",
  },
  {
    id: "user-003",
    firstName: "Michael",
    lastName: "Johnson",
    email: "michael.johnson@accessholdings.com",
    phoneNumber: "+254-70-123-4567",
    staffId: "AGX9012",
    grade: "Manager",
    opco: "Access Kenya",
    gender: "Male",
    function: "Risk Management",
    unit: "Credit Risk",
    status: "pending",
    enrolledCourses: 1,
    completedCourses: 0,
    lastActive: "3 hours ago",
    createdAt: "2024-01-12",
    courseId: "789",
  },
];

const analyticsData = {
  totalUsers: 156,
  activeUsers: 134,
  pendingUsers: 12,
  inactiveUsers: 10,
};

export default function UserManagementPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // You might want to pass course_id dynamically instead
    const courseId = "123";

    bulkUploadUsers(
      { file, courseId },
      {
        onSuccess: () => {
          toast.success("Upload successful");
        },
        onError: () => {
          toast.error("Upload failed");
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

  const handleBulkAction = (action: string) => {
    switch (action) {
      case "activate":
        setUsers((prev) =>
          prev.map((user) =>
            selectedUsers.includes(user.id)
              ? { ...user, status: "active" as const }
              : user
          )
        );
        break;
      case "deactivate":
        setUsers((prev) =>
          prev.map((user) =>
            selectedUsers.includes(user.id)
              ? { ...user, status: "inactive" as const }
              : user
          )
        );
        break;
      case "delete":
        setUsers((prev) =>
          prev.filter((user) => !selectedUsers.includes(user.id))
        );
        break;
    }
    setSelectedUsers([]);
  };

  return (
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
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx"
                className="hidden"
                onChange={handleFileChange}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                // disabled={isLoading}
              >
                <Upload className="w-4 h-4 mr-2" />
                Bulk Upload
              </Button>
            </label>

            {/* <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Users
            </Button> */}
            <Button onClick={handleAddUser}>
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
            {!searchTerm && statusFilter === "all" && opcoFilter === "all" && (
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
    </div>
  );
}
