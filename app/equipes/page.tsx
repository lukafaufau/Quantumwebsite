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

export default function TeamsPage() {
  const [teams, setTeams] = useState<any[]>([])
  const [selectedGame, setSelectedGame] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")

  // 🔄 Charger les équipes depuis l'API au chargement de la page
  useEffect(() => {
    fetch("/api/teams")
      .then(res => res.json())
      .then(data => {
        if (data.success) setTeams(data.data)
      })
      .catch(err => console.error("Erreur fetch teams:", err))
  }, [])

  const filteredTeams = teams.filter(team => {
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
          {/* … ici tu gardes tout le rendu des cartes comme avant … */}
          {filteredTeams.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">Aucune équipe trouvée avec ces filtres.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTeams.map(team => (
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
                    <div className="flex items-center space-x-2">
                      <Crown className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Capitaine:</span>
                      <span className="text-sm text-muted-foreground">{team.captain}</span>
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
