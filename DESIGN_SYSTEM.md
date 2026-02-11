# Work Ledger Design System

A world-class design system combining Google Chrome clarity with retro Apple warmth.

## Design Philosophy

**Clarity First** | **Restraint Over Decoration** | **Motion Is Physical** | **Tactile Digital** | **Analog Echo** | **System Before Page**

## Color System

### Base Palette

```css
/* Header & Structure */
--header-bg: #E8F0FE;           /* Pale light blue header */
--header-dark: #2D2D2D;         /* Dark mode header */

/* Backgrounds */
--bg-primary: #FAFAFB;          /* Main window background */
--bg-primary-dark: #1F2937;     /* Dark mode main background */
--bg-secondary: #EEF0F3;        /* Outer background */
--bg-secondary-dark: #111827;   /* Dark mode outer background */

/* Tab Colors */
--tab-active-bg: #FFFFFF;       /* Active tab background */
--tab-active-bg-dark: #3C3C3C;  /* Dark mode active tab */
--tab-inactive-bg: #E8F0FE;     /* Inactive tab background */
--tab-inactive-bg-dark: #35363A; /* Dark mode inactive tab */
--tab-hover-bg: #DCE8F8;        /* Tab hover state */
--tab-hover-bg-dark: #3F4043;   /* Dark mode tab hover */

/* Text Colors */
--text-primary: #1F2937;        /* Primary text (gray-900) */
--text-primary-dark: #FFFFFF;   /* Dark mode primary text */
--text-secondary: #6B7280;      /* Secondary text (gray-500) */
--text-secondary-dark: #D1D5DB; /* Dark mode secondary text */
--text-muted: #9CA3AF;          /* Muted text (gray-400) */
--text-muted-dark: #6B7280;     /* Dark mode muted text */

/* Borders & Dividers */
--border-light: rgba(0, 0, 0, 0.1);      /* Light border */
--border-dark: rgba(255, 255, 255, 0.1); /* Dark mode border */
--divider: #E5E7EB;              /* Divider color */
--divider-dark: #374151;         /* Dark mode divider */

/* Traffic Lights */
--traffic-red: #EF4444;          /* Red traffic light */
--traffic-yellow: #F59E0B;       /* Yellow traffic light */
--traffic-green: #10B981;       /* Green traffic light */

/* Accents */
--accent-orange: #F97316;       /* Orange indicator (timeline) */
--accent-blue: #3B82F6;         /* Blue accent (progress bars) */
```

### Dynamic Colors

The music player dynamically extracts colors from album artwork using Canvas API:
- Background color: Dominant color from album cover
- Text color: Inverted for contrast (light/dark detection)
- Progress bar: Inverse of background at 100% opacity
- Control frames: Inverse of background at 20% opacity

## Spacing Scale (4pt System)

```css
--space-1: 4px;    /* 0.25rem */
--space-2: 8px;    /* 0.5rem */
--space-3: 12px;   /* 0.75rem */
--space-4: 16px;   /* 1rem */
--space-5: 20px;   /* 1.25rem */
--space-6: 24px;   /* 1.5rem */
--space-8: 32px;   /* 2rem */
--space-10: 40px;  /* 2.5rem */
--space-12: 48px;  /* 3rem */
--space-16: 64px;  /* 4rem */
--space-20: 80px;  /* 5rem */
```

### Component-Specific Spacing

- **Traffic Lights**: 8px left/right margin
- **Tabs**: 8px horizontal padding, 12px vertical padding
- **Tab Gap**: 2px between tabs
- **Window Padding**: 20px border radius (rounded-[20px])
- **Content Padding**: 16px-32px depending on context

## Typography Scale

### Font Families

```css
--font-primary: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', Helvetica, Arial, sans-serif;
--font-handwriting: 'Caveat', 'Kalam', cursive;
--font-mono: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', monospace;
```

### Type Scale

```css
/* Headings */
--text-xs: 12px;      /* 0.75rem - Small labels */
--text-sm: 14px;      /* 0.875rem - Body small, tabs */
--text-base: 16px;    /* 1rem - Body text */
--text-lg: 18px;      /* 1.125rem - Large body */
--text-xl: 20px;      /* 1.25rem - Small headings */
--text-2xl: 24px;     /* 1.5rem - Medium headings */
--text-3xl: 30px;     /* 1.875rem - Large headings */
--text-4xl: 36px;     /* 2.25rem - Extra large headings */

/* Letter Spacing */
--tracking-tight: -0.025em;
--tracking-normal: 0;
--tracking-wide: 0.05em;      /* Used for Spotify tab */
--tracking-wider: 0.1em;
```

### Font Weights

```css
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

## Border Radius Scale

```css
--radius-sm: 4px;      /* 0.25rem */
--radius-md: 8px;      /* 0.5rem */
--radius-lg: 12px;     /* 0.75rem */
--radius-xl: 16px;     /* 1rem */
--radius-2xl: 20px;    /* 1.25rem - Window corners */
--radius-full: 9999px; /* Full circle */
```

## Elevation & Shadows

### Shadow Tokens (20% darker than default)

```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.06);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.12), 0 2px 4px -1px rgba(0, 0, 0, 0.072);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.12), 0 4px 6px -2px rgba(0, 0, 0, 0.06);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.12), 0 10px 10px -5px rgba(0, 0, 0, 0.048);
--shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.3);
```

### Elevation Levels

- **Level 0**: Flat (backgrounds)
- **Level 1**: Subtle (cards, tabs when inactive)
- **Level 2**: Medium (active tabs, buttons)
- **Level 3**: High (window container, modals)
- **Level 4**: Highest (overlays, full-screen previews)

## Motion & Animation Tokens

### Spring Configurations

```typescript
// Standard spring
{ type: "spring", stiffness: 400, damping: 25 }

// Gentle spring (window animations)
{ type: "spring", stiffness: 300, damping: 30 }

// Snappy spring (buttons, hovers)
{ type: "spring", stiffness: 400, damping: 17 }

// Smooth spring (page transitions)
{ type: "spring", stiffness: 200, damping: 20 }
```

### Duration Tokens

```css
--duration-fast: 150ms;      /* Quick interactions */
--duration-normal: 300ms;    /* Standard transitions */
--duration-slow: 600ms;      /* Page transitions */
--duration-slower: 1000ms;   /* Complex animations */
```

### Easing Functions

```css
--ease-linear: linear;
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-custom: cubic-bezier(0.16, 1, 0.3, 1); /* Used for scroll animations */
```

### Animation Patterns

- **Fade In**: `opacity: 0 → 1`
- **Slide Up**: `y: 20px → 0, opacity: 0 → 1`
- **Scale**: `scale: 0.95 → 1` (entrance) or `1 → 1.05` (hover)
- **Staggered**: Delay increments of 0.1s per item

## Sound Tokens

### Keyboard Click Sound

- **Type**: Programmatically generated via Web Audio API
- **Layers**: 
  - Sharp mechanical click (2200Hz → 1400Hz)
  - Low mechanical thock (180Hz → 90Hz)
  - Subtle release sound (800Hz → 400Hz)
- **Volume**: 60% quieter than original (gains: 0.06, 0.048, 0.012)
- **Duration**: ~25ms total
- **Toggle**: User-controllable via settings

## Component Tokens

### Browser Window

- **Width**: `min(1280px, 92vw)`
- **Height**: `min(760px, 86vh)`
- **Border Radius**: `20px` (or `0` in fullscreen)
- **Shadow**: `shadow-2xl`
- **Background**: `--bg-primary`

### Tabs

- **Min Width**: 120px (inactive), 160px (active)
- **Max Width**: 200px (inactive), 240px (active)
- **Height**: Auto (based on padding)
- **Padding**: 8px horizontal, 12px vertical
- **Gap**: 2px between tabs
- **Border Radius**: `rounded-t-lg` (top corners only)

### Traffic Lights

- **Size**: 12px × 12px (3px × 3px visual, 8px × 8px clickable)
- **Gap**: 6px between lights
- **Margin**: 8px from edges

### Progress Bar

- **Height**: 6px (1.5rem)
- **Border Radius**: Full (rounded-full)
- **Background**: Light gray (inactive), Dynamic inverse color (active)
- **Track Background**: `rgba(0, 0, 0, 0.1)` light mode, `rgba(255, 255, 255, 0.2)` dark mode

### Control Buttons (Music Player)

- **Frame Opacity**: 20% of inverse background color
- **Frame Size**: Slightly larger than button (3rem, 3.5rem, 5.5rem)
- **Button Sizes**: 
  - Small (shuffle/repeat): 40px × 40px
  - Medium (prev/next): 48px × 48px
  - Large (play/pause): 80px × 80px

## Accessibility Tokens

### Reduced Motion

When `reduce-motion` class is applied:
- All animations: `0.01ms duration`
- All transitions: `0.01ms duration`
- Scroll behavior: `auto`

### Contrast Ratios

- **Text on Light**: Minimum 4.5:1 (WCAG AA)
- **Text on Dark**: Minimum 4.5:1 (WCAG AA)
- **Large Text**: Minimum 3:1 (WCAG AA)

## Responsive Breakpoints

```css
--breakpoint-sm: 640px;
--breakpoint-md: 768px;
--breakpoint-lg: 1024px;
--breakpoint-xl: 1280px;
--breakpoint-2xl: 1536px;
```

## Z-Index Scale

```css
--z-base: 0;
--z-dropdown: 1000;
--z-sticky: 1020;
--z-fixed: 1030;
--z-modal-backdrop: 1040;
--z-modal: 1050;
--z-popover: 1060;
--z-tooltip: 1070;
```

## Usage Examples

### Tab Styling
```tsx
className={`
  px-2 py-3                    // 8px horizontal, 12px vertical
  rounded-t-lg                 // Top corners only
  bg-white dark:bg-[#3C3C3C]   // Active tab background
  min-w-[160px] max-w-[240px] // Size constraints
`}
style={{ paddingLeft: '8px', paddingRight: '8px' }}
```

### Spring Animation
```tsx
transition={{ 
  type: "spring", 
  stiffness: 400, 
  damping: 25 
}}
```

### Shadow Application
```tsx
className="shadow-2xl"  // Uses custom darker shadow
```

## Design Principles in Practice

1. **No one-off styling** - Everything built from tokens
2. **Consistent spacing** - Always use 4pt system
3. **Physical motion** - Spring-based, never linear
4. **Tactile feedback** - Sound + visual response
5. **System coherence** - Same patterns everywhere
6. **Accessibility first** - Reduced motion, audio toggle, keyboard navigation

---

*This design system evolves with the project. Update tokens as patterns emerge.*
