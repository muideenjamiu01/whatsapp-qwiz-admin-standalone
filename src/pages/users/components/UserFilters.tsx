// components/user-management/UserFilters.tsx
import { Search, UserCheck, UserX, Trash2, X } from "lucide-react";
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
import { Button } from "../../../components/ui/button";

interface UserFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  uniqueStatus: string[];
  opcoFilter: string;
  setOpcoFilter: (value: string) => void;
  selectedUsers: string[];
  handleBulkAction: (action: string) => void;
  uniqueOpcos: string[];
  uniqueFunctions: string[];
  functionFilter: string;
  setFunctionFilter: (value: string) => void;
}

export function UserFilters({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  opcoFilter,
  setOpcoFilter,
  selectedUsers,
  handleBulkAction,
  uniqueOpcos,
  uniqueFunctions,
  functionFilter,
  setFunctionFilter,
  uniqueStatus,
}: UserFiltersProps) {
  const hasActiveFilters =
    searchTerm ||
    statusFilter !== "all" ||
    opcoFilter !== "all" ||
    functionFilter !== "all";

  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setOpcoFilter("");
    setFunctionFilter("");
  };

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-64"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Select Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Active">Active </SelectItem>
            {uniqueStatus?.map((opco) => (
              <SelectItem key={opco} value={opco}>
                {opco}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={opcoFilter} onValueChange={setOpcoFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Select OPCO" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All OPCO</SelectItem>
            {uniqueOpcos?.map((opco) => (
              <SelectItem key={opco} value={opco}>
                {opco}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={functionFilter} onValueChange={setFunctionFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Select Function" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All </SelectItem>
            {uniqueFunctions?.map((opco) => (
              <SelectItem key={opco} value={opco}>
                {opco}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {hasActiveFilters && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleClearFilters}
          className="text-gray-600 hover:text-gray-800"
        >
          <X className="w-4 h-4 mr-2" />
          Clear Filters
        </Button>
      )}

      {selectedUsers.length > 0 && (
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">
            {selectedUsers.length} selected
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Bulk Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleBulkAction("activate")}>
                <UserCheck className="w-4 h-4 mr-2" />
                Activate Users
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleBulkAction("deactivate")}>
                <UserX className="w-4 h-4 mr-2" />
                Deactivate Users
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => handleBulkAction("delete")}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Users
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
}
