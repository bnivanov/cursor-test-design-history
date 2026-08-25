# The Field

A static site about the history of web and digital design, 1991 through 2026.

Human view is the history and notable examples. Selecting a movement restyles the page to that era.

Agent view is the same movement as a recipe: tokens, layout, type, motion, anti-patterns, and prompts. The build also writes `catalog.json` and `llms.txt` from the same records.

## Run locally

```bash
npm install
npm test
npm run dev
```

`npm run build` then `npm run preview` is the production path.

`npm run verify` builds, serves the preview, and checks the human path, agent path, and machine files in a real Chrome.

## Publish

GitHub Pages. Push to `main` with Pages set to GitHub Actions. The workflow in `.github/workflows/pages.yml` builds and deploys `dist`.

Vercel. Import the repo. Framework preset can stay Other. Build command `npm run build`, output `dist`. `vercel.json` is already here.

This checkout cannot deploy for you. There is no GitHub or Vercel login in the environment that built it.

## Add a movement

Edit a file under `src/records-*.ts` and add it to the tuple in `src/records.ts`. Fill a complete `DesignLanguage` and a `SceneProgram` that is not a copy of another era. `compileCatalog` will fail the build if the scene matches an existing one, if ids collide, or if `answers` points at a missing id. Do not teach `src/stage.ts` a movement id. If you need a new geometry, add a union variant and a case in the stage interpreter.
