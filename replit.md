# Quran Quest

## Overview

Quran learning app designed for young learners (11-16). Features bite-sized lessons, gamification (XP, levels, streaks, achievements), interactive quizzes, and a beautiful Islamic-inspired design.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite + Tailwind CSS + shadcn/ui
- **API framework**: Express 5 (shared API server)
- **Quran Data**: Al Quran Cloud API (https://api.alquran.cloud/v1/)
- **User Data**: localStorage (no database needed for progress/bookmarks)
- **Routing**: wouter
- **State Management**: React Query + custom hooks

## Features

- **Home Dashboard**: Daily verse, streak counter, XP/level display, quick actions
- **Surah Explorer**: Browse all 114 surahs with search, Makki/Madani labels
- **Surah Reader**: Arabic text (Amiri font, RTL) + English translation, audio playback, bookmark & mark-as-read
- **Quiz Mode**: Multiple choice & true/false questions from read content, 5 questions per quiz, XP rewards
- **Progress Tracking**: XP levels, streak counter, achievement badges (Bookworm, On Fire, Explorer, Quiz Master)
- **Bookmarks**: Save and manage favorite verses

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/quran-app run dev` — run frontend locally

## Project Structure

- `artifacts/quran-app/` — Main frontend app (React + Vite)
  - `src/pages/` — Page components (home, explore, surah-reader, quiz, progress, bookmarks)
  - `src/hooks/use-progress.ts` — localStorage-backed progress/XP/streak/achievement state
  - `src/hooks/use-quran.ts` — React Query hooks for Al Quran Cloud API
  - `src/components/layout.tsx` — App shell with sidebar (desktop) and bottom tabs (mobile)
- `artifacts/api-server/` — Shared Express API server
- `lib/` — Shared libraries (api-spec, api-client-react, api-zod, db)
