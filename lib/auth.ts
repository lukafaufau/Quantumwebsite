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

export async function authenticateUser(username: string, password: string): Promise<User | null> {
  try {
    // Essayer l'API d'authentification Netlify
    const response = await fetch('/.netlify/functions/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
    
    if (response.ok) {
      const data = await response.json()
      return data.success ? data.user : null
    }
    
    // Si l'API Netlify ne répond pas, essayer l'API Next.js locale
    const localResponse = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
    
    if (localResponse.ok) {
      const localData = await localResponse.json()
      return localData.success ? localData.user : null
    }
  } catch (error) {
    console.log('API non disponible, utilisation des données locales')
  }
  
  // Fallback vers authentification locale
  const users = [
    {
      id: 1,
      username: "Wayzze",
      email: "wayzze@quantum.gg",
      role: "admin" as const,
      discord_id: "Wayzze#0001",
    },
    {
      id: 2,
      username: "16k",
      email: "16k@quantum.gg",
      role: "developer" as const,
      discord_id: "16k#0002",
    },
  ]
  
  const user = users.find((u) => u.username === username || u.email === username)
  if (user && password === "password") {
    return user
  }
  
  return null
}

export function isAdmin(user: User | null): boolean {
  return user?.role === "admin" || user?.role === "developer"
}

export function requireAuth(user: User | null): boolean {
  return user !== null
}
