import { Router } from 'express';
import { prisma } from '../../shared/prisma/client.js';

export const participationRouter = Router();

// Enviar solicitud de participación a un evento (RF07)
participationRouter.post('/', async (req, res) => {
  try {
    const { userId, eventId, notes, standType } = req.body;

    if (!userId || !eventId) {
      return res.status(400).json({ success: false, message: 'Usuario y evento son requeridos' });
    }

    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) {
      return res.status(404).json({ success: false, message: 'Evento no encontrado' });
    }

    // Verificar si ya envió solicitud
    const existing = await prisma.participationRequest.findUnique({
      where: {
        userId_eventId: { userId, eventId }
      }
    });

    if (existing) {
      return res.status(400).json({ success: false, message: 'Ya has enviado una solicitud para este evento' });
    }

    const request = await prisma.participationRequest.create({
      data: {
        userId,
        eventId,
        notes,
        standType,
        status: 'PENDING'
      }
    });

    res.status(201).json({ success: true, data: request });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Consultar solicitudes del usuario comerciante (RF07 Notificación / Estado)
participationRouter.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const requests = await prisma.participationRequest.findMany({
      where: { userId },
      include: { event: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, data: requests });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});
