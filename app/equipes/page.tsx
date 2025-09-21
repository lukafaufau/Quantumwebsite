"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Users, Crown, Search, UserPlus, X, Star, Calendar, MessageCircle } from "lucide-react"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog"

interface Team {
  id: number
  name: string
  captain: string
  game: string
  members: string[]
  description?: string
  status?: "open" | "closed"
  rank?: number
  achievements?: string[]
  lastEvent?: string
}

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([])
  const [selectedGame, setSelectedGame] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [openModal, setOpenModal] = useState(false)
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null)

  useEffect(() => {
    fetch("/api/teams")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setTeams(data.data)
      })
      .catch((err) => console.error("Failed to fetch teams:", err))
  }, [])

  const filteredTeams = teams.filter((team) => {
    const matchesGame = selectedGame === "all" || team.game === selectedGame
    const matchesSearch =
      !searchTerm ||
      team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.captain.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.members.some((m) => m.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesGame && matchesSearch
  })

  const handleDetails = (team: Team) => {
    setCurrentTeam(team)
    setOpenModal(true)
  }

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Navbar />

      <main className="flex-1 py-10 px-4">
        <div className="container mx-auto">
          {/* Header */}
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-heading font-bold mb-2">Équipes Nemesis</h1>
            <p className="text-lg text-gray-400">
              Découvrez toutes nos équipes, leurs membres et leurs statistiques.
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
                className="pl-10 bg-black border border-gray-700 text-white"
              />
            </div>

            <Select value={selectedGame} onValueChange={setSelectedGame}>
              <SelectTrigger className="w-full sm:w-48 bg-black border border-gray-700 text-white">
                <SelectValue placeholder="Tous les jeux" />
              </SelectTrigger>
              <SelectContent className="bg-black text-white border border-gray-700">
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
            <Card className="bg-black border border-gray-700">
              <CardContent className="py-8 text-center text-gray-500">
                Aucune équipe trouvée avec ces filtres.
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTeams.map((team) => {
                const allMembers = [team.captain, ...team.members.filter((m) => m !== team.captain)]
                return (
                  <Card
                    key={team.id}
                    className="bg-black border border-gray-700 hover:shadow-xl hover:scale-105 transition-transform duration-200"
                  >
                    <CardHeader className="flex flex-col gap-2">
                      {/* Team Header */}
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xl font-bold text-white">{team.name}</CardTitle>
                        <Badge className={`${team.status === "open" ? "bg-green-600" : "bg-red-600"} text-white`}>
                          {team.status === "open" ? "Ouvert" : "Fermé"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-400">
                        <Users className="h-4 w-4" /> {allMembers.length} membres
                        {team.rank && (
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-400" /> {team.rank}
                          </div>
                        )}
                        {team.lastEvent && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" /> {team.lastEvent}
                          </div>
                        )}
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-3">
                      {team.description && (
                        <p className="text-gray-400 line-clamp-2">{team.description}</p>
                      )}

                      {/* Members List */}
                      <div className="flex flex-wrap gap-2">
                        {allMembers.map((member, index) => (
                          <div
                            key={member}
                            className={`flex items-center gap-1 px-2 py-1 rounded-md text-sm ${
                              index === 0
                                ? "font-bold text-yellow-400 border border-gray-700"
                                : "text-white border border-gray-700"
                            }`}
                            title={index === 0 ? "Capitaine" : "Membre"}
                          >
                            {index === 0 ? <Crown className="h-4 w-4" /> : <Users className="h-3 w-3" />}
                            {member}
                          </div>
                        ))}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-3">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 border-white text-white hover:bg-gray-800 hover:text-white transition-colors"
                          onClick={() => handleDetails(team)}
                        >
                          Voir détails
                        </Button>
                        <Button
                          size="sm"
                          className="flex-1 bg-white text-black hover:bg-gray-200 hover:text-black transition-colors"
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
        </div>
      </main>

      <Footer />

      {/* Modal Details */}
      {currentTeam && (
        <Dialog open={openModal} onOpenChange={setOpenModal}>
          <DialogContent className="bg-black text-white rounded-xl max-w-lg w-full p-6 border border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">{currentTeam.name}</DialogTitle>
              <DialogDescription className="text-gray-400 mb-4 flex items-center gap-2">
                <Calendar className="h-4 w-4" /> {currentTeam.game}
              </DialogDescription>
              <DialogClose asChild>
                <Button className="absolute top-4 right-4 p-1 rounded-full bg-black border border-gray-700 hover:bg-gray-800">
                  <X className="h-4 w-4 text-white" />
                </Button>
              </DialogClose>
            </DialogHeader>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {/* Capitaine */}
              <div className="p-3 rounded-md bg-black border border-gray-700 flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-yellow-400">
                  <Crown className="h-5 w-5" /> Capitaine
                </div>
                <span>{currentTeam.captain}</span>
              </div>

              {/* Membres */}
              <div className="p-3 rounded-md bg-black border border-gray-700">
                <div className="flex items-center gap-2 font-semibold mb-2">
                  <Users className="h-4 w-4" /> Membres
                </div>
                <div className="flex flex-wrap gap-2">
                  {currentTeam.members.map((member) => (
                    <div
                      key={member}
                      className="flex items-center gap-1 px-2 py-1 rounded-md text-sm text-white bg-black border border-gray-700"
                    >
                      <Users className="h-3 w-3" /> {member}
                    </div>
                  ))}
                </div>
              </div>

              {/* Achievements */}
              {currentTeam.achievements && currentTeam.achievements.length > 0 && (
                <div className="p-3 rounded-md bg-black border border-gray-700">
                  <div className="flex items-center gap-2 font-semibold mb-2">
                    <Star className="h-4 w-4 text-yellow-400" /> Achievements
                  </div>
                  <ul className="list-disc list-inside text-gray-400">
                    {currentTeam.achievements.map((ach, idx) => (
                      <li key={idx}>{ach}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Description */}
              {currentTeam.description && (
                <div className="p-3 rounded-md bg-black border border-gray-700">
                  <div className="flex items-center gap-2 font-semibold mb-2">
                    <MessageCircle className="h-4 w-4" /> Description
                  </div>
                  <p className="text-gray-400">{currentTeam.description}</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
