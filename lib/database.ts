import fs from 'fs/promises'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')

export interface User {
  id: number
  username: string
  email: string
  password: string
  role: 'admin' | 'developer' | 'player' | 'staff'
  discord_id: string
  status: 'active' | 'banned' | 'pending'
  created_at: string
  updated_at?: string
  ban_reason?: string
  banned_at?: string
  bio?: string
  games?: string[]
  invite_code?: string
}

export interface Team {
  id: number
  name: string
  captain: string
  members: string[]
  game: string
  description?: string
  status: 'active' | 'inactive' | 'recruiting'
  created_at: string
  updated_at?: string
}

export interface Player {
  id: number
  username: string
  role: string
  team: string | null
  status: 'active' | 'free' | 'inactive'
  game?: string
  discord_id?: string
  created_at: string
}

export interface Announcement {
  id: number
  title: string
  description: string
  type: 'tournament' | 'recruitment' | 'news' | 'general'
  game?: string
  author: string
  date: string
  visible: boolean
  priority: 'low' | 'medium' | 'high'
}

export interface RecruitmentApplication {
  id: number
  username: string
  discord_id: string
  role: string
  game: string
  status: 'pending' | 'accepted' | 'rejected'
  message?: string
  experience?: string
  availability?: string
  date: string
  reviewed_by?: string
  reviewed_at?: string
}

export interface InviteCode {
  id: number
  code: string
  role: 'player' | 'staff'
  uses_left: number
  max_uses: number
  expires_at?: string
  created_by: string
  created_at: string
  used_by: string[]
}

class Database {
  private async ensureDataDir() {
    try {
      await fs.access(DATA_DIR)
    } catch {
      await fs.mkdir(DATA_DIR, { recursive: true })
    }
  }

  private async readFile<T>(filename: string, defaultData: T): Promise<T> {
    await this.ensureDataDir()
    const filePath = path.join(DATA_DIR, filename)
    
    try {
      const data = await fs.readFile(filePath, 'utf8')
      return JSON.parse(data)
    } catch {
      await this.writeFile(filename, defaultData)
      return defaultData
    }
  }

  private async writeFile<T>(filename: string, data: T): Promise<void> {
    await this.ensureDataDir()
    const filePath = path.join(DATA_DIR, filename)
    await fs.writeFile(filePath, JSON.stringify(data, null, 2))
  }

  // Users
  async getUsers(): Promise<User[]> {
    const data = await this.readFile('users.json', { users: [] })
    return data.users || []
  }

  async addUser(user: Omit<User, 'id' | 'created_at'>): Promise<User> {
    const users = await this.getUsers()
    const newUser: User = {
      ...user,
      id: Math.max(0, ...users.map(u => u.id)) + 1,
      created_at: new Date().toISOString(),
      status: user.status || 'active'
    }
    users.push(newUser)
    await this.writeFile('users.json', { users })
    return newUser
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | null> {
    const users = await this.getUsers()
    const index = users.findIndex(u => u.id === id)
    if (index === -1) return null
    
    users[index] = { ...users[index], ...updates, updated_at: new Date().toISOString() }
    await this.writeFile('users.json', { users })
    return users[index]
  }

  async deleteUser(id: number): Promise<boolean> {
    const users = await this.getUsers()
    const filtered = users.filter(u => u.id !== id)
    if (filtered.length === users.length) return false
    
    await this.writeFile('users.json', { users: filtered })
    return true
  }

  async getUserByCredentials(username: string, password: string): Promise<User | null> {
    const users = await this.getUsers()
    return users.find(u => 
      (u.username === username || u.email === username) && 
      u.password === password && 
      u.status !== 'banned'
    ) || null
  }

  // Teams
  async getTeams(): Promise<Team[]> {
    const data = await this.readFile('teams.json', { teams: [] })
    return data.teams || []
  }

  async addTeam(team: Omit<Team, 'id' | 'created_at'>): Promise<Team> {
    const teams = await this.getTeams()
    const newTeam: Team = {
      ...team,
      id: Math.max(0, ...teams.map(t => t.id)) + 1,
      created_at: new Date().toISOString(),
      members: team.members || []
    }
    teams.push(newTeam)
    await this.writeFile('teams.json', { teams })
    return newTeam
  }

  async updateTeam(id: number, updates: Partial<Team>): Promise<Team | null> {
    const teams = await this.getTeams()
    const index = teams.findIndex(t => t.id === id)
    if (index === -1) return null
    
    teams[index] = { ...teams[index], ...updates, updated_at: new Date().toISOString() }
    await this.writeFile('teams.json', { teams })
    return teams[index]
  }

  async deleteTeam(id: number): Promise<boolean> {
    const teams = await this.getTeams()
    const filtered = teams.filter(t => t.id !== id)
    if (filtered.length === teams.length) return false
    
    await this.writeFile('teams.json', { teams: filtered })
    return true
  }

  // Players
  async getPlayers(): Promise<Player[]> {
    const data = await this.readFile('players.json', { players: [] })
    return data.players || []
  }

  async addPlayer(player: Omit<Player, 'id' | 'created_at'>): Promise<Player> {
    const players = await this.getPlayers()
    const newPlayer: Player = {
      ...player,
      id: Math.max(0, ...players.map(p => p.id)) + 1,
      created_at: new Date().toISOString()
    }
    players.push(newPlayer)
    await this.writeFile('players.json', { players })
    return newPlayer
  }

  // Announcements
  async getAnnouncements(): Promise<Announcement[]> {
    const data = await this.readFile('announcements.json', { announcements: [] })
    return data.announcements || []
  }

  async addAnnouncement(announcement: Omit<Announcement, 'id'>): Promise<Announcement> {
    const announcements = await this.getAnnouncements()
    const newAnnouncement: Announcement = {
      ...announcement,
      id: Math.max(0, ...announcements.map(a => a.id)) + 1
    }
    announcements.push(newAnnouncement)
    await this.writeFile('announcements.json', { announcements })
    return newAnnouncement
  }

  async updateAnnouncement(id: number, updates: Partial<Announcement>): Promise<Announcement | null> {
    const announcements = await this.getAnnouncements()
    const index = announcements.findIndex(a => a.id === id)
    if (index === -1) return null
    
    announcements[index] = { ...announcements[index], ...updates }
    await this.writeFile('announcements.json', { announcements })
    return announcements[index]
  }

  async deleteAnnouncement(id: number): Promise<boolean> {
    const announcements = await this.getAnnouncements()
    const filtered = announcements.filter(a => a.id !== id)
    if (filtered.length === announcements.length) return false
    
    await this.writeFile('announcements.json', { announcements: filtered })
    return true
  }

  // Recruitment
  async getRecruitments(): Promise<RecruitmentApplication[]> {
    const data = await this.readFile('recruitment.json', { applications: [] })
    return data.applications || []
  }

  async addRecruitment(recruitment: Omit<RecruitmentApplication, 'id'>): Promise<RecruitmentApplication> {
    const recruitments = await this.getRecruitments()
    const newRecruitment: RecruitmentApplication = {
      ...recruitment,
      id: Math.max(0, ...recruitments.map(r => r.id)) + 1
    }
    recruitments.push(newRecruitment)
    await this.writeFile('recruitment.json', { applications: recruitments })
    return newRecruitment
  }

  async updateRecruitment(id: number, updates: Partial<RecruitmentApplication>): Promise<RecruitmentApplication | null> {
    const recruitments = await this.getRecruitments()
    const index = recruitments.findIndex(r => r.id === id)
    if (index === -1) return null
    
    recruitments[index] = { ...recruitments[index], ...updates }
    await this.writeFile('recruitment.json', { applications: recruitments })
    return recruitments[index]
  }

  // Invite Codes
  async getInviteCodes(): Promise<InviteCode[]> {
    const data = await this.readFile('invite_codes.json', { codes: [] })
    return data.codes || []
  }

  async addInviteCode(code: Omit<InviteCode, 'id' | 'created_at' | 'used_by'>): Promise<InviteCode> {
    const codes = await this.getInviteCodes()
    const newCode: InviteCode = {
      ...code,
      id: Math.max(0, ...codes.map(c => c.id)) + 1,
      created_at: new Date().toISOString(),
      used_by: [],
      uses_left: code.uses_left || code.max_uses
    }
    codes.push(newCode)
    await this.writeFile('invite_codes.json', { codes })
    return newCode
  }

  async useInviteCode(code: string, username: string): Promise<InviteCode | null> {
    const codes = await this.getInviteCodes()
    const inviteCode = codes.find(c => c.code === code)
    
    if (!inviteCode || inviteCode.uses_left <= 0) return null
    if (inviteCode.expires_at && new Date(inviteCode.expires_at) < new Date()) return null
    
    inviteCode.uses_left--
    inviteCode.used_by.push(username)
    
    await this.writeFile('invite_codes.json', { codes })
    return inviteCode
  }

  async deleteInviteCode(id: number): Promise<boolean> {
    const codes = await this.getInviteCodes()
    const filtered = codes.filter(c => c.id !== id)
    if (filtered.length === codes.length) return false
    
    await this.writeFile('invite_codes.json', { codes: filtered })
    return true
  }
}

export const db = new Database()