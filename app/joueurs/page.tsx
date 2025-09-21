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
import { mockPlayers, availableGames, getFreeAgents } from "@/lib/data"
import { User, Search, MessageCircle, Trophy, UserCheck, UserX } from "lucide-react"

export default function PlayersPage() {
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
        return <UserCheck className="h-4 w-4 text-green-500" />
      case "free":
        return <UserX className="h-4 w-4 text-yellow-500" />
      case "inactive":
        return <User className="h-4 w-4 text-gray-500" />
      default:
        return <User className="h-4 w-4" />
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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-8 px-4">
        <div className="container mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-heading font-bold mb-4">Joueurs Nemesis</h1>
            <p className="text-lg text-muted-foreground">
              Découvrez notre communauté de joueurs talentueux et passionnés.
            </p>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Joueurs actifs</CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{activePlayers.length}</div>
                <p className="text-xs text-muted-foreground">Dans nos équipes</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Agents libres</CardTitle>
                <UserX className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{freeAgents.length}</div>
                <p className="text-xs text-muted-foreground">Disponibles pour recrutement</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Jeux représentés</CardTitle>
                <Trophy className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">
                  {new Set(mockPlayers.map((p) => p.game).filter(Boolean)).size}
                </div>
                <p className="text-xs text-muted-foreground">Différents titres</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="all" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">Tous les joueurs</TabsTrigger>
              <TabsTrigger value="active">En équipe</TabsTrigger>
              <TabsTrigger value="free">Agents libres</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-6">
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher un joueur..."
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

              {/* Players Grid */}
              {filteredPlayers.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center">
                    <p className="text-muted-foreground">Aucun joueur trouvé avec ces filtres.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPlayers.map((player) => (
                    <Card key={player.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <CardTitle className="text-lg">{player.username}</CardTitle>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className={getStatusColor(player.status)}>
                                {getStatusIcon(player.status)}
                                <span className="ml-1">{getStatusText(player.status)}</span>
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Rôle:</span>
                            <span className="font-medium">{player.role}</span>
                          </div>

                          {player.game && (
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Jeu:</span>
                              <Badge variant="secondary" className="text-xs">
                                {player.game}
                              </Badge>
                            </div>
                          )}

                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Équipe:</span>
                            <span className="font-medium">{player.team || "Aucune"}</span>
                          </div>

                          {player.discord_id && (
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Discord:</span>
                              <span className="font-mono text-xs">{player.discord_id}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1 bg-transparent"
                            onClick={() => {
                              // Show player profile modal
                              alert(`Profil de ${player.username}`)
                            }}
                          >
                            <User className="h-4 w-4 mr-1" />
                            Profil
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              // Open Discord or contact modal
                              alert(`Contacter ${player.username} sur Discord: ${player.discord_id}`)
                            }}
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

            <TabsContent value="active">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activePlayers.map((player) => (
                  <Card key={player.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg">{player.username}</CardTitle>
                      <Badge variant="outline" className="w-fit bg-green-500/10 text-green-500 border-green-500/20">
                        <UserCheck className="h-4 w-4 mr-1" />
                        En équipe
                      </Badge>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Équipe:</span>
                          <span className="font-medium">{player.team}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Rôle:</span>
                          <span className="font-medium">{player.role}</span>
                        </div>
                        {player.game && (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Jeu:</span>
                            <Badge variant="secondary" className="text-xs">
                              {player.game}
                            </Badge>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="free">
              <div className="mb-6">
                <Card className="bg-yellow-500/5 border-yellow-500/20">
                  <CardContent className="py-4">
                    <p className="text-sm text-yellow-600 dark:text-yellow-400">
                      <Trophy className="h-4 w-4 inline mr-2" />
                      Ces joueurs sont disponibles pour rejoindre une équipe !
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {freeAgents.map((player) => (
                  <Card key={player.id} className="hover:shadow-lg transition-shadow border-yellow-500/20">
                    <CardHeader>
                      <CardTitle className="text-lg">{player.username}</CardTitle>
                      <Badge variant="outline" className="w-fit bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                        <UserX className="h-4 w-4 mr-1" />
                        Agent libre
                      </Badge>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Rôle:</span>
                          <span className="font-medium">{player.role}</span>
                        </div>
                        {player.game && (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Jeu:</span>
                            <Badge variant="secondary" className="text-xs">
                              {player.game}
                            </Badge>
                          </div>
                        )}
                      </div>

                      <Button size="sm" className="w-full">
                        onClick={() => {
                          // Open contact modal for free agent
                          alert(`Contacter ${player.username} - Agent libre`)
                        }}
                      >
                        <MessageCircle className="h-4 w-4 mr-1" />
                        Contacter
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  )
}
