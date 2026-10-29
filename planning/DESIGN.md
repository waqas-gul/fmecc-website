# FMECC Website — Design System

Visual and motion specification for the FMECC website. Read with [MASTER_PLAN.md](./MASTER_PLAN.md) (what to build) and [ARCHITECTURE.md](./ARCHITECTURE.md) (how it is structured). Tokens described here are implemented once in `src/shared/styles/tokens.css` (Tailwind v4 `@theme`) and consumed everywhere through utilities and semantic classes.

## 1. Creative direction

**Concept: "Engineered cinema."** Monumental imagery held in a precise typographic grid. The site should feel like a well-run site office: calm, exact, confident. Scale comes from photography and 3D; trust comes from restraint.

Principles
- **Contrast of scale** — full-bleed media and oversized display type against small, exact labels and 1 px rules.
- **Architectural lines and nodes** — numbered eyebrows ("01 — Building Construction"), faint column guides on dark sections, ruled dividers with a short cyan tick and, sparingly, the node-and-line constellation borrowed from the logo mark (1 px lines meeting at small dots). These, not decoration, carry the identity.
- **Light documentary, dark cinematic** — content sections are light and documentary; hero, process and CTA bands are dark and cinematic. Alternation creates rhythm.
- **One interaction colour, one technical colour** — Royal Blue is the signal (CTAs, links, active states). Cyan is the technical trace (ticks, measurement lines, counters, 3D light). Purple lives only inside the spectrum gradient and a handful of selected accents; it is never a text or fill colour for UI.
- **Motion as camera work** — slow pushes, parallax, reveals that follow structure lines. Nothing bounces.

Avoid: gradients anywhere other than the spectrum rule (§2.4), glassmorphism everywhere, hero carousels, rounded "SaaS" cards, stock imagery of smiling people in hard hats, a dark-mode toggle (the site controls its own schemes), animated counters for numbers we do not have.

## 2. Brand colours and design tokens

### 2.1 Logo
- File: `public/images/brand/logo.png`, a transparent PNG supplied by FMECC (replaced the white-background original on 2026-10-28). The lockup is a diamond-shaped node-and-line mark (purple → royal blue → cyan, left to right) above the English wordmark and the Arabic name, both in royal blue. Keep the lockup intact; never recolour, stretch or separate the mark, the English and the Arabic. The magenta node at the mark's left edge is artwork only; magenta is not a UI colour.
- The logo sits directly on light surfaces. Its wordmarks (`#0003B2`) are 1.48:1 on Deep Navy, so on dark schemes (overlay header over the hero, mobile menu, footer) the unchanged lockup sits on a compact white plate (`--logo-plate`, rounded, constant padding). FMECC should still supply an SVG master and an inverse version (white wordmark, same mark) for dark surfaces, which would replace the plate.
- Clear space: the height of the English cap letters on all sides. Minimum height 32 px (mobile header), 40 px (desktop header), 48 px (footer). The mark's thin lines and small nodes need the PNG served at 2× its displayed size.
- Serve brand assets with `<Image unoptimized>` (or `<img>` for SVG); they bypass the responsive image pipeline.
- Icons (favicon, Apple touch icon) are the one exception to "never separate": the wordmarks are unreadable below ~48 px, so `npm run images` crops the diamond mark out of the supplied lockup (a pure crop, never redrawn or recoloured) and centres it on white. The Open Graph image and every on-page use keep the full lockup. Replace the crop with FMECC's approved mark-only artwork when it is supplied.

### 2.2 Approved palette
Derived from the logo and approved on 2026-10-27. The five approved colours are the anchors; the surrounding steps exist only so text, fills and hover states meet contrast (§13) on every scheme. No other hues (gold, amber, magenta, green) are introduced anywhere.

| Anchor | Hex | Role |
|--------|-----|------|
| Deep Navy | `#0B1220` | Dark surfaces, overlays, footer |
| White | `#FFFFFF` | Light surface, ink on dark |
| Royal Blue | `#1246D8` | Primary brand interactions and CTAs |
| Cyan | `#13C9D7` | Subtle highlights, technical details, 3D lighting |
| Purple | `#8B25E8` | Sparingly: the spectrum gradient and selected accents |

| Token | Hex | Role |
|-------|-----|------|
| `navy-950` | `#070B14` | Deepest surface: video and 3D backdrops, overlays |
| `navy-900` | `#0B1220` | **Deep Navy** — brand scheme surface, footer |
| `navy-800` | `#121C33` | Raised dark surface, media placeholders |
| `navy-700` | `#1A2749` | Hover on dark surfaces |
| `blue-700` | `#0E37AE` | Primary hover on light |
| `blue-600` | `#1246D8` | **Royal Blue** — primary fills, links and active states on light |
| `blue-500` | `#2E5BE8` | Primary fills on dark schemes (≥ 3:1 against navy) |
| `blue-300` | `#8FB0FF` | Links and active text on dark schemes |
| `blue-100` | `#DCE6FF` | Muted ink on the brand scheme, light tints |
| `blue-50` | `#EEF3FF` | Subtle light surface |
| `cyan-800` | `#087078` | Text-safe cyan on light (5.8:1) |
| `cyan-500` | `#13C9D7` | **Cyan** — ticks, rules, counters, 3D rim light, focus on dark |
| `cyan-300` | `#7FE3EC` | Glow and gradient end on dark |
| `cyan-100` | `#DDF8FA` | Tint |
| `purple-600` | `#7A1FD0` | Gradient start on light |
| `purple-500` | `#8B25E8` | **Purple** — gradient start, selected accents |
| `purple-300` | `#C79BFF` | Gradient start on dark |
| `neutral-950` | `#10141C` | Ink on light |
| `neutral-700` | `#4B5262` | Muted ink on light |
| `neutral-500` | `#6B7281` | Subtle ink on light (4.8:1) |
| `neutral-400` | `#8A94AB` | Subtle ink on dark (6.2:1) |
| `neutral-300` | `#C7CDD8` | Strong lines on light; muted ink on dark |
| `neutral-200` | `#DFE3EA` | Lines |
| `neutral-100` | `#F1F3F7` | Muted light surface |
| `neutral-50` | `#F7F8FA` | Light surface alt |
| `white` | `#FFFFFF` | **White** — light surface |

Usage rules
- Royal Blue: every primary action and interactive state. One primary CTA per view.
- Cyan: never a button fill or a large area; never text on light (2.0:1) — use `cyan-800` there. On dark it is the preferred text highlight (9.2:1 on navy). Raw `cyan-500` on light is decorative only (gradient end, glow), never informational.
- Purple: only inside `--gradient-spectrum` and in at most one selected accent per page (the hero rule, the active filter indicator). Never text on dark (3.1:1).

### 2.3 Semantic tokens and schemes
Components never use raw palette colours for surfaces and text; they use semantic utilities (`bg-surface`, `text-ink`, `border-line`, `bg-accent`, `text-accent-text`, `text-highlight`). A section sets `data-scheme="light" | "dark" | "brand"` and the semantic tokens remap, so one component works on every scheme.

| Semantic | light | dark | brand |
|----------|-------|------|-------|
| `surface` | white | navy-950 | navy-900 |
| `surface-muted` | neutral-100 | navy-900 | navy-800 |
| `surface-raised` | white | navy-800 | navy-800 |
| `ink` | neutral-950 | white | white |
| `ink-muted` | neutral-700 | neutral-300 | blue-100 |
| `ink-subtle` | neutral-500 | neutral-400 | blue-100 / 70% |
| `line` | neutral-200 | white / 12% | white / 14% |
| `line-strong` | neutral-300 | white / 24% | white / 28% |
| `accent` (fills: buttons, active bars, badges) | blue-600 | blue-500 | blue-500 |
| `accent-hover` | blue-700 | blue-600 | blue-600 |
| `accent-text` (links, active text) | blue-600 | blue-300 | blue-300 |
| `accent-ink` (text on accent) | white | white | white |
| `highlight` (cyan details, text-safe) | cyan-800 | cyan-500 | cyan-500 |
| `focus` | blue-600 | cyan-500 | cyan-500 |

Implementation sketch (Tailwind v4):
```css
@theme { --color-navy-900: #0B1220; --color-blue-600: #1246D8; --color-cyan-500: #13C9D7; --color-purple-500: #8B25E8; /* …remaining steps… */ }
@theme inline { --color-surface: var(--surface); --color-ink: var(--ink); --color-accent: var(--accent); --color-accent-text: var(--accent-text); --color-highlight: var(--highlight); /* …semantic… */ }
:root, [data-scheme="light"] { --surface: var(--color-white); --ink: var(--color-neutral-950); --accent: var(--color-blue-600); --highlight: var(--color-cyan-800); /* … */ }
[data-scheme="dark"]  { --surface: var(--color-navy-950); --ink: var(--color-white); --accent: var(--color-blue-500); --highlight: var(--color-cyan-500); /* … */ }
[data-scheme="brand"] { --surface: var(--color-navy-900); --ink: var(--color-white); --accent: var(--color-blue-500); --highlight: var(--color-cyan-500); /* … */ }
```
No `prefers-color-scheme` handling: the template's dark-mode block in `globals.css` is removed.

### 2.4 Other tokens
| Group | Tokens |
|-------|--------|
| Radius | `sm 4px` (buttons, inputs), `md 8px` (cards, media), `lg 16px` (large panels), `full` (pills) |
| Shadow | `raised` (header on scroll, dropdowns) only; everything else uses lines and surface contrast |
| Border | 1 px everywhere; 2 px only for focus rings |
| Z-index | `base 0`, `raised 10`, `header 40`, `overlay 50`, `menu 60`, `toast 70`, `skip 100` |
| Motion | durations `micro 150ms`, `ui 250ms`, `reveal 600ms`, `cinematic 1200ms`; easings `out-expo cubic-bezier(0.16,1,0.3,1)`, `in-out-quart cubic-bezier(0.76,0,0.24,1)`, `standard cubic-bezier(0.2,0,0,1)` |
| Gradient | `--gradient-spectrum: linear-gradient(90deg, purple-500, blue-600, cyan-500)` on light; `purple-300 → blue-300 → cyan-300` on dark schemes (mirrors the logo mark, left to right). Allowed on rules ≤ 2 px (hero eyebrow rule, CTA band top edge, active filter indicator) and on at most one display word per page, on dark schemes only, where every stop keeps ≥ 4.5:1. Never a background fill, never body text |

## 3. Typography

| Role | Family (`next/font/google`) | Weights | CSS var |
|------|-----------------------------|---------|---------|
| Display and UI | Manrope (variable) | 500–800 | `--font-display` |
| Body | Inter (variable) | 400–600 | `--font-sans` |
| Labels and data | Geist Mono | 400, 500 | `--font-mono` |

Fluid scale (`clamp`), line height, tracking:

| Style | Size | Line height | Tracking | Use |
|-------|------|-------------|----------|-----|
| `display-2xl` | clamp(3.5rem, 1rem + 9vw, 10rem) | 0.9 | −0.04em | Projects hero `h1`, outlined portfolio numbers |
| `display-xl` | clamp(2.75rem, 2rem + 3.5vw, 5.5rem) | 0.95 | −0.03em | Home hero `h1`, case-study titles |
| `display-lg` | clamp(2.25rem, 1.6rem + 2.6vw, 4rem) | 1.0 | −0.025em | Page hero `h1`, section titles |
| `heading-md` | clamp(1.5rem, 1.25rem + 1vw, 2rem) | 1.15 | −0.015em | `h2`/`h3` within sections |
| `heading-sm` | 1.25rem | 1.3 | −0.01em | Card titles |
| `body-lg` | 1.125rem | 1.6 | 0 | Ledes |
| `body` | 1rem | 1.65 | 0 | Paragraphs |
| `body-sm` | 0.875rem | 1.5 | 0 | Captions, meta |
| `label` | 0.75rem mono, uppercase | 1 | 0.14em | Eyebrows, nav labels, counters |

Rules: body measure ≤ 65ch, display measure ≤ 20ch, headings in `font-display`, numbers in `font-mono` with `tabular-nums`, no faux bold or italic, text never below 0.75rem. The Arabic in the logo is artwork; no Arabic typesetting is needed in v1.

## 4. Spacing and layout system

- Base unit 4 px; use Tailwind's default spacing scale.
- Containers: `content` 1280 px (text-led sections), `wide` 1440 px (media grids), `full` (bleeds). Gutters: 16 px (< 640), 24 px (≥ 640), 40 px (≥ 1024), 64 px (≥ 1536).
- Grid: 12 columns ≥ 1024, 6 columns ≥ 640, 4 columns below. Gaps 16 / 24 / 32 px.
- Section rhythm: vertical padding `clamp(4rem, 8vw, 8rem)`; `sm` variant `clamp(2.5rem, 5vw, 4rem)`. Adjacent sections with the same scheme share a 1 px `line` divider; scheme changes need no divider.
- Hero heights: Home `min-height: 100svh`; page heros `min-height: 60svh` (desktop) / `auto` (mobile) with the media as a 16:9 block.
- Decorative column guides on dark sections: one 1 px line on each column's start edge (where content aligns) plus one closing the last column, `line` colour at 50 % opacity, `aria-hidden`, hidden below 1024 px.
- Sticky header offset: 80 px desktop, 64 px mobile (`scroll-padding-top` on `html`).

## 5. Responsive breakpoints

Tailwind v4 defaults: `sm 640`, `md 768`, `lg 1024`, `xl 1280`, `2xl 1536`. Design and QA at 360, 390, 768, 1024, 1280, 1536 and 1920 px. Mobile first: write base styles for 360 px, add breakpoints upward. Touch targets ≥ 44 × 44 px. Hover-only affordances must have a visible resting state on touch devices (`@media (hover: hover)` for hover-only effects).

## 6. Header and footer

### 6.1 Header (`SiteHeader`)
- Height 80 px desktop / 64 px mobile. Two variants: `overlay` (transparent over a dark hero, white ink) and `solid` (light surface, 1 px bottom line).
- On scroll past 24 px: becomes compact (64 px), light surface at 92 % with `backdrop-blur`, `raised` shadow, ink flips to dark. Hides on scroll-down, reveals on scroll-up (desktop and mobile), always visible when the menu is open.
- Left: logo lockup (white plate over the hero, none once the header turns light, §2.1). Centre: primary nav — Services (dropdown listing the four services with icon, name and one-line summary), Projects, About, Contact. Right: phone icon link (only if `site.contact.phone` exists) and the primary CTA "Request a quotation" → `/contact/#quote`.
- Services dropdown: opens on hover and on click/Enter, closes on Escape and outside click, arrow-key navigable, `aria-expanded`, `aria-controls`.
- Mobile (< 1024): hamburger → full-screen overlay panel (scheme `brand`): staggered large links (`display-lg`), services as an indented group, contact row (phone, WhatsApp, email) and the CTA pinned at the bottom. Focus trapped, body scroll locked, Escape closes, returns focus to the trigger.
- Active route underlined with a 2 px accent bar; `aria-current="page"`.
- Skip link is the first focusable element on every page.

### 6.2 Footer (`SiteFooter`)
- Scheme `brand`. Top row: logo (§2.1), one-line company description, address (if supplied).
- Four columns ≥ 1024, two at ≥ 640, one below: Services (four links), Company (About, Projects, Contact), Contact (phone, WhatsApp, email, hours — only existing values), and the CTA block ("Have a project in mind?" + an `outline` button: the CTA band directly above already carries the view's primary quote button).
- Bottom bar: © year (computed at build), legal name, privacy link (only if the page exists), back-to-top link.
- Optional watermark: oversized "FMECC" wordmark at 4 % opacity behind the columns, hidden below 1024 px.

## 7. Cards, buttons and controls

### 7.1 Buttons
| Variant | Resting | Hover | Use |
|---------|---------|-------|-----|
| `primary` | `accent` fill (Royal Blue), `accent-ink` white text | `accent-hover`, arrow icon shifts 4 px | One per view: quote CTA |
| `secondary` | navy-900 surface, white text (light scheme) / white surface, navy-950 text (dark) | surface shifts one step | Second action |
| `outline` | transparent, 1 px `line-strong`, ink text | border → ink | Tertiary |
| `ghost` | transparent, ink text | surface-muted | Toolbar, filters |
| `link` | `accent-text`, underline on hover, arrow | arrow shifts | Inline "Explore" |

Sizes `sm 36px`, `md 44px`, `lg 52px`; horizontal padding 16 / 20 / 28 px; radius `sm`; `label` typography at `sm`, `body` at `md`/`lg`, weight 600. Icon slot start or end (Lucide, 18–20 px). Loading state swaps the icon for a spinner and sets `aria-busy`. Focus: 2 px `focus` ring with 2 px offset. Cyan is never a button fill; Purple never appears on buttons.

### 7.2 Cards
- **ServiceCard** — media (4:3) or icon tile, mono index "01", `heading-sm` title, two-line summary, `link` button "Explore". Hover: media scales 1.04 over 600 ms `out-expo`, border → `line-strong`, arrow shifts. Entire card is the link (one `<a>`, title text as the accessible name).
- **ProjectCard** — media 3:2 with bottom gradient overlay on hover, service badge, title, meta line (location · year; only existing fields). Variant `featured` spans two columns.
- **FeatureItem** — icon tile 40 px, title, description. Used for scope and values grids.
- **Stat** — mono value, label, optional note. Only rendered with real data.
- **Card** base: `surface-raised`, 1 px `line`, radius `md`, padding 24 px (32 px ≥ 1024). Interactive cards add `translateY(-2px)` on hover, never shadows.

### 7.3 Form controls
Inputs 48 px tall, 1 px `line-strong` border, radius `sm`, `surface` background, label above (never placeholder-as-label), helper and error text in `body-sm`, error colour `#B42318` with an icon (not colour alone). Selects use the native element styled consistently. Checkbox 20 px with accent check. Focus ring as buttons.

### 7.4 Other
- **Badge**: `label` typography, 1 px border, radius `full`, tones `neutral | accent | brand`.
- **Accordion**: native `<details>`/`<summary>` (works without JavaScript; find-in-page opens a match), 1 px rules between items, mono index, plus icon rotating 45°, content height and opacity animate 250 ms where `::details-content` is supported (opacity only, 150 ms, with reduced motion; elsewhere it opens at once); one open by default on FAQ.
- **Breadcrumbs**: `body-sm`, separators "/", current item `aria-current="page"`.

## 8. Homepage design specification

| # | Section | Layout | Media | Motion (reduced-motion fallback: static end state) |
|---|---------|--------|-------|---------------------------------------------------|
| 1 | Hero | Full viewport; content bottom-left in `content` container; a 2 px `--gradient-spectrum` rule (Home's one purple accent), eyebrow, `display-xl` headline (max 3 lines), 1-line lede, primary + outline buttons; bottom strip with four service quick links (mono index + name) and a scroll cue | `VideoBackground` with poster; gradient overlay `navy-950` 70 % → 20 % | Headline lines reveal with SplitText (stagger 80 ms, 900 ms `out-expo`), media scales 1.08 → 1 over 1.6 s, header fades in last; on scroll the media parallaxes 15 % and dims |
| 2 | Introduction | Two columns ≥ 1024: left eyebrow + `display-lg` statement (≤ 20 words); right: numbered list of the four disciplines with links | None | Statement reveals by line; list items stagger in |
| 3 | Services showcase | ≥ 1024: left column sticky list of four services (index, name, summary, "Explore"); right column media panel that cross-fades as the active service changes while scrolling (ScrollTrigger pin, scrub). < 1024: a short full-width frame above the list, pinned under a header-high band in portrait; each service becomes active as it crosses 60 % of the viewport and the frame cross-fades to its landscape hero image | One 4:5 image per service (video optional for telecom); the service hero below 1024 | Active item: index turns `highlight` (cyan), title `ink`, others `ink-muted`; media cross-fade 500 ms with 1.04 scale |
| 4 | How we deliver | Scheme `dark`; left: step list (01–05) that fills as the user scrolls; right: `LazyScene` tower whose assembly progress follows the step progress; whenever the scene is not drawing (loading, no WebGL, low tier) the poster assembles in bands with the same progress (ground, seven lattice sections, antenna crown; reversed when scrolling back) | Poster + 3D | ScrollTrigger scrub drives both the step fill and `progress` (0–1) passed to the scene |
| 5 | Featured projects | Section header + pinned horizontal gallery of `ProjectCard` (featured variant) ≥ 1024; native horizontal scroll with snap < 1024; "All projects" link | 3:2 images | Horizontal scrub tied to vertical scroll; cards parallax slightly |
| 6 | From concept to construction | Scheme `dark`; text left (5/12), 4:5 comparison panel right: the concept drawing traced from the building poster vs the poster itself, draggable divider; labelled illustrative | Concept drawing + building poster | Media-scale reveal; one-time divider hint sweep (none with reduced motion) |
| 7 | Why FMECC | Four numbered cards (icon, title, description, cyan rule) in a 4-column grid (2 on tablet, 1 on mobile) on `surface-muted` | Icons | Stagger reveal; hover strengthens the border and extends the rule |
| 8 | CTA band | Scheme `brand`; `display-lg` prompt, one-line support, primary CTA + contact channels | Column guides | Single reveal |

Every page except Contact also carries the floating "Get a quote" shortcut (royal blue pill, navy icon disc with a cyan glyph) once the first viewport has scrolled past; it steps aside over the CTA band and the footer.

If `company.stats` is empty, no statistics band exists; do not leave an empty gap or placeholder numbers.

## 9. Service page design guidelines

### 9.1 Template
1. **PageHero** (scheme `brand` or `dark`): breadcrumbs, eyebrow "Service 02", `display-lg` title, lede, primary CTA ("Request a quotation" with service preselected), 16:9 media (image or video).
2. **Overview**: two columns — positioning text (≤ 120 words) and "Who it is for" list.
3. **Scope of work**: `FeatureItem` grid (3 columns ≥ 1024).
4. **Delivery process**: numbered horizontal steps ≥ 1024 (connected by a rule with cyan `highlight` ticks), vertical below; scroll reveals each step.
5. **Showcase**: the service's `showcase` key selects a 3D scene, the coverage diagram, or a gallery. Each is self-contained with a poster fallback.
6. **Related projects**: up to three `ProjectCard`s filtered by service; hidden when none exist.
7. **FAQ**: `Accordion`.
8. **CTA band**.

### 9.2 Per-service visual identity
| Service | Hero mood | Showcase | Cyan technical detail |
|---------|-----------|----------|--------------|
| Building Construction | Low-horizon site photography, concrete and steel tones | 3D massing assembling floor by floor | Floor-count ticks |
| Telecom Tower Rollout | Tower against sky, wide and vertical | Procedural lattice tower assembling bottom-up | Section markers |
| Security Systems | Night-time or control-room context, cooler grade | SVG coverage diagram: cameras sweep, zones fill | Coverage zones |
| Hydraulic Bollards | Close product detail, cool highlights | 3D bollard rising/lowering on scroll; hover nudges | Rise indicator |

Service pages share identical rhythm and components; only media, showcase and content differ. No bespoke layouts per service.

### 9.3 Other inner pages
- **About**: PageHero (image), story (two columns), values grid, process section (reused from Home with the same data and the same assembling tower scene), optional leadership and registrations blocks (render only with data), CTA.
- **Services overview**: PageHero (no media), four large alternating panels (media left/right), shared process, CTA.
- **Projects** while concepts stand in: `PortfolioHero` (scheme `dark`, distinct from Home's full-bleed video): breadcrumbs, eyebrow "Illustrative project concepts", a two-line `display-2xl` title ("Selected / concepts", second line indented) whose lines rise out of masks, the lede and the concept notice; on the right a frameless 4:5 render (the building scene poster, the LCP image) that melts into the surface inside cyan corner marks, settles from 1.12, then sinks and dims as the hero leaves; a ruled base bar with plain facts and a scroll cue. Then the filter (text tabs with counts on one rule; the pressed tab carries the 2 px spectrum indicator, which slides to the next pressed tab) and the concepts as full-width editorial features, 7–12 rem apart, in four compositions in turn: a wide 4:3 frame beside the text (the frame sits on the text baseline, the number rises above it), tall 4:5 frames on the right and then on the left, and a 21:9 panorama with the text in a row below. Each feature: the framed hero image with the "Illustrative concept" pill, an outlined `display-2xl` number, the discipline, a `display-lg` title, the summary, a spec row (hypothetical scope, status) and an "Explore concept" disc; the whole feature is one link. Below 1024 px: full-bleed 4:3 images, number and discipline on one line, text below. With real projects: PageHero (no media), the same filter, the card grid, empty state, CTA.
- **Project detail** (verified projects): PageHero with hero media, facts sidebar (sticky ≥ 1024) beside narrative, gallery, related projects, CTA.
- **Concept detail** (a case study): `CaseStudyHero` (scheme `dark`: meta line "Concept 02 / 04 — discipline" with an "Illustrative concept" pill, `display-xl` title, lede beside the actions, then the hero image across the full width at 2:1, 4:3 below 1024 px, labelled on the image; the morph target), `CaseStudyBrief` (light: sticky facts beside the overview, whose first paragraph leads in display type, the notice, then the hypothetical scope as a numbered three-column specification under rules with drawn cyan ticks), the gallery (the concept's own images only, never the hero again), the other concepts as a ruled `ProjectIndex`, the next concept as a full-width `NextProject` panel whose image morphs into that page's hero, CTA.
- **Gallery** (`ProjectGallery`, both detail pages): dark; the header sticky in the left four columns, the images beside it in two staggered columns at their own ratios (a single image takes the full width), each wiped open as it enters and numbered "Fig. 01".
- **Contact**: PageHero (no media), two columns: channels + location (left, 5/12) and quote form (right, 7/12); stacked on mobile with channels first.
- **404**: scheme `brand`, mono "404", short message, links to Services and Contact.

## 10. Animation principles

1. **Purpose first** — animation explains structure (reveal along a line, assemble a tower) or confirms interaction. If removing it loses nothing, remove it.
2. **Budget** — per view: one cinematic sequence (hero or showcase), ambient reveals, micro-interactions. Never more than one scroll-pinned section in the viewport at a time.
3. **Library split** — GSAP + ScrollTrigger only for scroll choreography (hero parallax, SplitText headlines, the process fill and scrub, the services switcher, the horizontal gallery); `fade-up` reveals with the Web Animations API and IntersectionObserver, so pages whose only scroll motion is reveals ship no animation library; the accordion is native `<details>` animated with CSS; CSS transitions with `@starting-style` for the header dropdown and mobile menu, so no animation library ships on every page; React 19.3 `ViewTransition` for route cross-fades. Motion (`motion/react`) remains approved for a future component that needs layout animation, but none uses it today. One engine per element, never both.
4. **Reveal catalogue** — `fade-up` (y 24 px → 0, 600 ms `out-expo`, stagger 80 ms; section headers stagger eyebrow, title and lede), `line-reveal` for headlines (SplitText lines, mask overflow; Home and About statements), `media-scale` (the frame fades up while its image settles 1.08 → 1 over 1.4 s), `media-mask` (a surface-coloured cover lifts off the frame from the bottom edge up, 1.2 s `in-out-quart`, while the image settles 1.12 → 1 over 1.6 s; the frame itself never moves), `mask` (children slide up out of a clipping box: the portfolio numbers' digits), `rule-draw` (scaleX 0 → 1 for dividers), `count-fill` for process steps (numbered nodes; the current step is haloed, upcoming steps dimmed). Scroll-linked extras without JavaScript: image parallax (±4 % inside the frame), process progress rules, the portfolio numbers drifting against the scroll (`parallax-drift`) and the Projects hero render sinking and dimming as it leaves (`scroll-exit`), via CSS scroll-driven animations with a static fallback. Portfolio filter changes are React view transitions (the previous set lifts away in 200 ms, the new set rises in over 700 ms, the indicator slides), never on page load. Everything else needs a design reason.
5. **Scroll choreography** — ScrollTrigger `start: "top 80%"` for reveals; pinned sections use `scrub: 0.6` and `anticipatePin: 1`; pin durations ≤ 150 % of viewport height; no pinning below 1024 px except the horizontal gallery which becomes native scroll.
6. **Native scrolling only** — no smooth-scroll or scroll-jacking libraries; wheel and touch behave normally.
7. **Performance** — animate `transform` and `opacity` only; `will-change` applied just before animating and removed after; no layout-triggering properties in scrub; ScrollTrigger refreshed after fonts and images load.
8. **Timing** — micro 150 ms, UI 250 ms, reveals 600 ms, cinematic ≤ 1.6 s; no delay longer than 400 ms before content is visible.
9. **Reduced motion** — `prefers-reduced-motion: reduce` turns reveals into instant visibility, disables pin/scrub, parallax, SplitText, video autoplay and 3D; UI transitions shrink to opacity-only, 150 ms.
10. **Robustness** — animations must not depend on content length; every animated element has a correct resting state in CSS so the page is complete before JS runs.

## 11. 3D interaction principles

- **Three scenes only** (tower, bollard, building), each procedural geometry (no model files in v1), each ≤ 60 KB of scene code on top of the shared three bundle.
- **Scroll-driven, not free-roam** — the parent passes `progress` (0–1); the scene maps it to assembly, rise or camera orbit. Pointer input adds at most a 6° tilt or a hover nudge; no orbit controls, no zoom.
- **Camera** — slow moves, 35–45° lens, slight low angle for scale; horizon stays stable.
- **Look** — matte steel and concrete materials; white key light, cyan rim light (`cyan-500`) and an optional faint purple bounce light opposite the rim (the only purple in 3D); soft contact shadow; scheme-matched background (transparent canvas over the section surface). Technical overlays (dimension lines, section markers) are cyan. No post-processing passes.
- **Performance** — `frameloop="demand"` with invalidation on progress or pointer change; `dpr` capped at 1.5; `AdaptiveDpr`; instanced meshes for repeated members; dispose geometry and materials on unmount; one canvas per page.
- **Gating** — load only when the section is within one viewport; skip entirely (poster) when WebGL is unavailable, `prefers-reduced-motion: reduce`, device tier `low` (≤ 4 logical cores or ≤ 4 GB memory or Save-Data), or the user is on a 2G connection. A 3G estimate alone does not count: Chrome reports it for any link with more than ~270 ms latency, even on fast desktops. In development, `LazyScene` logs why a scene in view kept its poster.
- **Accessibility** — canvas is `aria-hidden`; an adjacent text alternative describes the subject; the poster image carries meaningful alt text.
- **Scope discipline** — scenes are a Phase 3 enhancement; pages ship complete with posters first.

## 12. Image and video guidelines

### 12.1 Photography art direction
Real site photography preferred. Wide, low-horizon compositions; steel, concrete and sky; crews shown working safely and correctly; equipment in context. Grade: slightly desaturated, cool shadows with a restrained blue cast, clean neutral highlights so Royal Blue and Cyan sit naturally; no warm or orange grading. No heavy HDR, no watermarks, no imagery of other companies' sites presented as FMECC work.

### 12.2 Image specs
| Use | Ratio | Source size | Delivered |
|-----|-------|-------------|-----------|
| Hero / page hero | 16:9 | ≥ 2560 × 1440 | 640, 960, 1280, 1600, 1920 w WebP, q 75 |
| Services showcase | 4:5 | ≥ 1600 × 2000 | same widths |
| Cards | 3:2 or 4:3 | ≥ 1600 w | 320, 480, 640, 960 w |
| Gallery | mixed 3:2 / 4:5 | ≥ 1920 w | all widths |
| OG image | 1.91:1 | 1200 × 630 PNG | as-is |

Originals live in `media-src/<section>/<name>.jpg`; `npm run images` writes `public/images/<section>/<name>-<w>.webp`. Components reference `/images/<section>/<name>.webp` with explicit `width`, `height`, `alt` and a `sizes` attribute. Only the hero image on each page uses `preload`. File names: kebab-case, descriptive (`telecom-tower-erection-crew.jpg`).

### 12.3 Video specs
- Hero loop 8–12 s, 1920 × 1080, 24–30 fps, no audio track, H.264 MP4 (≤ 3 MB) plus VP9 WebM (≤ 2 MB); poster = first frame as WebP.
- Attributes: `autoPlay muted loop playsInline preload="none"`; source attached only when in view, motion is allowed and Save-Data is off; paused when off-screen. The Home hero plays from 1024 px only: narrower screens get the poster alone, with no video request.
- Project videos: ≤ 60 s, user-initiated playback with native controls, poster required.
- Never autoplay with sound; never rely on video to convey text.

### 12.4 Placeholders
Until real media arrives, use in-repo neutral placeholders (flat `navy-800` panels with a faint 40 px drafting grid, a short cyan rule and the mono label "Media placeholder", followed from 640 px up by the intended shot, which is the asset's alt text) flagged `placeholder: true` in data so they are easy to find and impossible to ship unnoticed. Each panel doubles as the brief for the photo that replaces it.

## 13. Accessibility and reduced motion

- Target WCAG 2.2 AA. Text contrast ≥ 4.5:1 (≥ 3:1 for large text and UI boundaries) on every scheme. Computed for the approved palette: Royal Blue on white 7.3:1; white on Royal Blue 7.3:1; `blue-500` fill against navy 3.4:1 with white text on it 5.6:1; `blue-300` on navy 8.8:1; Cyan on navy 9.2:1; `cyan-800` on white 5.8:1; Purple on white 5.9:1; `neutral-500` on white 4.8:1; `neutral-400` on navy 6.2:1. Not allowed: Royal Blue as text on navy (2.6:1), Cyan as text on white (2.0:1), Purple as text on navy (3.1:1).
- Semantic landmarks (`header`, `nav`, `main`, `footer`), one `h1` per page, heading levels never skip.
- Keyboard: every interactive element reachable and operable; visible focus ring on all schemes; menus and overlays trap and restore focus; Escape closes.
- Motion: honour `prefers-reduced-motion` (see §10.9); provide pause for anything that moves longer than 5 s (video background gets a pause control in the hero corner).
- Media: meaningful alt text; decorative images `alt=""`; 3D canvases `aria-hidden` with a text alternative; videos have no audio.
- Forms: visible labels, error text linked by `aria-describedby`, errors announced via a live region, focus moved to the first invalid field, no colour-only cues.
- Touch: targets ≥ 44 px; no hover-only disclosure.
- Zoom and reflow: usable at 200 % zoom and 320 px width without horizontal scrolling.
- Language: `<html lang="en">`; the logo image alt is "Future Middle East Construction Company".
