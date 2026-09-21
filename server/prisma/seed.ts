import dotenv from 'dotenv';
dotenv.config();
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Sembrando datos institucionales de CANACO Huauchinango...');

  // 1. Administrador institucional preestablecido (RF01 / RF06 Admin)
  const adminPassword = await bcrypt.hash(process.env.ADMIN_PRESET_PASSWORD || 'AdminCanaco2026!', 10);
  const admin = await prisma.user.upsert({
    where: { email: process.env.ADMIN_PRESET_EMAIL || 'admin@canaco-huauchinango.org' },
    update: {},
    create: {
      email: process.env.ADMIN_PRESET_EMAIL || 'admin@canaco-huauchinango.org',
      password: adminPassword,
      fullName: 'Administrador General CANACO',
      role: 'ADMIN',
    },
  });

  // 2. Atractivos Turísticos (RF01)
  await prisma.touristSpot.createMany({
    data: [
      {
        title: 'Presa de Tenango de las Flores',
        description: 'Paisaje libre, paseos en lancha, comida tradicional y mercado de plantas de ornato.',
        category: 'DAM',
        location: 'Tenango de las Flores, Huauchinango',
        imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
        isFeatured: true,
      },
      {
        title: 'Centro Histórico de Huauchinango',
        description: 'Paisaje libre, arquitectura colonial, comida tradicional serrana y parroquia de la Asunción.',
        category: 'HISTORIC',
        location: 'Huauchinango, Puebla',
        imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
        isFeatured: true,
      },
      {
        title: 'Presa Nuevo Necaxa',
        description: 'Paisaje libre, paseos en lancha, comida tradicional y vista al imponente embalse hidroeléctrico.',
        category: 'DAM',
        location: 'Nuevo Necaxa, Sierra Norte',
        imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80',
        isFeatured: true,
      },
    ],
    skipDuplicates: true,
  });

  // 3. Evento Oficial CANACO (RF02)
  await prisma.event.createMany({
    data: [
      {
        title: 'Feria de las Flores Huauchinango 2026',
        description: 'Muestra comercial de floricultura, artesanías y gastronomía de la Sierra Norte.',
        location: 'Recinto Ferial de Huauchinango',
        startDate: new Date('2026-10-10T10:00:00Z'),
        endDate: new Date('2026-10-18T22:00:00Z'),
        capacityLimit: 40,
        currentAcceptedCount: 15,
        isPublished: true,
      },
    ],
    skipDuplicates: true,
  });

  console.log('Semilla completada exitosamente en Supabase.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
