import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const TEAMS_FILE = path.join(process.cwd(), "data", "teams.json");

interface Team {
  id: number;
  name: string;
  captain: string;
  members: string[];
  game: string;
  description?: string;
  status: string;
  created_at: string;
  updated_at?: string;
}

async function ensureDataFile() {
  try {
    await fs.access(TEAMS_FILE);
  } catch {
    await fs.mkdir(path.dirname(TEAMS_FILE), { recursive: true });
    await fs.writeFile(TEAMS_FILE, JSON.stringify({ teams: [] }, null, 2));
  }
}

// Récupérer une équipe par ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  await ensureDataFile();
  const id = parseInt(params.id);

  const data = await fs.readFile(TEAMS_FILE, "utf8");
  const teams = JSON.parse(data).teams || [];

  const team = teams.find((t: Team) => t.id === id);
  if (!team) return NextResponse.json({ success: false, error: "Team not found" }, { status: 404 });

  return NextResponse.json({ success: true, data: team });
}

// Mettre à jour une équipe
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  await ensureDataFile();
  const id = parseInt(params.id);
  const updates = await request.json();

  const data = await fs.readFile(TEAMS_FILE, "utf8");
  const teamsData = JSON.parse(data);
  const teams = teamsData.teams || [];

  const index = teams.findIndex((t: Team) => t.id === id);
  if (index === -1) return NextResponse.json({ success: false, error: "Team not found" }, { status: 404 });

  teams[index] = {
    ...teams[index],
    ...updates,
    updated_at: new Date().toISOString(),
  };

  await fs.writeFile(TEAMS_FILE, JSON.stringify({ teams }, null, 2));
  return NextResponse.json({ success: true, data: teams[index] });
}

// Supprimer une équipe
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  await ensureDataFile();
  const id = parseInt(params.id);

  const data = await fs.readFile(TEAMS_FILE, "utf8");
  const teamsData = JSON.parse(data);
  const teams = teamsData.teams || [];

  const newTeams = teams.filter((t: Team) => t.id !== id);
  if (newTeams.length === teams.length) return NextResponse.json({ success: false, error: "Team not found" }, { status: 404 });

  await fs.writeFile(TEAMS_FILE, JSON.stringify({ teams: newTeams }, null, 2));
  return NextResponse.json({ success: true });
}
