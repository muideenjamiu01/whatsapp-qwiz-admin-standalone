import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, Save } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../components/ui/form";
import { RadioGroup, RadioGroupItem } from "../../../components/ui/radio-group";
// import { useToast } from "../../../components/hooks/use-toast"
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useCreateQuiz } from "../../../hooks/useQuizzes";
import { useNavigate } from "react-router";
import BackButton from "../../../components/back-button";
interface QuizDraft {
  name: string;
  description: string;
  joinCode: string;
  type: "trivia";
  questions: string; // Consider changing to number if it's numeric
  duration: string; // Consider changing to number if it's numeric (e.g., in minutes)
  welcomeMessage: string;
  instructions: string;
  status: "draft" | "published";
  externalId: string;
}

// Steps in the quiz creation process
const steps = [
  { id: "basics", label: "Basic Info" },
  { id: "type", label: "Quiz Type" },
  { id: "messages", label: "Messages" },
  { id: "publish", label: "Publish" },
  { id: "preview", label: "Preview" },
];
export default function CreateQuizPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const createQuiz = useCreateQuiz();
  const navigate = useNavigate();
  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
      joinCode: "",
      type: "Trivia",
      questions: "10",
      duration: "30",
      welcomeMessage:
        "Welcome to the quiz! Answer the following questions to test your knowledge.",
      instructions: "Reply with the letter of your answer (A, B, C, or D).",
      status: "published",
      externalId: "",
    },
  });

  const goToNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = (data: QuizDraft) => {
    console.warn("Form submitted:", data);
    toast.loading(`Creating quiz... please wait`);
    createQuiz.mutate(
      {
        title: data?.name,
        description: data.description,
        // createdAt:new Date().toISOString(),
        duration: +data.duration,
        external_id: data.externalId,
        instructions: data.instructions,
        // join_code:data?.joinCode,
        status: data?.status,
        type: data?.type,
        welcome_message: data?.welcomeMessage,
      },
      {
        onSuccess: () => {
          toast("Your quiz has been created and saved.");
          toast("Your quiz has been published successfully.");

          navigate("/quizzes");
        },
        onError() {
          toast.error(`Unable to publish quiz`);
        },
        onSettled() {
          toast.dismiss();
        },
      }
    );
  };

  const saveAsDraft = () => {
    const data = form.getValues();
    console.warn("Saving as draft:", data);
    toast("Your quiz has been saved as a draft.");
  };

  return (
    <div className="container mx-auto py-6 md:px-4 space-y-6">
      <BackButton />
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Create New Quiz</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={saveAsDraft}>
            <Save className="mr-2 h-4 w-4" />
            Save Draft
          </Button>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="flex space-x-2">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              {index > 0 && (
                <div className="h-[2px] w-10 bg-muted-foreground/30 mx-1" />
              )}
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                  index === currentStep
                    ? "border-primary bg-primary text-primary-foreground"
                    : index < currentStep
                    ? "border-primary bg-primary/20 text-primary"
                    : "border-muted-foreground/30 text-muted-foreground/30"
                }`}
              >
                {index < currentStep ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <span
                className={`ml-2 text-sm font-medium ${
                  index === currentStep
                    ? "text-foreground"
                    : "text-muted-foreground/60"
                }`}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            {/* @ts-expect-error ignore next line  */}
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {currentStep === 0 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Basic Information</h2>
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quiz Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter quiz name" {...field} />
                        </FormControl>
                        <FormDescription>
                          Give your quiz a clear and descriptive name.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter a brief description of your quiz"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Describe what your quiz is about and what participants
                          will learn.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="joinCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Join Code</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., QUIZ123" {...field} />
                        </FormControl>
                        <FormDescription>
                          A unique code that participants will use to join your
                          quiz on WhatsApp.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="externalId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>External Quiz ID</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., EXT-123" {...field} />
                        </FormControl>
                        <FormDescription>
                          Optional identifier to link this quiz with external
                          systems.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {currentStep === 1 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">
                    Quiz Type & Structure
                  </h2>
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quiz Type</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-3"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="Trivia" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Trivia Quiz - Multiple choice questions with
                                correct answers
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="Personality" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Personality Quiz - Questions that lead to
                                different outcomes based on answers
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="Scorecard" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Scorecard - Rating-based questions for feedback
                                or assessment
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="questions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Questions</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select number of questions" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="5">5 questions</SelectItem>
                            <SelectItem value="10">10 questions</SelectItem>
                            <SelectItem value="15">15 questions</SelectItem>
                            <SelectItem value="20">20 questions</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Choose how many questions your quiz will have.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duration (minutes)</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select quiz duration" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="15">15 minutes</SelectItem>
                            <SelectItem value="30">30 minutes</SelectItem>
                            <SelectItem value="45">45 minutes</SelectItem>
                            <SelectItem value="60">60 minutes</SelectItem>
                            <SelectItem value="unlimited">Unlimited</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Set how long participants have to complete the quiz.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">
                    Messages & Instructions
                  </h2>
                  <FormField
                    control={form.control}
                    name="welcomeMessage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Welcome Message</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter welcome message"
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          This message will be sent to participants when they
                          join the quiz.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="instructions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Instructions</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter quiz instructions"
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Provide clear instructions on how to participate in
                          the quiz.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Publish Settings</h2>
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quiz Status</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-3"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="draft" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Save as Draft - Save your quiz but don't make it
                                available yet
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="published" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Publish - Make your quiz available to
                                participants immediately
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Preview</h2>
                  <div className="border rounded-lg p-6 space-y-4">
                    <div className="space-y-2">
                      <h3 className="font-medium">Quiz Name</h3>
                      <p>{form.getValues("name") || "Untitled Quiz"}</p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-medium">Description</h3>
                      <p>
                        {form.getValues("description") ||
                          "No description provided."}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-medium">Join Code</h3>
                      <p className="font-mono">
                        {form.getValues("joinCode") || "QUIZ123"}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-medium">External Quiz ID</h3>
                      <p className="font-mono">
                        {form.getValues("externalId") || "Not specified"}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-medium">Quiz Type</h3>
                      <p className="capitalize">{form.getValues("type")}</p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-medium">Number of Questions</h3>
                      <p>{form.getValues("questions")}</p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-medium">Duration</h3>
                      <p>
                        {form.getValues("duration") === "unlimited"
                          ? "Unlimited"
                          : `${form.getValues("duration")} minutes`}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-medium">Welcome Message</h3>
                      <p>{form.getValues("welcomeMessage")}</p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-medium">Instructions</h3>
                      <p>{form.getValues("instructions")}</p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-medium">Status</h3>
                      <p className="capitalize">{form.getValues("status")}</p>
                    </div>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <h3 className="font-medium mb-2">WhatsApp Preview</h3>
                    <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4 max-w-md mx-auto">
                      <div className="flex flex-col space-y-4">
                        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg self-start max-w-[80%] shadow-sm">
                          <p className="text-sm">
                            Hi! I'd like to join the quiz.
                          </p>
                        </div>
                        <div className="bg-green-100 dark:bg-green-900 p-3 rounded-lg self-end max-w-[80%] shadow-sm">
                          <p className="text-sm">
                            Welcome to {form.getValues("name") || "our quiz"}!{" "}
                            {form.getValues("welcomeMessage")}
                          </p>
                        </div>
                        <div className="bg-green-100 dark:bg-green-900 p-3 rounded-lg self-end max-w-[80%] shadow-sm">
                          <p className="text-sm">
                            {form.getValues("instructions")}
                          </p>
                        </div>
                        <div className="bg-green-100 dark:bg-green-900 p-3 rounded-lg self-end max-w-[80%] shadow-sm">
                          <p className="text-sm">
                            Question 1: What is the capital of France?
                          </p>
                          <p className="text-sm mt-2">A) London</p>
                          <p className="text-sm">B) Paris</p>
                          <p className="text-sm">C) Berlin</p>
                          <p className="text-sm">D) Madrid</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg self-start max-w-[80%] shadow-sm">
                          <p className="text-sm">B</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={goToPreviousStep}
                  disabled={currentStep === 0}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                {currentStep === steps.length - 1 ? (
                  <Button type="submit">
                    <Check className="mr-2 h-4 w-4" />
                    {form.getValues("status") === "published"
                      ? "Publish Quiz"
                      : "Save Quiz"}
                  </Button>
                ) : (
                  <Button type="button" onClick={goToNextStep}>
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
