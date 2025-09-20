export interface User {
  id: number
  username: string
  email: string
  role: "admin" | "developer" | "player" | "staff"
  discord_id: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
}

// Mock users data (in real app, this would come from database)
const mockUsers: User[] = [
  {
    id: 1,
    username: "Wayzze",
    email: "wayzze@quantum.gg",
    role: "admin",
    discord_id: "Wayzze#0001",
  },
  {
    id: 2,
    username: "16k",
    email: "16k@quantum.gg",
    role: "developer",
    discord_id: "16k#0002",
  },
]

export function authenticateUser(username: string, password: string): User | null {
  // In real app, this would hash password and check against database
  const user = mockUsers.find((u) => u.username === username || u.email === username)
  return user || null
}

export function isAdmin(user: User | null): boolean {
  return user?.role === "admin" || user?.role === "developer"
}

export function requireAuth(user: User | null): boolean {
  return user !== null
}
