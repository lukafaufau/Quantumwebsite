import { promises as fs } from "fs"
import path from "path"

const DATA_DIR = path.join(process.cwd(), "data")

export interface JsonData {
  [key: string]: any
}

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR)
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true })
  }
}

// Read JSON file
export async function readJsonFile(filename: string): Promise<JsonData> {
  await ensureDataDir()
  const filePath = path.join(DATA_DIR, filename)

  try {
    const data = await fs.readFile(filePath, "utf8")
    return JSON.parse(data)
  } catch (error) {
    console.error(`Error reading ${filename}:`, error)
    return {}
  }
}

// Write JSON file
export async function writeJsonFile(filename: string, data: JsonData): Promise<boolean> {
  await ensureDataDir()
  const filePath = path.join(DATA_DIR, filename)

  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8")
    return true
  } catch (error) {
    console.error(`Error writing ${filename}:`, error)
    return false
  }
}

// Update specific record in JSON file
export async function updateJsonRecord(
  filename: string,
  recordId: number,
  updates: Partial<any>,
  arrayKey: string,
): Promise<boolean> {
  try {
    const data = await readJsonFile(filename)
    const records = data[arrayKey] || []

    const recordIndex = records.findIndex((record: any) => record.id === recordId)
    if (recordIndex === -1) {
      return false
    }

    records[recordIndex] = { ...records[recordIndex], ...updates }
    data[arrayKey] = records

    return await writeJsonFile(filename, data)
  } catch (error) {
    console.error(`Error updating record in ${filename}:`, error)
    return false
  }
}

// Add new record to JSON file
export async function addJsonRecord(filename: string, newRecord: any, arrayKey: string): Promise<boolean> {
  try {
    const data = await readJsonFile(filename)
    const records = data[arrayKey] || []

    // Generate new ID
    const maxId = records.length > 0 ? Math.max(...records.map((r: any) => r.id)) : 0
    newRecord.id = maxId + 1

    records.push(newRecord)
    data[arrayKey] = records

    return await writeJsonFile(filename, data)
  } catch (error) {
    console.error(`Error adding record to ${filename}:`, error)
    return false
  }
}

// Delete record from JSON file
export async function deleteJsonRecord(filename: string, recordId: number, arrayKey: string): Promise<boolean> {
  try {
    const data = await readJsonFile(filename)
    const records = data[arrayKey] || []

    const filteredRecords = records.filter((record: any) => record.id !== recordId)
    data[arrayKey] = filteredRecords

    return await writeJsonFile(filename, data)
  } catch (error) {
    console.error(`Error deleting record from ${filename}:`, error)
    return false
  }
}

// Specific helper functions for each data type
export const JsonManager = {
  // Users
  async getUsers() {
    const data = await readJsonFile("users.json")
    return data.users || []
  },

  async addUser(user: any) {
    return await addJsonRecord("users.json", user, "users")
  },

  async updateUser(id: number, updates: any) {
    return await updateJsonRecord("users.json", id, updates, "users")
  },

  async deleteUser(id: number) {
    return await deleteJsonRecord("users.json", id, "users")
  },

  // Teams
  async getTeams() {
    const data = await readJsonFile("teams.json")
    return data.teams || []
  },

  async addTeam(team: any) {
    return await addJsonRecord("teams.json", team, "teams")
  },

  async updateTeam(id: number, updates: any) {
    return await updateJsonRecord("teams.json", id, updates, "teams")
  },

  async deleteTeam(id: number) {
    return await deleteJsonRecord("teams.json", id, "teams")
  },

  // Players
  async getPlayers() {
    const data = await readJsonFile("players.json")
    return data.players || []
  },

  async addPlayer(player: any) {
    return await addJsonRecord("players.json", player, "players")
  },

  async updatePlayer(id: number, updates: any) {
    return await updateJsonRecord("players.json", id, updates, "players")
  },

  async deletePlayer(id: number) {
    return await deleteJsonRecord("players.json", id, "players")
  },

  // Recruitment
  async getRecruitments() {
    const data = await readJsonFile("recrutement.json")
    return data.candidatures || []
  },

  async addRecruitment(recruitment: any) {
    return await addJsonRecord("recrutement.json", recruitment, "candidatures")
  },

  async updateRecruitment(id: number, updates: any) {
    return await updateJsonRecord("recrutement.json", id, updates, "candidatures")
  },

  async deleteRecruitment(id: number) {
    return await deleteJsonRecord("recrutement.json", id, "candidatures")
  },

  // Announcements
  async getAnnouncements() {
    const data = await readJsonFile("explorer.json")
    return data.annonces || []
  },

  async addAnnouncement(announcement: any) {
    return await addJsonRecord("explorer.json", announcement, "annonces")
  },

  async updateAnnouncement(id: number, updates: any) {
    return await updateJsonRecord("explorer.json", id, updates, "annonces")
  },

  async deleteAnnouncement(id: number) {
    return await deleteJsonRecord("explorer.json", id, "annonces")
  },
}
