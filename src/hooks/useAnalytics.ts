import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'

interface SummaryResponse {
  success: boolean
  data: {
    totalQuizzes: number
    activeQuizzes: number
    totalPlayers: number
    totalCompleted: number
    completionRate: number
    averageScore: string
    timeRange: {
      start: string // ISO date string
      end: string // ISO date string
    }
  }
}

export const useFetchSummary = () => {
  return useQuery({
    queryKey: ['summary'],
    queryFn: async () => {
      const res = await api.get(`/api/analytics`)
      return res.data as SummaryResponse
    },
  })
}

interface PlayerData {
  rank: number
  phoneNumber: string
  score: number
  attempts: number
  lastPlayed: string // ISO timestamp as string
}

interface Pagination {
  currentPage: number
  totalPages: number
  totalCount: number
}

interface AnalyticsResponse {
  success: boolean
  data: PlayerData[]
  pagination: Pagination
}

export const useFetchQuizPlayers = (id: string) => {
  return useQuery({
    queryKey: ['quiz players', id],
    queryFn: async () => {
      const res = await api.get(`/api/quizzes/${id}/players`)
      return res.data as AnalyticsResponse
    },
  })
}

interface LeaderboardResponse {
  success: boolean
  type: string
  message: LeaderboardEntry[]
}

interface LeaderboardEntry {
  rank: number
  userId: string
  name: string
  totalPoints: number
  updatedAt?: string
}

export const useFetchLeaderboard = (id: string) => {
  return useQuery({
    queryKey: ['leaderboard', id],
    queryFn: async () => {
      const res = await api.get(`/api/leaderboard/${id}`)
      return res.data as LeaderboardResponse
    },
  })
}

interface QuizInfo {
  id: string
  title: string
}

interface QuizActivity {
  id: string
  type: string
  description: string
  adminId: string | null
  quiz_id: string
  createdAt: string // ISO date string
  updatedAt: string // ISO date string
  admin?: {
    id: string
    name?: string
    email?: string
  } // Replace `any` with a specific type if known
  Quiz: QuizInfo
}

interface Pagination {
  totalItems: number
  currentPage: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

interface QuizActivityResponse {
  success: boolean
  data: QuizActivity[]
  pagination: Pagination
}

/*************  ✨ Windsurf Command ⭐  *************/
/**
 * Custom hook to fetch the latest quiz activities.
 *
 * This hook utilizes the `useQuery` hook from `@tanstack/react-query` to perform
 * an asynchronous GET request to the `/api/analytics/activities` endpoint.
 * It retrieves the latest quiz activities and returns the data in the form of a `QuizActivityResponse`.
 *
 * @returns {object} - Returns the query result which includes the data, error, and status
 * of the request for the latest quiz activities.
 */

/*******  59007dc1-374c-4b9f-87ac-f02277d6b627  *******/
export const useFetchLatestActivities = () => {
  return useQuery({
    queryKey: ['latest actions'],
    queryFn: async () => {
      const res = await api.get(`/api/analytics/activities`)
      return res.data as QuizActivityResponse
    },
  })
}
