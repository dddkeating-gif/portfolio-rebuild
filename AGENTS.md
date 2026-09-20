# Project

- This repository contains Jake Vallante's portfolio site at https://www.thejake.design/.
- It is a Next.js site deployed through Vercel.
- The current production website is on the `master` branch; the default `main` branch is not the current production site.
- Branch new site work from the latest `master` unless explicitly instructed otherwise.

# Design preservation

- Preserve the established visual design unless Jake explicitly requests a redesign; prefer surgical, minimal changes.
- Do not broadly refactor unrelated code or modify unrelated site content.
- Reuse existing components, typography, spacing, animation patterns, colors, and visual language.
- Never introduce rounded corners as a generic design improvement.

# Implementation

- Inspect the relevant existing implementation before changing it, and prefer the existing architecture and dependencies.
- Do not add, replace, or upgrade dependencies unless genuinely necessary.
- Remove dead code created by a change, prefer deterministic solutions over timing hacks, and keep changes narrowly scoped.

# Verification

- For user-facing changes, run lint and the production build; test the affected behavior in an actual browser on desktop and mobile when relevant; inspect the console; and verify the interaction, not only compilation.
- For interaction bugs, reproduce the problem before changing code whenever practical.

# Git and deployment

- Create dedicated working branches from `master` and keep patches narrowly scoped.
- Do not push, merge, or deploy unless Jake explicitly asks.
- Never modify `main` as a substitute for `master`.
