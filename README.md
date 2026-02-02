# Work Ledger

A personal work journal with a calm ledger notebook aesthetic, inspired by Japanese handcrafted notebooks and woodworking traditions.

![Work Ledger](https://via.placeholder.com/800x400?text=Work+Ledger)

## Features

- 📓 **Two-column ledger layout** — sidebar index + main content page
- 📅 **Week-based entries** — organized by year and week number
- 🏷️ **Project tagging** — connect weeks to ongoing projects
- 🔍 **Command palette** — press `⌘K` to search everything
- 📝 **Guestbook** — let visitors sign your ledger
- 🎵 **Bench radio** — optional ambient music player
- 🎨 **Calm aesthetic** — paper textures, muted colors, restrained motion

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to see your ledger.

## Adding Content

### Create a New Week Entry

1. Create a new MDX file in `content/weeks/{year}/`:

```
content/weeks/2026/week-05.mdx
```

2. Add frontmatter and content:

```mdx
---
year: 2026
week: 5
date_start: "2026-01-29"
date_end: "2026-02-04"
status: "in-progress"  # reviewed | in-progress | archived
title: "Week 05"
tags:
  - project-name
  - another-tag
links:
  - label: "Design doc"
    url: "https://example.com"
    kind: "doc"  # figma | doc | slack | prototype | misc
artifacts:
  - src: "/images/ledger/2026/week-05/photo.jpg"
    alt: "Description"
music:
  track: "Ambient Tape"
  src: "/audio/ambient.mp3"
---

## Shipped

- Item one
- Item two

## In Progress

- Working on this
- And this

## Grain

Reflection paragraphs go here...

## Notes (optional)

Any extra notes.
```

### Adding Images

1. Place images in `public/images/ledger/{year}/week-{NN}/`
2. Reference them in frontmatter:

```yaml
artifacts:
  - src: "/images/ledger/2026/week-05/screenshot.png"
    alt: "Screenshot description"
```

### Adding Music

1. Place audio files in `public/audio/`
2. Reference in frontmatter:

```yaml
music:
  track: "Track Name"
  src: "/audio/filename.mp3"
```

## Project Structure

```
work-ledger/
├── content/
│   └── weeks/
│       └── 2026/
│           ├── week-01.mdx
│           └── week-02.mdx
├── data/
│   └── guestbook.json
├── public/
│   ├── images/
│   ├── audio/
│   └── search-index.json
├── src/
│   ├── app/
│   │   ├── (ledger)/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── weeks/[year]/[week]/page.tsx
│   │   │   ├── projects/page.tsx
│   │   │   ├── photos/page.tsx
│   │   │   ├── guestbook/page.tsx
│   │   │   └── about/page.tsx
│   │   └── api/
│   │       └── guestbook/route.ts
│   ├── components/
│   │   ├── LedgerShell.tsx
│   │   ├── SidebarIndex.tsx
│   │   ├── LedgerHeader.tsx
│   │   ├── LedgerPage.tsx
│   │   ├── SectionBlock.tsx
│   │   ├── LinkTape.tsx
│   │   ├── ArtifactGrid.tsx
│   │   ├── MDXContent.tsx
│   │   ├── BenchRadio.tsx
│   │   └── CommandPalette.tsx
│   └── lib/
│       ├── content.ts
│       ├── mdx.ts
│       └── schemas.ts
└── scripts/
    └── generate-search-index.ts
```

## Design Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--paper` | `#f8f5f0` | Main background |
| `--paper-dark` | `#f0ebe3` | Sidebar background |
| `--ink` | `#2c2c2c` | Primary text |
| `--ink-light` | `#5a5a5a` | Secondary text |
| `--stamp` | `#b85450` | Accent color |
| `--tape` | `#e8e4dc` | Chip backgrounds |

## Deployment

### Deploying to Vercel

1. Push your code to GitHub
2. Import the repository in [Vercel](https://vercel.com)
3. Deploy!

The build command automatically generates the search index.

### Manual Deployment

```bash
# Build the project
npm run build

# Start production server
npm start
```

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Content**: MDX with gray-matter
- **Validation**: Zod
- **Animation**: Framer Motion
- **Search**: cmdk

## License

MIT
