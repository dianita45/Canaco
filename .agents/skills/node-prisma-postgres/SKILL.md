---
name: node-prisma-postgres
description: >-
  Use this skill when developing Node.js backends with Express/Fastify,
  TypeScript, Prisma ORM, and PostgreSQL databases.
---

# Node.js + Prisma + PostgreSQL Skill

Standards for developing robust, production-grade backends with Prisma and PostgreSQL.

## Core Best Practices

1. **Prisma ORM Standards:**
   - Always define explicit models with `@id @default(uuid())` or `@default(autoincrement())`.
   - Maintain timestamps on all entities: `createdAt DateTime @default(now())`, `updatedAt DateTime @updatedAt`.
   - Explicit relational constraints: define `onDelete` cascade or restrict behaviors clearly.
   - Use indexes on search fields (e.g., `title`, `location`, `slug`, `category`).
   - Use database migrations: `npx prisma migrate dev --name <migration_name>`.
   - Provide comprehensive seed scripts in `prisma/seed.ts` for initial test & demo data.

2. **Backend Architecture:**
   - 3-tier layering: `routes/` -> `controllers/` -> `services/` (with Prisma queries).
   - Validation Layer: Always validate request body, params, and queries using **Zod**.
   - Centralized error handling middleware returning standardized JSON responses:
     `{ success: false, message: string, errors?: any }`.
   - Configuration management using `.env` with a schema validator (Zod or dotenv-safe).
