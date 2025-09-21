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

  // Récupère les équipes
  const fetchTeams = async () => {
    const res = await fetch("/api/teams");
    const data = await res.json();
    if (data.success) setTeams(data.data);
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  // Ajouter une équipe
  const addTeam = async () => {
    if (!name || !captain || !game) return alert("Remplis tous les champs");

    const res = await fetch("/api/teams", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, captain, game }),
    });

    const data = await res.json();
    if (data.success) {
      setTeams([...teams, data.data]);
      setName("");
      setCaptain("");
      setGame("");
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
        <button onClick={addTeam} className="bg-blue-500 text-white px-4 py-2">
          Ajouter
        </button>
      </div>

      <h2 className="text-xl mb-2">Liste des équipes</h2>
      <ul className="space-y-2">
        {teams.map((team) => (
          <li key={team.id}>
            {team.name} - {team.captain} ({team.game})
          </li>
        ))}
      </ul>
    </div>
  );
}
