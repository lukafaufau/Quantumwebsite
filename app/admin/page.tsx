"use client";

import { useEffect, useState } from "react";

interface Team {
  id: number;
  name: string;
  captain: string;
  members: string[];
  game: string;
  description?: string;
  status: string;
}

export default function AdminPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [name, setName] = useState("");
  const [captain, setCaptain] = useState("");
  const [game, setGame] = useState("");
  const [description, setDescription] = useState("");

  // Récupérer les équipes
  const fetchTeams = async () => {
    try {
      const res = await fetch("/api/teams");
      const data = await res.json();
      if (data.success) setTeams(data.data);
    } catch (err) {
      console.error("Erreur fetch équipes :", err);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  // Ajouter une équipe
  const addTeam = async () => {
    if (!name || !captain || !game) return alert("Remplis tous les champs");

    try {
      const res = await fetch("/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, captain, game, description }),
      });

      const data = await res.json();
      if (data.success) {
        setTeams([...teams, data.data]);
        setName("");
        setCaptain("");
        setGame("");
        setDescription("");
      }
    } catch (err) {
      console.error("Erreur ajout équipe :", err);
    }
  };

  // Supprimer une équipe
  const deleteTeam = async (id: number) => {
    if (!confirm("Voulez-vous vraiment supprimer cette équipe ?")) return;

    try {
      const res = await fetch(`/api/teams/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) setTeams(teams.filter((t) => t.id !== id));
    } catch (err) {
      console.error("Erreur suppression équipe :", err);
    }
  };

  // Mettre à jour une équipe
  const updateTeam = async (id: number) => {
    const newName = prompt("Nouveau nom de l'équipe :") || "";
    const newCaptain = prompt("Nouveau capitaine :") || "";
    const newGame = prompt("Nouveau jeu :") || "";
    const newDescription = prompt("Nouvelle description :") || "";

    if (!newName || !newCaptain || !newGame) return alert("Tous les champs sont requis");

    try {
      const res = await fetch(`/api/teams/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName,
          captain: newCaptain,
          game: newGame,
          description: newDescription,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setTeams(teams.map((t) => (t.id === id ? data.data : t)));
      }
    } catch (err) {
      console.error("Erreur mise à jour équipe :", err);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Admin - Gestion des équipes</h1>

      <div className="mb-6 space-y-2">
        <input
          placeholder="Nom de l'équipe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border px-2 py-1"
        />
        <input
          placeholder="Capitaine"
          value={captain}
          onChange={(e) => setCaptain(e.target.value)}
          className="border px-2 py-1"
        />
        <input
          placeholder="Jeu"
          value={game}
          onChange={(e) => setGame(e.target.value)}
          className="border px-2 py-1"
        />
        <input
          placeholder="Description (optionnel)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border px-2 py-1"
        />
        <button onClick={addTeam} className="bg-blue-500 text-white px-4 py-2">
          Ajouter
        </button>
      </div>

      <h2 className="text-xl mb-2">Liste des équipes</h2>
      <ul className="space-y-2">
        {teams.map((team) => (
          <li key={team.id} className="flex justify-between items-center border p-2 rounded">
            <div>
              <strong>{team.name}</strong> - {team.captain} ({team.game})
              {team.description && <p className="text-sm text-gray-500">{team.description}</p>}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => updateTeam(team.id)}
                className="bg-yellow-400 px-2 py-1 text-white rounded"
              >
                Modifier
              </button>
              <button
                onClick={() => deleteTeam(team.id)}
                className="bg-red-500 px-2 py-1 text-white rounded"
              >
                Supprimer
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
