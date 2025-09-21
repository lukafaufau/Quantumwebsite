"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Users, Crown, Search, UserPlus } from "lucide-react"
import Link from "next/link"

interface Team {
  id: number
  name: string
  captain: string
  game: string
  members: string[]
  description?: string
  status?: string
}

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([])
  const [selectedGame, setSelectedGame] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")

  // Charger les équipes depuis l'API
  useEffect(() => {
    fetch("/api/teams")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setTeams(data.data)
      })
      .catch((err) => console.error("Failed to fetch teams:", err))
  }, [])

  // Filtrage
  const filteredTeams = teams.filter((team) => {
    const matchesGame = selectedGame === "all" || team.game === selectedGame
    const matchesSearch =
      !searchTerm ||
      team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.captain.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.members.some((m) => m.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesGame && matchesSearch
  })

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      <Navbar />

      <main className="flex-1 py-8 px-4">
        <div className="container mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-heading font-bold mb-2">Équipes Nemesis</h1>
            <p className="text-lg text-gray-400">
              Découvrez nos équipes compétitives et leurs membres talentueux.
            </p>
          </div>

          {/* Filters */}
          <div className="mb-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher une équipe..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-700 text-white"
              />
            </div>

            <Select value={selectedGame} onValueChange={setSelectedGame}>
              <SelectTrigger className="w-full sm:w-48 bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Tous les jeux" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 text-white border-gray-700">
                <SelectItem value="all">Tous les jeux</SelectItem>
                {[...new Set(teams.map((t) => t.game))].map((game) => (
                  <SelectItem key={game} value={game}>
                    {game}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Teams Grid */}
          {filteredTeams.length === 0 ? (
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="py-8 text-center text-gray-400">
                Aucune équipe trouvée avec ces filtres.
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTeams.map((team) => {
                // Liste complète des membres avec le capitaine en premier
                const allMembers = [team.captain, ...team.members.filter((m) => m !== team.captain)]

                return (
                  <Card key={team.id} className="bg-gray-800 border-gray-700 hover:shadow-xl transition-shadow">
                    <CardHeader className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xl font-bold">{team.name}</CardTitle>
                        <Badge variant="secondary">{team.game}</Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Users className="h-4 w-4" /> {allMembers.length} membres
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-3">
                      {team.description && <CardDescription>{team.description}</CardDescription>}

                      <div className="flex flex-wrap gap-2">
                        {allMembers.map((member, index) => (
                          <div
                            key={member}
                            className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs ${
                              index === 0
                                ? "bg-yellow-600/30 text-yellow-300" // capitaine
                                : "bg-gray-700 text-gray-200" // autres membres
                            }`}
                          >
                            {index === 0 ? (
                              <Crown className="h-4 w-4 text-yellow-400" />
                            ) : (
                              <Users className="h-3 w-3 text-gray-400" />
                            )}
                            {member}
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 border-white text-white hover:bg-white hover:text-black transition-colors"
                          onClick={() =>
                            alert(
                              `Équipe: ${team.name}\nCapitaine: ${team.captain}\nJeu: ${team.game}\nMembres: ${allMembers.length}\nDescription: ${
                                team.description || "Aucune description"
                              }`
                            )
                          }
                        >
                          Voir détails
                        </Button>
                        <Button
                          size="sm"
                          className="flex-1 bg-white text-black hover:bg-black hover:text-white transition-colors"
                          asChild
                        >
                          <Link href="/recrutement">
                            <UserPlus className="h-4 w-4 mr-1" />
                            Rejoindre
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}

          {/* Call to Action */}
          <div className="mt-12 text-center">
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="py-8">
                <h3 className="text-2xl font-heading font-bold mb-4">Envie de rejoindre une équipe ?</h3>
                <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
                  Postulez dès maintenant pour intégrer l'une de nos équipes compétitives et participez aux plus grands tournois esport.
                </p>
                <Button
                  size="lg"
                  className="bg-white text-black hover:bg-black hover:text-white transition-colors"
                >
                  <Link href="/recrutement">Postuler maintenant</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
