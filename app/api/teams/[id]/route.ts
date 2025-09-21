import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs/promises";
import path from "path";

const TEAMS_FILE = path.join(process.cwd(), "data", "teams.json");

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  let teams = [];
  try {
    const file = await fs.readFile(TEAMS_FILE, "utf-8");
    teams = JSON.parse(file);
  } catch {
    teams = [];
  }

  const id = parseInt(req.query.id as string);
  const teamIndex = teams.findIndex(t => t.id === id);
  if (teamIndex === -1) return res.status(404).json({ success: false, message: "Équipe non trouvée" });

  if (req.method === "PUT") {
    const updates = req.body;
    teams[teamIndex] = { ...teams[teamIndex], ...updates };
    await fs.writeFile(TEAMS_FILE, JSON.stringify(teams, null, 2));
    return res.status(200).json({ success: true, data: teams[teamIndex] });
  }

  if (req.method === "DELETE") {
    const removed = teams.splice(teamIndex, 1);
    await fs.writeFile(TEAMS_FILE, JSON.stringify(teams, null, 2));
    return res.status(200).json({ success: true, data: removed[0] });
  }

  res.setHeader("Allow", ["PUT", "DELETE"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
