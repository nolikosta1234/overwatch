# Contributing to OVERWATCH

Thanks for your interest in contributing! Here's how to get started.

## Development Setup

1. Fork and clone the repo
2. Run `npm install`
3. Copy `.env.local.example` to `.env.local` and add your [Mapbox token](https://account.mapbox.com/access-tokens/)
4. Run `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000)

## Code Conventions

- **TypeScript** — strict types, no `any`
- **Components** — PascalCase filenames (`GlassPanel.tsx`)
- **Stores** — camelCase with `Store` suffix (`mapStore.ts`)
- **API clients** — go in `src/lib/api/`
- **State** — Zustand for client state, TanStack Query for server state
- **Styling** — Tailwind CSS utility classes using the existing theme

## Pull Requests

- Create a feature branch from `main`
- Include a clear description of what changed and why
- Add screenshots for UI changes
- Ensure `npm run build` passes with no errors
