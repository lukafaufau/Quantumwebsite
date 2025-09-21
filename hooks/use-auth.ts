"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface User {
  id: number
  username: string
  email: string
  role: 'admin' | 'developer' | 'player' | 'staff'
  discord_id: string
  status: 'active' | 'banned' | 'pending'
  created_at: string
  bio?: string
  games?: string[]
}

interface AuthStore {
  user: User | null
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  signup: (userData: {
    username: string
    email: string
    password: string
    discord_id: string
    role?: string
    invite_code?: string
  }) => Promise<{ success: boolean; error?: string }>
}

export const useAuth = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      
      login: async (username: string, password: string) => {
        try {
          const response = await fetch('/api/auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
          })
          
          const data = await response.json()
          
          if (data.success && data.user) {
            set({ user: data.user, isAuthenticated: true })
            return true
          }
          
          return false
        } catch (error) {
          console.error('Login error:', error)
          return false
        }
      },
      
      logout: () => {
        set({ user: null, isAuthenticated: false })
      },
      
      signup: async (userData) => {
        try {
          const response = await fetch('/api/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
          })
          
          const data = await response.json()
          
          if (data.success && data.user) {
            set({ user: data.user, isAuthenticated: true })
            return { success: true }
          }
          
          return { success: false, error: data.error || 'Signup failed' }
        } catch (error) {
          console.error('Signup error:', error)
          return { success: false, error: 'Network error' }
        }
      }
    }),
    {
      name: "nemesis-auth",
    }
  )
)