import { Router } from "express";
import { prisma } from "../services/prisma";
import { Role } from "@prisma/client";

const router = Router();

function isValidEmail(email: unknown): email is string {
  return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

router.post("/", async (req, res) => {
  try {
    const { email, name, role, clubId } = req.body;

    // Validaciones mínimas
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: "email inválido" });
    }
    if (!name || typeof name !== "string") {
      return res.status(400).json({ error: "name requerido (string)" });
    }
    // role opcional: si viene, debe ser uno del enum
    if (role && !Object.values(Role).includes(role)) {
      return res.status(400).json({ error: `role inválido. Valores: ${Object.values(Role).join(", ")}` });
    }
    // clubId opcional: si viene, debe ser número
    if (clubId !== undefined && typeof clubId !== "number") {
      return res.status(400).json({ error: "clubId debe ser número" });
    }

    const user = await prisma.user.create({
      data: {
        email,
        name,
        role: role ?? Role.DELEGADO,
        clubId: clubId ?? null,
      },
    });

    res.status(201).json(user);
  } catch (e: any) {
    // Prisma unique violation (email/club name duplicado, etc.)
    if (e?.code === "P2002") {
      return res.status(409).json({ error: "email ya existe" });
    }
    res.status(400).json({ error: e?.message ?? "Error creando usuario" });
  }
});

router.get("/", async (_req, res) => {
  const users = await prisma.user.findMany({ include: { club: true } });
  res.json(users);
});

export default router;
