# Implementation workflow

Designed before code. Arena synthesis must land before unit 2.

## Blocking first steps

1. Synthesize the design package from the arena (types, module map, interaction shape).
2. Scaffold Vite + TypeScript + Three.js with `base` that works on GitHub Pages and Vercel. Empty catalog type-checks. `npm run build` is green on an empty app. This is the verification harness baseline.
3. Write `scripts/verify.mjs`: serve the preview, hit `/`, `/catalog.json`, `/llms.txt`, assert build artifacts exist. Capture baseline screenshots of the empty shell.

## Independent workstreams after scaffold

These share the catalog file, so they serialize on that file and parallelize on everything else.

4. Catalog records (copy + tokens + recipes + notable works). One file. Chronological. Twelve movements.
5. App state: selected movement + view mode as one discriminated model. URL reflects both (`#/m/web-2-0/human`).
6. Human projection: history, examples, era restyle from tokens.
7. Agent projection: recipe UI plus JSON and llms.txt emit at build.
8. Three.js stage bound to the selected movement's geometry vocabulary. Reduced-motion fallback.

5-8 may proceed in parallel once 4 is committed, if workers do not write the catalog. They only read it.

## Shared mutable state

The catalog module is the shared write. One owner. Scene, human view, and agent view read it.

`index.html` and Vite config are scaffold-owned. Do not let later units rewrite the build graph.

## Smallest safe decomposition

One implementation owner after synthesis. The app is one static site. Fan-out is only for the design arena and for a later visual pass if an era looks generic.

## Verify-before-next

Each unit ends with `npm run build` and a targeted `scripts/verify.mjs` assertion. Do not batch checks.

Unit 4: catalog.json length is 12 and ids are unique.
Unit 5: URL round-trip of mode + movement.
Unit 6: opening a movement shows its title and a dated example.
Unit 7: agent view shows tokens; catalog.json matches on-screen count.
Unit 8: canvas exists, or a reduced-motion static treatment exists. No uncaught errors.

## Then

Control-UI pass on desktop and mobile viewports for the main path.
Deploy files: `vercel.json`, GitHub Pages workflow, README with the two publish paths.
