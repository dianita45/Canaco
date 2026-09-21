---
name: canaco-core-rules
description: >-
  ALWAYS USE THIS SKILL whenever working on the CANACO Servytur Huauchinango repository.
  It enforces strict security (hidden admin panel, bcrypt hashing), modular feature-driven
  architecture, PostgreSQL/Prisma standards, and the approved institutional visual identity.
---

# CANACO Core Rules & Architecture Governance Skill

This skill acts as the permanent contract for any agent, assistant, or developer working on the CANACO Servytur project.

## 1. Zero-Leak Administration Security (Mandatory)
- The admin dashboard MUST remain 100% hidden from all public interfaces.
- NEVER add links, buttons, or indicators to the admin section in the public Navbar, Footer, or user menus.
- The route must never be `/admin`. It must use an obfuscated route name.
- Any unauthenticated/unauthorized request to admin endpoints MUST respond with `HTTP 404 Not Found` (never `401` or `403`), preventing port/route scanners from knowing the panel exists.
- In-browser activation is strictly reserved to the hotkey combo `Ctrl + Shift + A` with master password validation.

## 2. Password Encryption Standards (RNF06)
- Plain-text passwords are strictly forbidden.
- Always use `bcrypt` with at least 10 salt rounds (`await bcrypt.hash(password, 10)`).
- Compare passwords strictly via `await bcrypt.compare(input, hash)`.

## 3. Mandatory Feature-Driven Structure
Always organize new code into domain folders:

### Client (`client/src/`):
```text
features/
  ├── tourism/       # Tourist spots, waterfalls, dams, maps
  ├── events/        # CANACO fairs, expos, festivals
  ├── routes/        # Hiking, cultural, coffee circuits
  ├── participation/ # Merchant application & space requests
  ├── auth/          # Merchant login & registration
  └── admin/         # Secret institutional admin dashboard
shared/
  ├── components/    # Reusable: Navbar, Footer, Hero
  └── types/         # Domain interfaces
```

### Server (`server/src/`):
```text
modules/
  ├── tourism/
  ├── events/
  ├── routes/
  ├── participation/
  ├── auth/
  └── admin/
shared/
  ├── prisma/        # Singleton client instance
  └── middlewares/   # JWT, RBAC, error handlers
```

## 4. Institutional Visual System (Tailwind CSS)
- Navy Blue `#0d2c54` for institutional surfaces, navbar, footer.
- Sierra Orange `#f05423` for Hero banner title, search button, and cartelera highlights.
- Ecotourism Green `#289643` for tourism module actions.

## 5. Structural Change Protocol
If a developer or user requests changes to these rules, they must:
1. Update `AGENTS.md` and `GEMINI.md`.
2. Update this skill file (`.agents/skills/canaco-core-rules/SKILL.md`).
3. Refactor existing code accordingly rather than introducing loose exceptions.
