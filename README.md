# FUC – Backend (API)

API base para el Sistema de Gestión de la Federación Uruguaya de Canotaje (FUC).

## Requisitos
- Docker Desktop (WSL2 activado)
- Node.js 22+
- Git

## Clonar y levantar
`ash
# 1) Clonar
git clone git@github.com:nicorecoba/Sistema_Gestion_FUC.git
cd Sistema_Gestion_FUC

# 2) Variables de entorno
copy .env.example .env

# 3) Docker (DB + Adminer)
docker compose up -d

# 4) Instalar deps
npm i

# 5) Aplicar migraciones y generar cliente
npx prisma generate
npx prisma migrate deploy

# 6) (Opcional) Seed de datos
npm run prisma:seed

# 7) Correr la API
npm run dev
# http://localhost:4000/health  -> { "status": "ok", "db": "reachable" }

subiendo a Develop
