"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Crown, Search, UserPlus, UserCheck, UserX, MessageCircle, Trophy } from "lucide-react"
import { mockTeams, mockPlayers, availableGames, getPlayersByTeam, getFreeAgents } from "@/lib/data"

export default function CommunityPage() {
  const [selectedGame, setSelectedGame] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")

  const filteredPlayers = mockPlayers.filter((player) => {
    const matchesGame = selectedGame === "all" || player.game === selectedGame
    const matchesSearch =
      !searchTerm ||
      player.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (player.team && player.team.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = selectedStatus === "all" || player.status === selectedStatus

    return matchesGame && matchesSearch && matchesStatus
  })

  const freeAgents = getFreeAgents()
  const activePlayers = mockPlayers.filter((p) => p.status === "active")

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <UserCheck className="h-4 w-4 text-green-400" />
      case "free":
        return <UserX className="h-4 w-4 text-yellow-400" />
      case "inactive":
        return <Users className="h-4 w-4 text-gray-400" />
      default:
        return <Users className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "free":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "inactive":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "En équipe"
      case "free":
        return "Agent libre"
      case "inactive":
        return "Inactif"
      default:
        return status
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 text-white">
              Communauté Nemesis
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Découvrez nos équipes et joueurs, connectez-vous avec la communauté esport française.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <Card className="glass-effect border-white/10 text-center">
              <CardContent className="py-6">
                <div className="text-2xl font-bold text-white mb-2">{mockTeams.length}</div>
                <div className="text-sm text-white/70">Équipes</div>
              </CardContent>
            </Card>
            <Card className="glass-effect border-white/10 text-center">
              <CardContent className="py-6">
                <div className="text-2xl font-bold text-white mb-2">{activePlayers.length}</div>
                <div className="text-sm text-white/70">Joueurs actifs</div>
              </CardContent>
            </Card>
            <Card className="glass-effect border-white/10 text-center">
              <CardContent className="py-6">
                <div className="text-2xl font-bold text-white mb-2">{freeAgents.length}</div>
                <div className="text-sm text-white/70">Agents libres</div>
              </CardContent>
            </Card>
            <Card className="glass-effect border-white/10 text-center">
              <CardContent className="py-6">
                <div className="text-2xl font-bold text-white mb-2">{availableGames.length}</div>
                <div className="text-sm text-white/70">Jeux</div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="mb-8 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
              <Input
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-white/40"
              />
            </div>

            <Select value={selectedGame} onValueChange={setSelectedGame}>
              <SelectTrigger className="w-full sm:w-48 bg-white/5 border-white/20 text-white">
                <SelectValue placeholder="Tous les jeux" />
              </SelectTrigger>
              <SelectContent className="bg-black border-white/20">
                <SelectItem value="all">Tous les jeux</SelectItem>
                {availableGames.map((game) => (
                  <SelectItem key={game} value={game}>
                    {game}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full sm:w-48 bg-white/5 border-white/20 text-white">
                <SelectValue placeholder="Tous les statuts" />
              </SelectTrigger>
              <SelectContent className="bg-black border-white/20">
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="active">En équipe</SelectItem>
                <SelectItem value="free">Agent libre</SelectItem>
                <SelectItem value="inactive">Inactif</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="teams" className="space-y-8">
            <TabsList className="grid w-full grid-cols-2 bg-white/5 border-white/20">
              <TabsTrigger
                value="teams"
                className="text-white data-[state=active]:bg-white data-[state=active]:text-black"
              >
                <Trophy className="h-4 w-4 mr-2" />
                Équipes
              </TabsTrigger>
              <TabsTrigger
                value="players"
                className="text-white data-[state=active]:bg-white data-[state=active]:text-black"
              >
                <Users className="h-4 w-4 mr-2" />
                Joueurs
              </TabsTrigger>
            </TabsList>

            {/* Teams Tab */}
            <TabsContent value="teams" className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockTeams.map((team) => {
                  const teamPlayers = getPlayersByTeam(team.name)
                  return (
                    <Card key={team.id} className="glass-effect border-white/10 hover-lift">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <CardTitle className="text-xl text-white">{team.name}</CardTitle>
                            <Badge variant="secondary" className="bg-white/10 text-white">
                              {team.game}
                            </Badge>
                          </div>
                          <div className="flex items-center text-sm text-white/60">
                            <Users className="h-4 w-4 mr-1" />
                            {team.members.length}
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        {team.description && (
                          <p className="text-sm text-white/70">{team.description}</p>
                        )}

                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Crown className="h-4 w-4 text-yellow-400" />
                            <span className="text-sm text-white/60">Capitaine:</span>
                            <span className="text-sm text-white font-medium">{team.captain}</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <span className="text-sm font-medium text-white">Membres:</span>
                          <div className="flex flex-wrap gap-1">
                            {team.members.map((member, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="text-xs bg-white/5 text-white border-white/20"
                              >
                                {member === team.captain && <Crown className="h-3 w-3 mr-1 text-yellow-400" />}
                                {member}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </TabsContent>

            {/* Players Tab */}
            <TabsContent value="players" className="space-y-6">
              {filteredPlayers.length === 0 ? (
                <Card className="glass-effect border-white/10">
                  <CardContent className="py-12 text-center">
                    <Users className="h-12 w-12 text-white/20 mx-auto mb-4" />
                    <p className="text-white/60">Aucun joueur trouvé.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPlayers.map((player) => (
                    <Card key={player.id} className="glass-effect border-white/10 hover-lift">
                      <CardHeader className="flex justify-between items-center">
                        <CardTitle className="text-lg text-white">{player.username}</CardTitle>
                        <Badge variant="outline" className={getStatusColor(player.status)}>
                          {getStatusIcon(player.status)}
                          <span className="ml-1">{getStatusText(player.status)}</span>
                        </Badge>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-white/60">Rôle:</span>
                            <span className="text-white font-medium">{player.role}</span>
                          </div>
                          {player.game && (
                            <div className="flex justify-between">
                              <span className="text-white/60">Jeu:</span>
                              <Badge variant="secondary" className="text-xs bg-white/10 text-white">
                                {player.game}
                              </Badge>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span className="text-white/60">Équipe:</span>
                            <span className="text-white font-medium">{player.team || "Aucune"}</span>
                          </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 border-white/20 text-white hover:bg-white/10"
                            onClick={() =>
                              alert(
                                `Profil: ${player.username}\nRôle: ${player.role}\nJeu: ${
                                  player.game || "Non spécifié"
                                }\nÉquipe: ${player.team || "Aucune"}\nStatut: ${getStatusText(player.status)}`
                              )
                            }
                          >
                            <Users className="h-4 w-4 mr-1" /> Profil
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-white/20 text-white hover:bg-white/10"
                            onClick={() =>
                              alert(player.discord_id ? `Contactez ${player.username}: ${player.discord_id}` : "Aucun Discord renseigné")
                            }
                          >
                            <MessageCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  )
}
