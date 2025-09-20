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
    name: "Quantum RL",
    captain: "Player1",
    members: ["Player1", "Player2", "Player3"],
    game: "Rocket League",
    description: "Équipe compétitive Rocket League visant le plus haut niveau",
  },
  {
    id: 2,
    name: "Quantum Valorant",
    captain: "FragMaster",
    members: ["FragMaster", "SniperPro", "TacticalAce", "FlashKing", "SmokeGod"],
    game: "Valorant",
    description: "Formation tactique Valorant spécialisée dans les stratégies avancées",
  },
  {
    id: 3,
    name: "Quantum CS2",
    captain: "HeadshotHero",
    members: ["HeadshotHero", "SprayControl", "ClutchMaster", "EntryFragger"],
    game: "Counter-Strike 2",
    description: "Équipe CS2 expérimentée avec de nombreuses victoires en tournoi",
  },
]

export const mockPlayers: Player[] = [
  {
    id: 1,
    username: "Player1",
    role: "Attaquant",
    team: "Quantum RL",
    status: "active",
    game: "Rocket League",
    discord_id: "Player1#1234",
  },
  {
    id: 2,
    username: "Player2",
    role: "Défenseur",
    team: "Quantum RL",
    status: "active",
    game: "Rocket League",
    discord_id: "Player2#5678",
  },
  {
    id: 3,
    username: "FragMaster",
    role: "Duelist",
    team: "Quantum Valorant",
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
    team: "Quantum CS2",
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
      "Participez aux essais Quantum RL pour la prochaine saison. Nous recherchons des joueurs motivés et compétitifs.",
    date: "2024-01-15",
    type: "recruitment",
    game: "Rocket League",
  },
  {
    id: 2,
    title: "Victoire en tournoi Valorant",
    description: "Félicitations à l'équipe Quantum Valorant pour leur victoire au tournoi régional !",
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
  {
    id: 3,
    username: "Player1",
    email: "player1@quantum.gg",
    role: "player" as const,
    discord_id: "Player1#1234",
  },
  {
    id: 4,
    username: "FragMaster",
    email: "fragmaster@quantum.gg",
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
