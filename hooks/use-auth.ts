"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { type User, authenticateUser } from "@/lib/auth"

interface AuthStore {
  user: User | null
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  signup: (userData: Omit<User, "id"> & { password: string }) => Promise<boolean>
}

export const useAuth = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      login: async (username: string, password: string) => {
        const user = authenticateUser(username, password)
        if (user) {
          set({ user, isAuthenticated: true })
          return true
        }
        return false
      },
      logout: () => {
        set({ user: null, isAuthenticated: false })
      },
      signup: async (userData) => {
        // In real app, this would create user in database
        const newUser: User = {
          id: Date.now(),
          username: userData.username,
          email: userData.email,
          role: userData.role,
          discord_id: userData.discord_id,
        }
        set({ user: newUser, isAuthenticated: true })
        return true
      },
    }),
    {
      name: "quantum-auth",
    },
  ),
)
