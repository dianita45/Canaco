# DIRECTRICES OBLIGATORIAS: PROYECTO CANACO SERVYTUR HUAUCHINANGO

Este archivo rige para TODO nuevo chat, asistente o desarrollador que trabaje en este repositorio con Antigravity.
Cualquier modificación a estas directrices debe realizarse de forma estructural y consensuada.

---

## 1. MÁXIMA SEGURIDAD Y PRIVACIDAD (REGLA INQUEBRANTABLE)
- **Panel de Administración 100% Oculto:**
  - NADIE ajeno a la administración institucional debe saber de la existencia de un panel administrativo.
  - NUNCA incluir enlaces, botones, textos o referencias al panel de control en el Navbar público, Footer ni menús de usuario.
  - La ruta administrativa NO debe llamarse `/admin`. Debe permanecer ofuscada (definida en `ADMIN_SECRET_ROUTE`).
  - Todo intento de acceso no autenticado o no autorizado a endpoints administrativos debe responder con código `404 Not Found` (simulación de inexistencia), NUNCA con `401` ni `403`.
  - El desbloqueo visual en el portal público se realiza exclusivamente mediante la combinación de teclas reservada `Ctrl + Shift + A` con solicitud de clave maestra.
- **Cifrado de Credenciales (RNF06):**
  - Todas las contraseñas DEBEN ser hasheadas con `bcrypt` (mínimo 10 rondas de salt). NUNCA almacenar contraseñas en texto plano.
- **Protección de Datos Institucionales:**
  - Todas las variables sensibles (`DATABASE_URL`, `JWT_SECRET`, `ADMIN_PRESET_PASSWORD`) residen en `.env` y jamás deben exponerse en el cliente.

---

## 2. ARQUITECTURA POR FUNCIONES (FEATURE-DRIVEN ARCHITECTURE)
Tanto en Frontend como en Backend, el código debe organizarse ESTRICTAMENTE por módulos o funciones:

### Frontend (`client/src/`):
- `src/features/<modulo>/components/` (ej. `tourism`, `events`, `routes`, `participation`, `auth`, `admin`).
- `src/shared/` (componentes globales reutilizables como `Navbar`, `Footer`, `Hero` y tipos compartidos en `types/index.ts`).
- PROHIBIDO crear carpetas genéricas desordenadas en la raíz de `src/`.

### Backend (`server/src/`):
- `src/modules/<modulo>/` (ej. `modules/tourism/tourism.router.ts`, `modules/events/events.router.ts`).
- `src/shared/` (instancia de `prisma/client.ts`, middlewares comunes de seguridad y auth).

---

## 3. IDENTIDAD VISUAL Y ESTÁNDARES DE DISEÑO
- Paleta institucional obligatoria:
  - Azul Marino Institucional: `#0d2c54` (Headers, footers, botones corporativos).
  - Naranja Sierra: `#f05423` (Títulos destacados, buscador, botones de cartelera y acciones principales).
  - Verde Ecoturismo: `#289643` (Botón del Módulo Turismo y badges).
- El diseño debe replicar fielmente el prototipo aprobado:
  - Hero con paisaje de presas y tipografía imponente "DESCUBRE LA SIERRA NORTE DE PUEBLA".
  - Buscador flotante centrado en el Hero.
  - Requisitos de accesibilidad WCAG 2.1 AA (contrastes legibles, enfoque accesible por teclado).

---

## 4. BASE DE DATOS Y TRAZABILIDAD
- Gestor oficial: **PostgreSQL en Supabase**.
- ORM: **Prisma ORM**.
- Toda acción administrativa crítica (creación, edición, eliminación o cambio de estado de solicitudes de comerciantes) DEBE registrarse en la tabla `AuditLog` para auditoría pública/gubernamental.
