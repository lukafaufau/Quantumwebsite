"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Users, Crown, Search, UserPlus, X } from "lucide-react"
import Link from "next/link"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog"

interface Team {
  id: number
  name: string
  captain: string
  game: string
  members: string[]
  description?: string
  status?: string
  maxMembers?: number
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

  const filteredTeams = teams.filter(team => {
    const matchesGame = selectedGame === "all" || team.game === selectedGame
    const matchesSearch = !searchTerm ||
      team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.captain.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.members.some(m => m.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesGame && matchesSearch
  })

  const openTeamModal = (team: Team) => {
    setCurrentTeam(team)
    setOpenModal(true)
  }

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Navbar />

      <main className="flex-1 py-12 px-6 md:px-12">
        <div className="container mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-2">Équipes Nemesis</h1>
            <p className="text-gray-400 text-lg">Découvrez nos équipes compétitives et leurs membres talentueux.</p>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-10 justify-center items-center">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher une équipe..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-black border border-gray-700 text-white placeholder-gray-500"
              />
            </div>

            <Select value={selectedGame} onValueChange={setSelectedGame}>
              <SelectTrigger className="w-full sm:w-48 bg-black border border-gray-700 text-white">
                <SelectValue placeholder="Tous les jeux" />
              </SelectTrigger>
              <SelectContent className="bg-black text-white border border-gray-700">
                <SelectItem value="all">Tous les jeux</SelectItem>
                {[...new Set(teams.map(t => t.game))].map(game => (
                  <SelectItem key={game} value={game}>{game}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Teams Grid */}
          {filteredTeams.length === 0 ? (
            <Card className="bg-black border border-gray-700 text-center py-12">
              <CardDescription className="text-gray-500">Aucune équipe trouvée avec ces filtres.</CardDescription>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTeams.map(team => {
                const allMembers = [team.captain, ...team.members.filter(m => m !== team.captain)]
                return (
                  <Card key={team.id} className="bg-black border border-gray-700 hover:shadow-xl transition-shadow rounded-xl">
                    <CardHeader className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-2xl font-bold">{team.name}</CardTitle>
                        <Badge className="bg-gray-900 text-white border border-gray-700">{team.game}</Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Users className="h-4 w-4" /> {allMembers.length}{team.maxMembers ? `/${team.maxMembers}` : ""} membres
                        {team.status && (
                          <Badge className={`ml-2 text-sm ${team.status === "ouvert" ? "text-green-400" : "text-red-500"} bg-gray-900 border border-gray-700`}>
                            {team.status === "ouvert" ? "Recrutement ouvert" : "Recrutement fermé"}
                          </Badge>
                        )}
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {team.description && (
                        <CardDescription className="text-gray-300 line-clamp-3">{team.description}</CardDescription>
                      )}

                      <div className="flex flex-wrap gap-2">
                        {allMembers.map((member, i) => (
                          <div
                            key={member}
                            className={`flex items-center gap-1 px-3 py-1 rounded-md text-sm ${
                              i === 0 ? "font-bold text-yellow-400" : "text-white"
                            } bg-gray-900 hover:bg-gray-800 transition-colors cursor-default`}
                            title={i === 0 ? "Capitaine" : "Membre"}
                          >
                            {i === 0 ? <Crown className="h-4 w-4" /> : <Users className="h-3 w-3" />}
                            {member}
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2 pt-3">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 border border-white text-white hover:bg-gray-900 transition-colors"
                          onClick={() => openTeamModal(team)}
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

          {/* Call to Action */}
          <div className="mt-16 text-center">
            <Card className="bg-black border border-gray-700">
              <CardContent className="py-10">
                <h3 className="text-3xl font-bold mb-4 text-white">Envie de rejoindre une équipe ?</h3>
                <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
                  Postulez dès maintenant pour intégrer l'une de nos équipes compétitives et participez aux plus grands tournois esport.
                </p>
                <Button size="lg" className="bg-white text-black hover:bg-gray-200 hover:text-black transition-colors">
                  <Link href="/recrutement">Postuler maintenant</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />

      {/* Modal */}
      {currentTeam && (
        <Dialog open={openModal} onOpenChange={setOpenModal}>
          <DialogContent className="bg-black text-white rounded-2xl max-w-lg w-full p-6 border border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-3xl font-bold">{currentTeam.name}</DialogTitle>
              <DialogDescription className="text-gray-400 mb-4">{currentTeam.game}</DialogDescription>
              <DialogClose asChild>
                <Button className="absolute top-4 right-4 p-1 rounded-full bg-gray-900 hover:bg-gray-800 border border-gray-700">
                  <X className="h-4 w-4 text-white" />
                </Button>
              </DialogClose>
            </DialogHeader>

            <div className="space-y-5 max-h-96 overflow-y-auto">
              <div className="p-4 rounded-lg bg-gray-900 border border-gray-700">
                <h4 className="font-semibold text-yellow-400 flex items-center gap-2 mb-2">
                  <Crown className="h-5 w-5" /> Capitaine
                </h4>
                <p>{currentTeam.captain}</p>
              </div>

              <div className="p-4 rounded-lg bg-gray-900 border border-gray-700">
                <h4 className="font-semibold text-white mb-2">Membres</h4>
                <div className="flex flex-wrap gap-2">
                  {currentTeam.members.map(member => (
                    <div
                      key={member}
                      className="flex items-center gap-1 px-2 py-1 rounded-md text-sm text-white bg-gray-900 border border-gray-700"
                      title="Membre"
                    >
                      <Users className="h-3 w-3" /> {member}
                    </div>
                  ))}
                </div>
              </div>

              {currentTeam.description && (
                <div className="p-4 rounded-lg bg-gray-900 border border-gray-700">
                  <h4 className="font-semibold text-white mb-2">Description</h4>
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
