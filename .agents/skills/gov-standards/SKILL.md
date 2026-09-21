---
name: gov-standards
description: >-
  Use this skill when developing solutions for government, public sector,
  or institutional entities, ensuring compliance, accessibility, auditability, and data security.
---

# Government & Public Sector Standards Skill

Standards designed specifically for institutional and public sector applications (e.g., chambers of commerce, municipal portals).

## Compliance & Core Pillars

1. **Security & Data Protection:**
   - Password hashing with Bcrypt/Argon2 with high work factor.
   - HttpOnly, SameSite, and Secure flags on authentication cookies.
   - Strict input sanitization to prevent XSS and SQL/NoSQL Injection.
   - Rate limiting on public and authentication endpoints (e.g., login, contact forms, participation requests).

2. **Audit Trails (Trazabilidad):**
   - Keep audit logs for critical actions: entity creation, modification, deletion, and role changes.
   - Structure: `AuditLog { id, action, entity, entityId, userId, timestamp, ipAddress, userAgent }`.

3. **Accessibility (WCAG 2.1 AA):**
   - High contrast ratios (legible text over photos via dark overlays).
   - Semantic HTML5 (`header`, `nav`, `main`, `section`, `article`, `footer`).
   - All interactive elements must be keyboard navigatable (`Tab`, `Enter`, `Escape`).
   - Descriptive `alt` attributes on all dynamic images.

4. **Public Trust & Reliability:**
   - Clear feedback messages on citizen forms (e.g., "Solicitud de Participación enviada con folio #...").
   - Transparent publication dates on events and tourist advisories.
