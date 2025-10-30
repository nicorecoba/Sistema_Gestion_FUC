import { Router } from "express";
import { prisma } from "../services/prisma";

const router = Router();

function isNonEmptyString(x: unknown): x is string {
  return typeof x === "string" && x.trim().length > 0;
}

// Crear club
router.post("/", async (req, res) => {
  try {
    const { name } = req.body;

    if (!isNonEmptyString(name)) {
      return res.status(400).json({ error: "name requerido (string no vacío)" });
    }

    const club = await prisma.club.create({ data: { name: name.trim() } });
    return res.status(201).json(club);
  } catch (e: any) {
    // Nombre único (constraint unique)
    if (e?.code === "P2002") {
      return res.status(409).json({ error: "El club ya existe (name duplicado)" });
    }
    return res.status(400).json({ error: e?.message ?? "Error creando club" });
  }
});

// Listar clubs
router.get("/", async (_req, res) => {
  const clubs = await prisma.club.findMany({
    include: { users: true },
    orderBy: { id: "asc" },
  });
  return res.json(clubs);
});

export default router;
