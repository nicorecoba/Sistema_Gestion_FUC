import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import usersRouter from "./routes/users.routes";
import clubsRouter from "./routes/clubs.routes";
import { prisma } from "./services/prisma";

const app = express();

app.use(express.json());
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(",") || true }));

app.get("/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: "ok", db: "reachable" });
  } catch {
    res.status(500).json({ status: "error", db: "unreachable" });
  }
});

app.use("/users", usersRouter);
app.use("/clubs", clubsRouter);

const PORT = Number(process.env.PORT) || 4000;
app.listen(PORT, () => console.log(`API FUC escuchando en :${PORT}`));
