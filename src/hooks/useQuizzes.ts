import { useMutation, useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'

export interface Quiz {
  id: string
  join_code: string
  status: 'published' | 'draft' | string // adjust as needed
  title: string
  description: string
  type: 'Scorecard' | string // extend with other types if necessary
  duration: number
  external_id: string
  welcome_message: string
  instructions: string
  createdAt: string // ISO date string
  updatedAt: string // ISO date string
}

interface CompletionRateData {
  id: string
  title: string
  createdAt: string // ISO timestamp
  completedSessions: number
  totalParticipants?: number
  completionRate: number
  weeklyGrowthPercentage: number
}

interface PlayerCountData extends Partial<CompletionRateData> {
  id: string
  title: string
  createdAt: string // ISO timestamp
  totalPlayers: number
  completedSessions: number
  weeklyPlayerGrowthPercentage: number
}
export interface QuizResponse {
  total: number
  page: number
  pages: number
  data: Quiz[]
  completionRate?: { data: CompletionRateData[] }
  playerCount?: { data: PlayerCountData[] }
}

interface RecentQuizResponse {
  data: {
    id: string
    title: string
    createdAt: string
    totalPlayers: number
    totalCompleted: number
    type?: string
  }[]
}

interface Filter {
  searchTerm: string
}
export const useQuizzes = (payload: Partial<Filter> = { searchTerm: '' }) => {
  return useQuery({
    queryKey: ['quizzes', payload],
    queryFn: async () => {
      const res = await api.get(`/api/quizzes?search=${payload?.searchTerm}`)
      return res.data as QuizResponse
    },
  })
}
export const useFetchRecentQuizzes = (
  payload: Partial<Filter> = { searchTerm: '' },
) => {
  return useQuery({
    queryKey: ['recent-quizzes', payload],
    queryFn: async () => {
      const res = await api.get(
        `/api/analytics/recent?search=${payload?.searchTerm}`,
      )
      return res.data as RecentQuizResponse
    },
  })
}
export const useFetchQuiz = (id: string) => {
  return useQuery({
    queryKey: ['quiz', id],
    queryFn: async () => {
      const res = await api.get(`/api/quizzes/${id}`)
      return res.data as { data: Quiz }
    },
  })
}

export const useCreateQuiz = () => {
  return useMutation({
    mutationKey: ['create quiz'],
    mutationFn: async (payload: Partial<Quiz>) => {
      const { data } = await api.post(`/api/quizzes`, payload)
      return data
    },
  })
}
