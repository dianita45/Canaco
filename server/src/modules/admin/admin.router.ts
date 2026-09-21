import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../../shared/prisma/client.js';

export const adminRouter = Router();

// Middleware de seguridad de administración: Cualquier fallo responde 404
const adminAuth = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(404).json({ message: 'Not Found' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    if (decoded.role !== 'ADMIN') {
      return res.status(404).json({ message: 'Not Found' });
    }
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(404).json({ message: 'Not Found' });
  }
};

// ==========================================
// CRUD 1: ATRACTIVOS TURÍSTICOS (RF08)
// ==========================================

// Alta
adminRouter.post('/spots', adminAuth, async (req, res) => {
  try {
    const { title, description, category, location, imageUrl, isFeatured } = req.body;
    if (!title || !description || !location) {
      return res.status(400).json({ success: false, message: 'Campos requeridos incompletos' });
    }

    const spot = await prisma.touristSpot.create({
      data: {
        title,
        description,
        category: category || 'ECOTOURISM',
        location,
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
        isFeatured: Boolean(isFeatured),
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: (req as any).user.userId,
        action: 'CREATE_SPOT',
        entity: 'TouristSpot',
        entityId: spot.id,
        details: `Alta de atractivo: ${spot.title}`,
      },
    });

    res.status(201).json({ success: true, data: spot });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Modificación
adminRouter.put('/spots/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, location, imageUrl, isFeatured } = req.body;

    const updated = await prisma.touristSpot.update({
      where: { id },
      data: {
        title,
        description,
        category,
        location,
        imageUrl,
        isFeatured,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: (req as any).user.userId,
        action: 'UPDATE_SPOT',
        entity: 'TouristSpot',
        entityId: id,
        details: `Edición de atractivo: ${updated.title}`,
      },
    });

    res.json({ success: true, data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Baja
adminRouter.delete('/spots/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.touristSpot.delete({ where: { id } });

    await prisma.auditLog.create({
      data: {
        userId: (req as any).user.userId,
        action: 'DELETE_SPOT',
        entity: 'TouristSpot',
        entityId: id,
        details: `Eliminación de atractivo ID: ${id}`,
      },
    });

    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// CRUD 2: EVENTOS Y EXPOSICIONES (RF08)
// ==========================================

// Alta
adminRouter.post('/events', adminAuth, async (req, res) => {
  try {
    const { title, description, location, startDate, endDate, capacityLimit, imageUrl } = req.body;
    if (!title || !description || !location || !startDate || !endDate) {
      return res.status(400).json({ success: false, message: 'Campos requeridos incompletos' });
    }

    const event = await prisma.event.create({
      data: {
        title,
        description,
        location,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        capacityLimit: Number(capacityLimit) || 40,
        imageUrl: imageUrl || null,
        isPublished: true,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: (req as any).user.userId,
        action: 'CREATE_EVENT',
        entity: 'Event',
        entityId: event.id,
        details: `Alta de evento: ${event.title}`,
      },
    });

    res.status(201).json({ success: true, data: event });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Modificación
adminRouter.put('/events/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, location, startDate, endDate, capacityLimit, imageUrl, isPublished } = req.body;

    const updated = await prisma.event.update({
      where: { id },
      data: {
        title,
        description,
        location,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        capacityLimit: capacityLimit ? Number(capacityLimit) : undefined,
        imageUrl,
        isPublished,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: (req as any).user.userId,
        action: 'UPDATE_EVENT',
        entity: 'Event',
        entityId: id,
        details: `Edición de evento: ${updated.title}`,
      },
    });

    res.json({ success: true, data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Baja
adminRouter.delete('/events/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.event.delete({ where: { id } });

    await prisma.auditLog.create({
      data: {
        userId: (req as any).user.userId,
        action: 'DELETE_EVENT',
        entity: 'Event',
        entityId: id,
        details: `Eliminación de evento ID: ${id}`,
      },
    });

    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// CONTROL DE SOLICITUDES DE COMERCIANTES (RF09)
// ==========================================

// Listar todas las solicitudes con datos del comerciante y del evento
adminRouter.get('/requests', adminAuth, async (req, res) => {
  try {
    const requests = await prisma.participationRequest.findMany({
      include: {
        user: { select: { id: true, fullName: true, businessName: true, phone: true, email: true } },
        event: { select: { id: true, title: true, capacityLimit: true, currentAcceptedCount: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: requests });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Aprobar o rechazar solicitud con actualización atómica de cupo
adminRouter.patch('/requests/:id/status', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminRemarks } = req.body;

    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Estado inválido' });
    }

    const currentReq = await prisma.participationRequest.findUnique({
      where: { id },
      include: { event: true },
    });

    if (!currentReq) {
      return res.status(404).json({ success: false, message: 'Solicitud no encontrada' });
    }

    // Verificar cupo si se va a aprobar
    if (status === 'APPROVED' && currentReq.status !== 'APPROVED') {
      if (currentReq.event.currentAcceptedCount >= currentReq.event.capacityLimit) {
        return res.status(400).json({
          success: false,
          message: 'No es posible aprobar: el cupo límite de comerciantes para este evento ha sido alcanzado',
        });
      }
    }

    // Transacción para garantizar consistencia entre solicitud y contador de cupo del evento
    const [updatedRequest] = await prisma.$transaction([
      prisma.participationRequest.update({
        where: { id },
        data: { status, adminRemarks: adminRemarks || null },
      }),
      // Si pasa a APPROVED, incrementar contador de cupo
      ...(status === 'APPROVED' && currentReq.status !== 'APPROVED'
        ? [
            prisma.event.update({
              where: { id: currentReq.eventId },
              data: { currentAcceptedCount: { increment: 1 } },
            }),
          ]
        : []),
      // Si fue revocado de APPROVED a REJECTED, decrementar contador
      ...(status === 'REJECTED' && currentReq.status === 'APPROVED'
        ? [
            prisma.event.update({
              where: { id: currentReq.eventId },
              data: { currentAcceptedCount: { decrement: 1 } },
            }),
          ]
        : []),
    ]);

    await prisma.auditLog.create({
      data: {
        userId: (req as any).user.userId,
        action: status === 'APPROVED' ? 'APPROVE_REQUEST' : 'REJECT_REQUEST',
        entity: 'ParticipationRequest',
        entityId: id,
        details: `Solicitud ${status} para evento: ${currentReq.event.title}. Nota: ${adminRemarks || 'N/A'}`,
      },
    });

    res.json({ success: true, data: updatedRequest });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});
