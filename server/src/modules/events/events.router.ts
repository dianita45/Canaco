import { Router } from 'express';
import { prisma } from '../../shared/prisma/client.js';

export const eventsRouter = Router();

// RF02: Cartelera pública de eventos y expos
eventsRouter.get('/', async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      where: { isPublished: true },
      orderBy: { startDate: 'asc' },
    });
    res.json({ success: true, data: events });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});
