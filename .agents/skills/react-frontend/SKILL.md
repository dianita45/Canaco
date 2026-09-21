---
name: react-frontend
description: >-
  Use this skill when developing React applications, component architecture,
  custom hooks, client-side routing, and API integration.
---

# React Frontend Development Skill

Guidelines and standards for building scalable, maintainable React web applications.

## Key Principles

1. **Architecture & Directory Structure:**
   - `src/components/`: Reusable presentational components (Button, Input, Card, Modal, Header, Footer).
   - `src/features/` or `src/pages/`: Domain-specific pages and views (Home, TourismModule, EventsModule, RoutesModule, Login).
   - `src/hooks/`: Custom reusable hooks (e.g., `useAuth`, `useFetch`, `useDebounce`).
   - `src/services/` or `src/api/`: Typed API client methods using fetch or axios.
   - `src/types/`: Centralized TypeScript interfaces and types.

2. **Component Conventions:**
   - Prefer functional components with hooks.
   - Strict typing with TypeScript for props, states, and event handlers.
   - Decouple business logic from UI using custom hooks.
   - Manage UI loading, error, and empty states cleanly.

3. **Performance & UX:**
   - Optimize images using lazy loading (`loading="lazy"`).
   - Memoize expensive operations with `useMemo` and callbacks with `useCallback` where appropriate.
   - Provide instant optimistic UI updates or clear loading spinners/skeletons for civic platforms.
