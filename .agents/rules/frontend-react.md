---
description: Frontend React components, hooks, and stylesheet constraints
globs: ["src/frontend/**/*.{ts,tsx,js,jsx}", "styles/**/*.css", "**/*.tsx", "**/*.jsx"]
---

# Frontend React & Styling Constraints

1. **Strict Component Isolation**:
   - Every component must declare explicit TypeScript interface props. Avoid `any`.
   - Implement functional components with explicit hook dependencies in `useEffect` and `useCallback`.
   - Never mutate state directly; utilize immutable updates.

2. **Styling & Design System**:
   - Use curated, semantic styling tokens rather than ad-hoc inline styles.
   - Maintain dark/light mode parity and responsive layout breakpoints.
   - Zero CSS bloat: avoid loading monolithic frameworks when scoped components or design tokens suffice.

3. **Performance & Accessibility**:
   - Lazy load heavy route components via `React.lazy` and `Suspense`.
   - Every interactive element must possess an explicit accessible label (`aria-label`, `aria-labelledby`, or visible text).
   - Ensure color contrast ratios satisfy WCAG AA standards.
