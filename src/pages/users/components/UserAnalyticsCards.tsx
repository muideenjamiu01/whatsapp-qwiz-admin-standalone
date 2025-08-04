
import { Users, UserCheck, UserX } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"

interface AnalyticsData {
  totalUsers: number
  completedUsers: number
  inProgressUsers: number
  completionRate: number
}

export function UserAnalyticsCards({ data }: { data: AnalyticsData }) {
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data?.totalUsers}</div>
          <p className="text-xs text-muted-foreground">All registered users</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Users</CardTitle>
          <UserCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data?.completedUsers}</div>
          <p className="text-xs text-muted-foreground">
            {Math.round((data?.completedUsers / data?.totalUsers) * 100)}% of total
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Users</CardTitle>
          <UserX className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data?.inProgressUsers}</div>
          <p className="text-xs text-muted-foreground">Awaiting approval</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
          <UserX className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data?.completionRate}</div>
          {/* <p className="text-xs text-muted-foreground">Deactivated accounts</p> */}
        </CardContent>
      </Card>
    </div>
  )
}