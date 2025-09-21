"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Users, Crown, Search, UserPlus } from "lucide-react"
import Link from "next/link"

interface Team {
  id: number
  name: string
  captain: string
  members: string[]
  game: string
  description?: string
  status: string
  created_at: string
}

const availableGames = ["CS:GO", "Valorant", "League of Legends", "Fortnite"]

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([])
  const [selectedGame, setSelectedGame] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")

  // Récupère les équipes depuis l'API
  const fetchTeams = async () => {
    try {
      const res = await fetch("/api/teams")
      const data = await res.json()
      if (data.success) {
        setTeams(data.data)
      }
    } catch (err) {
      console.error("Erreur fetch teams:", err)
    }
  }

  useEffect(() => {
    fetchTeams()
  }, [])

  // Filtrage
  const filteredTeams = teams.filter((team) => {
    const matchesGame = selectedGame === "all" || team.game === selectedGame
    const matchesSearch =
      !searchTerm ||
      team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.captain.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesGame && matchesSearch
  })

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-8 px-4">
        <div className="container mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-heading font-bold mb-4">Équipes Nemesis</h1>
            <p className="text-lg text-muted-foreground">
              Découvrez nos équipes compétitives et leurs membres talentueux.
            </p>
          </div>

          {/* Filters */}
          <div className="mb-8 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher une équipe..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={selectedGame} onValueChange={setSelectedGame}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Tous les jeux" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les jeux</SelectItem>
                {availableGames.map((game) => (
                  <SelectItem key={game} value={game}>
                    {game}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Teams Grid */}
          {filteredTeams.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">Aucune équipe trouvée avec ces filtres.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTeams.map((team) => (
                <Card key={team.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <CardTitle className="text-xl">{team.name}</CardTitle>
                        <Badge variant="secondary">{team.game}</Badge>
                      </div>
                      <div className="text-right text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {team.members.length}
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {team.description && <CardDescription>{team.description}</CardDescription>}

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Crown className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">Capitaine:</span>
                        <span className="text-sm text-muted-foreground">{team.captain}</span>
                      </div>

                      <div className="space-y-1">
                        <span className="text-sm font-medium">Membres:</span>
                        <div className="flex flex-wrap gap-1">
                          {team.members.map((member) => (
                            <Badge key={member} variant="outline" className="text-xs">
                              {member}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
