"use client"

import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Star } from "lucide-react"
import { useState, useEffect } from "react"

export default function CreditsPage() {
  const { user } = useAuth()
  const [content, setContent] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editableContent, setEditableContent] = useState<any>(null)

  useEffect(() => {
    fetch("/api/content?page=credits")
      .then(res => res.json())
      .then(data => {
        setContent(data)
        setEditableContent(data)
      })
      .catch(() => {
        const defaultContent = {
          hero: {
            title: "Crédits",
            subtitle: "Merci à toutes les personnes qui ont contribué au succès de Nemesis Esports.",
          },
          team: [
            { name: "Wayzze", role: "Fondateur" },
            { name: "16k", role: "Dev" },
          ],
        }
        setContent(defaultContent)
        setEditableContent(defaultContent)
      })
  }, [])

  const saveContent = async () => {
    try {
      await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page: "credits", content: editableContent }),
      })
      setContent(editableContent)
      setIsEditing(false)
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error)
    }
  }

  if (!content)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white animate-pulse-slow">Chargement...</div>
      </div>
    )

  return (
    <div className="min-h-screen flex flex-col bg-black text-white font-sans">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 px-4 text-center">
          {(user?.role === "admin" || user?.role === "developer") && (
            <Button
              onClick={() => setIsEditing(!isEditing)}
              className="fixed top-20 right-4 z-40 bg-white/10 hover:bg-white/20 border-white/20"
              size="sm"
            >
              {isEditing ? "Annuler" : "Modifier"}
            </Button>
          )}

          <div className="container mx-auto max-w-4xl">
            {isEditing ? (
              <div className="space-y-4 mb-8">
                <input
                  type="text"
                  value={editableContent.hero?.title || ""}
                  onChange={(e) =>
                    setEditableContent({
                      ...editableContent,
                      hero: { ...editableContent.hero, title: e.target.value },
                    })
                  }
                  className="w-full text-4xl md:text-6xl lg:text-7xl font-heading font-bold bg-transparent border-b border-white/20 text-center text-white placeholder-white/50"
                  placeholder="Titre principal"
                />
                <textarea
                  value={editableContent.hero?.subtitle || ""}
                  onChange={(e) =>
                    setEditableContent({
                      ...editableContent,
                      hero: { ...editableContent.hero, subtitle: e.target.value },
                    })
                  }
                  className="w-full text-lg md:text-xl bg-transparent border border-white/20 rounded p-4 text-center text-white placeholder-white/50 resize-none"
                  rows={3}
                  placeholder="Sous-titre"
                />
                <div className="flex justify-center space-x-4">
                  <Button onClick={saveContent} className="bg-white text-black hover:bg-white/90">
                    Sauvegarder
                  </Button>
                  <Button
                    onClick={() => setIsEditing(false)}
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    Annuler
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold mb-6 leading-tight">
                  {content.hero?.title}
                </h1>
                <p className="text-lg md:text-xl text-white/80 mb-12 max-w-2xl mx-auto leading-relaxed">
                  {content.hero?.subtitle}
                </p>
              </>
            )}
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 px-4 text-center">
          <div className="container mx-auto">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-8 text-glow">
              Équipe Nemesis
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {content.team && content.team.length > 0 ? (
                content.team.map((member: any, i: number) => (
                  <Card key={i} className="bg-black/50 border-white/20 text-center hover-lift transition-all duration-500">
                    <CardHeader>
                      <div className="mx-auto mb-4 p-3 bg-white/10 rounded-full w-fit">
                        <Star className="h-8 w-8 text-white" />
                      </div>
                      <CardTitle className="text-xl text-white">{member.name}</CardTitle>
                      <CardDescription className="text-white/60">{member.role}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-center space-x-2 mt-2">
                        <Button size="sm" className="bg-white text-black hover:bg-white/90">
                          Profil
                        </Button>
                        <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                          Message
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-white/50">Aucun membre trouvé.</p>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
