import { useState } from "react";
// import Link from "next/link"
import {
  BarChart3,
  Calendar,
  ChevronRight,
  Clock,
  Filter,
  ListChecks,
  Plus,
  RefreshCw,
  Search,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { QuizCreationModal } from "../../components/quiz-creation-modal.tsx";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/tooltip";
import { Link } from "react-router";
import { useFetchRecentQuizzes, useQuizzes } from "../../hooks/useQuizzes.ts";
import { useFetchSummary } from "../../hooks/useAnalytics.ts";
import { useFetchLatestActivities } from "../../hooks/useAnalytics";

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState("week");
  const [quizTypeFilter, setQuizTypeFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [topPerformerSearchTerm, setTopPerformerSearchTerm] = useState("");
  const fetchquizzes = useQuizzes({
    searchTerm: topPerformerSearchTerm,
  });
  const recentQuizzes = useFetchRecentQuizzes({ searchTerm });
  const fetchSummary = useFetchSummary();

  // const [recentQuizzes, setRecentQuizzes] =useState( fetchquizzes.data?.data ?? []);

  // Sample data for recent quizzes
  // const recentQuizzes = [
  //   {
  //     id: "1",
  //     name: "Product Knowledge Quiz",
  //     type: "Trivia",
  //     date: "2 days ago",
  //     participants: 45,
  //     completionRate: 92,
  //   },
  //   {
  //     id: "2",
  //     name: "Customer Satisfaction",
  //     type: "Scorecard",
  //     date: "5 days ago",
  //     participants: 32,
  //     completionRate: 78,
  //   },
  //   {
  //     id: "3",
  //     name: "Team Building Quiz",
  //     type: "Personality",
  //     date: "1 week ago",
  //     participants: 28,
  //     completionRate: 85,
  //   },
  //   { id: "4", name: "Marketing Concepts", type: "Trivia", date: "2 weeks ago", participants: 53, completionRate: 76 },
  // ]

  // Sample data for top performing quizzes
  const topQuizzes = [
    {
      id: "5",
      name: "Product Features Quiz",
      completion: 92,
      players: 78,
      trend: "up",
    },
    {
      id: "6",
      name: "Company History",
      completion: 88,
      players: 45,
      trend: "up",
    },
    {
      id: "7",
      name: "Customer Service",
      completion: 85,
      players: 62,
      trend: "down",
    },
    {
      id: "8",
      name: "New Product Launch",
      completion: 82,
      players: 53,
      trend: "up",
    },
  ];

  // Filter quizzes based on search term and quiz type
  const filteredRecentQuizzes = recentQuizzes?.data?.data?.filter(
    (quiz) =>
      quiz?.title?.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (quizTypeFilter === "all" || quiz.type === quizTypeFilter)
  );

  const filteredTopQuizzes = topQuizzes.filter((quiz) =>
    quiz.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const latestActivities = useFetchLatestActivities();
  const [activeRankingTab, setActiveRankingTab] = useState("completion");
  return (
    <TooltipProvider>
      <div className="flex flex-col p-6 space-y-6 bg-[#F0F2F5]">
        {/* Header Section */}
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#1C1E21]">
              Dashboard
            </h1>
            <p className="text-[#65676B]">
              Welcome back! Here's what's happening with your quizzes.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px] bg-white">
                <Calendar className="mr-2 h-4 w-4 text-[#005F6A]" />
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
            <QuizCreationModal
              trigger={
                <Button className="bg-[#005F6A] hover:bg-[#004954] text-white">
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Quiz
                </Button>
              }
            />
          </div>
        </div>

        {/* Key Metrics Section */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-white border-none shadow-sm hover:shadow transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#65676B]">
                Total Quizzes
              </CardTitle>
              <ListChecks className="h-5 w-5 text-[#005F6A]" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#1C1E21]">
                {fetchSummary.data?.data?.totalQuizzes}
              </div>
              <div className="flex items-center mt-1">
                <Badge className="bg-[#E0F2F1] text-[#00897B] hover:bg-[#E0F2F1]">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  +2 from last month
                </Badge>
              </div>
            </CardContent>
            <CardFooter className="p-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-[#005F6A] hover:text-[#004954] hover:bg-[#E0F2F1] w-full justify-between"
                asChild
              >
                <Link to="/quizzes">
                  View all quizzes
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
          <Card className="bg-white border-none shadow-sm hover:shadow transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#65676B]">
                Active Quizzes
              </CardTitle>
              <ListChecks className="h-5 w-5 text-[#00ACC1]" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#1C1E21]">
                {fetchSummary.data?.data.activeQuizzes}
              </div>
              <div className="flex items-center mt-1">
                <Badge className="bg-[#E0F2F1] text-[#00897B] hover:bg-[#E0F2F1]">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  +1 from last month
                </Badge>
              </div>
            </CardContent>
            <CardFooter className="p-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-[#005F6A] hover:text-[#004954] hover:bg-[#E0F2F1] w-full justify-between"
                asChild
              >
                <Link to="/quizzes?status=Published">
                  View active quizzes
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
          <Card className="bg-white border-none shadow-sm hover:shadow transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#65676B]">
                Total Players
              </CardTitle>
              <Users className="h-5 w-5 text-[#005F6A]" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#1C1E21]">
                {fetchSummary.data?.data.totalPlayers}
              </div>
              <div className="flex items-center mt-1">
                <Badge className="bg-[#E0F2F1] text-[#00897B] hover:bg-[#E0F2F1]">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  +18% from last month
                </Badge>
              </div>
            </CardContent>
            {/* <CardFooter className="p-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-[#005F6A] hover:text-[#004954] hover:bg-[#E0F2F1] w-full justify-between"
                asChild
              >
                <Link to="/analytics">
                  View player analytics
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardFooter> */}
          </Card>
          <Card className="bg-white border-none shadow-sm hover:shadow transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#65676B]">
                Completion Rate
              </CardTitle>
              <BarChart3 className="h-5 w-5 text-[#00ACC1]" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#1C1E21]">
                {fetchSummary.data?.data.completionRate}%
              </div>
              <div className="flex items-center mt-1">
                <Badge className="bg-[#E0F2F1] text-[#00897B] hover:bg-[#E0F2F1]">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  +5% from last month
                </Badge>
              </div>
            </CardContent>
            {/* <CardFooter className="p-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-[#005F6A] hover:text-[#004954] hover:bg-[#E0F2F1] w-full justify-between"
                asChild
              >
                <Link to="/analytics">
                  View completion details
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardFooter> */}
          </Card>
        </div>

        {/* Quiz Performance Section */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="bg-white border-none shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Quizzes</CardTitle>
                  <CardDescription>
                    Your most recently created quizzes
                    {quizTypeFilter !== "all" && (
                      <span className="ml-1 text-[#005F6A]">
                        ({filteredRecentQuizzes?.length} of{" "}
                        {fetchquizzes.data?.data.length})
                      </span>
                    )}
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-[#65676B] hover:text-[#005F6A] hover:bg-[#E0F2F1]"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Refresh quizzes</p>
                    </TooltipContent>
                  </Tooltip>
                  <DropdownMenu>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-[#65676B] hover:text-[#005F6A] hover:bg-[#E0F2F1]"
                          >
                            <Filter className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Filter quizzes</p>
                      </TooltipContent>
                    </Tooltip>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => setQuizTypeFilter("all")}
                      >
                        All Types
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setQuizTypeFilter("Trivia")}
                      >
                        Trivia
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setQuizTypeFilter("Personality")}
                      >
                        Personality
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setQuizTypeFilter("Scorecard")}
                      >
                        Scorecard
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <div className="mt-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[#65676B]" />
                  <Input
                    type="search"
                    placeholder="Search recent quizzes..."
                    className="pl-8 bg-[#F0F2F5] border-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredRecentQuizzes?.length === 0 ? (
                  <p className="text-center text-[#65676B] py-4">
                    No quizzes found matching your criteria.
                  </p>
                ) : (
                  filteredRecentQuizzes?.map((quiz, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-[#F0F2F5] transition-colors"
                    >
                      <div>
                        <div className="flex items-center">
                          <Badge
                            className="mr-2"
                            variant={
                              quiz.type === "Trivia"
                                ? "default"
                                : quiz.type === "Personality"
                                ? "secondary"
                                : "outline"
                            }
                          >
                            {quiz.type}
                          </Badge>
                          <Link
                            to={`/quizzes/${quiz.id}`}
                            className="font-medium text-[#1C1E21] hover:text-[#005F6A] transition-colors"
                          >
                            {quiz.title}
                          </Link>
                        </div>
                        <div className="flex items-center mt-1 text-sm text-[#65676B]">
                          <Clock className="mr-1 h-3 w-3" />
                          {quiz?.createdAt
                            ? new Date(quiz.createdAt).toDateString()
                            : ""}
                          <span className="mx-2">•</span>
                          <Users className="mr-1 h-3 w-3" />
                          {quiz?.totalPlayers} players
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-[#005F6A] hover:bg-[#E0F2F1]"
                          asChild
                          title="View quiz details and performance"
                        >
                          <Link to={`/quizzes/${quiz.id}`}>View</Link>
                        </Button>
                        {/* <Button
                          variant="ghost"
                          size="sm"
                          className="text-[#00ACC1] hover:bg-[#E0F7FA]"
                          asChild
                          title="Edit quiz content and settings"
                        >
                          <Link to={`/quizzes/${quiz.id}/edit`}>Edit</Link>
                        </Button> */}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Button
                variant="outline"
                className="w-full border-[#005F6A] text-[#005F6A] hover:bg-[#E0F2F1] hover:text-[#004954]"
                asChild
              >
                <Link to="/quizzes">View All Quizzes</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="bg-white border-none shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Top Performing Quizzes</CardTitle>
                  <CardDescription>
                    Quizzes with highest completion rates
                    {topPerformerSearchTerm && (
                      <span className="ml-1 text-[#005F6A]">
                        ({filteredTopQuizzes.length} of {topQuizzes.length})
                      </span>
                    )}
                  </CardDescription>
                </div>
                <Tabs defaultValue="completion" className="w-[250px]">
                  <TabsList className="bg-[#F0F2F5]">
                    <TabsTrigger
                      value="completion"
                      className="data-[state=active]:bg-[#005F6A] data-[state=active]:text-white"
                      onClick={() => setActiveRankingTab("completion")}
                    >
                      By Completion
                    </TabsTrigger>
                    <TabsTrigger
                      value="players"
                      className="data-[state=active]:bg-[#005F6A] data-[state=active]:text-white"
                      onClick={() => setActiveRankingTab("players")}
                    >
                      By Players
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <div className="mt-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[#65676B]" />
                  <Input
                    type="search"
                    placeholder="Search top performing quizzes..."
                    className="pl-8 bg-[#F0F2F5] border-none"
                    value={topPerformerSearchTerm}
                    onChange={(e) => setTopPerformerSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {fetchquizzes?.data?.[
                  activeRankingTab === "players"
                    ? "playerCount"
                    : "completionRate"
                ]?.data?.length === 0 ? (
                  <p className="text-center text-[#65676B] py-4">
                    No quizzes found matching your criteria.
                  </p>
                ) : (
                  fetchquizzes?.data?.[
                    activeRankingTab === "players"
                      ? "playerCount"
                      : "completionRate"
                  ]?.data?.map((quiz, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-[#F0F2F5] transition-colors"
                    >
                      <div className="flex items-center">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#E0F2F1] text-[#005F6A] font-bold mr-3">
                          {i + 1}
                        </div>
                        <div>
                          <Link
                            to={`/quizzes/${quiz.id}`}
                            className="font-medium text-[#1C1E21] hover:text-[#005F6A] transition-colors"
                          >
                            {quiz.title}
                          </Link>
                          <div className="flex items-center mt-1 text-sm text-[#65676B]">
                            <Users className="mr-1 h-3 w-3" />
                            {quiz?.totalParticipants} players
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="text-right mr-3">
                          <div className="font-semibold text-[#1C1E21]">
                            {quiz.completionRate}%
                          </div>
                          <div className="flex items-center justify-end text-xs">
                            {Number(quiz?.weeklyGrowthPercentage) > 0 ? (
                              <Badge className="bg-[#E0F2F1] text-[#00897B] hover:bg-[#E0F2F1]">
                                <TrendingUp className="mr-1 h-3 w-3" />
                                {quiz?.weeklyGrowthPercentage}%
                              </Badge>
                            ) : (
                              <Badge className="bg-[#FFEBEE] text-[#F44336] hover:bg-[#FFEBEE]">
                                <TrendingDown className="mr-1 h-3 w-3" />
                                {quiz?.weeklyGrowthPercentage}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-[#005F6A] hover:bg-[#E0F2F1]"
                          asChild
                          title="View detailed analytics"
                        >
                          <Link to={`/analytics/${quiz.id}`}>
                            <BarChart3 className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Button
                variant="outline"
                className="w-full border-[#005F6A] text-[#005F6A] hover:bg-[#E0F2F1] hover:text-[#004954]"
                asChild
              >
                <Link to="/analytics">View All Analytics</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Campaign Performance Section */}
        {/* <Card className="bg-white border-none shadow-sm">
          <CardHeader>
            <CardTitle>Campaign Performance</CardTitle>
            <CardDescription>Overview of quiz campaigns and their performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Product Knowledge Series", quizzes: 3, participants: 120, completionRate: 85, trend: "up" },
                {
                  name: "Customer Feedback Initiative",
                  quizzes: 2,
                  participants: 78,
                  completionRate: 72,
                  trend: "down",
                },
                { name: "Team Building Activities", quizzes: 4, participants: 95, completionRate: 90, trend: "up" },
              ].map((campaign, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 rounded-lg border border-[#F0F2F5] hover:bg-[#F0F2F5] transition-colors"
                >
                  <div>
                    <h3 className="font-medium text-[#1C1E21]">{campaign.name}</h3>
                    <div className="flex items-center mt-1 text-sm text-[#65676B]">
                      <ListChecks className="mr-1 h-3 w-3" />
                      {campaign.quizzes} quizzes
                      <span className="mx-2">•</span>
                      <Users className="mr-1 h-3 w-3" />
                      {campaign.participants} participants
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="text-right mr-4">
                      <div className="font-semibold text-[#1C1E21]">{campaign.completionRate}%</div>
                      <div className="text-xs text-[#65676B]">Completion Rate</div>
                    </div>
                    <div>
                      {campaign.trend === "up" ? (
                        <Badge className="bg-[#E0F2F1] text-[#00897B] hover:bg-[#E0F2F1]">
                          <TrendingUp className="mr-1 h-3 w-3" />
                          +3%
                        </Badge>
                      ) : (
                        <Badge className="bg-[#FFEBEE] text-[#F44336] hover:bg-[#FFEBEE]">
                          <TrendingDown className="mr-1 h-3 w-3" />
                          -2%
                        </Badge>
                      )}
                    </div>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="ml-2 text-[#005F6A] hover:bg-[#E0F2F1]" asChild>
                          <Link to={`/campaigns/${i + 1}`}>
                            <ChevronRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>View campaign details</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-[#005F6A] hover:bg-[#004954] text-white" asChild>
              <Link to="/campaigns/create">
                <Plus className="mr-2 h-4 w-4" />
                Create New Campaign
              </Link>
            </Button>
          </CardFooter>
        </Card> */}

        {/* Activity Timeline */}
        <Card className="bg-white border-none shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest actions and events</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="text-[#005F6A] border-[#005F6A] hover:bg-[#E0F2F1] hover:text-[#004954]"
              >
                View All Activity
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-0 before:h-full before:w-0.5 before:bg-[#E0F2F1]">
              {latestActivities.data?.data?.map((activity, i) => (
                <div key={i} className="relative">
                  <div className="absolute -left-6 top-0 flex h-4 w-4 items-center justify-center">
                    <div
                      className={`h-3 w-3 rounded-full ${
                        activity.type === "quiz_created"
                          ? "bg-[#005F6A]"
                          : activity.type === "high_score"
                          ? "bg-[#FFC107]"
                          : activity.type === "quiz_completed"
                          ? "bg-[#00ACC1]"
                          : "bg-[#F44336]"
                      }`}
                    ></div>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <div className="flex items-center text-sm">
                      <span className="text-[#65676B]">
                        {activity?.updatedAt}
                      </span>
                      <span className="mx-2">•</span>
                      <span className="font-medium">
                        {activity?.admin?.name}
                      </span>
                    </div>
                    <p className="text-[#1C1E21]">
                      {activity.type === "quiz_created" && (
                        <>
                          Created a new quiz:{" "}
                          <Link
                            to="#"
                            className="font-medium text-[#005F6A] hover:underline"
                          >
                            {activity?.Quiz?.title}
                          </Link>
                        </>
                      )}
                      {activity.type !== "quiz_created" && (
                        <>
                          {activity.description}{" "}
                          <Link
                            to="#"
                            className="font-medium text-[#005F6A] hover:underline"
                          >
                            {activity?.Quiz?.title}
                          </Link>
                        </>
                      )}
                      {/* {activity.type === "high_score" && (
                        <>
                          Achieved high score <span className="font-medium">{activity.score}</span> on{" "}
                          <Link to="#" className="font-medium text-[#005F6A] hover:underline">
                            {activity.Quiz.title}
                          </Link>
                        </>
                      )}
                      {activity.type === "quiz_completed" && (
                        <>
                          Completed{" "}
                          <Link to="#" className="font-medium text-[#005F6A] hover:underline">
                            {activity.quiz}
                          </Link>{" "}
                          with {activity.participants} other participants
                        </>
                      )}
                      {activity.type === "quiz_published" && (
                        <>
                          Published{" "}
                          <Link to="#" className="font-medium text-[#005F6A] hover:underline">
                            {activity.quiz}
                          </Link>{" "}
                          to all users
                        </>
                      )} */}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}
