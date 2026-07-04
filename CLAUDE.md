# dlqs.github.io — personal site

Personal website at **dlqs.xyz**. Astro static site, GitHub Pages.

## Stack

- **Astro 5** (static output, zero JS by default) + `@astrojs/mdx`, `@astrojs/sitemap`.
- Custom design (no theme package) modeled on emilkowal.ski — narrow centered
  column, system-aware light/dark, subtle motion. Design tokens live in
  `src/styles/global.css`; motion follows the `emil-design-eng` playbook.
- Self-hosted font: `@fontsource-variable/inter`.

## Dev

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # -> dist/
npm run preview  # serve dist/ locally
```

**Dev port: 4321** (Astro default; reserved for this project — do not collide with
other devbox projects on 3001/8001/8002/4600/3211/3250/8443/10000).

Tailscale note: the site is a root user-site (`base: '/'`), so serving it under a
Tailscale subpath breaks absolute asset URLs. For remote preview, serve at the
root (`tailscale serve --bg 4321`) rather than `--set-path /something`.

## Authoring content

All content is markdown with frontmatter — no code changes needed to add posts or
projects.

- **Writing**: add `src/content/writing/<slug>.md`. Frontmatter: `title`,
  `pubDate` (required), `description?`, `updatedDate?`, `draft?`. URL is
  `/writing/<slug>/`. Set `draft: true` to hide from the homepage.
- **Projects**: add `src/content/projects/<slug>.md`. Frontmatter: `title`,
  `description` (required), `link?` (external URL), `order` (lower sorts first).

Schemas: `src/content.config.ts`.

## Layout of the code

- `src/pages/index.astro` — homepage: intro + Projects + Writing.
- `src/pages/writing/[...slug].astro` — article pages.
- `src/layouts/BaseLayout.astro` — html shell, no-flash theme init, `<ClientRouter>`
  (view transitions), header + footer.
- `src/layouts/PostLayout.astro` — long-form article typography.
- `src/components/` — `ThemeToggle`, `Footer`, `ProjectList`, `WritingList`.

## Deploy

Push to `master` → `.github/workflows/deploy.yml` builds and deploys to Pages.

**One-time setup (manual):** GitHub → Settings → Pages → Source = **GitHub Actions**
(was "Deploy from branch" under Jekyll). Custom domain `dlqs.xyz` is kept via
`public/CNAME` (copied into `dist/`).
