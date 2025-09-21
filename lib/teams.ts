import fs from "fs/promises"
import path from "path"

const TEAMS_FILE = path.join(process.cwd(), "data", "teams.json")

export async function getTeams() {
  try {
    const data = await fs.readFile(TEAMS_FILE, "utf-8")
    return JSON.parse(data)
  } catch {
    return []
  }
}

export async function saveTeams(teams: any[]) {
  await fs.writeFile(TEAMS_FILE, JSON.stringify(teams, null, 2))
}

export async function createTeam(team: any) {
  const teams = await getTeams()
  team.id = teams.length > 0 ? teams[teams.length - 1].id + 1 : 1
  teams.push(team)
  await saveTeams(teams)
  return team
}

export async function updateTeam(id: number, updates: any) {
  const teams = await getTeams()
  const index = teams.findIndex((t: any) => t.id === id)
  if (index === -1) throw new Error("Équipe introuvable")
  teams[index] = { ...teams[index], ...updates }
  await saveTeams(teams)
  return teams[index]
}

export async function deleteTeam(id: number) {
  const teams = await getTeams()
  const filtered = teams.filter((t: any) => t.id !== id)
  await saveTeams(filtered)
  return filtered
}
