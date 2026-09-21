import { Router } from 'express';
import { prisma } from '../../shared/prisma/client.js';

export const routesRouter = Router();

// Consulta pública de rutas e itinerarios (RF03)
routesRouter.get('/', async (req, res) => {
  try {
    const routes = await prisma.route.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, data: routes });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});
