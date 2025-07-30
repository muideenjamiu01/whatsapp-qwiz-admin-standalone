import { useEffect, useState } from "react";

import {
  BarChart3,
  Copy,
  //  Edit,
  Eye,
  Filter,
  // MoreHorizontal,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  // DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Badge } from "../../components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Link } from "react-router";
import { useQuizzes, type Quiz } from "../../hooks/useQuizzes";
import BackButton from "../../components/back-button";

export default function QuizzesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState<string | null>(null);
  const fetchQuiz = useQuizzes();

  // Sample quiz data
  const [quizzes, setQuizzes] = useState<Partial<Quiz[]>>([]);

  useEffect(() => {
    setQuizzes(fetchQuiz.data?.data || []);
  }, [fetchQuiz.data]);

  // Filter quizzes based on search term and filters
  const filteredQuizzes = quizzes?.filter((quiz) => {
    const matchesSearch = quiz?.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || quiz?.type === typeFilter;
    const matchesStatus =
      statusFilter === "all" || quiz?.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleDeleteClick = (quizId: string) => {
    setQuizToDelete(quizId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    // In a real app, you would delete the quiz here
    console.log(`Deleting quiz ${quizToDelete}`);
    setDeleteDialogOpen(false);
    setQuizToDelete(null);
  };

  return (
    <div className="flex flex-col p-6 space-y-6">
      <div className="">
        <BackButton />
      </div>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Quizzes</h1>
        <Button asChild>
          <Link to="/quizzes/create">
            <Plus className="mr-2 h-4 w-4" />
            Create New Quiz
          </Link>
        </Button>
      </div>

      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search quizzes..."
              className="w-full pl-8 md:w-[300px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-x-2 md:space-y-0">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Filter:</span>
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Quiz Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Trivia">Trivia</SelectItem>
              <SelectItem value="Personality">Personality</SelectItem>
              <SelectItem value="Scorecard">Scorecard</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Published">Published</SelectItem>
              <SelectItem value="Draft">Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Quiz Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created Date</TableHead>
              <TableHead>Join Code</TableHead>
              <TableHead>External ID</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredQuizzes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No quizzes found.
                </TableCell>
              </TableRow>
            ) : (
              filteredQuizzes?.map((quiz) => (
                <TableRow key={quiz?.id}>
                  <TableCell className="font-medium">{quiz?.title}</TableCell>
                  <TableCell>{quiz?.type}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        quiz?.status === "published" ? "default" : "secondary"
                      }
                    >
                      {quiz?.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(quiz?.createdAt || "").toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono">{quiz?.join_code}</span>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <Copy className="h-3.5 w-3.5" />
                        <span className="sr-only">Copy join code</span>
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-xs">
                      {quiz?.external_id || "—"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-1">
                      <Button variant="ghost" size="icon" asChild>
                        <Link to={`/quizzes/${quiz?.id}`}>
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Link>
                      </Button>
                      {/* <Button variant="ghost" size="icon" asChild>
                        <Link to={`/quizzes/${quiz?.id}/edit`}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Link>
                      </Button> */}
                      <Button variant="ghost" size="icon" asChild>
                        <Link to={`/analytics/${quiz?.id}`}>
                          <BarChart3 className="h-4 w-4" />
                          <span className="sr-only">Analytics</span>
                        </Link>
                      </Button>
                      <DropdownMenu>
                        {/* <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">More options</span>
                          </Button>
                        </DropdownMenuTrigger> */}
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem asChild>
                            <Link to={`/quizzes/${quiz?.id}/preview`}>
                              <Eye className="mr-2 h-4 w-4" />
                              Preview
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="mr-2 h-4 w-4" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => handleDeleteClick(quiz?.id || "")}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Are you sure you want to delete this quiz?
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the
              quiz and all associated data.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
