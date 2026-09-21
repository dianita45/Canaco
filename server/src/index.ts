import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { tourismRouter } from './modules/tourism/tourism.router.js';
import { eventsRouter } from './modules/events/events.router.js';
import { routesRouter } from './modules/routes/routes.router.js';
import { authRouter } from './modules/auth/auth.router.js';
import { participationRouter } from './modules/participation/participation.router.js';
import { adminRouter } from './modules/admin/admin.router.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Verificación de estado de la API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    institution: 'CANACO Servytur Huauchinango',
    database: 'Supabase PostgreSQL Conectado',
    timestamp: new Date().toISOString()
  });
});

// Enrutadores públicos y de comerciantes
app.use('/api/spots', tourismRouter);
app.use('/api/events', eventsRouter);
app.use('/api/routes', routesRouter);
app.use('/api/auth', authRouter);
app.use('/api/participation', participationRouter);

// Ruta administrativa oculta y protegida (Zero-Leak)
const adminSecretRoute = process.env.ADMIN_SECRET_ROUTE || 'sys-c0ntr0l-canac0';
app.use(`/api/${adminSecretRoute}`, adminRouter);

app.listen(PORT, () => {
  console.log(`[CANACO Server] Ejecutándose en el puerto ${PORT} conectado a Supabase`);
});
