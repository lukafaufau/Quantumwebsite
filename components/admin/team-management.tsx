"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Trophy, Edit, Trash2, Plus, Users, Crown } from "lucide-react"

interface Team {
  id: number
  name: string
  captain: string
  members: string[]
  game: string
  description?: string
  status?: string
}

const availableGames = [
  "Rocket League",
  "Valorant",
  "Counter-Strike 2",
  "League of Legends",
  "Overwatch 2",
  "Apex Legends",
]

export function TeamManagement() {
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [editingTeam, setEditingTeam] = useState<Team | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newTeam, setNewTeam] = useState<Partial<Team>>({
    name: "",
    captain: "",
    members: [],
    game: "",
    description: "",
  })

  useEffect(() => {
    fetchTeams()
  }, [])

  const fetchTeams = async () => {
    try {
      const response = await fetch("/api/teams")
      const data = await response.json()
      if (data.success) {
        setTeams(data.data || [])
      }
    } catch (error) {
      console.error("Erreur lors du chargement des équipes:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTeam = async () => {
    try {
      const response = await fetch("/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newTeam,
          members: newTeam.members || [],
          created_at: new Date().toISOString(),
        }),
      })

      const result = await response.json()
      if (result.success) {
        await fetchTeams()
        setIsCreateDialogOpen(false)
        setNewTeam({ name: "", captain: "", members: [], game: "", description: "" })
      } else {
        console.error("Erreur:", result.error)
        alert("Erreur lors de la création de l'équipe")
      }
    } catch (error) {
      console.error("Erreur lors de la création:", error)
    }
  }

  const handleEditTeam = async (team: Team) => {
    setEditingTeam(team)
    setIsEditDialogOpen(true)
  }

  const handleUpdateTeam = async () => {
    if (!editingTeam) return

    try {
      const response = await fetch(`/api/teams/${editingTeam.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingTeam),
      })

      const result = await response.json()
      if (result.success) {
        await fetchTeams()
        setIsEditDialogOpen(false)
        setEditingTeam(null)
      } else {
        console.error("Erreur:", result.error)
        alert("Erreur lors de la mise à jour de l'équipe")
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error)
    }
  }

  const handleDeleteTeam = async (teamId: number) => {
    try {
      const response = await fetch(`/api/teams/${teamId}`, {
        method: "DELETE",
      })

      const result = await response.json()
      if (result.success) {
        await fetchTeams()
      } else {
        console.error("Erreur:", result.error)
        alert("Erreur lors de la suppression de l'équipe")
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-8 text-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
        Chargement des équipes...
      </div>
    )
  }

  return (
    <Card className="bg-black border-white/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white flex items-center space-x-2">
              <Trophy className="h-5 w-5" />
              <span>Gestion des équipes</span>
            </CardTitle>
            <CardDescription className="text-white/60">
              Administrez toutes les équipes de la plateforme
            </CardDescription>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-white text-black hover:bg-white/90">
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle équipe
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-black border-white/20">
              <DialogHeader>
                <DialogTitle className="text-white">Créer une nouvelle équipe</DialogTitle>
                <DialogDescription className="text-white/60">
                  Ajoutez une nouvelle équipe à la plateforme
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-white">
                    Nom de l'équipe
                  </Label>
                  <Input
                    id="name"
                    value={newTeam.name}
                    onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                    placeholder="Nom de l'équipe"
                  />
                </div>
                <div>
                  <Label htmlFor="captain" className="text-white">
                    Capitaine
                  </Label>
                  <Input
                    id="captain"
                    value={newTeam.captain}
                    onChange={(e) => setNewTeam({ ...newTeam, captain: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                    placeholder="Nom du capitaine"
                  />
                </div>
                <div>
                  <Label htmlFor="game" className="text-white">
                    Jeu
                  </Label>
                  <Select
                    value={newTeam.game}
                    onValueChange={(value) => setNewTeam({ ...newTeam, game: value })}
                  >
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Sélectionnez un jeu" />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-white/20">
                      {availableGames.map((game) => (
                        <SelectItem key={game} value={game} className="text-white">
                          {game}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="description" className="text-white">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={newTeam.description}
                    onChange={(e) => setNewTeam({ ...newTeam, description: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                    placeholder="Description de l'équipe"
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleCreateTeam} className="bg-white text-black hover:bg-white/90">
                  Créer l'équipe
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {teams.map((team) => (
            <Card key={team.id} className="border-l-4 border-l-white bg-white/5 border-white/20">
              <CardContent className="py-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-white">{team.name}</h4>
                      <Badge variant="secondary">{team.game}</Badge>
                      <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                        <Users className="h-3 w-3 mr-1" />
                        {team.members?.length || 0} membres
                      </Badge>
                    </div>

                    <div className="flex items-center space-x-2 text-sm">
                      <Crown className="h-4 w-4 text-yellow-400" />
                      <span className="text-white/60">Capitaine:</span>
                      <span className="text-white">{team.captain}</span>
                    </div>

                    {team.description && (
                      <p className="text-sm text-white/60">{team.description}</p>
                    )}

                    {team.members && team.members.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {team.members.map((member, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {member}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-2 ml-4">
                    <Dialog
                      open={isEditDialogOpen && editingTeam?.id === team.id}
                      onOpenChange={setIsEditDialogOpen}
                    >
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditTeam(team)}
                          className="border-white/20 text-white hover:bg-white/10"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Modifier
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-black border-white/20">
                        <DialogHeader>
                          <DialogTitle className="text-white">Modifier l'équipe</DialogTitle>
                          <DialogDescription className="text-white/60">
                            Modifiez les informations de l'équipe
                          </DialogDescription>
                        </DialogHeader>
                        {editingTeam && (
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="edit-name" className="text-white">
                                Nom de l'équipe
                              </Label>
                              <Input
                                id="edit-name"
                                value={editingTeam.name}
                                onChange={(e) =>
                                  setEditingTeam({ ...editingTeam, name: e.target.value })
                                }
                                className="bg-white/10 border-white/20 text-white"
                              />
                            </div>
                            <div>
                              <Label htmlFor="edit-captain" className="text-white">
                                Capitaine
                              </Label>
                              <Input
                                id="edit-captain"
                                value={editingTeam.captain}
                                onChange={(e) =>
                                  setEditingTeam({ ...editingTeam, captain: e.target.value })
                                }
                                className="bg-white/10 border-white/20 text-white"
                              />
                            </div>
                            <div>
                              <Label htmlFor="edit-game" className="text-white">
                                Jeu
                              </Label>
                              <Select
                                value={editingTeam.game}
                                onValueChange={(value) =>
                                  setEditingTeam({ ...editingTeam, game: value })
                                }
                              >
                                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-black border-white/20">
                                  {availableGames.map((game) => (
                                    <SelectItem key={game} value={game} className="text-white">
                                      {game}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="edit-description" className="text-white">
                                Description
                              </Label>
                              <Textarea
                                id="edit-description"
                                value={editingTeam.description || ""}
                                onChange={(e) =>
                                  setEditingTeam({ ...editingTeam, description: e.target.value })
                                }
                                className="bg-white/10 border-white/20 text-white"
                                rows={3}
                              />
                            </div>
                          </div>
                        )}
                        <DialogFooter>
                          <Button onClick={handleUpdateTeam} className="bg-white text-black hover:bg-white/90">
                            Sauvegarder
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="destructive">
                          <Trash2 className="h-4 w-4 mr-1" />
                          Supprimer
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-black border-white/20">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-white">Confirmer la suppression</AlertDialogTitle>
                          <AlertDialogDescription className="text-white/60">
                            Êtes-vous sûr de vouloir supprimer l'équipe "{team.name}" ? Cette action est
                            irréversible.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="border-white/20 text-white hover:bg-white/10">
                            Annuler
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteTeam(team.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Supprimer
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {teams.length === 0 && (
            <div className="text-center py-8">
              <Trophy className="h-12 w-12 text-white/20 mx-auto mb-4" />
              <p className="text-white/60">Aucune équipe trouvée</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}