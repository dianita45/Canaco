-- ==========================================================
-- BASE DE DATOS INSTITUCIONAL: CANACO SERVYTUR HUAUCHINANGO
-- Gestor: PostgreSQL 14+ / Compatible con Prisma ORM
-- Estándares de Seguridad y Auditoría Gubernamental
-- ==========================================================

CREATE SCHEMA IF NOT EXISTS "public";

-- 1. TIPOS ENUMERADOS
CREATE TYPE "Role" AS ENUM ('ADMIN', 'MERCHANT');
CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
CREATE TYPE "SpotCategory" AS ENUM ('WATERFALL', 'RIVER', 'HILL', 'HISTORIC', 'DAM', 'ECOTOURISM');

-- 2. TABLA: USUARIOS (Comerciantes y Administradores Preestablecidos)
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL, -- Hash seguro Bcrypt/Argon2 (RNF06)
    "fullName" TEXT NOT NULL,
    "businessName" TEXT,      -- Nombre del negocio local
    "phone" TEXT,
    "role" "Role" NOT NULL DEFAULT 'MERCHANT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- 3. TABLA: ZONAS Y ATRACTIVOS TURÍSTICOS (RF01, RF03)
CREATE TABLE "tourist_spots" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" "SpotCategory" NOT NULL DEFAULT 'ECOTOURISM',
    "location" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "imageUrl" TEXT,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tourist_spots_pkey" PRIMARY KEY ("id")
);

-- 4. TABLA: CARTELERA DE EVENTOS Y EXPOSICIONES (RF02)
CREATE TABLE "events" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL, -- Sede oficial
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "capacityLimit" INTEGER NOT NULL DEFAULT 50,    -- Cupo límite para comerciantes
    "currentAcceptedCount" INTEGER NOT NULL DEFAULT 0,
    "imageUrl" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- 5. TABLA: RUTAS E ITINERARIOS (RF03)
CREATE TABLE "routes" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL DEFAULT 'Moderada',
    "duration" TEXT NOT NULL,
    "stops" TEXT NOT NULL,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "routes_pkey" PRIMARY KEY ("id")
);

-- 6. TABLA: SOLICITUDES DE PARTICIPACIÓN A EVENTOS (RF07, RF09)
CREATE TABLE "participation_requests" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "notes" TEXT,        -- Detalle de productos / dimensiones
    "standType" TEXT,    -- Artesanías, Gastronomía, Comercio
    "status" "RequestStatus" NOT NULL DEFAULT 'PENDING',
    "adminRemarks" TEXT, -- Justificación o instrucciones al comerciante
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "participation_requests_pkey" PRIMARY KEY ("id")
);

-- 7. TABLA: BITÁCORA DE AUDITORÍA Y TRAZABILIDAD (RNF Seguridad & Gov)
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "action" TEXT NOT NULL, -- CREATE, UPDATE, DELETE, APPROVE, REJECT
    "entity" TEXT NOT NULL, -- TouristSpot, Event, ParticipationRequest
    "entityId" TEXT,
    "details" TEXT,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- ÍNDICES Y RESTRICCIONES DE INTEGRIDAD
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX "participation_requests_userId_eventId_key" ON "participation_requests"("userId", "eventId");

-- LLAVES FORÁNEAS (RELACIONES)
ALTER TABLE "participation_requests" ADD CONSTRAINT "participation_requests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "participation_requests" ADD CONSTRAINT "participation_requests_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- ==========================================================
-- REGISTROS SEMILLA INICIALES (DATOS REALES HUAUCHINANGO)
-- ==========================================================

-- Administrador preestablecido institucional (RF01 / RF06 Admin)
-- Password cifrado con Bcrypt ("AdminCanaco2026!")
INSERT INTO "users" ("id", "email", "password", "fullName", "role", "createdAt", "updatedAt")
VALUES (
    'usr-admin-initial',
    'admin@canaco-huauchinango.org',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    'Administrador Institucional CANACO',
    'ADMIN',
    NOW(),
    NOW()
) ON CONFLICT ("email") DO NOTHING;

-- Atractivos Turísticos de la Sierra Norte
INSERT INTO "tourist_spots" ("id", "title", "description", "category", "location", "imageUrl", "isFeatured", "createdAt", "updatedAt")
VALUES
(
    'spot-1',
    'Presa de Tenango de las Flores',
    'Paisaje libre, paseos en lancha, comida tradicional y mercado de plantas de ornato.',
    'DAM',
    'Tenango de las Flores, Huauchinango',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    true,
    NOW(),
    NOW()
),
(
    'spot-2',
    'Centro Histórico de Huauchinango',
    'Paisaje libre, arquitectura colonial, comida tradicional serrana y parroquia de la Asunción.',
    'HISTORIC',
    'Huauchinango, Puebla',
    'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    true,
    NOW(),
    NOW()
),
(
    'spot-3',
    'Presa Nuevo Necaxa',
    'Paisaje libre, paseos en lancha, comida tradicional y vista al imponente embalse hidroeléctrico.',
    'DAM',
    'Nuevo Necaxa, Sierra Norte',
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80',
    true,
    NOW(),
    NOW()
) ON CONFLICT ("id") DO NOTHING;

-- Evento Oficial CANACO
INSERT INTO "events" ("id", "title", "description", "location", "startDate", "endDate", "capacityLimit", "currentAcceptedCount", "isPublished", "createdAt", "updatedAt")
VALUES
(
    'evt-1',
    'Feria de las Flores Huauchinango 2026',
    'Gran expo comercial, floricultores de la región, muestras gastronómicas y pabellón artesanal.',
    'Recinto Ferial de Huauchinango',
    '2026-10-10 10:00:00',
    '2026-10-18 22:00:00',
    40,
    15,
    true,
    NOW(),
    NOW()
) ON CONFLICT ("id") DO NOTHING;
