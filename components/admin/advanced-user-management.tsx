"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { AdminAPI, type User } from "@/lib/admin-api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Users, UserPlus, Edit, Trash2, Ban, Shield, Search, Download, Eye, Crown, Zap } from "lucide-react"

export function AdvancedUserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  useEffect(() => {
    loadUsers()
  }, [])

  useEffect(() => {
    filterUsers()
  }, [users, searchTerm, roleFilter, statusFilter])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const usersData = await AdminAPI.getUsers()
      setUsers(usersData)
    } catch (error) {
      console.error("Erreur lors du chargement des utilisateurs:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterUsers = () => {
    let filtered = users

    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.discord_id.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (roleFilter !== "all") {
      filtered = filtered.filter((user) => user.role === roleFilter)
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((user) => user.status === statusFilter)
    }

    setFilteredUsers(filtered)
  }

  const handleCreateUser = async (userData: Partial<User>) => {
    try {
      await AdminAPI.createUser(userData)
      await loadUsers()
      setIsCreateDialogOpen(false)
    } catch (error) {
      console.error("Erreur lors de la création:", error)
    }
  }

  const handleUpdateUser = async (userData: Partial<User>) => {
    if (!selectedUser) return
    try {
      await AdminAPI.updateUser(selectedUser.id, userData)
      await loadUsers()
      setIsEditDialogOpen(false)
      setSelectedUser(null)
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error)
    }
  }

  const handleDeleteUser = async (userId: number) => {
    try {
      await AdminAPI.deleteUser(userId)
      await loadUsers()
    } catch (error) {
      console.error("Erreur lors de la suppression:", error)
    }
  }

  const handleBanUser = async (userId: number, reason: string) => {
    try {
      await AdminAPI.banUser(userId, reason)
      await loadUsers()
    } catch (error) {
      console.error("Erreur lors du bannissement:", error)
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Crown className="h-4 w-4" />
      case "developer":
        return <Zap className="h-4 w-4" />
      case "staff":
        return <Shield className="h-4 w-4" />
      default:
        return <Users className="h-4 w-4" />
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      case "developer":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30"
      case "staff":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "banned":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  if (loading) {
    return (
      <Card className="bg-black border-white/20">
        <CardContent className="py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white/60">Chargement des utilisateurs...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-white/20">
          <CardContent className="py-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-400" />
              <div>
                <p className="text-sm text-white/60">Total</p>
                <p className="text-2xl font-bold text-white">{users.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-white/20">
          <CardContent className="py-4">
            <div className="flex items-center space-x-2">
              <Eye className="h-5 w-5 text-green-400" />
              <div>
                <p className="text-sm text-white/60">Actifs</p>
                <p className="text-2xl font-bold text-white">{users.filter((u) => u.status === "active").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-500/10 to-pink-500/10 border-white/20">
          <CardContent className="py-4">
            <div className="flex items-center space-x-2">
              <Ban className="h-5 w-5 text-red-400" />
              <div>
                <p className="text-sm text-white/60">Bannis</p>
                <p className="text-2xl font-bold text-white">{users.filter((u) => u.status === "banned").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500/10 to-violet-500/10 border-white/20">
          <CardContent className="py-4">
            <div className="flex items-center space-x-2">
              <Crown className="h-5 w-5 text-purple-400" />
              <div>
                <p className="text-sm text-white/60">Admins</p>
                <p className="text-2xl font-bold text-white">
                  {users.filter((u) => u.role === "admin" || u.role === "developer").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contrôles */}
      <Card className="bg-black border-white/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Gestion des utilisateurs</span>
              </CardTitle>
              <CardDescription className="text-white/60">
                Administrez tous les comptes utilisateurs de la plateforme
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-white text-black hover:bg-white/90">
                <UserPlus className="h-4 w-4 mr-2" />
                Nouvel utilisateur
              </Button>
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filtres */}
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
                <Input
                  placeholder="Rechercher par nom, email ou Discord..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-white/40"
                />
              </div>
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full md:w-48 bg-white/5 border-white/20 text-white">
                <SelectValue placeholder="Filtrer par rôle" />
              </SelectTrigger>
              <SelectContent className="bg-black border-white/20">
                <SelectItem value="all">Tous les rôles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="developer">Développeur</SelectItem>
                <SelectItem value="staff">Staff</SelectItem>
                <SelectItem value="player">Joueur</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48 bg-white/5 border-white/20 text-white">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent className="bg-black border-white/20">
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="active">Actif</SelectItem>
                <SelectItem value="banned">Banni</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Liste des utilisateurs */}
          <div className="space-y-2">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-200"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="font-medium text-white">{user.username}</p>
                      <Badge className={getRoleBadgeColor(user.role)}>
                        {getRoleIcon(user.role)}
                        <span className="ml-1">{user.role}</span>
                      </Badge>
                      <Badge className={getStatusBadgeColor(user.status || "active")}>{user.status || "active"}</Badge>
                    </div>
                    <p className="text-sm text-white/60">{user.email}</p>
                    <p className="text-xs text-white/40">{user.discord_id}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedUser(user)
                      setIsEditDialogOpen(true)
                    }}
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  {user.status !== "banned" && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-yellow-500/20 text-yellow-400 hover:bg-yellow-500/10 bg-transparent"
                        >
                          <Ban className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-black border-white/20">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-white">Bannir l'utilisateur</AlertDialogTitle>
                          <AlertDialogDescription className="text-white/60">
                            Êtes-vous sûr de vouloir bannir {user.username} ? Cette action peut être annulée.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="bg-white/10 text-white border-white/20">
                            Annuler
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleBanUser(user.id, "Banni par l'administrateur")}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            Bannir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-red-500/20 text-red-400 hover:bg-red-500/10 bg-transparent"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-black border-white/20">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-white">Supprimer l'utilisateur</AlertDialogTitle>
                        <AlertDialogDescription className="text-white/60">
                          Êtes-vous sûr de vouloir supprimer définitivement {user.username} ? Cette action est
                          irréversible.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-white/10 text-white border-white/20">
                          Annuler
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteUser(user.id)}
                          className="bg-red-500 hover:bg-red-600"
                        >
                          Supprimer
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-white/20 mx-auto mb-4" />
              <p className="text-white/60">Aucun utilisateur trouvé</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog de création */}
      <UserFormDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateUser}
        title="Créer un nouvel utilisateur"
        submitText="Créer"
      />

      {/* Dialog d'édition */}
      <UserFormDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSubmit={handleUpdateUser}
        title="Modifier l'utilisateur"
        submitText="Mettre à jour"
        initialData={selectedUser}
      />
    </div>
  )
}

interface UserFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: Partial<User>) => void
  title: string
  submitText: string
  initialData?: User | null
}

function UserFormDialog({ open, onOpenChange, onSubmit, title, submitText, initialData }: UserFormDialogProps) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    discord_id: "",
    role: "player" as User["role"],
    status: "active" as User["status"],
    bio: "",
    games: [] as string[],
  })

  useEffect(() => {
    if (initialData) {
      setFormData({
        username: initialData.username || "",
        email: initialData.email || "",
        discord_id: initialData.discord_id || "",
        role: initialData.role || "player",
        status: initialData.status || "active",
        bio: initialData.bio || "",
        games: initialData.games || [],
      })
    } else {
      setFormData({
        username: "",
        email: "",
        discord_id: "",
        role: "player",
        status: "active",
        bio: "",
        games: [],
      })
    }
  }, [initialData, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black border-white/20 text-white max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="text-white/60">
            {initialData ? "Modifiez les informations de l'utilisateur" : "Créez un nouveau compte utilisateur"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="username" className="text-white">
              Nom d'utilisateur
            </Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="bg-white/5 border-white/20 text-white"
              required
            />
          </div>
          <div>
            <Label htmlFor="email" className="text-white">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="bg-white/5 border-white/20 text-white"
              required
            />
          </div>
          <div>
            <Label htmlFor="discord_id" className="text-white">
              Discord ID
            </Label>
            <Input
              id="discord_id"
              value={formData.discord_id}
              onChange={(e) => setFormData({ ...formData, discord_id: e.target.value })}
              className="bg-white/5 border-white/20 text-white"
              placeholder="Username#0000"
              required
            />
          </div>
          <div>
            <Label htmlFor="role" className="text-white">
              Rôle
            </Label>
            <Select
              value={formData.role}
              onValueChange={(value: User["role"]) => setFormData({ ...formData, role: value })}
            >
              <SelectTrigger className="bg-white/5 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-black border-white/20">
                <SelectItem value="player">Joueur</SelectItem>
                <SelectItem value="staff">Staff</SelectItem>
                <SelectItem value="developer">Développeur</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="status" className="text-white">
              Statut
            </Label>
            <Select
              value={formData.status}
              onValueChange={(value: User["status"]) => setFormData({ ...formData, status: value })}
            >
              <SelectTrigger className="bg-white/5 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-black border-white/20">
                <SelectItem value="active">Actif</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="banned">Banni</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="bio" className="text-white">
              Biographie
            </Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="bg-white/5 border-white/20 text-white"
              placeholder="Biographie de l'utilisateur..."
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-white/20 text-white hover:bg-white/10"
            >
              Annuler
            </Button>
            <Button type="submit" className="bg-white text-black hover:bg-white/90">
              {submitText}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
