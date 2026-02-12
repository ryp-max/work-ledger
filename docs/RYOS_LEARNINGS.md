# ryOS Learnings — Applied to Work Ledger

Study of [ryOS](https://os.ryo.lu/) ([GitHub](https://github.com/ryokun6/ryos)) — a web-based desktop environment emulating classic OS aesthetics.

---

## Architecture Overview

| Layer | ryOS Approach | Work Ledger Equivalent |
|-------|---------------|------------------------|
| **Presentation** | 18 app modules, UI components, 4 themes | ChromeBrowser, tab pages |
| **State** | Zustand (24 stores), localStorage/IndexedDB | React state, localStorage |
| **Persistence** | IndexedDB, LocalStorage | localStorage |
| **API** | Vercel serverless functions | Next.js API routes |

---

## Tech Stack Comparison

| Category | ryOS | Work Ledger |
|----------|------|-------------|
| **Framework** | React 19, Vite | Next.js, React |
| **Styling** | Tailwind v4, shadcn/ui, Framer Motion | Tailwind, Framer Motion |
| **State** | Zustand + persist | useState, localStorage |
| **AI** | Vercel AI SDK (OpenAI, Anthropic, Google) | Direct OpenAI API |
| **Audio** | Tone.js, WaveSurfer.js | Web Audio API |
| **Build** | Vite, Bun | Next.js |

---

## Design Patterns to Adopt

### 1. **App Logic Hook Pattern**

Each app uses a main logic hook that encapsulates state and behavior:

```ts
// src/apps/[app-name]/hooks/use[AppName]Logic.ts
export function useAppLogic({ isWindowOpen, isForeground, initialData, instanceId }) {
  // 1. Global hooks (audio, vibration)
  // 2. Store state (Zustand selectors)
  // 3. Local state for UI
  // 4. Handlers combining state + actions
  return { state, actions, uiState };
}
```

**Benefits:** Separation of concerns, testability, composability. Work Ledger pages (Rachel, Spotify, etc.) could extract logic into dedicated hooks.

### 2. **Theme System via CSS Variables**

```css
:root[data-os-theme="macosx"] {
  --os-font-ui: "LucidaGrande", ...;
  --os-color-window-bg: #ececec;
  --os-metrics-radius: 0.45rem;
  --os-metrics-titlebar-height: 22px;
}
```

**Applied:** Work Ledger already uses `dark` class. Could extend with a `data-theme` attribute and CSS variables for spacing, colors, typography.

### 3. **Lazy Loading with Chunk Splitting**

```ts
// Heavy deps loaded only when app opens
const audio = lazy(() => import('./audio-chunk')); // tone.js, wavesurfer
const tiptap = lazy(() => import('./tiptap-chunk')); // editor
const ai = lazy(() => import('./ai-chunk')); // AI SDK
```

**Applied:** Rachel chat, Spotify, Games could be lazy-loaded to reduce initial bundle size.

### 4. **PWA Caching Strategy**

| Resource | Strategy | Rationale |
|----------|----------|-----------|
| HTML | NetworkFirst | Fresh app shell |
| JS Chunks | NetworkFirst (3s timeout) | Fresh code with fallback |
| CSS | StaleWhileRevalidate | Cached, update in background |
| Images | CacheFirst | Rarely change |

---

## UI / UX Notes

### Theme Metadata

Each theme defines layout metadata:

```ts
interface ThemeMetadata {
  isWindows: boolean;
  hasDock: boolean;
  hasTaskbar: boolean;
  hasMenuBar: boolean;
  titleBarControlsPosition: "left" | "right";
  menuBarHeight: number;
}
```

### Traffic Light Buttons (Aqua)

- 13×13px circles
- Gradients: close (red), minimize (yellow), maximize (green)
- Border: `1px solid rgba(0,0,0,0.2)`

### Pinstripe Textures

```css
repeating-linear-gradient(
  0deg,
  transparent 0px,
  transparent 1.5px,
  rgba(255, 255, 255, 0.85) 1.5px,
  rgba(255, 255, 255, 0.85) 4px
)
```

---

## Suggested Improvements for Work Ledger

1. **Logic Hooks** — Extract `useRachelChatLogic`, `useSpotifyLogic` from page components.
2. **Lazy Loading** — `React.lazy()` for Rachel, Spotify, Games to reduce initial load.
3. **Zustand** — Consider replacing scattered `useState` + `localStorage` with Zustand + persist for tabs, audio, settings.
4. **Theme Variables** — Extend globals.css with `--wl-*` variables for spacing, colors, typography (align with DESIGN_SYSTEM.md).
5. **PWA** — Add service worker with caching for offline/performance.

---

## Project Structure

```
ryOS/
├── _api/           # Vercel API endpoints
├── src/
│   ├── apps/       # 18 app modules (each with component, menu, hooks)
│   ├── components/ # Shared UI, dialogs, layout
│   ├── config/     # App registry
│   ├── hooks/      # 35 custom hooks
│   ├── stores/     # 24 Zustand stores
│   ├── themes/     # 4 theme definitions
│   └── types/
└── public/icons/   # Per-theme icons (macosx, system7, xp, win98)
```

---

## References

- [ryOS Docs](https://os.ryo.lu/docs)
- [Architecture](https://os.ryo.lu/docs/architecture)
- [Application Framework](https://os.ryo.lu/docs/application-framework)
- [Theme System](https://os.ryo.lu/docs/theme-system)
- [GitHub: ryokun6/ryos](https://github.com/ryokun6/ryos)
