---
name: tailwind-design
description: >-
  Use this skill when developing or styling user interfaces with Tailwind CSS,
  especially for modern, accessible, institutional and responsive layouts.
---

# Tailwind CSS Development Skill

This skill provides best practices, utility conventions, and patterns for building accessible, modern UI with Tailwind CSS.

## Core Rules

1. **Design Tokens & Palette Consistency:**
   - Primary Corporate Navy: `bg-[#0d2c54]` / `text-[#0d2c54]` (Institutional header, footer, primary buttons).
   - Brand Accent Orange: `bg-[#f05423]` / `text-[#f05423]` (Action buttons, highlights, search triggers).
   - Eco Tourism Green: `bg-[#289643]` / `text-[#289643]` (Tourism badges and module buttons).
   - Backgrounds: Clean neutral tones (`bg-slate-50`, `bg-white`, `border-slate-200`).

2. **Responsive Breakpoints:**
   - Mobile-first approach (`sm:`, `md:`, `lg:`, `xl:`).
   - Grid layouts: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`.

3. **Accessibility (WCAG 2.1 AA Compliance):**
   - Ensure color contrast ratios >= 4.5:1 for body text and >= 3:1 for large text.
   - Use visible focus rings: `focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500`.
   - Appropriate interactive states: `hover:opacity-90 active:scale-95 transition-all duration-200`.

4. **Component Patterns:**
   - Card container: `bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-slate-100`.
   - Institutional Header: Sticky, dark navbar with high-contrast text and logo placement.
   - Hero Banner: Full-width responsive container with gradient/dark overlay to ensure typography legibility over landscape photography.
