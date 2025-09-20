export interface User {
  id: number
  username: string
  email: string
  password: string
  role: "admin" | "developer" | "player" | "staff"
  discord_id: string
  created_at?: string
  last_login?: string
  status?: "active" | "banned" | "pending"
  avatar?: string
  bio?: string
  games?: string[]
  rank?: string
  team_id?: number
  ban_reason?: string
  banned_at?: string
  updated_at?: string
}

export interface Team {
  id: number
  name: string
  game: string
  logo?: string
  description: string
  members: number[]
  captain_id: number
  created_at: string
  status: "active" | "inactive" | "recruiting"
  achievements: string[]
  social_links?: {
    twitter?: string
    discord?: string
    twitch?: string
  }
}

export interface Application {
  id: number
  user_id: number
  team_id: number
  game: string
  role: string
  experience: string
  motivation: string
  availability: string
  status: "pending" | "approved" | "rejected"
  created_at: string
  reviewed_by?: number
  reviewed_at?: string
}

export interface Announcement {
  id: number
  title: string
  content: string
  author_id: number
  created_at: string
  updated_at?: string
  type: "info" | "warning" | "success" | "tournament" | "recruitment"
  priority: "low" | "medium" | "high"
  visible: boolean
  tags: string[]
}

export class AdminAPI {
  // Gestion des utilisateurs
  static async getUsers(): Promise<User[]> {
    try {
      console.log("[v0] AdminAPI: Fetching users")
      const response = await fetch("/.netlify/functions/api/admin/users")
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      console.log("[v0] AdminAPI: Users fetched successfully", data.length)
      return data
    } catch (error) {
      console.error("[v0] AdminAPI: Error fetching users:", error)
      throw error
    }
  }

  static async createUser(userData: Partial<User>): Promise<User> {
    try {
      console.log("[v0] AdminAPI: Creating user", userData)
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      console.log("[v0] AdminAPI: User created successfully", data.id)
      return data
    } catch (error) {
      console.error("[v0] AdminAPI: Error creating user:", error)
      throw error
    }
  }

  static async updateUser(id: number, userData: Partial<User>): Promise<User> {
    try {
      console.log("[v0] AdminAPI: Updating user", id, userData)
      const response = await fetch(`/api/admin/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      console.log("[v0] AdminAPI: User updated successfully", id)
      return data
    } catch (error) {
      console.error("[v0] AdminAPI: Error updating user:", error)
      throw error
    }
  }

  static async deleteUser(id: number): Promise<void> {
    try {
      console.log("[v0] AdminAPI: Deleting user", id)
      const response = await fetch(`/api/admin/users/${id}`, { method: "DELETE" })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      console.log("[v0] AdminAPI: User deleted successfully", id)
    } catch (error) {
      console.error("[v0] AdminAPI: Error deleting user:", error)
      throw error
    }
  }

  static async banUser(id: number, reason: string): Promise<void> {
    try {
      console.log("[v0] AdminAPI: Banning user", id, reason)
      const response = await fetch(`/api/admin/users/${id}/ban`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      console.log("[v0] AdminAPI: User banned successfully", id)
    } catch (error) {
      console.error("[v0] AdminAPI: Error banning user:", error)
      throw error
    }
  }

  // Gestion des équipes
  static async getTeams(): Promise<Team[]> {
    const response = await fetch("/api/admin/teams")
    return response.json()
  }

  static async createTeam(teamData: Partial<Team>): Promise<Team> {
    const response = await fetch("/api/admin/teams", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(teamData),
    })
    return response.json()
  }

  static async updateTeam(id: number, teamData: Partial<Team>): Promise<Team> {
    const response = await fetch(`/api/admin/teams/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(teamData),
    })
    return response.json()
  }

  static async deleteTeam(id: number): Promise<void> {
    await fetch(`/api/admin/teams/${id}`, { method: "DELETE" })
  }

  // Gestion des candidatures
  static async getApplications(): Promise<Application[]> {
    const response = await fetch("/api/admin/applications")
    return response.json()
  }

  static async approveApplication(id: number): Promise<void> {
    await fetch(`/api/admin/applications/${id}/approve`, { method: "POST" })
  }

  static async rejectApplication(id: number, reason: string): Promise<void> {
    await fetch(`/api/admin/applications/${id}/reject`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason }),
    })
  }

  // Gestion des annonces
  static async getAnnouncements(): Promise<Announcement[]> {
    const response = await fetch("/api/admin/announcements")
    return response.json()
  }

  static async createAnnouncement(announcementData: Partial<Announcement>): Promise<Announcement> {
    const response = await fetch("/api/admin/announcements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(announcementData),
    })
    return response.json()
  }

  static async updateAnnouncement(id: number, announcementData: Partial<Announcement>): Promise<Announcement> {
    const response = await fetch(`/api/admin/announcements/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(announcementData),
    })
    return response.json()
  }

  static async deleteAnnouncement(id: number): Promise<void> {
    await fetch(`/api/admin/announcements/${id}`, { method: "DELETE" })
  }

  // Statistiques
  static async getStats() {
    try {
      console.log("[v0] AdminAPI: Fetching stats")
      const response = await fetch("/.netlify/functions/api/admin/stats")
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      console.log("[v0] AdminAPI: Stats fetched successfully")
      return data
    } catch (error) {
      console.error("[v0] AdminAPI: Error fetching stats:", error)
      throw error
    }
  }

  // Logs système
  static async getLogs() {
    const response = await fetch("/api/admin/logs")
    return response.json()
  }

  // Sauvegarde
  static async createBackup() {
    const response = await fetch("/api/admin/backup", { method: "POST" })
    return response.json()
  }
}
