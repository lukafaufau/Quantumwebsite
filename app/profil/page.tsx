"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { User, Edit, Save, X, Shield, Trophy, Calendar } from "lucide-react"
import { mockRecruitments } from "@/lib/data"

export default function ProfilePage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    discord_id: "",
    bio: "",
  })

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    if (user) {
      setFormData({
        username: user.username,
        email: user.email,
        discord_id: user.discord_id,
        bio: "",
      })
    }
  }, [user, isAuthenticated, router])

  const handleSave = () => {
    // In real app, this would update the user in database
    console.log("Saving profile:", formData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    if (user) {
      setFormData({
        username: user.username,
        email: user.email,
        discord_id: user.discord_id,
        bio: "",
      })
    }
    setIsEditing(false)
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      case "developer":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "staff":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20"
      case "player":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
      case "developer":
        return <Shield className="h-4 w-4" />
      default:
        return <User className="h-4 w-4" />
    }
  }

  const userApplications = mockRecruitments.filter((app) => app.username === user?.username)

  if (!isAuthenticated || !user) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-8 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-8">
            <h1 className="text-4xl font-heading font-bold mb-4">Mon Profil</h1>
            <p className="text-lg text-muted-foreground">
              Gérez vos informations personnelles et suivez vos candidatures.
            </p>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">Profil</TabsTrigger>
              <TabsTrigger value="applications">Candidatures</TabsTrigger>
              <TabsTrigger value="stats">Statistiques</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-primary/10 rounded-full">
                        <User className="h-8 w-8 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl">{user.username}</CardTitle>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className={getRoleColor(user.role)}>
                            {getRoleIcon(user.role)}
                            <span className="ml-1 capitalize">{user.role}</span>
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      {isEditing ? (
                        <>
                          <Button size="sm" onClick={handleSave}>
                            <Save className="h-4 w-4 mr-1" />
                            Sauvegarder
                          </Button>
                          <Button size="sm" variant="outline" onClick={handleCancel}>
                            <X className="h-4 w-4 mr-1" />
                            Annuler
                          </Button>
                        </>
                      ) : (
                        <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
                          <Edit className="h-4 w-4 mr-1" />
                          Modifier
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="username">Nom d'utilisateur</Label>
                      <Input
                        id="username"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="discord_id">Discord ID</Label>
                      <Input
                        id="discord_id"
                        value={formData.discord_id}
                        onChange={(e) => setFormData({ ...formData, discord_id: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="role">Rôle</Label>
                      <Input id="role" value={user.role} disabled className="capitalize" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Biographie</Label>
                    <Textarea
                      id="bio"
                      placeholder="Parlez-nous de vous, vos expériences esport, vos objectifs..."
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      disabled={!isEditing}
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="applications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Mes Candidatures</CardTitle>
                  <CardDescription>Suivez l'état de vos candidatures de recrutement</CardDescription>
                </CardHeader>
                <CardContent>
                  {userApplications.length === 0 ? (
                    <div className="text-center py-8">
                      <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-4">Vous n'avez pas encore de candidatures.</p>
                      <Button asChild>
                        <a href="/recrutement">Postuler maintenant</a>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {userApplications.map((application) => (
                        <Card key={application.id} className="border-l-4 border-l-primary">
                          <CardContent className="py-4">
                            <div className="flex items-center justify-between">
                              <div className="space-y-1">
                                <h4 className="font-medium">
                                  {application.role} - {application.game}
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  Candidature envoyée le {new Date(application.date).toLocaleDateString("fr-FR")}
                                </p>
                                {application.message && <p className="text-sm">{application.message}</p>}
                              </div>
                              <Badge
                                variant="outline"
                                className={
                                  application.status === "accepted"
                                    ? "bg-green-500/10 text-green-500 border-green-500/20"
                                    : application.status === "rejected"
                                      ? "bg-red-500/10 text-red-500 border-red-500/20"
                                      : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                                }
                              >
                                {application.status === "pending"
                                  ? "En attente"
                                  : application.status === "accepted"
                                    ? "Acceptée"
                                    : "Refusée"}
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="stats" className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Candidatures</CardTitle>
                    <Trophy className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-primary">{userApplications.length}</div>
                    <p className="text-xs text-muted-foreground">Total envoyées</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Membre depuis</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-primary">Jan 2024</div>
                    <p className="text-xs text-muted-foreground">Date d'inscription</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Statut</CardTitle>
                    <User className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-primary capitalize">{user.role}</div>
                    <p className="text-xs text-muted-foreground">Rôle actuel</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Activité récente</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-muted-foreground">Connexion aujourd'hui</span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="w-2 h-2 bg-muted rounded-full"></div>
                      <span className="text-muted-foreground">Profil créé en janvier 2024</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  )
}
