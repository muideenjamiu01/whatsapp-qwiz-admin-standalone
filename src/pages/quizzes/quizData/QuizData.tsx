import {
  BarChart3,
  Calendar,
  Clock,
  Edit,
  Eye,
  MessageSquare,
  Users,
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
import { Separator } from "../../../components/ui/separator";
import { Link, useParams } from "react-router";
import { useFetchQuiz, type Quiz } from "../../../hooks/useQuizzes";
import { useEffect, useState } from "react";
import BackButton from "../../../components/back-button";

// Sample quiz data - in a real app, this would come from a database
// const getQuizData = (id: string) => {
//   return {
//     id,
//     name: "Product Knowledge Quiz",
//     description: "Test your knowledge about our product features and benefits.",
//     type: "Trivia",
//     status: "Published",
//     createdAt: "2023-04-15",
//     questions: 10,
//     joinCode: "PROD123",
//     duration: 30,
//     welcomeMessage: "Welcome to the Product Knowledge Quiz! Answer the following questions to test your knowledge.",
//     instructions: "Reply with the letter of your answer (A, B, C, or D).",
//     stats: {
//       participants: 78,
//       completionRate: "92%",
//       averageScore: "7.5/10",
//     },
//     externalId: "EXT-PROD-123",
//   }
// }
export default function QuizDetailsPage() {
  const params = useParams();

  const fetchQuiz = useFetchQuiz(params.id || "");
  const [quiz, setQuiz] = useState<Quiz>();
  useEffect(() => {
    setQuiz(fetchQuiz.data?.data);
  }, [fetchQuiz.data]);
  // const quiz = getQuizData(params.id||"")

  return (
    <div className="container mx-auto py-6 px-4 space-y-6">
      <BackButton />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{quiz?.title}</h1>
          <p className="text-muted-foreground">{quiz?.description}</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" asChild>
            <Link to={`/quizzes/${quiz?.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Quiz
            </Link>
          </Button>
          <Button asChild>
            <Link to={`/quizzes/${quiz?.id}/preview`}>
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quiz Details</CardTitle>
            <CardDescription>Overview of quiz configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Join Code
                </p>
                <p className="font-mono text-lg">{quiz?.join_code}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Status
                </p>
                <Badge
                  variant={
                    quiz?.status === "published" ? "default" : "secondary"
                  }
                >
                  {quiz?.status}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Type
                </p>
                <p>{quiz?.type}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Questions
                </p>
                {/* <p>{quiz?.}</p> */}
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Duration
                </p>
                <div className="flex items-center">
                  <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
                  <p>{quiz?.duration} minutes</p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Created
                </p>
                <div className="flex items-center">
                  <Calendar className="mr-1 h-4 w-4 text-muted-foreground" />
                  <p>{new Date(quiz?.createdAt || "").toLocaleDateString()}</p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  External ID
                </p>
                <p className="font-mono">
                  {quiz?.external_id || "Not specified"}
                </p>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Welcome Message
              </p>
              <p className="text-sm">{quiz?.welcome_message}</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Instructions
              </p>
              <p className="text-sm">{quiz?.instructions}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Overview</CardTitle>
            <CardDescription>Quiz engagement and results</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center justify-center space-y-1 rounded-lg border p-4">
                <Users className="h-5 w-5 text-muted-foreground" />
                {/* <p className="text-2xl font-bold">{quiz.}</p> */}
                <p className="text-xs text-muted-foreground">Participants</p>
              </div>
              <div className="flex flex-col items-center justify-center space-y-1 rounded-lg border p-4">
                <BarChart3 className="h-5 w-5 text-muted-foreground" />
                {/* <p className="text-2xl font-bold">{quiz.stats.completionRate}</p> */}
                <p className="text-xs text-muted-foreground">Completion Rate</p>
              </div>
              <div className="flex flex-col items-center justify-center space-y-1 rounded-lg border p-4">
                <MessageSquare className="h-5 w-5 text-muted-foreground" />
                {/* <p className="text-2xl font-bold">{quiz.stats.averageScore}</p> */}
                <p className="text-xs text-muted-foreground">Average Score</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Recent Activity</p>
                <Button variant="link" size="sm" asChild>
                  <Link to={`/analytics/${quiz?.id}`}>View Full Analytics</Link>
                </Button>
              </div>
              <div className="space-y-2">
                {[
                  {
                    name: "+1 234 567 8901",
                    score: "8/10",
                    date: "Today, 2:30 PM",
                  },
                  {
                    name: "+1 987 654 3210",
                    score: "7/10",
                    date: "Today, 1:15 PM",
                  },
                  {
                    name: "+1 555 123 4567",
                    score: "9/10",
                    date: "Yesterday, 5:45 PM",
                  },
                  {
                    name: "+1 444 555 6666",
                    score: "6/10",
                    date: "Yesterday, 3:20 PM",
                  },
                ].map((player, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div>
                      <p className="font-medium">{player.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {player.date}
                      </p>
                    </div>
                    <Badge variant="outline">{player.score}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
