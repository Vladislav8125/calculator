# AGENTS.md

## Cursor Cloud specific instructions

This repository is a **project economics calculator** for video transcription cost analysis. It compares manual vs automated approaches and computes unit economics at different margins.

### Tech stack

- React 19 + TypeScript + Vite
- CSS Modules for styling
- pnpm as package manager

### Commands

| Action | Command |
|--------|---------|
| Install deps | `pnpm install` |
| Dev server | `pnpm dev` (runs on port 5173) |
| Lint | `pnpm lint` |
| Type check | `npx tsc -b` |
| Build | `pnpm build` |
| Preview build | `pnpm preview` |

### Notes

- `pnpm.onlyBuiltDependencies` in `package.json` allows `esbuild` post-install scripts (avoids interactive `pnpm approve-builds`).
- Vite dev server is configured to listen on `0.0.0.0:5173` for remote access.
- No backend services or databases needed — the app is fully client-side.
