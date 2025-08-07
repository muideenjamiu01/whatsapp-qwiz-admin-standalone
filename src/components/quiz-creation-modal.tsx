
import type React from "react"

import { useState } from "react"
// import { useRouter } from "next/navigation"
import { X } from "lucide-react"
import { Button } from "../components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog"
import { Input } from "../components/ui/input"
import { Textarea } from "../components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group"
import { Label } from "../components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { useNavigate } from "react-router"
import { toast } from "sonner"
import { useCreateQuiz } from "../hooks/useQuizzes"
// import { useToast } from "../components/ui/use-toast"

export function QuizCreationModal({ trigger }: { trigger: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("basic")
  const [quizData, setQuizData] = useState({
    name: "",
    description: "",
    joinCode: "",
    type: "Trivia",
    questions: "10",
    duration: "30",
    welcomeMessage: "Welcome to the quiz! Answer the following questions to test your knowledge.",
    instructions: "Reply with the letter of your answer (A, B, C, or D).",
    status: "published",
    externalId: "",
  })
//   const router = useRouter()
const navigate= useNavigate()

const createQuiz= useCreateQuiz()
//   const { toast } = useToast()

  const handleChange = (field: string, value: string) => {
    setQuizData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSaveAsDraft = () => {
    console.warn("Saving as draft:", quizData)
    toast(
        "Your quiz has been saved as a draft.")
    setOpen(false)
    // In a real app, you would save the data to the database here
  }

  const handlePublish = () => {
    console.warn("Publishing quiz:", quizData)
const data= quizData
    createQuiz.mutate({
      title:data?.name,
      description:data.description,
      // createdAt:new Date().toISOString(),
duration:+data.duration,
external_id:data.externalId,
instructions:data.instructions,
// join_code:data?.joinCode,
status:data?.status,
type:data?.type,
welcome_message:data?.welcomeMessage,


    }, {
      onSuccess:()=>{

        toast("Your quiz has been created and saved.")
        toast(
          "Your quiz has been published successfully."
        )
        
        setOpen(false)
        navigate("/quizzes")
      },
      onError(){
        toast.error(`Unable to publish quiz`)
      }
    })
    // In a real app, you would save the data to the database here
  }

  const handleContinueToEditor = () => {
    console.warn("Continuing to full editor:", quizData)
    setOpen(false)
    navigate("/quizzes/create")
    // In a real app, you would save the data and redirect to the full editor
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Quiz</DialogTitle>
          <DialogDescription>
            Quickly set up a new quiz. You can save as draft or continue to the full editor for more options.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="structure">Structure</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4 mt-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Quiz Name</Label>
                <Input
                  id="name"
                  value={quizData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Enter quiz name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={quizData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="Enter a brief description of your quiz"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="joinCode">Join Code</Label>
                <Input
                  id="joinCode"
                  value={quizData.joinCode}
                  onChange={(e) => handleChange("joinCode", e.target.value)}
                  placeholder="e.g., QUIZ123"
                />
                <p className="text-sm text-muted-foreground">
                  A unique code that participants will use to join your quiz on WhatsApp.
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="externalId">External Quiz ID (Optional)</Label>
                <Input
                  id="externalId"
                  value={quizData.externalId}
                  onChange={(e) => handleChange("externalId", e.target.value)}
                  placeholder="e.g., EXT-123"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={() => setActiveTab("structure")}>Next</Button>
            </div>
          </TabsContent>

          <TabsContent value="structure" className="space-y-4 mt-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label>Quiz Type</Label>
                <RadioGroup
                  value={quizData.type}
                  onValueChange={(value) => handleChange("type", value)}
                  className="flex flex-col space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Trivia" id="trivia" />
                    <Label htmlFor="trivia" className="font-normal">
                      Trivia Quiz - Multiple choice questions with correct answers
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Personality" id="personality" />
                    <Label htmlFor="personality" className="font-normal">
                      Personality Quiz - Questions that lead to different outcomes
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Scorecard" id="scorecard" />
                    <Label htmlFor="scorecard" className="font-normal">
                      Scorecard - Rating-based questions for feedback
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="questions">Number of Questions</Label>
                  <Select value={quizData.questions} onValueChange={(value) => handleChange("questions", value)}>
                    <SelectTrigger id="questions">
                      <SelectValue placeholder="Select number of questions" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 questions</SelectItem>
                      <SelectItem value="10">10 questions</SelectItem>
                      <SelectItem value="15">15 questions</SelectItem>
                      <SelectItem value="20">20 questions</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Select value={quizData.duration} onValueChange={(value) => handleChange("duration", value)}>
                    <SelectTrigger id="duration">
                      <SelectValue placeholder="Select quiz duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="45">45 minutes</SelectItem>
                      <SelectItem value="60">60 minutes</SelectItem>
                      <SelectItem value="unlimited">Unlimited</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="welcomeMessage">Welcome Message</Label>
                <Textarea
                  id="welcomeMessage"
                  value={quizData.welcomeMessage}
                  onChange={(e) => handleChange("welcomeMessage", e.target.value)}
                  placeholder="Enter welcome message"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="instructions">Instructions</Label>
                <Textarea
                  id="instructions"
                  value={quizData.instructions}
                  onChange={(e) => handleChange("instructions", e.target.value)}
                  placeholder="Enter quiz instructions"
                />
              </div>
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("basic")}>
                Back
              </Button>
              <Button onClick={() => setActiveTab("preview")}>Preview</Button>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="space-y-4 mt-4">
            <div className="border rounded-lg p-4 space-y-3">
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-muted-foreground">Quiz Name</h3>
                <p className="font-medium">{quizData.name || "Untitled Quiz"}</p>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
                <p>{quizData.description || "No description provided."}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-muted-foreground">Join Code</h3>
                  <p className="font-mono">{quizData.joinCode || "QUIZ123"}</p>
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-muted-foreground">External ID</h3>
                  <p className="font-mono">{quizData.externalId || "Not specified"}</p>
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-muted-foreground">Quiz Type</h3>
                  <p className="capitalize">{quizData.type}</p>
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-muted-foreground">Questions</h3>
                  <p>{quizData.questions}</p>
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-muted-foreground">Duration</h3>
                  <p>{quizData.duration === "unlimited" ? "Unlimited" : `${quizData.duration} minutes`}</p>
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-muted-foreground">Welcome Message</h3>
                <p>{quizData.welcomeMessage}</p>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-muted-foreground">Instructions</h3>
                <p>{quizData.instructions}</p>
              </div>
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("structure")}>
                Back
              </Button>
              <div className="space-x-2">
                <Button variant="outline" onClick={handleSaveAsDraft}>
                  Save as Draft
                </Button>
                <Button variant="secondary" onClick={handleContinueToEditor}>
                  Continue to Editor
                </Button>
                <Button onClick={handlePublish}>Publish Quiz</Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <div className="text-xs text-muted-foreground">
            {activeTab === "basic" ? "Step 1 of 3" : activeTab === "structure" ? "Step 2 of 3" : "Step 3 of 3"}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
