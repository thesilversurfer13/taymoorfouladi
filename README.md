# Taymoor Fouladi — Personal Website

A modern, fully static portfolio site built with [Astro](https://astro.build), Tailwind CSS, and content collections. Migrated from Squarespace.

## Tech stack

- **Astro 4** with content collections
- **Tailwind CSS** for styling
- **Fraunces** (display), **Inter** (sans), **JetBrains Mono** (mono)
- Dark/light theme with system preference + manual toggle
- All images self-hosted (no external dependencies)
- **44 pages built statically** (5 top-level + 12 portfolio + 18 career + 8 blog + index pages)

## Local development

```bash
npm install
npm run dev       # http://localhost:4321
```

## Build

```bash
npm run build     # outputs to ./dist
npm run preview   # serves the built site
```

## Deploy to Cloudflare Pages

```bash
# one-time auth (opens browser)
npx wrangler login

# deploy
npm run deploy
```

The site lives at `https://taymoorfouladi.pages.dev` (and any custom domain you attach).

## Structure

```
src/
├── content/
│   ├── pages/       # home, about, contact
│   ├── portfolio/   # 12 project case studies
│   ├── career/      # 18 role descriptions
│   └── blog/        # 8 blog posts
├── components/      # Nav, Footer, Hero, ProjectCard, RoleCard, LogoWall
├── layouts/         # BaseLayout
├── pages/           # File-based routing
└── styles/          # global.css + Tailwind
public/
├── assets/img/      # All 159 localized images
├── cv.pdf           # Resume / CV
└── favicon.svg
```

## Adding content

Drop a Markdown file into `src/content/portfolio/`, `career/`, or `blog/` with frontmatter:

```markdown
---
title: "New Project"
hero: "/assets/img/your-image.jpg"
summary: "One-line description"
order: 0
---

# Project body in Markdown
```

The site rebuilds automatically.
