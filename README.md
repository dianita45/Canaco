# Sistema Integral de Promoción Turística y Gestión Comercial para la Sierra Norte de Puebla
**Organización:** Cámara Nacional de Comercio, Servicios y Turismo de Huauchinango (CANACO SERVYTUR)  
**Proyecto de Residencia Profesional**  
**Área:** Tecnologías de la Información y Desarrollo Web  
**Entorno de Base de Datos:** PostgreSQL en la Nube (Supabase)  
**Periodo:** 2026  

---

## 📌 1. Descripción del Proyecto

El presente proyecto constituye una solución tecnológica desarrollada como proyecto de residencia profesional para **CANACO SERVYTUR Huauchinango**. El propósito principal es dotar a la institución de una plataforma web moderna, accesible y de alta disponibilidad orientada a dos objetivos estratégicos:

1. **Impulso al Ecoturismo y Patrimonio Regional:** Difusión pública del catálogo de atractivos turísticos naturales, cascadas, cerros, presas (Tenango de las Flores, Nuevo Necaxa) y el Centro Histórico de Huauchinango, complementado con rutas e itinerarios sugeridos.
2. **Fomento al Comercio Local y Participación Ciudadana:** Módulo de eventos oficiales (ferias, exposiciones comerciales, muestras gastronómicas) donde comerciantes y artesanos de la región pueden registrarse e interactuar solicitando espacios y stands dentro de los eventos de la cámara.

El sistema fue diseñado bajo una arquitectura modular por funciones (*Feature-Driven Architecture*), asegurando escalabilidad, mantenibilidad y altos estándares de seguridad institucional y protección de datos.

---

## 🏛️ 2. Especificación de Requerimientos Cumplidos

### 2.1 Requerimientos Funcionales (RF)
- **RF01 - Visualización de atractivos:** Consulta abierta del catálogo de zonas y atractivos turísticos con filtros por categoría e información contextual.
- **RF02 - Cartelera de eventos:** Consulta pública de fechas, sedes, horarios y descripciones de ferias y expos comerciales de CANACO.
- **RF03 - Consultar información y vista previa:** Acceso libre a rutas, geolocalización e inspección previa del formulario de participación a eventos para usuarios visitantes.
- **RF04 y RF05 - Registro de comerciantes locales:** Creación y activación de cuentas para productores y comerciantes con validación de datos comerciales.
- **RF06 - Inicio de sesión seguro:** Autenticación de comerciantes para acceder al formulario de solicitud de espacio.
- **RF07 - Solicitud de participación:** Formulario interactivo para postular productos/stands a eventos vigentes y seguimiento de estatus (*Pendiente, Aceptado, Rechazado*).
- **RF08 - Gestión CRUD institucional:** Altas, bajas, modificaciones y consultas protegidas para el mantenimiento del catálogo de atractivos y eventos.
- **RF09 - Control y aprobación de solicitudes:** Módulo para la revisión y dictaminación de postulaciones ciudadanas conforme al cupo límite establecido por evento.

### 2.2 Requerimientos No Funcionales (RNF)
- **RNF01 - Interfaz responsiva:** Diseño bajo metodología *Mobile-First*, adaptable a dispositivos móviles, tabletas y equipos de escritorio.
- **RNF02 - Usabilidad y navegación intuitiva:** Experiencia accesible (WCAG 2.1 AA) para facilitar su operación tanto a ciudadanos como a personal administrativo.
- **RNF03 - Mantenibilidad del software:** Arquitectura modular por funciones y documentación exhaustiva para facilitar futuras extensiones y soporte técnico.
- **RNF04 - Infraestructura y comunicación segura:** Comunicación cliente-servidor mediante peticiones asíncronas HTTPS/REST y persistencia en la nube.
- **RNF05 - Confiabilidad y disponibilidad:** Arquitectura cliente-servidor desacoplada con pool de conexiones tolerante a fallos.
- **RNF06 - Cifrado de credenciales:** Almacenamiento seguro de contraseñas procesadas mediante algoritmo de dispersión unidireccional `bcrypt` con 10 rondas de salt criptográfico.

---

## 🛠️ 3. Stack Tecnológico

| Capa / Componente | Tecnología | Propósito |
| :--- | :--- | :--- |
| **Frontend** | React 18 / 19 + TypeScript | Construcción de interfaces de usuario reactivas y componentes tipados |
| **Herramienta de Construcción** | Vite | Empaquetado optimizado para entornos de desarrollo y producción |
| **Estilos y Diseño Visual** | Tailwind CSS | Sistema de diseño institucional basado en tokens de diseño |
| **Iconografía** | Lucide React | Iconos vectoriales semánticos |
| **Backend API** | Node.js + Express + TypeScript | Servidor de aplicaciones y arquitectura RESTful modular |
| **Gestor de Base de Datos** | PostgreSQL (Supabase) | Base de datos relacional ACID con integridad referencial |
| **ORM / Acceso a Datos** | Prisma ORM | Modelado relacional, tipado estricto y migraciones estructuradas |
| **Seguridad de Acceso** | Bcrypt + JSON Web Tokens (JWT) | Hashing criptográfico de credenciales y autorización por roles |

---

## 📁 4. Arquitectura del Software (Por Funciones / Módulos)

El código fuente se organizó estrictamente separando las responsabilidades en capas funcionales de negocio:

```text
CANACO/
├── client/                               # Aplicación Frontend (Cliente Web)
│   ├── src/
│   │   ├── features/                     # Módulos por función de negocio
│   │   │   ├── tourism/                  # Módulo de Zonas y Atractivos Turísticos
│   │   │   │   └── components/           # TouristSection.tsx
│   │   │   ├── events/                   # Módulo de Cartelera de Eventos
│   │   │   │   └── components/           # EventsSection.tsx
│   │   │   ├── routes/                   # Módulo de Rutas e Itinerarios
│   │   │   │   └── components/           # RoutesSection.tsx
│   │   │   ├── participation/            # Módulo de Solicitudes de Comerciantes
│   │   │   │   └── components/           # ParticipationModal.tsx
│   │   │   ├── auth/                     # Módulo de Acceso y Registro
│   │   │   │   └── components/           # AuthModal.tsx
│   │   │   └── admin/                    # Módulo de Control Administrativo
│   │   │       └── components/           # AdminDashboard.tsx
│   │   ├── shared/                       # Componentes y tipos transversales
│   │   │   ├── components/               # Navbar.tsx, Hero.tsx, Footer.tsx
│   │   │   └── types/                    # Definiciones TypeScript de entidades
│   │   ├── App.tsx                       # Orquestador principal de la vista
│   │   └── main.tsx                      # Punto de entrada de React
│   └── tailwind.config.js                # Paleta cromática oficial de CANACO
│
├── server/                               # Aplicación Backend (API REST)
│   ├── prisma/
│   │   ├── schema.prisma                 # Definición del modelo relacional
│   │   └── seed.ts                       # Script de carga inicial de datos institucionales
│   ├── src/
│   │   ├── modules/                      # Controladores y enrutadores por dominio
│   │   │   ├── tourism/                  # tourism.router.ts
│   │   │   ├── events/                   # events.router.ts
│   │   │   ├── routes/                   # routes.router.ts
│   │   │   ├── participation/            # participation.router.ts
│   │   │   └── auth/                     # auth.router.ts
│   │   ├── shared/                       # Servicios compartidos e infraestructura
│   │   │   ├── prisma/                   # Instancia única del cliente Prisma
│   │   │   └── middlewares/              # Validaciones y control de accesos
│   │   └── index.ts                      # Servidor principal Express
│   └── package.json
│
└── database_schema.sql                   # Esquema DDL en SQL puro para auditoría
```

---

## 🗄️ 5. Modelo de Datos Relacional

La base de datos relacional incluye las siguientes entidades normalizadas:

1. **`users`:** Gestión de cuentas de comerciantes locales y administradores del sistema. Incluye identificación, credenciales hasheadas (`password`), razón social (`businessName`) y rol (`ADMIN` / `MERCHANT`).
2. **`tourist_spots`:** Atractivos naturales y arquitectónicos con categorización (`DAM`, `HISTORIC`, `WATERFALL`, `ECOTOURISM`), ubicación geográfica e imágenes.
3. **`events`:** Ferias, desfiles y exposiciones de CANACO. Controla fechas de inicio/fin, sede, estado de publicación y cupo límite (`capacityLimit` y `currentAcceptedCount`).
4. **`routes`:** Circuitos turísticos con nivel de dificultad, duración estimada y puntos de parada.
5. **`participation_requests`:** Registro de solicitudes emitidas por comerciantes locales para participar en eventos. Mantiene llave foránea hacia el usuario y hacia el evento con restricción de unicidad (`userId`, `eventId`) y estado de aprobación (`PENDING`, `APPROVED`, `REJECTED`).
6. **`audit_logs`:** Bitácora de trazabilidad técnica para registrar operaciones críticas realizadas sobre la plataforma.

---

## 🎨 6. Identidad Visual Institucional

El diseño de interfaces se ajustó a los lineamientos de imagen corporativa aprobados para CANACO Servytur Huauchinango:
- **Azul Marino Institucional (`#0d2c54`):** Encabezados, barra de navegación, pie de página institucional y componentes formales.
- **Naranja Sierra (`#f05423`):** Título principal en cabecera Hero, botón de búsqueda, distintivos de eventos y llamadas a la acción (*Call to Action*).
- **Verde Ecoturismo (`#289643`):** Botón del Módulo de Turismo y etiquetas de atractivos naturales.

---

## 🚀 7. Guía de Instalación y Puesta en Marcha

### Prerrequisitos
- **Node.js** v18.0 o superior instalado en el equipo.
- **NPM** v9.0 o superior.
- Conexión a Internet para la sincronización con la base de datos PostgreSQL en Supabase.

### 7.1 Configuración del Backend (`/server`)

1. Abrir una terminal y posicionarse en el directorio del servidor:
   ```bash
   cd server
   ```

2. Instalar las dependencias de ejecución:
   ```bash
   npm install
   ```

3. Verificar las variables de entorno en el archivo `.env`:
   ```env
   PORT=5000
   NODE_ENV=development
   DATABASE_URL="postgresql://postgres:[PASSWORD]@db.ftsjvwlwzpzuftctcgrt.supabase.co:5432/postgres"
   JWT_SECRET="canaco_super_secure_secret_token_institutional_2026"
   ADMIN_PRESET_EMAIL="admin@canaco-huauchinango.org"
   ADMIN_PRESET_PASSWORD="AdminCanaco2026!"
   ADMIN_SECRET_ROUTE="sys-c0ntr0l-canac0"
   ```

4. Generar el cliente de Prisma y verificar la sincronización de la base de datos:
   ```bash
   npx prisma generate
   npm run prisma:seed
   ```

5. Iniciar el servidor en modo de desarrollo:
   ```bash
   npm run dev
   ```
   *El servidor quedará a la escucha en `http://localhost:5000`.*

---

### 7.2 Configuración del Frontend (`/client`)

1. Abrir una segunda terminal y posicionarse en la carpeta del cliente:
   ```bash
   cd client
   ```

2. Instalar las dependencias del cliente:
   ```bash
   npm install
   ```

3. Iniciar el servidor local de desarrollo:
   ```bash
   npm run dev
   ```
   *La aplicación estará accesible en el navegador en `http://localhost:5173`.*

4. Para compilar la versión de producción:
   ```bash
   npm run build
   ```

---

## 🔒 8. Mecanismo de Control Institucional

Con el fin de preservar la privacidad institucional requerida por la administración de la cámara, el acceso al panel administrativo no se encuentra visible ni expuesto en el menú público del portal.

- **Acceso Autorizado:** El personal administrativo institucional puede activar el formulario de acceso mediante la combinación reservada de teclado:  
  `Ctrl + Shift + A`
- **Autenticación:** Requiere la clave institucional registrada para habilitar las herramientas de gestión de atractivos, eventos y revisión de solicitudes de comerciantes.

---

## 👨‍💻 Autoría y Agradecimientos

- **Desarrollador Residente:** Estudiante de Residencia Profesional  
- **Institución Asesora:** Cámara Nacional de Comercio, Servicios y Turismo (CANACO SERVYTUR) - Delegación Huauchinango, Puebla  
- **Año:** 2026
