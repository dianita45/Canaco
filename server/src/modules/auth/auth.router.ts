import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../shared/prisma/client.js';

export const authRouter = Router();

// Registro exclusivo para comerciantes locales (RF04 / RF05)
authRouter.post('/register', async (req, res) => {
  try {
    const { email, password, fullName, businessName, phone } = req.body;

    if (!email || !password || !fullName) {
      return res.status(400).json({ success: false, message: 'Todos los campos obligatorios deben completarse' });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const existingUser = await prisma.user.findUnique({ where: { email: cleanEmail } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'El correo electrónico ya se encuentra registrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email: cleanEmail,
        password: hashedPassword,
        fullName: String(fullName).trim(),
        businessName: businessName ? String(businessName).trim() : null,
        phone: phone ? String(phone).trim() : null,
        role: 'MERCHANT' // Todo autoregistro es forzado a comerciante
      }
    });

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        businessName: user.businessName,
        role: user.role
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Ocurrió un error al procesar la solicitud' });
  }
});

// Inicio de sesión unificado con verificación criptográfica y obtención de rol
authRouter.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Credenciales incompletas' });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const user = await prisma.user.findUnique({ where: { email: cleanEmail } });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Credenciales de acceso incorrectas' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Credenciales de acceso incorrectas' });
    }

    // Firma de token con rol verificado en base de datos
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '8h' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        businessName: user.businessName,
        role: user.role
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error interno en la autenticación' });
  }
});

// Verificación de sesión e integridad de rol (Protección contra manipulación)
authRouter.get('/me', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'No autenticado' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'secret');

    // Siempre verificar existencia y rol actual en la base de datos
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, fullName: true, businessName: true, role: true }
    });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Sesión no válida' });
    }

    res.json({ success: true, user });
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Token expirado o inválido' });
  }
});
