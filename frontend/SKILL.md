# SKILL.md

## Project Overview

This project is a modern frontend web application built with:

- Node.js
- Next.js (App Router)
- React
- Tailwind CSS
- TypeScript
- shadcn/ui components
- Vercel deployment workflow

The codebase was initially generated using v0.dev and is now maintained locally using:

- Visual Studio Code
- GitHub Copilot

The objective is to keep the project:

- Modular
- Reusable
- Accessible
- SEO-friendly
- Responsive
- Easy to scale and maintain

---

# General Development Guidelines

## Core Principles

- Prefer composition over duplication.
- Keep components small and reusable.
- Avoid deeply nested component trees.
- Prioritize readability over clever code.
- Use TypeScript types explicitly.
- Favor server components when possible in Next.js.
- Minimize client-side JavaScript.
- Keep business logic outside UI components when appropriate.

---

# Frontend Architecture

## Folder Structure

Use the following structure consistently:

```txt
/app
  /(marketing)
  /(dashboard)
  /api
  /globals.css
  /layout.tsx
  /page.tsx

/components
  /ui
  /layout
  /forms
  /shared
  /charts

/lib
  /utils
  /services
  /hooks
  /constants
  /types

/styles

/public

/tests
````

## Folder Responsibilities

### `/app`

* Next.js App Router pages and layouts.
* Prefer Server Components by default.
* Use route groups for logical separation.

### `/components/ui`

* Reusable low-level UI primitives.
* Buttons, cards, modals, inputs, dialogs, badges, etc.
* Prefer shadcn/ui patterns.

### `/components/shared`

* Shared business-level components.
* Navbar, Footer, Hero sections, Feature blocks, etc.

### `/lib`

Contains:

* Utilities
* API clients
* Services
* Custom hooks
* Shared types
* Constants

---

# React and Next.js Best Practices

## Component Design

### Preferred Component Style

* Functional components only.
* Use named exports unless component is page/layout.
* Keep components under ~200 lines when possible.

Example:

```tsx
type ButtonProps = {
  label: string
  onClick: () => void
}

export function PrimaryButton({
  label,
  onClick,
}: ButtonProps) {
  return (
    <button onClick={onClick}>
      {label}
    </button>
  )
}
```

---

## Reusability Rules

Before creating a new component:

1. Check if similar UI already exists.
2. Extract repeated JSX into reusable components.
3. Use props instead of duplicating variants.
4. Prefer composition with `children`.

---

## State Management

### Prefer:

* Server Components
* React local state
* URL state
* React Context (small scope)

### Avoid:

* Global state unless necessary
* Prop drilling across many layers
* Excessive `useEffect`

---

## Hooks

### Custom Hooks

* Prefix with `use`
* Keep hooks focused on one responsibility

Example:

```ts
useUser()
useDebounce()
useMobile()
```

---

# TypeScript Standards

## Rules

* Avoid `any`
* Prefer explicit types
* Use interfaces for object contracts
* Use utility types when useful

Example:

```ts
interface User {
  id: string
  name: string
}
```

---

# Tailwind CSS Guidelines

## Styling Philosophy

* Utility-first styling
* Avoid inline styles
* Avoid unnecessary custom CSS
* Prefer Tailwind classes over CSS modules

---

## Responsive Design

Use mobile-first breakpoints:

```txt
sm:
md:
lg:
xl:
2xl:
```

Example:

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
```

---

## Class Organization

Order Tailwind classes consistently:

1. Layout
2. Spacing
3. Typography
4. Colors
5. Effects
6. Transitions

Example:

```tsx
className="
flex items-center gap-2
p-4
text-sm font-medium
bg-blue-600 text-white
rounded-lg shadow-md
hover:bg-blue-700
transition-colors
"
```

---

## Dark Mode

* Support dark mode by default.
* Use Tailwind dark variants.

Example:

```tsx
className="bg-white text-black dark:bg-zinc-900 dark:text-white"
```

---

# Accessibility (a11y)

Accessibility is mandatory.

## Requirements

* Use semantic HTML.
* All images require `alt`.
* Buttons must have accessible labels.
* Inputs must be associated with labels.
* Ensure keyboard navigation works.
* Maintain color contrast.
* Use ARIA only when necessary.

---

## Examples

### Good

```tsx
<button aria-label="Open menu">
```

### Avoid

```tsx
<div onClick={...}>
```

---

# SEO Best Practices

## Metadata

Every page should define:

* title
* description
* openGraph metadata

Use Next.js metadata API.

Example:

```ts
export const metadata = {
  title: "Dashboard",
  description: "Analytics dashboard",
}
```

---

## Performance

Optimize for Core Web Vitals:

* Minimize client components
* Lazy-load heavy components
* Use Next.js Image component
* Optimize fonts
* Avoid large bundles

---

# UI/UX Standards

## Design Principles

* Clean and minimal interfaces
* Consistent spacing
* Predictable interactions
* Responsive layouts
* Clear visual hierarchy

---

## Animation

* Use subtle animations only.
* Prefer Framer Motion when necessary.
* Avoid excessive motion.

---

# API and Data Fetching

## Preferred Patterns

### Server-side fetching

Prefer:

```ts
async function Page() {
  const data = await fetch(...)
}
```

### Client-side fetching

Use only when interactivity requires it.

---

# Error Handling

## Rules

* Never fail silently.
* Display user-friendly errors.
* Log meaningful debug information.

---

# Code Quality

## Linting

Always maintain:

* ESLint clean
* TypeScript clean
* No unused imports
* No console.logs in production

---

## Naming Conventions

### Components

PascalCase:

```txt
UserCard.tsx
Navbar.tsx
```

### Hooks

camelCase with `use`:

```txt
useAuth.ts
```

### Utilities

camelCase:

```txt
formatDate.ts
```

### Constants

UPPER_SNAKE_CASE:

```ts
MAX_ITEMS
```

---

# Git Workflow

## Branch Naming

```txt
feature/auth
fix/navbar-mobile
refactor/dashboard-layout
```

---

## Commit Style

Use conventional commits:

```txt
feat:
fix:
refactor:
style:
docs:
```

Example:

```txt
feat: add responsive pricing section
```

---

# Copilot Instructions

When generating code:

* Prefer reusable components.
* Follow existing project structure.
* Use TypeScript strictly.
* Prefer accessibility-first implementations.
* Use Tailwind CSS utilities.
* Avoid unnecessary dependencies.
* Keep generated code production-ready.
* Prefer clean and maintainable solutions.
* Follow Next.js App Router best practices.
* Prefer server components unless interactivity is required.
* Avoid overengineering.

---

# Preferred Libraries

## UI

* shadcn/ui
* Radix UI
* Lucide Icons

## Forms

* React Hook Form
* Zod

## Animations

* Framer Motion

## Tables

* TanStack Table

---

# Testing Recommendations

Preferred tools:

* Vitest
* React Testing Library
* Playwright

Test:

* Rendering
* Accessibility
* User interactions
* Edge cases

---

# Security Guidelines

* Never expose secrets in frontend code.
* Use environment variables.
* Validate all user input.
* Sanitize dynamic content.

---

# Performance Checklist

Before merging:

* Check Lighthouse score
* Verify responsive layout
* Verify accessibility
* Check bundle size
* Optimize images
* Remove unused dependencies

---

# Final Principles

This project prioritizes:

1. Maintainability
2. Accessibility
3. Performance
4. Reusability
5. Scalability
6. Developer Experience
7. Clean UI/UX

