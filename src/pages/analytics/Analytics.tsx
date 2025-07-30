"use client";

import { useState } from "react";
// import Link from "next/link"
import { ArrowLeft, Calendar, Download, Filter, Search } from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Badge } from "../../components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../../components/ui/chart";
import { Link, useParams } from "react-router";
import {
  useFetchLeaderboard,
  useFetchQuizPlayers,
} from "../../hooks/useAnalytics";

// Sample quiz data
const getQuizData = (id: string) => {
  return {
    id,
    name: "Product Knowledge Quiz",
    type: "Trivia",
    questions: 10,
  };
};

// Sample player data
// const players = [
//   { id: "1", phone: "+1 234 567 8901", score: 8, rank: 1, attempts: 1, lastPlayed: "2023-04-20T14:30:00" },
//   { id: "2", phone: "+1 987 654 3210", score: 7, rank: 2, attempts: 1, lastPlayed: "2023-04-20T13:15:00" },
//   { id: "3", phone: "+1 555 123 4567", score: 9, rank: 3, attempts: 2, lastPlayed: "2023-04-19T17:45:00" },
//   { id: "4", phone: "+1 444 555 6666", score: 6, rank: 4, attempts: 1, lastPlayed: "2023-04-19T15:20:00" },
//   { id: "5", phone: "+1 333 222 1111", score: 5, rank: 5, attempts: 1, lastPlayed: "2023-04-18T11:10:00" },
//   { id: "6", phone: "+1 222 333 4444", score: 8, rank: 6, attempts: 2, lastPlayed: "2023-04-18T10:05:00" },
//   { id: "7", phone: "+1 111 444 5555", score: 7, rank: 7, attempts: 1, lastPlayed: "2023-04-17T16:30:00" },
//   { id: "8", phone: "+1 777 888 9999", score: 9, rank: 8, attempts: 1, lastPlayed: "2023-04-17T14:20:00" },
//   { id: "9", phone: "+1 666 777 8888", score: 4, rank: 9, attempts: 1, lastPlayed: "2023-04-16T12:15:00" },
//   { id: "10", phone: "+1 555 666 7777", score: 6, rank: 10, attempts: 2, lastPlayed: "2023-04-16T09:45:00" },
// ]

// Sample chart data
const participationData = [
  { date: "Apr 16", participants: 5 },
  { date: "Apr 17", participants: 8 },
  { date: "Apr 18", participants: 12 },
  { date: "Apr 19", participants: 15 },
  { date: "Apr 20", participants: 10 },
];

const scoreDistributionData = [
  { score: "0-2", count: 2 },
  { score: "3-5", count: 8 },
  { score: "6-8", count: 15 },
  { score: "9-10", count: 5 },
];

export default function QuizAnalyticsPage() {
  const params = useParams();
  const id = params.id || "";
  const quiz = getQuizData(id);
  const quizPlayers = useFetchQuizPlayers(id || "");
  const leaderboard = useFetchLeaderboard(id || "");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("all");

  // Filter players based on search term and date filter
  const filteredPlayers = quizPlayers.data?.data.filter((player) => {
    const matchesSearch = player.phoneNumber
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    // In a real app, you would implement proper date filtering
    return matchesSearch;
  });

  const handleExport = () => {
    // In a real app, this would generate and download a CSV/Excel file
    console.log("Exporting data...");
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" asChild>
            <Link to={`/quizzes/${params.id}`}>
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back to Quiz</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {quiz.name} Analytics
            </h1>
            <p className="text-muted-foreground">
              {quiz.type} Quiz with {quiz.questions} questions
            </p>
          </div>
        </div>
        <Button onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" />
          Export Data
        </Button>
      </div>

      <Tabs defaultValue="players">
        <TabsList>
          <TabsTrigger value="players">Player Analytics</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="overview">Overview</TabsTrigger>
        </TabsList>
        <TabsContent value="players" className="space-y-6">
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by phone number..."
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
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Date Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="yesterday">Yesterday</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rank</TableHead>
                  <TableHead>Phone Number</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Attempts</TableHead>
                  <TableHead>Last Played</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPlayers?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No players found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPlayers?.map((player, index) => (
                    <TableRow key={player.phoneNumber + index}>
                      <TableCell>
                        <Badge variant="outline">{player.rank}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {player.phoneNumber}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={player.score >= 7 ? "default" : "secondary"}
                        >
                          {player.score}/{quiz.questions}
                        </Badge>
                      </TableCell>
                      <TableCell>{player.attempts}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="mr-1 h-4 w-4 text-muted-foreground" />
                          {new Date(player.lastPlayed).toLocaleString()}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-6">
          {/* <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by phone number..."
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
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Date Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="yesterday">Yesterday</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div> */}

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rank</TableHead>
                  <TableHead>Name</TableHead>
                  {/* <TableHead>Phone Number</TableHead> */}
                  <TableHead>Score</TableHead>
                  {/* <TableHead>Attempts</TableHead> */}
                  <TableHead>Last Played</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaderboard?.data?.message?.map((player, index) => (
                  <TableRow key={player.userId + index}>
                    <TableCell>
                      <Badge variant="outline">{player.rank}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">{player.name}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          player.totalPoints >= 7 ? "default" : "secondary"
                        }
                      >
                        {player.totalPoints}
                        {/* /{quiz.questions} */}
                      </Badge>
                    </TableCell>
                    {/* <TableCell>{player?.attempts}</TableCell> */}
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="mr-1 h-4 w-4 text-muted-foreground" />
                        {player.updatedAt &&
                          new Date(player?.updatedAt).toLocaleString()}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Daily Participation</CardTitle>
                <CardDescription>
                  Number of participants per day
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ChartContainer
                  config={{
                    participants: {
                      label: "Participants",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={participationData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="participants"
                        stroke="var(--color-participants)"
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Score Distribution</CardTitle>
                <CardDescription>
                  Number of players by score range
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ChartContainer
                  config={{
                    count: {
                      label: "Players",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={scoreDistributionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="score" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar dataKey="count" fill="var(--color-count)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Performance Summary</CardTitle>
              <CardDescription>Key metrics for this quiz</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="flex flex-col space-y-1.5">
                  <span className="text-sm font-medium text-muted-foreground">
                    Total Participants
                  </span>
                  <span className="text-3xl font-bold">
                    {quizPlayers.data?.data?.length}
                  </span>
                </div>
                <div className="flex flex-col space-y-1.5">
                  <span className="text-sm font-medium text-muted-foreground">
                    Average Score
                  </span>
                  <span className="text-3xl font-bold">
                    {(quizPlayers?.data?.data &&
                    quizPlayers.data.data.length > 0
                      ? quizPlayers.data.data.reduce(
                          (sum, player) => sum + player.score,
                          0
                        ) / quizPlayers.data.data.length
                      : 0
                    ).toFixed(1)}
                    /{quiz.questions}
                  </span>
                </div>
                <div className="flex flex-col space-y-1.5">
                  <span className="text-sm font-medium text-muted-foreground">
                    Completion Rate
                  </span>
                  <span className="text-3xl font-bold">78%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
