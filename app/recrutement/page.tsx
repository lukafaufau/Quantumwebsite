"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { availableGames, mockTeams } from "@/lib/data"
import { Send, UserPlus, AlertCircle, CheckCircle, Trophy, Users } from "lucide-react"

const availableRoles = [
  "Attaquant",
  "Défenseur",
  "Support",
  "Capitaine",
  "Duelist",
  "Controller",
  "Initiator",
  "Sentinel",
  "AWPer",
  "Entry Fragger",
  "IGL (In-Game Leader)",
  "Rifler",
  "Lurker",
]

export default function RecruitmentPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: "",
    discord_id: "",
    role: "",
    game: "",
    message: "",
    experience: "",
    availability: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    if (user) {
      setFormData((prev) => ({
        ...prev,
        username: user.username,
        discord_id: user.discord_id,
      }))
    }
  }, [user, isAuthenticated, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/recruitment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (result.success) {
        setSubmitted(true)
      } else {
        console.error("Failed to submit application:", result.error)
        // In real app, show error message to user
      }
    } catch (error) {
      console.error("Error submitting application:", error)
      // In real app, show error message to user
    }

    setIsSubmitting(false)
  }

  const resetForm = () => {
    setFormData({
      username: user?.username || "",
      discord_id: user?.discord_id || "",
      role: "",
      game: "",
      message: "",
      experience: "",
      availability: "",
    })
    setSubmitted(false)
  }

  if (!isAuthenticated || !user) {
    return null
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />

        <main className="flex-1 flex items-center justify-center py-12 px-4">
          <Card className="w-full max-w-md text-center">
            <CardContent className="py-8">
              <div className="mx-auto mb-4 p-3 bg-green-500/10 rounded-full w-fit">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <h2 className="text-2xl font-heading font-bold mb-4">Candidature envoyée !</h2>
              <p className="text-muted-foreground mb-6">
                Votre candidature a été transmise à nos équipes. Vous recevrez une réponse sous 48-72 heures.
              </p>
              <div className="space-y-2">
                <Button onClick={resetForm} className="w-full">
                  Nouvelle candidature
                </Button>
                <Button variant="outline" onClick={() => router.push("/profil")} className="w-full">
                  Voir mes candidatures
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>

        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-8 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-8">
            <h1 className="text-4xl font-heading font-bold mb-4">Recrutement</h1>
            <p className="text-lg text-muted-foreground">
              Rejoignez l'une de nos équipes compétitives et participez aux plus grands tournois esport.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Application Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <UserPlus className="h-5 w-5 mr-2" />
                    Formulaire de candidature
                  </CardTitle>
                  <CardDescription>Remplissez ce formulaire pour postuler à nos équipes</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="username">Nom d'utilisateur</Label>
                        <Input
                          id="username"
                          value={formData.username}
                          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                          required
                          disabled
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="discord_id">Discord ID</Label>
                        <Input
                          id="discord_id"
                          value={formData.discord_id}
                          onChange={(e) => setFormData({ ...formData, discord_id: e.target.value })}
                          required
                          placeholder="VotrePseudo#1234"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="game">Jeu</Label>
                        <Select
                          value={formData.game}
                          onValueChange={(value) => setFormData({ ...formData, game: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez un jeu" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableGames.map((game) => (
                              <SelectItem key={game} value={game}>
                                {game}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="role">Rôle recherché</Label>
                        <Select
                          value={formData.role}
                          onValueChange={(value) => setFormData({ ...formData, role: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez un rôle" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableRoles.map((role) => (
                              <SelectItem key={role} value={role}>
                                {role}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="experience">Expérience esport</Label>
                      <Textarea
                        id="experience"
                        placeholder="Décrivez votre expérience dans l'esport, vos précédentes équipes, tournois, etc."
                        value={formData.experience}
                        onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="availability">Disponibilités</Label>
                      <Textarea
                        id="availability"
                        placeholder="Indiquez vos créneaux de disponibilité pour les entraînements et tournois"
                        value={formData.availability}
                        onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                        rows={2}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message de motivation</Label>
                      <Textarea
                        id="message"
                        placeholder="Expliquez pourquoi vous souhaitez rejoindre Quantum et ce que vous pouvez apporter à l'équipe"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        required
                        rows={4}
                      />
                    </div>

                    <div className="bg-muted/50 p-4 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
                        <div className="text-sm">
                          <p className="font-medium mb-1">Informations importantes :</p>
                          <ul className="space-y-1 text-muted-foreground">
                            <li>• Les candidatures sont traitées sous 48-72 heures</li>
                            <li>• Un entretien Discord peut être organisé</li>
                            <li>• Les tryouts sont obligatoires pour certaines équipes</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>Envoi en cours...</>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Envoyer ma candidature
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Teams Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Trophy className="h-5 w-5 mr-2" />
                    Nos équipes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {mockTeams.map((team) => (
                    <div key={team.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{team.name}</p>
                        <p className="text-xs text-muted-foreground">{team.game}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        <Users className="h-3 w-3 mr-1" />
                        {team.members.length}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Requirements */}
              <Card>
                <CardHeader>
                  <CardTitle>Prérequis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>Niveau compétitif confirmé</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>Disponibilité régulière</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>Esprit d'équipe</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>Communication Discord</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact */}
              <Card>
                <CardHeader>
                  <CardTitle>Besoin d'aide ?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">Des questions sur le processus de recrutement ?</p>
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    Contacter le staff
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
