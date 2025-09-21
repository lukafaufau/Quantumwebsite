"use client"

import { useState } from "react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Crown, Search, UserPlus, UserCheck, UserX, MessageCircle } from "lucide-react"
import { mockTeams, mockPlayers, availableGames, getPlayersByTeam, getFreeAgents } from "@/lib/data"

export default function TeamsAndPlayersPage() {
  const [selectedGame, setSelectedGame] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")

  /** Filtrage des joueurs selon jeu / recherche / statut */
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

  /** Icônes et couleurs selon le statut */
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <UserCheck className="h-4 w-4 text-green-500" />
      case "free":
        return <UserX className="h-4 w-4 text-yellow-500" />
      case "inactive":
        return <Users className="h-4 w-4 text-gray-500" />
      default:
        return <Users className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "free":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "inactive":
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
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

  /** Affichage des membres d'une équipe */
  const renderTeamMembers = (team: typeof mockTeams[number]) =>
    team.members.map((member) => {
      const isCaptain = member === team.captain
      return (
        <Badge
          key={member}
          variant={isCaptain ? "secondary" : "outline"}
          className="flex items-center gap-1 text-xs"
        >
          {isCaptain ? <Crown className="h-3 w-3 text-yellow-400" /> : <Users className="h-3 w-3 text-muted-foreground" />}
          {member}
        </Badge>
      )
    })

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-8 px-4">
        <div className="container mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-heading font-bold mb-2">Communauté Nemesis</h1>
            <p className="text-lg text-muted-foreground">
              Découvrez nos équipes, leurs membres et profils détaillés.
            </p>
          </div>

          {/* Filtres */}
          <div className="mb-8 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un joueur ou équipe..."
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

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Tous les statuts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="active">En équipe</SelectItem>
                <SelectItem value="free">Agent libre</SelectItem>
                <SelectItem value="inactive">Inactif</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tabs pour Joueurs */}
          <Tabs defaultValue="players" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="players">Joueurs</TabsTrigger>
              <TabsTrigger value="teams">Équipes</TabsTrigger>
            </TabsList>

            {/* Joueurs */}
            <TabsContent value="players" className="space-y-6">
              {filteredPlayers.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center">
                    <p className="text-muted-foreground">Aucun joueur trouvé.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPlayers.map((player) => (
                    <Card key={player.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <CardTitle className="text-lg">{player.username}</CardTitle>
                        <Badge variant="outline" className={getStatusColor(player.status)}>
                          {getStatusIcon(player.status)}
                          <span className="ml-1">{getStatusText(player.status)}</span>
                        </Badge>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Rôle:</span>
                            <span className="font-medium">{player.role}</span>
                          </div>
                          {player.game && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Jeu:</span>
                              <Badge variant="secondary" className="text-xs">{player.game}</Badge>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Équipe:</span>
                            <span className="font-medium">{player.team || "Aucune"}</span>
                          </div>
                          {player.discord_id && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Discord:</span>
                              <span className="font-mono text-xs">{player.discord_id}</span>
                            </div>
                          )}
                        </div>

                        {/* Boutons détails + contacter */}
                        <div className="flex gap-2 pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => {
                              alert(
                                `Profil: ${player.username}\nRôle: ${player.role}\nJeu: ${player.game || "Non spécifié"}\nÉquipe: ${player.team || "Aucune"}\nStatut: ${getStatusText(player.status)}\nDiscord: ${player.discord_id || "Non renseigné"}`
                              )
                            }}
                          >
                            <Users className="h-4 w-4 mr-1" /> Détails
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => {
                              alert(player.discord_id ? `Contactez ${player.username}: ${player.discord_id}` : "Aucun Discord renseigné")
                            }}
                          >
                            <MessageCircle className="h-4 w-4 mr-1" /> Contacter
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Équipes */}
            <TabsContent value="teams" className="space-y-6">
              {mockTeams.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center">
                    <p className="text-muted-foreground">Aucune équipe disponible.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mockTeams.map((team) => {
                    const teamPlayers = getPlayersByTeam(team.name)
                    return (
                      <Card key={team.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="space-y-2">
                              <CardTitle className="text-xl">{team.name}</CardTitle>
                              <Badge variant="secondary">{team.game}</Badge>
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Users className="h-4 w-4 mr-1" />
                              {team.members.length}
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent className="space-y-4">
                          {team.description && <p className="text-sm text-muted-foreground">{team.description}</p>}

                          <div className="space-y-2">
                            <span className="text-sm font-medium">Membres:</span>
                            <div className="flex flex-wrap gap-1">
                              {team.members.map((member) => {
                                const isCaptain = member === team.captain
                                return (
                                  <Badge
                                    key={member}
                                    variant={isCaptain ? "secondary" : "outline"}
                                    className="flex items-center gap-1 text-xs"
                                  >
                                    {isCaptain ? (
                                      <Crown className="h-3 w-3 text-yellow-400" />
                                    ) : (
                                      <Users className="h-3 w-3 text-muted-foreground" />
                                    )}
                                    {member}
                                  </Badge>
                                )
                              })}
                            </div>
                          </div>

                          <div className="pt-2">
                            <span className="text-sm font-medium">Joueurs détaillés:</span>
                            <div className="space-y-1 mt-1">
                              {teamPlayers.map((player) => (
                                <Card key={player.id} className="p-2 border border-muted-foreground/20 hover:shadow-sm">
                                  <div className="flex justify-between text-sm">
                                    <span>{player.username}</span>
                                    <Badge variant="outline" className={getStatusColor(player.status)}>
                                      {getStatusIcon(player.status)}
                                      <span className="ml-1">{getStatusText(player.status)}</span>
                                    </Badge>
                                  </div>
                                </Card>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
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
