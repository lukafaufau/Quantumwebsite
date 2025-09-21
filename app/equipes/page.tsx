"use client"

import { useState } from "react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Users, Crown, Search, UserPlus } from "lucide-react"
import { mockTeams, availableGames } from "@/lib/data"

export default function TeamsPage() {
  const [selectedGame, setSelectedGame] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")

  // Filtrage des équipes
  const filteredTeams = mockTeams.filter((team) => {
    const matchesGame = selectedGame === "all" || team.game === selectedGame
    const matchesSearch =
      !searchTerm ||
      team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.captain.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesGame && matchesSearch
  })

  // Fonction pour afficher les membres avec icônes
  const renderMembers = (team: typeof mockTeams[number]) =>
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
            <h1 className="text-4xl font-heading font-bold mb-2">Équipes Nemesis</h1>
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
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Users className="h-4 w-4 mr-1" />
                        {team.members.length}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {team.description && <CardDescription>{team.description}</CardDescription>}

                    <div className="space-y-2">
                      <span className="text-sm font-medium">Membres:</span>
                      <div className="flex flex-wrap gap-1">{renderMembers(team)}</div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 bg-transparent"
                        onClick={() =>
                          alert(
                            `Équipe: ${team.name}\nCapitaine: ${team.captain}\nJeu: ${team.game}\nMembres: ${team.members.length}\n\nDescription: ${
                              team.description || "Aucune description"
                            }`
                          )
                        }
                      >
                        Voir détails
                      </Button>
                      <Button size="sm" className="flex-1" asChild>
                        <Link href="/recrutement">
                          <UserPlus className="h-4 w-4 mr-1" />
                          Rejoindre
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Call to Action */}
          <div className="mt-12 text-center">
            <Card className="bg-card/50">
              <CardContent className="py-8">
                <h3 className="text-2xl font-heading font-bold mb-4">Envie de rejoindre une équipe ?</h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Postulez dès maintenant pour intégrer l'une de nos équipes compétitives et participez aux plus grands
                  tournois esport.
                </p>
                <Button size="lg" asChild>
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
