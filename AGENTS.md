# NGF Racing

- The Next.js application and its npm scripts are in `ngfracing/`, not the repository root.
- Preserve the existing Prisma/PostgreSQL model, admin authentication and Vercel Blob integration. Do not replace them with other Neon services as part of setup.
- For Neon work, read the relevant project skills in `.agents/skills/neon`, `.agents/skills/neon-postgres` and `.agents/skills/neon-postgres-branches`.
- Test schema changes on an isolated Neon child branch before production. Confirm the project and branch IDs explicitly; the `.neon` context may reference an expiring test branch.
- Use `--no-env-pull` when linking/checking out Neon branches unless replacing local environment values was explicitly requested. Keep credentials out of source control and logs.
- Production schema writes require a verified recoverable backup, a concrete migration plan and explicit user approval. Never run reset, seed, table recreation or destructive commands against production.
- Production already records `0_existing_schema` and `20261026_product_image_assets`, applied after explicit approval on 2026-10-27. Inspect migration history before changes; never execute the baseline SQL against existing tables or repeat baseline setup blindly.
- Production deploys require separate explicit approval. Do not push or merge automatically.
- Production was explicitly approved and published on 2026-10-28 via CLI from the then-uncommitted tree: deployment `dpl_8ov5c9PSZNJhwhaA5MXw6fQe55xJ`, main URL `https://www.ngfracing.com.br`; the earlier `dpl_7A8zPe9RNpFqpGzBoe88jzqCHbor` was its rollback reference. That approval does not authorize future releases. See the private `ngfracing/docs/production-release-20261028.md`.
- On 2026-11-16 that same tree was committed on branch `sync/producao-20261028`, validated on Preview and, with explicit approval, merged to `main`. `dpl_8ov5c9PSZNJhwhaA5MXw6fQe55xJ` is the rollback reference for that Git deploy; check `vercel ls` for the current production deployment.
- Vercel is Git-linked to `gustavosantos04/ngfracingSite` with production branch `main`: every push or merge to `main` deploys to Production automatically. Validate on a non-main branch first (its Preview uses the isolated Preview environment) and push or merge to `main` only with explicit approval.
- The GitHub repository is public. `ngfracing/docs/` and `ngfracing/scripts/ops/` are private operational records (infrastructure IDs, local paths) and are git-ignored; never commit them.
- Run the applicable unit tests, browser tests, lint, typecheck and build from `ngfracing/` after implementation changes.
- Development uses persistent Neon branch `br-bold-term-acz7sj0o` (`ngfracing-development`), role `ngf_development`; Preview uses `br-raspy-tooth-achfnndi` (`ngfracing-preview`), role `ngf_preview`. Preserve their independent database passwords and admin/JWT values. Never pull production values over local development files. The local Neon context points to Development.
- Non-production Blob uses `ngfracing-images-preview`; production uses `ngfracing-images`. Environment guards reject production DB access and production image uploads outside Vercel Production. Keep these guards; use isolated Preview values for builds/tests.
- Security overrides in `ngfracing/package.json` have compatibility regression tests. Preserve the patched minimums; never replace framework or ORM major versions blindly with `npm audit fix --force`.
