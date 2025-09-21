"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { isAdmin } from "@/lib/auth";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trophy, Trash2 } from "lucide-react";

type Team = {
  id: number;
  name: string;
  active: boolean;
  recruiting: boolean;
};

export default function AdminTeamsPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  const [teams, setTeams] = useState<Team[]>([]);
  const [newTeamName, setNewTeamName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) return router.push("/login");
    if (!isAdmin(user)) return router.push("/");
    fetchTeams();
  }, [user, isAuthenticated, router]);

  const fetchTeams = async () => {
    setLoading(true);
    const res = await fetch("/api/teams");
    const data = await res.json();
    if (data.success) setTeams(data.data);
    setLoading(false);
  };

  const addTeam = async () => {
    if (!newTeamName.trim()) return;
    const res = await fetch("/api/teams", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newTeamName.trim() }),
    });
    const data = await res.json();
    if (data.success) {
      setTeams([data.data, ...teams]);
      setNewTeamName("");
    }
  };

  const toggleActive = async (team: Team) => {
    const res = await fetch(`/api/teams/${team.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !team.active }),
    });
    const data = await res.json();
    if (data.success) fetchTeams();
  };

  const toggleRecruiting = async (team: Team) => {
    const res = await fetch(`/api/teams/${team.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recruiting: !team.recruiting }),
    });
    const data = await res.json();
    if (data.success) fetchTeams();
  };

  const deleteTeam = async (team: Team) => {
    if (!confirm("Supprimer cette équipe ?")) return;
    const res = await fetch(`/api/teams/${team.id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) fetchTeams();
  };

  if (!isAuthenticated || !isAdmin(user)) return null;
  if (loading) return <div className="min-h-screen flex items-center justify-center text-white">Chargement...</div>;

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Navbar />
      <main className="flex-1 py-8 px-4">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-6 flex items-center">
            <Trophy className="h-6 w-6 mr-2" /> Gestion des équipes
          </h1>

          <Card className="mb-6 bg-black/50 border-white/20">
            <CardHeader>
              <CardTitle>Ajouter une équipe</CardTitle>
            </CardHeader>
            <CardContent className="flex space-x-2">
              <Input
                placeholder="Nom de l'équipe"
                value={newTeamName}
                onChange={e => setNewTeamName(e.target.value)}
                className="flex-1 bg-white/10 text-white border-white/20"
              />
              <Button onClick={addTeam}>Ajouter</Button>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teams.map(team => (
              <Card key={team.id} className="bg-black/50 border-white/20">
                <CardHeader className="flex flex-col space-y-1">
                  <CardTitle className="text-white flex items-center justify-between">
                    {team.name}
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleActive(team)}
                        className={`${team.active ? "bg-green-500/20" : "bg-red-500/20"} text-white`}
                      >
                        {team.active ? "Actif" : "Inactif"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleRecruiting(team)}
                        className={`${team.recruiting ? "bg-blue-500/20" : "bg-gray-500/20"} text-white`}
                      >
                        {team.recruiting ? "Recrute" : "Fermé"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteTeam(team)}
                        className="bg-red-500/20 text-white"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/60">
                    Statut: {team.active ? "Actif" : "Inactif"}, Recrutement: {team.recruiting ? "Ouvert" : "Fermé"}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
