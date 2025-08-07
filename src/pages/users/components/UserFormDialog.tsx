import { X, Save } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";

interface UserForm {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  staffId: string;
  grade: string;
  opco: string;
  gender: string;
  function: string;
  unit: string;
  courseId: string; // Added courseId
}

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingUser: boolean;
  userForm: UserForm;
  setUserForm: (form: UserForm) => void;
  errors: Record<string, string>;
  handleSaveUser: () => void;
  courses: any;
  
}

export function UserFormDialog({
  open,
  onOpenChange,
  editingUser,
  userForm,
  setUserForm,
  errors,
  handleSaveUser,
  courses,
}: UserFormDialogProps) {


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {editingUser ? "Edit User" : "Add New User"}
          </DialogTitle>
          <DialogDescription>
            {editingUser
              ? "Update the user details below"
              : "Enter the details for the new user"}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                placeholder="John"
                value={userForm.firstName}
                onChange={(e) =>
                  setUserForm({ ...userForm, firstName: e.target.value })
                }
                className={errors.firstName ? "border-red-500" : ""}
              />
              {errors.firstName && (
                <p className="text-sm text-red-600">{errors.firstName}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                placeholder="Doe"
                value={userForm.lastName}
                onChange={(e) =>
                  setUserForm({ ...userForm, lastName: e.target.value })
                }
                className={errors.lastName ? "border-red-500" : ""}
              />
              {errors.lastName && (
                <p className="text-sm text-red-600">{errors.lastName}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="john.doe@accessholdings.com"
                value={userForm.email}
                onChange={(e: any) =>
                  setUserForm({ ...userForm, email: e.target.value })
                }
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number *</Label>
              <Input
                id="phoneNumber"
                placeholder="+234-801-234-5678"
                value={userForm.phoneNumber}
                onChange={(e: any) =>
                  setUserForm({ ...userForm, phoneNumber: e.target.value })
                }
                className={errors.phoneNumber ? "border-red-500" : ""}
              />
              {errors.phoneNumber && (
                <p className="text-sm text-red-600">{errors.phoneNumber}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="staffId">Staff ID *</Label>
              <Input
                id="staffId"
                placeholder="AGX1234"
                value={userForm.staffId}
                onChange={(e) =>
                  setUserForm({
                    ...userForm,
                    staffId: e.target.value.toUpperCase(),
                  })
                }
                className={errors.staffId ? "border-red-500" : ""}
              />
              {errors.staffId && (
                <p className="text-sm text-red-600">{errors.staffId}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="grade">Grade</Label>
              <Select
                value={userForm.grade}
                onValueChange={(value: any) =>
                  setUserForm({ ...userForm, grade: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select grade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CEO">CEO</SelectItem>
                  <SelectItem value="ED">ED</SelectItem>
                  <SelectItem value="GMD">GMD</SelectItem>
                  <SelectItem value="EVP">EVP</SelectItem>
                  <SelectItem value="SVP">SVP</SelectItem>
                  <SelectItem value="VP">VP</SelectItem>
                  <SelectItem value="AVP">AVP</SelectItem>
                  <SelectItem value="Manager">Manager</SelectItem>
                  <SelectItem value="Officer">Officer</SelectItem>
                  <SelectItem value="Associate">Associate</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="opco">OPCO</Label>
              <Select
                value={userForm.opco}
                onValueChange={(value: any) =>
                  setUserForm({ ...userForm, opco: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select OPCO" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Access Nigeria">Access Nigeria</SelectItem>
                  <SelectItem value="Access Ghana">Access Ghana</SelectItem>
                  <SelectItem value="Access Kenya">Access Kenya</SelectItem>
                  <SelectItem value="Access Rwanda">Access Rwanda</SelectItem>
                  <SelectItem value="Access DRC">Access DRC</SelectItem>
                  <SelectItem value="Access Zambia">Access Zambia</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select
                value={userForm.gender}
                onValueChange={(value: any) =>
                  setUserForm({ ...userForm, gender: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="function">Function</Label>
              <Input
                id="function"
                placeholder="Technology"
                value={userForm.function}
                onChange={(e: any) =>
                  setUserForm({ ...userForm, function: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">Unit</Label>
              <Input
                id="unit"
                placeholder="Engineering"
                value={userForm.unit}
                onChange={(e: any) =>
                  setUserForm({ ...userForm, unit: e.target.value })
                }
              />
            </div>
          </div>
          {/* Course Select */}
          <Select
            value={userForm.courseId}
            onValueChange={(value: any) => {
            //   console.warn(value); 
              setUserForm({ ...userForm, courseId: value });
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select course" />
            </SelectTrigger>
            <SelectContent>
              {courses?.map((course:any) => (
                <SelectItem key={course.id} value={course.id}>
                  {course.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSaveUser} className="bg-[#005F6A] hover:bg-[#004954] text-white">
              <Save className="w-4 h-4 mr-2" />
              {editingUser ? "Update User" : "Add User"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
