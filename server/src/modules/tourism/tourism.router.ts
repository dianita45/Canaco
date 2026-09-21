import { Router } from 'express';
import { prisma } from '../../shared/prisma/client.js';

export const tourismRouter = Router();

// RF01 / RF03: Consulta pública de atractivos turísticos
tourismRouter.get('/', async (req, res) => {
  try {
    const spots = await prisma.touristSpot.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: spots });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});
