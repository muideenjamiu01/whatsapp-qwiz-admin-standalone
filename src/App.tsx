import { Route, Routes, useLocation } from "react-router"
import Dashboard from "./pages/dashboard/Dashboard"
import QuizzesPage from "./pages/quizzes/Quizzes"
import { Toaster } from "sonner"
import CreateQuizPage from "./pages/quizzes/create/CreateQuiz"
import { SidebarProvider } from "./components/ui/sidebar"
import { AppSidebar } from "./components/app-sidebar"
import QuizDetailsPage from "./pages/quizzes/quizData/QuizData"
import QuizAnalyticsPage from "./pages/analytics/Analytics"
import Login from "./pages/auth/Login"
import Courses from "./pages/courses/Courses"
import UserManagement from "./pages/users/Users"

function App() {
  
  return (
    <>
    <Layout>
<>
    <Routes>
      <Route path="/" element={<Login/>}/>
      <Route path="/dashboard" element={<Dashboard/>}/>
      <Route path="/quizzes" element={<QuizzesPage/>}/>
      <Route path="/courses" element={<Courses/>}/>
      <Route path="/users" element={<UserManagement/>}/>
      <Route path="/quizzes/create" element={<CreateQuizPage/>}/>
      <Route path="/quizzes/:id/*" element={<QuizDetailsPage/>}/>
      <Route path="/analytics/:id/*" element={<QuizAnalyticsPage/>}/>
    </Routes>
</>
    </Layout>

    <Toaster/> 
    </>
  )
}

export default App

const Layout=( {children}:{children: React.ReactNode})=>{
  const location = useLocation();
  const pathname = location.pathname;
  if(pathname==="/") return children
return        <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 w-full ">{children}</main>
      </div>
      <Toaster />
    </SidebarProvider>
 
}
