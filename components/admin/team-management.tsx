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
import { Trophy, Edit, Trash2, Plus, Users, Crown, Search, Filter } from "lucide-react"

interface Team {
  id: number
  name: string
  captain: string
  members: string[]
  game: string
  description?: string
  status?: string
  created_at?: string
}

const availableGames = [
  "Rocket League",
  "Valorant",
  "Counter-Strike 2",
  "League of Legends",
  "Overwatch 2",
  "Apex Legends",
]

const teamStatuses = [
  { value: "active", label: "Active", color: "bg-green-500/10 text-green-500 border-green-500/20" },
  { value: "inactive", label: "Inactive", color: "bg-gray-500/10 text-gray-500 border-gray-500/20" },
  { value: "recruiting", label: "Recrutement", color: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
]

export function TeamManagement() {
  const [teams, setTeams] = useState<Team[]>([])
  const [filteredTeams, setFilteredTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [gameFilter, setGameFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [editingTeam, setEditingTeam] = useState<Team | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newTeam, setNewTeam] = useState<Partial<Team>>({
    name: "",
    captain: "",
    members: [],
    game: "",
    description: "",
    status: "active"
  })

  useEffect(() => {
    fetchTeams()
  }, [])

  useEffect(() => {
    filterTeams()
  }, [teams, searchTerm, gameFilter, statusFilter])

  const filterTeams = () => {
    let filtered = teams

    if (searchTerm) {
      filtered = filtered.filter(team =>
        team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        team.captain.toLowerCase().includes(searchTerm.toLowerCase()) ||
        team.game.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (gameFilter !== "all") {
      filtered = filtered.filter(team => team.game === gameFilter)
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(team => (team.status || "active") === statusFilter)
    }

    setFilteredTeams(filtered)
  }

  const fetchTeams = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/teams")
      const data = await response.json()
      if (data.success) {
        setTeams(data.data || [])
      } else {
        console.error("Erreur API:", data.error)
        setTeams([])
      }
    } catch (error) {
      console.error("Erreur lors du chargement des équipes:", error)
      setTeams([])
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTeam = async () => {
    if (!newTeam.name || !newTeam.captain || !newTeam.game) {
      alert("Veuillez remplir tous les champs obligatoires")
      return
    }

    try {
      const response = await fetch("/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newTeam,
          members: Array.isArray(newTeam.members) ? newTeam.members : [],
          created_at: new Date().toISOString(),
        }),
      })

      const result = await response.json()
      if (result.success) {
        await fetchTeams()
        setIsCreateDialogOpen(false)
        setNewTeam({ name: "", captain: "", members: [], game: "", description: "", status: "active" })
        alert("Équipe créée avec succès!")
      } else {
        console.error("Erreur:", result.error)
        alert("Erreur lors de la création de l'équipe: " + (result.error || "Erreur inconnue"))
      }
    } catch (error) {
      console.error("Erreur lors de la création:", error)
      alert("Erreur de connexion lors de la création")
    }
  }

  const handleEditTeam = async (team: Team) => {
    setEditingTeam({ ...team })
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
        alert("Équipe mise à jour avec succès!")
      } else {
        console.error("Erreur:", result.error)
        alert("Erreur lors de la mise à jour de l'équipe: " + (result.error || "Erreur inconnue"))
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error)
      alert("Erreur de connexion lors de la mise à jour")
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
        alert("Équipe supprimée avec succès!")
      } else {
        console.error("Erreur:", result.error)
        alert("Erreur lors de la suppression de l'équipe: " + (result.error || "Erreur inconnue"))
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error)
      alert("Erreur de connexion lors de la suppression")
    }
  }

  const getStatusColor = (status: string) => {
    const statusObj = teamStatuses.find(s => s.value === status)
    return statusObj?.color || "bg-gray-500/10 text-gray-500 border-gray-500/20"
  }

  const getStatusLabel = (status: string) => {
    const statusObj = teamStatuses.find(s => s.value === status)
    return statusObj?.label || status
  }

  const addMemberToNewTeam = (member: string) => {
    if (member.trim() && !newTeam.members?.includes(member.trim())) {
      setNewTeam({
        ...newTeam,
        members: [...(newTeam.members || []), member.trim()]
      })
    }
  }

  const removeMemberFromNewTeam = (member: string) => {
    setNewTeam({
      ...newTeam,
      members: (newTeam.members || []).filter(m => m !== member)
    })
  }

  const addMemberToEditingTeam = (member: string) => {
    if (editingTeam && member.trim() && !editingTeam.members?.includes(member.trim())) {
      setEditingTeam({
        ...editingTeam,
        members: [...(editingTeam.members || []), member.trim()]
      })
    }
  }

  const removeMemberFromEditingTeam = (member: string) => {
    if (editingTeam) {
      setEditingTeam({
        ...editingTeam,
        members: (editingTeam.members || []).filter(m => m !== member)
      })
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
              Administrez toutes les équipes de la plateforme ({teams.length} équipes)
            </CardDescription>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-white text-black hover:bg-white/90">
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle équipe
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-black border-white/20 max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-white">Créer une nouvelle équipe</DialogTitle>
                <DialogDescription className="text-white/60">
                  Ajoutez une nouvelle équipe à la plateforme
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-white">
                      Nom de l'équipe *
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
                      Capitaine *
                    </Label>
                    <Input
                      id="captain"
                      value={newTeam.captain}
                      onChange={(e) => setNewTeam({ ...newTeam, captain: e.target.value })}
                      className="bg-white/10 border-white/20 text-white"
                      placeholder="Nom du capitaine"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="game" className="text-white">
                      Jeu *
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
                    <Label htmlFor="status" className="text-white">
                      Statut
                    </Label>
                    <Select
                      value={newTeam.status}
                      onValueChange={(value) => setNewTeam({ ...newTeam, status: value })}
                    >
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-black border-white/20">
                        {teamStatuses.map((status) => (
                          <SelectItem key={status.value} value={status.value} className="text-white">
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
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
                <div>
                  <Label className="text-white">
                    Membres ({(newTeam.members || []).length})
                  </Label>
                  <div className="space-y-2">
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Nom du membre"
                        className="bg-white/10 border-white/20 text-white"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            addMemberToNewTeam(e.currentTarget.value)
                            e.currentTarget.value = ''
                          }
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="border-white/20 text-white hover:bg-white/10"
                        onClick={(e) => {
                          const input = e.currentTarget.previousElementSibling as HTMLInputElement
                          if (input?.value) {
                            addMemberToNewTeam(input.value)
                            input.value = ''
                          }
                        }}
                      >
                        Ajouter
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {(newTeam.members || []).map((member, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs cursor-pointer hover:bg-red-500/20"
                          onClick={() => removeMemberFromNewTeam(member)}
                        >
                          {member} ×
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setIsCreateDialogOpen(false)}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Annuler
                </Button>
                <Button onClick={handleCreateTeam} className="bg-white text-black hover:bg-white/90">
                  Créer l'équipe
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filtres */}
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
              <Input
                placeholder="Rechercher par nom, capitaine ou jeu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-white/40"
              />
            </div>
          </div>
          <Select value={gameFilter} onValueChange={setGameFilter}>
            <SelectTrigger className="w-full md:w-48 bg-white/5 border-white/20 text-white">
              <SelectValue placeholder="Filtrer par jeu" />
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
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-48 bg-white/5 border-white/20 text-white">
              <SelectValue placeholder="Filtrer par statut" />
            </SelectTrigger>
            <SelectContent className="bg-black border-white/20">
              <SelectItem value="all">Tous les statuts</SelectItem>
              {teamStatuses.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          {filteredTeams.length === 0 ? (
            <div className="text-center py-8">
              <Trophy className="h-12 w-12 text-white/20 mx-auto mb-4" />
              <p className="text-white/60">
                {teams.length === 0 ? "Aucune équipe trouvée" : "Aucune équipe ne correspond aux filtres"}
              </p>
            </div>
          ) : (
            filteredTeams.map((team) => (
              <Card key={team.id} className="border-l-4 border-l-white bg-white/5 border-white/20">
                <CardContent className="py-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center space-x-2 flex-wrap">
                        <h4 className="font-medium text-white">{team.name}</h4>
                        <Badge variant="secondary">{team.game}</Badge>
                        <Badge variant="outline" className={getStatusColor(team.status || "active")}>
                          {getStatusLabel(team.status || "active")}
                        </Badge>
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

                      <div className="flex items-center space-x-4 text-xs text-white/40">
                        {team.created_at && (
                          <span>Créée le {new Date(team.created_at).toLocaleDateString("fr-FR")}</span>
                        )}
                        <span>ID: #{team.id}</span>
                      </div>
                    </div>

                    <div className="flex space-x-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditTeam(team)}
                        className="border-white/20 text-white hover:bg-white/10"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Modifier
                      </Button>

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
            ))
          )}
        </div>
      </CardContent>

      {/* Dialog d'édition */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-black border-white/20 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white">Modifier l'équipe</DialogTitle>
            <DialogDescription className="text-white/60">
              Modifiez les informations de l'équipe
            </DialogDescription>
          </DialogHeader>
          {editingTeam && (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-name" className="text-white">
                    Nom de l'équipe *
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
                    Capitaine *
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
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-game" className="text-white">
                    Jeu *
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
                  <Label htmlFor="edit-status" className="text-white">
                    Statut
                  </Label>
                  <Select
                    value={editingTeam.status || "active"}
                    onValueChange={(value) =>
                      setEditingTeam({ ...editingTeam, status: value })
                    }
                  >
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-white/20">
                      {teamStatuses.map((status) => (
                        <SelectItem key={status.value} value={status.value} className="text-white">
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
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
              <div>
                <Label className="text-white">
                  Membres ({(editingTeam.members || []).length})
                </Label>
                <div className="space-y-2">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Nom du membre"
                      className="bg-white/10 border-white/20 text-white"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addMemberToEditingTeam(e.currentTarget.value)
                          e.currentTarget.value = ''
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10"
                      onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement
                        if (input?.value) {
                          addMemberToEditingTeam(input.value)
                          input.value = ''
                        }
                      }}
                    >
                      Ajouter
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {(editingTeam.members || []).map((member, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="text-xs cursor-pointer hover:bg-red-500/20"
                        onClick={() => removeMemberFromEditingTeam(member)}
                      >
                        {member} ×
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsEditDialogOpen(false)}
              className="border-white/20 text-white hover:bg-white/10"
            >
              Annuler
            </Button>
            <Button onClick={handleUpdateTeam} className="bg-white text-black hover:bg-white/90">
              Sauvegarder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}