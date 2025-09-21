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
import { Trophy, Edit, Trash2, Plus, Users, Crown, Search } from "lucide-react"

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
      if (!response.ok) throw new Error("API non disponible")
      const data = await response.json()
      setTeams(data.success ? data.data || [] : [])
    } catch {
      // Données locales par défaut
      setTeams([
        {
          id: 1,
          name: "Équipe Epsilon",
          captain: "Epsilon",
          members: ["Player1", "Player2", "Player3"],
          game: "Rocket League",
          description: "Équipe réservée aux meilleurs joueurs.",
          status: "active",
          created_at: new Date().toISOString()
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTeam = async () => {
    if (!newTeam.name || !newTeam.captain || !newTeam.game) {
      alert("Veuillez remplir tous les champs obligatoires")
      return
    }
    const newId = Math.max(...teams.map(t => t.id), 0) + 1
    const teamData: Team = {
      id: newId,
      name: newTeam.name!,
      captain: newTeam.captain!,
      members: newTeam.members || [],
      game: newTeam.game!,
      description: newTeam.description,
      status: newTeam.status || "active",
      created_at: new Date().toISOString()
    }
    setTeams([...teams, teamData])
    setNewTeam({ name: "", captain: "", members: [], game: "", description: "", status: "active" })
    setIsCreateDialogOpen(false)
    alert("Équipe créée avec succès !")
  }

  const handleEditTeam = (team: Team) => {
    setEditingTeam({ ...team })
    setIsEditDialogOpen(true)
  }

  const handleUpdateTeam = () => {
    if (!editingTeam) return
    const updatedTeams = teams.map(t => t.id === editingTeam.id ? editingTeam : t)
    setTeams(updatedTeams)
    setEditingTeam(null)
    setIsEditDialogOpen(false)
    alert("Équipe mise à jour avec succès !")
  }

  const handleDeleteTeam = (teamId: number) => {
    const updatedTeams = teams.filter(t => t.id !== teamId)
    setTeams(updatedTeams)
    alert("Équipe supprimée avec succès !")
  }

  const getStatusColor = (status: string) => teamStatuses.find(s => s.value === status)?.color || "bg-gray-500/10 text-gray-500 border-gray-500/20"
  const getStatusLabel = (status: string) => teamStatuses.find(s => s.value === status)?.label || status

  const addMemberToNewTeam = (member: string) => {
    if (!member.trim()) return
    setNewTeam({ ...newTeam, members: [...(newTeam.members || []), member.trim()] })
  }

  const removeMemberFromNewTeam = (member: string) => {
    setNewTeam({ ...newTeam, members: (newTeam.members || []).filter(m => m !== member) })
  }

  const addMemberToEditingTeam = (member: string) => {
    if (!editingTeam || !member.trim()) return
    setEditingTeam({ ...editingTeam, members: [...(editingTeam.members || []), member.trim()] })
  }

  const removeMemberFromEditingTeam = (member: string) => {
    if (!editingTeam) return
    setEditingTeam({ ...editingTeam, members: (editingTeam.members || []).filter(m => m !== member) })
  }

  if (loading) return (
    <div className="text-center py-8 text-white">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
      Chargement des équipes...
    </div>
  )

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
              Administrez toutes les équipes ({teams.length})
            </CardDescription>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-white text-black hover:bg-white/90">
                <Plus className="h-4 w-4 mr-2" /> Nouvelle équipe
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-black border-white/20 max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-white">Créer une équipe</DialogTitle>
                <DialogDescription className="text-white/60">Ajoutez une nouvelle équipe</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white">Nom *</Label>
                    <Input
                      value={newTeam.name}
                      onChange={e => setNewTeam({ ...newTeam, name: e.target.value })}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-white">Capitaine *</Label>
                    <Input
                      value={newTeam.captain}
                      onChange={e => setNewTeam({ ...newTeam, captain: e.target.value })}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white">Jeu *</Label>
                    <Select value={newTeam.game} onValueChange={value => setNewTeam({ ...newTeam, game: value })}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white"><SelectValue /></SelectTrigger>
                      <SelectContent className="bg-black border-white/20">
                        {availableGames.map(game => <SelectItem key={game} value={game} className="text-white">{game}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-white">Statut</Label>
                    <Select value={newTeam.status} onValueChange={value => setNewTeam({ ...newTeam, status: value })}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white"><SelectValue /></SelectTrigger>
                      <SelectContent className="bg-black border-white/20">
                        {teamStatuses.map(s => <SelectItem key={s.value} value={s.value} className="text-white">{s.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label className="text-white">Description</Label>
                  <Textarea
                    value={newTeam.description}
                    onChange={e => setNewTeam({ ...newTeam, description: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div>
                  <Label className="text-white">Membres</Label>
                  <div className="flex space-x-2 mb-2">
                    <Input
                      placeholder="Nom membre"
                      className="bg-white/10 border-white/20 text-white"
                      onKeyPress={e => {
                        if (e.key === "Enter") {
                          addMemberToNewTeam(e.currentTarget.value)
                          e.currentTarget.value = ""
                        }
                      }}
                    />
                    <Button onClick={e => {
                      const input = e.currentTarget.previousElementSibling as HTMLInputElement
                      if (input?.value) { addMemberToNewTeam(input.value); input.value = "" }
                    }}>Ajouter</Button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {(newTeam.members || []).map((m,i) => <Badge key={i} variant="outline" className="cursor-pointer" onClick={() => removeMemberFromNewTeam(m)}>{m} ×</Badge>)}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Annuler</Button>
                <Button onClick={handleCreateTeam}>Créer</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col md:flex-row md:space-x-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
            <Input
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/5 border-white/20 text-white"
            />
          </div>
          <Select value={gameFilter} onValueChange={setGameFilter}>
            <SelectTrigger className="w-full md:w-48 bg-white/5 border-white/20 text-white"><SelectValue /></SelectTrigger>
            <SelectContent className="bg-black border-white/20">
              <SelectItem value="all">Tous les jeux</SelectItem>
              {availableGames.map(game => <SelectItem key={game} value={game}>{game}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-48 bg-white/5 border-white/20 text-white"><SelectValue /></SelectTrigger>
            <SelectContent className="bg-black border-white/20">
              <SelectItem value="all">Tous les statuts</SelectItem>
              {teamStatuses.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTeams.map(team => (
            <Card key={team.id} className="bg-white/5 border-white/20">
              <CardHeader className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-white">{team.name}</CardTitle>
                  <CardDescription className="text-white/60">{team.game} • Capitaine: {team.captain}</CardDescription>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {(team.members || []).map((m,i) => <Badge key={i} variant="outline" className="text-white">{m}</Badge>)}
                  </div>
                  <Badge className={`${getStatusColor(team.status || "active")} mt-2`}>{getStatusLabel(team.status || "active")}</Badge>
                </div>
                <div className="flex flex-col space-y-2">
                  <Button size="icon" variant="outline" onClick={() => handleEditTeam(team)}><Edit className="h-4 w-4" /></Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="icon" variant="outline"><Trash2 className="h-4 w-4" /></Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-black border-white/20">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-white">Supprimer l'équipe ?</AlertDialogTitle>
                        <AlertDialogDescription className="text-white/60">Cette action est irréversible.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteTeam(team.id)}>Supprimer</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </CardContent>

      {/* Dialog édition */}
      {editingTeam && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="bg-black border-white/20 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-white">Éditer l'équipe</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">Nom *</Label>
                  <Input
                    value={editingTeam.name}
                    onChange={e => setEditingTeam({ ...editingTeam, name: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div>
                  <Label className="text-white">Capitaine *</Label>
                  <Input
                    value={editingTeam.captain}
                    onChange={e => setEditingTeam({ ...editingTeam, captain: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">Jeu *</Label>
                  <Select value={editingTeam.game} onValueChange={value => setEditingTeam({ ...editingTeam, game: value })}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-black border-white/20">
                      {availableGames.map(game => <SelectItem key={game} value={game}>{game}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-white">Statut</Label>
                  <Select value={editingTeam.status} onValueChange={value => setEditingTeam({ ...editingTeam, status: value })}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-black border-white/20">
                      {teamStatuses.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label className="text-white">Description</Label>
                <Textarea
                  value={editingTeam.description}
                  onChange={e => setEditingTeam({ ...editingTeam, description: e.target.value })}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
              <div>
                <Label className="text-white">Membres</Label>
                <div className="flex space-x-2 mb-2">
                  <Input
                    placeholder="Nom membre"
                    className="bg-white/10 border-white/20 text-white"
                    onKeyPress={e => {
                      if (e.key === "Enter") {
                        addMemberToEditingTeam(e.currentTarget.value)
                        e.currentTarget.value = ""
                      }
                    }}
                  />
                  <Button onClick={e => {
                    const input = e.currentTarget.previousElementSibling as HTMLInputElement
                    if (input?.value) { addMemberToEditingTeam(input.value); input.value = "" }
                  }}>Ajouter</Button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {(editingTeam.members || []).map((m,i) => <Badge key={i} variant="outline" className="cursor-pointer" onClick={() => removeMemberFromEditingTeam(m)}>{m} ×</Badge>)}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Annuler</Button>
              <Button onClick={handleUpdateTeam}>Sauvegarder</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  )
}
