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

  if (req.method === "GET") {
    return res.status(200).json({ success: true, data: teams });
  }

  if (req.method === "POST") {
    const { name } = req.body;
    if (!name) return res.status(400).json({ success: false, message: "Nom requis" });

    const newTeam = {
      id: Date.now(),
      name,
      active: true,
      recruiting: false,
    };
    teams.push(newTeam);
    await fs.writeFile(TEAMS_FILE, JSON.stringify(teams, null, 2));
    return res.status(201).json({ success: true, data: newTeam });
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
