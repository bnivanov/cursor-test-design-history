# Frame: history of web and digital design

Greenfield site. Empty `/agent` workspace. No GitHub auth in this environment, so the site is built and verified locally. Hosting is a static export the user can push to GitHub Pages or Vercel.

## Definition of done

A local `npm run build` produces static files that, when served, satisfy all of the following. Each check is a browser action or a file on disk, not a self-report.

1. The home view shows a chronological human history covering at least ten named movements from the early web (1991-1995) through 2026.
2. Opening a movement shows a written history, notable examples with names and dates, and a visual treatment that is recognizably of that era rather than a generic dark UI with particles.
3. A WebGL canvas is present on the human path (Three.js). It is driven by the selected movement. Reduced-motion users still get a complete page without the canvas.
4. An Agent view, reachable in one click from the human view, shows the same movement as structured recipe: tokens, layout rules, type, motion, anti-patterns, and a prompt an agent can follow. Switching views does not lose the selected movement.
5. `/catalog.json` and `/llms.txt` exist in the built output and describe the same catalog the UI renders. Counts match.
6. Desktop (1280x800) and mobile (390x844) both reach history, an era page, and agent view without clipped primary controls.
7. `npm run build` exits 0. The preview has no uncaught console errors on the main path.

## Scope

About 12 movements. One typed catalog as the source of truth. Two projections of it (human, agent). One Three.js stage bound to the selected movement. Static Vite (or equivalent) so GitHub Pages and Vercel both work.

Out of scope for this run: a CMS, user accounts, comments, search-engine crawling beyond static files, live deploys from this environment.

## Rigor

High for the data model, dual-view contract, and visual identity of each era. Those are one-way doors.

Medium for historical copy. Cite real sites and dates. Do not invent fake URLs.

Deploy from this VM is blocked (no `gh` login, no Vercel token). Ship a static build plus deploy files (`vercel.json`, GitHub Pages workflow).

## Decisions already taken

Hosting is static files that work on both GitHub Pages and Vercel. GitHub Pages is the default path the user named. Vercel is the fallback if they prefer it.

The catalog is one TypeScript module compiled to JSON at build. Human and agent views are projections, not two datasets.

The site is itself an argument about design. Walking eras should change the visual language. A single "stunning" look applied to every decade fails the brief.

## Tradeoffs

Fewer polished eras over a thin encyclopedia of every micro-trend. Twelve beats thirty.

One morphing stage over twelve separate Three.js apps. Shared camera and renderer, per-movement scene graph.

No live hosting from this agent. The user publishes.
