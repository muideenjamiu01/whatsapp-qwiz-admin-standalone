import { useState } from "react"
import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react"
import { Badge } from "../../../components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table"
import { Checkbox } from "../../../components/ui/checkbox"
import { Avatar, AvatarFallback } from "../../../components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../components/ui/dropdown-menu"
import { Button } from "../../../components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../components/ui/dialog"
import { toast } from "sonner"
import { userApi } from "../../../hooks/useUsers"


//  user type
interface User {
  id: string
  first_name: string
  last_name: string
  email: string
  staff_id: string
  grade: string
  opco: string
  function: string
  createdAt: string
  totalCourses: string
  completedCourses: string
  coursesStatus: string
}

export interface UserTableProps {
  users: any[];
  selectedUsers: string[];
  setSelectedUsers: React.Dispatch<React.SetStateAction<string[]>>;
  handleEditUser: (user: any) => void;
refetch: () => void
}

export function UserTable({ users, selectedUsers, setSelectedUsers, handleEditUser,refetch}: UserTableProps) {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)

  const getStatusBadge = (coursesStatus: string) => {
    // Example: "1/1" or "0/0". You can customize status logic here.
    if (coursesStatus === "0/0") {
      return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
    }
    const [completed, total] = coursesStatus.split("/").map(Number)
    if (completed === total && total > 0) {
      return <Badge className="bg-green-100 text-green-800">Active</Badge>
    }
    if (completed < total) {
      return <Badge className="bg-red-100 text-red-800">Inactive</Badge>
    }
    return <Badge variant="secondary">Unknown</Badge>
  }

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user)
    setDeleteModalOpen(true)
  }

  const confirmDeleteUser = async () => {
    if (userToDelete) {
      try {
        const deleteUser = await userApi.deleteUser({userId:userToDelete.id})
        toast.success(deleteUser.message || "User deleted successfully")
        refetch() // Refetch users after deletion
      } catch (err) {
        toast.error("Failed to delete user")
      } finally {
        setDeleteModalOpen(false)
        setUserToDelete(null)
      }
    }
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={selectedUsers?.length === users?.length}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedUsers(users?.map((user) => user.id))
                  } else {
                    setSelectedUsers([])
                  }
                }}
              />
            </TableHead>
            <TableHead>User</TableHead>
            <TableHead>Staff ID</TableHead>
            <TableHead>Grade</TableHead>
            <TableHead>OPCO</TableHead>
            <TableHead>Function</TableHead>
            <TableHead>Courses</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users?.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <Checkbox
                  checked={selectedUsers.includes(user.id)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedUsers((prev: string[]) => [...prev, user.id])
                    } else {
                      setSelectedUsers((prev: string[]) => prev.filter((id) => id !== user.id))
                    }
                  }}
                />
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="text-xs">
                      {user.first_name[0]}
                      {user.last_name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {user.first_name} {user.last_name}
                    </p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>{user.staff_id}</TableCell>
              <TableCell>{user.grade}</TableCell>
              <TableCell>{user.opco}</TableCell>
              <TableCell>{user.function}</TableCell>
              <TableCell>
                <div className="text-sm">
                  <p>
                    {user.completedCourses}/{user.totalCourses}
                  </p>
                  <p className="text-gray-600">completed</p>
                </div>
              </TableCell>
              <TableCell>{getStatusBadge(user.coursesStatus)}</TableCell>
              <TableCell className="text-sm text-gray-600">{new Date(user.createdAt).toLocaleDateString()}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {/* <DropdownMenuItem>
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </DropdownMenuItem> */}
                    <DropdownMenuItem onClick={() => handleEditUser && handleEditUser(user)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit User
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteClick(user)}>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete User
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete {userToDelete?.first_name} {userToDelete?.last_name}?</p>
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
    </>
  )
}