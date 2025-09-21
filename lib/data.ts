export interface Team {
  id: number
  name: string
  captain: string
  members: string[]
  game: string
  logo?: string
  description?: string
}

export interface Player {
  id: number
  username: string
  role: string
  team: string | null
  status: "active" | "free" | "inactive"
  game?: string
  discord_id?: string
}

export interface Announcement {
  id: number
  title: string
  description: string
  date: string
  type: "tournament" | "recruitment" | "news"
  game?: string
}

export interface RecruitmentApplication {
  id: number
  username: string
  discord_id: string
  role: string
  game: string
  status: "pending" | "accepted" | "rejected"
  message?: string
  date: string
}

// Mock data
export const mockTeams: Team[] = [
  {
    id: 1,
    name: "L'équipe Epsilon",
    captain: "Epsilon",
    members: ["Player1", "Player2", "Player3"],
    game: "Rocket League",
    description: "Cette équipe est réservée aux meilleurs joueurs de la Nemesis, c’est-à-dire ceux ayant atteint le rang Super Sonic Legend !",
  },
  {
    id: 2,
    name: "L'équipe Mocha",
    captain: "Mocha",
    members: ["FragMaster", "SniperPro", "TacticalAce", "FlashKing", "SmokeGod"],
    game: "Rocket League",
    description: "Cette équipe peut être attribuée à des joueurs de tous rangs, mais elle est le plus souvent réservée aux Champions & Grand Champions.",
  },
  {
    id: 3,
    name: "L'équipe Gen",
    captain: "Gen",
    members: ["HeadshotHero", "SprayControl", "ClutchMaster", "EntryFragger"],
    game: "Rocket League"",
    description: "Cette équipe peut être attribuée à des joueurs de tous rangs, mais elle est le plus souvent réservée aux Diamant & Champions.",
  },
    {
    id: 4,
    name: "L'équipe Blast",
    captain: "Blast",
    members: ["HeadshotHero", "SprayControl", "ClutchMaster", "EntryFragger"],
    game: "Rocket League"",
    description: "Cette équipe peut être attribuée à des joueurs de tous rangs.",
  },
]

export const mockPlayers: Player[] = [
  {
    id: 1,
    username: "Player1",
    role: "Attaquant",
    team: "Nemesis RL",
    status: "active",
    game: "Rocket League",
    discord_id: "Player1#1234",
  },
  {
    id: 2,
    username: "Player2",
    role: "Défenseur",
    team: "Nemesis RL",
    status: "active",
    game: "Rocket League",
    discord_id: "Player2#5678",
  },
  {
    id: 3,
    username: "FragMaster",
    role: "Duelist",
    team: "Nemesis Valorant",
    status: "active",
    game: "Valorant",
    discord_id: "FragMaster#9999",
  },
  {
    id: 4,
    username: "FreeAgent",
    role: "Support",
    team: null,
    status: "free",
    game: "League of Legends",
    discord_id: "FreeAgent#1111",
  },
  {
    id: 5,
    username: "HeadshotHero",
    role: "AWPer",
    team: "Nemesis CS2",
    status: "active",
    game: "Counter-Strike 2",
    discord_id: "HeadshotHero#2222",
  },
]

export const mockAnnouncements: Announcement[] = [
  {
    id: 1,
    title: "Nouveaux tryouts Rocket League",
    description:
      "Participez aux essais Nemesis RL pour la prochaine saison. Nous recherchons des joueurs motivés et compétitifs.",
    date: "2024-01-15",
    type: "recruitment",
    game: "Rocket League",
  },
  {
    id: 2,
    title: "Victoire en tournoi Valorant",
    description: "Félicitations à l'équipe Nemesis Valorant pour leur victoire au tournoi régional !",
    date: "2024-01-10",
    type: "news",
    game: "Valorant",
  },
  {
    id: 3,
    title: "Tournoi CS2 à venir",
    description: "Inscription ouverte pour le prochain tournoi Counter-Strike 2. Préparez-vous !",
    date: "2024-01-20",
    type: "tournament",
    game: "Counter-Strike 2",
  },
]

export const mockRecruitments: RecruitmentApplication[] = [
  {
    id: 1,
    username: "Zerkai",
    discord_id: "Zerkai#1234",
    role: "Joueur",
    game: "Rocket League",
    status: "pending",
    message: "Je souhaite rejoindre une équipe compétitive",
    date: "2024-01-12",
  },
]

// Mock users data for admin dashboard
export const mockUsers = [
  {
    id: 1,
    username: "Wayzze",
    email: "wayzze@nemesis.gg",
    role: "admin" as const,
    discord_id: "Wayzze#0001",
  },
  {
    id: 2,
    username: "16k",
    email: "16k@nemesis.gg",
    role: "developer" as const,
    discord_id: "16k#0002",
  },
  {
    id: 3,
    username: "Player1",
    email: "player1@nemesis.gg",
    role: "player" as const,
    discord_id: "Player1#1234",
  },
  {
    id: 4,
    username: "FragMaster",
    email: "fragmaster@nemesis.gg",
    role: "player" as const,
    discord_id: "FragMaster#9999",
  },
]

// Helper functions
export function getTeamsByGame(game?: string): Team[] {
  if (!game) return mockTeams
  return mockTeams.filter((team) => team.game === game)
}

export function getPlayersByTeam(teamName?: string): Player[] {
  if (!teamName) return mockPlayers
  return mockPlayers.filter((player) => player.team === teamName)
}

export function getFreeAgents(): Player[] {
  return mockPlayers.filter((player) => player.status === "free")
}

export function getAnnouncementsByType(type?: string): Announcement[] {
  if (!type) return mockAnnouncements
  return mockAnnouncements.filter((announcement) => announcement.type === type)
}

export const availableGames = [
  "Rocket League",
  "Valorant",
  "Counter-Strike 2",
  "League of Legends",
  "Overwatch 2",
  "Apex Legends",
]