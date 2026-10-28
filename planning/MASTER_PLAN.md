# FMECC Website — Master Plan

Corporate website for **Future Middle East Construction Company (FMECC)**: a frontend-only, statically exported Next.js 16 (App Router) site.

Companion documents: [DESIGN.md](./DESIGN.md) — visual system · [ARCHITECTURE.md](./ARCHITECTURE.md) — code structure and contracts · [CLAUDE.md](../CLAUDE.md) — working rules.
Planning completed 2026-10-27; the brand palette was approved from the delivered logo the same day (DESIGN.md §2). The foundation (WS-0) and workstreams WS-1 to WS-5 were integrated on `master` on 2026-10-28, and the WS-6 technical hardening pass (performance, accessibility, SEO, visual polish, QA) was completed the same day; real content and media (Phase 4) are still outstanding.

## 1. Objectives

| # | Objective | How we know it is met |
|---|-----------|-----------------------|
| 1 | Position FMECC as a premium, trustworthy engineering and construction partner across four disciplines | Every page follows DESIGN.md; one consistent identity, no template look |
| 2 | Convert visitors into quotation requests (primary) and direct contact by phone / WhatsApp / email (secondary) | Quote CTA reachable in one tap from any page; the form works on static hosting |
| 3 | Give each service an authoritative, indexable page | Four service pages with unique metadata, structured data and internal links |
| 4 | Show delivered work credibly | Only real projects, figures and credentials appear in production |
| 5 | Fast, accessible, mobile-first, host-agnostic | Budgets in §8 met; Lighthouse mobile ≥ 90 performance, 100 accessibility and SEO |

Out of scope for v1: CMS, authentication, blog/news, careers portal, Arabic localisation (see §10), e-commerce, any backend.

## 2. Target audience and user journeys

| Audience | What they need to see | Typical entry | Conversion |
|----------|-----------------------|---------------|------------|
| Developers and property owners (building construction) | Capability, process discipline, delivered buildings | Home → Building Construction | Quote request |
| Telecom operators and tower companies (rollout) | Site-build experience, safety and QA process, scale | Search → Telecom service page → Projects filtered by service | Quote / email |
| Facility and security managers | Installation plus maintenance contracts, response model | Security service page | Phone / WhatsApp |
| Villas, compounds, commercial and government sites (bollards) | Product understanding, installation, after-care | Search → Bollard service page | WhatsApp / quote |
| Procurement and prequalification teams | Company profile, scope, registrations, contacts | About → Projects → Contact | Email |

Journey rules:
- Every page reaches a quotation CTA within one tap (header button on desktop, sticky CTA on mobile).
- A service page answers, in order: what we do → who it is for → how we deliver → proof → next step.
- Contact channels are visible without scrolling on the contact page at phone width.
- Service pages deep-link to the quote form with the service preselected: `/contact/?service=<slug>`.

## 3. Sitemap and page requirements

| Route | Page | Purpose | Required content | Phase |
|-------|------|---------|------------------|-------|
| `/` | Home | Cinematic overview; route to services and quote | §5 | 2 |
| `/about/` | About | Who FMECC is, how it works, why it can be trusted | Company statement, values, delivery process, HSE commitment (generic), leadership and registrations **only if supplied** | 2 |
| `/services/` | Services overview | Compare the four disciplines | Four service panels, shared process, CTA | 2 |
| `/services/building-construction/` | Service | Authoritative page | §4 template | 2 |
| `/services/telecom-tower-rollout/` | Service | Authoritative page | §4 template | 2 |
| `/services/security-systems/` | Service | Authoritative page | §4 template | 2 |
| `/services/hydraulic-parking-bollards/` | Service | Authoritative page | §4 template | 2 |
| `/projects/` | Portfolio | Browse delivered work by service | Filterable grid (§6) | 2 |
| `/projects/[slug]/` | Project detail | Proof of delivery | Hero, facts, narrative, gallery, related projects | 2 |
| `/contact/` | Contact and quotation | Convert | Channels, quote form, location, hours (§7) | 2 |
| `404` | Not found | Recover | Links to services and contact | 1 |
| `/privacy/` | Privacy | Legal | Only when the client supplies the text | 4 (optional) |

Common to every page: unique `<title>` (≤ 60 chars) and description (≤ 155 chars), exactly one `h1`, breadcrumbs on non-home pages, Open Graph image, CTA band before the footer, shared header and footer, skip link, logical heading order.

## 4. The four services

Shared page template (DESIGN.md §9): hero → overview → scope of work → delivery process → showcase (3D, diagram or gallery) → related projects → FAQ → CTA.

Content requirements per service. Scope items are **candidate** items for FMECC to confirm, trim or extend; nothing below is a verified business claim.

### 4.1 Building Construction — `building-construction`
- Positioning: end-to-end construction delivery for residential, commercial and industrial buildings (confirm segments).
- Candidate scope: civil and structural works, MEP coordination, finishing and fit-out, site management, QA/QC, handover documentation.
- Process: consult → design coordination → mobilise → build → commission → handover.
- Media: construction-site photography, time-lapse video (optional), finished-building imagery.
- Showcase: 3D building massing that assembles floor by floor on scroll (Phase 3); gallery fallback.
- FAQ themes: typical durations, permits and approvals, subcontractor management, safety on site.

### 4.2 Telecom Tower Rollout and Site Construction — `telecom-tower-rollout`
- Positioning: turnkey site construction for telecom networks: greenfield and rooftop (confirm).
- Candidate scope: site survey and civil foundations, tower erection (lattice, monopole, rooftop), shelters and power, earthing and grounding, equipment installation support, acceptance testing, documentation.
- Process: survey → design and approvals → civil works → erection → installation → acceptance.
- Media: tower-erection photography against sky, site-wide shots, crew-at-height imagery (safety-compliant).
- Showcase: procedural 3D lattice tower that assembles on scroll (signature scene; also used on Home).
- FAQ themes: rollout capacity, HSE standards, working at height, multi-site programmes.

### 4.3 Security System Installation and Maintenance — `security-systems`
- Positioning: design, installation and maintenance of integrated security systems (confirm).
- Candidate scope: CCTV, access control, intrusion detection, perimeter protection, intercom and gate systems, integration and control rooms, preventive maintenance and service contracts.
- Process: assessment → design → installation → commissioning → maintenance plan.
- Media: installed-camera and control-room imagery in context; avoid generic stock where possible.
- Showcase: 2D animated coverage diagram (SVG, scroll-driven); no 3D.
- FAQ themes: maintenance contracts and response, integration with existing systems, compliance.

### 4.4 Hydraulic Parking Bollard Installation — `hydraulic-parking-bollards`
- Positioning: supply and installation of automatic hydraulic bollards for access control (confirm product sources before naming any brand).
- Candidate scope: site assessment, civil works, hydraulic units and bollards, control systems and access methods, safety features, commissioning, maintenance.
- Process: assessment → specification → civil works → installation → commissioning → maintenance.
- Media: close-up product imagery, installed context (villa, compound, commercial entrance), short rise/lower video.
- Showcase: 3D bollard that rises and lowers on scroll with hover interaction (Phase 3).
- FAQ themes: cycle time, power failure behaviour, maintenance intervals, suitable sites.

## 5. Homepage section order

| # | Section | Job | Notes |
|---|---------|-----|-------|
| 1 | Hero | Cinematic first impression, state what FMECC does, two CTAs | Background video with poster fallback; headline reveal; service quick-links strip at the bottom |
| 2 | Introduction | One-paragraph company statement and the four disciplines as a numbered list | Statistics band renders **only** when real figures exist in `company.stats` |
| 3 | Services showcase | Present the four services with strong media | Sticky scroll switcher on desktop, stacked cards on mobile; each links to its page |
| 4 | How we deliver | Process steps with a signature visual | Scroll-scrubbed step timeline; 3D tower scene (lazy, poster fallback) or gallery |
| 5 | Featured projects | Proof | Horizontal gallery on desktop, swipe carousel on mobile; links to `/projects/` |
| 6 | Why FMECC | Principles: safety, quality, schedule, compliance | Generic principles, no unverifiable claims |
| 7 | CTA band | Convert | "Request a quotation" plus phone / WhatsApp / email |
| 8 | Footer | Navigation and contact | Shared widget |

## 6. Project portfolio requirements

- Data model: `Project` in ARCHITECTURE.md §7 (slug, title, services, location, year, client, status, summary, scope, hero, gallery, video, featured).
- Listing page: responsive grid (1 / 2 / 3 columns), filter chips by service, "All" default, filter state mirrored in `?service=` so links from service pages preselect it. Empty state when a filter has no projects.
- Detail page: hero media, facts sidebar (service, location, year, client, status — only fields that exist), narrative paragraphs, scope list, gallery with lightbox-free grid (keep simple), related projects by service, CTA band.
- Media per project: hero ≥ 1920 × 1080, 4–8 gallery images, optional video. Alt text required for every image.
- Placeholder policy: during development, entries carry `placeholder: true`, render a visible "Sample" badge and never ship. Production acceptance requires zero placeholder entries; if no real projects are available at launch, the listing renders a "Portfolio in progress" state and the Home featured-projects section is hidden.
- Never invent clients, locations, values or dates. Optional fields stay empty rather than guessed.

## 7. Contact and quotation experience

Contact page layout (DESIGN.md §9.3): contact channels and location on one side, quotation form on the other; stacked on mobile with channels first.

Channels (each renders only if present in `site.contact`; missing values are omitted, never faked):
- Phone (`tel:`), WhatsApp (`https://wa.me/<E.164>?text=<prefilled>`), email (`mailto:`), office address, office hours.
- Map: static map image linking to Google Maps (no iframe on first load).

Quotation form (`QuoteRequestForm`):
- Fields: full name*, company, email*, phone*, service* (four services + "Other"), project location, project brief*, preferred contact method, consent checkbox*. Honeypot field for spam.
- Preselect service from `?service=<slug>`.
- Delivery (no backend): `POST` JSON to `NEXT_PUBLIC_FORM_ENDPOINT` (a Formspree-compatible endpoint supplied by the client; Web3Forms would also need its access key sent in the body). When the variable is unset, the submit button composes a `mailto:` with the form content as a fallback and says so.
- States: idle, submitting, success (clear confirmation plus channels to reach FMECC faster), error (retry plus fallback channels).
- Validation: client-side, inline messages, `aria-describedby`, focus moves to the first error, live region for status.
- Privacy line under the form; link to `/privacy/` only when that page exists.

## 8. SEO and performance requirements

SEO
- `metadataBase` from `site.url`; per-page `title`, `description`, canonical, Open Graph and Twitter cards; `title.template = "%s | FMECC"`.
- Structured data (JSON-LD): `Organization` on every page (only fields in `site`), `Service` on service pages, `BreadcrumbList` on inner pages, `Project`-level `CreativeWork` optional.
- `sitemap.xml` and `robots.txt` generated at build (`force-static`); every route listed with `lastModified`.
- Semantic HTML, one `h1`, descriptive link text, alt text, no text baked into images.
- Open Graph image: one brand image at the root; service and project pages point to their hero image.

Performance budgets (gzipped, mobile)
| Item | Budget |
|------|--------|
| Core Web Vitals | LCP ≤ 2.5 s, CLS ≤ 0.1, INP ≤ 200 ms on a mid-range Android over 4G |
| JS shared by every route | Not budgeted, re-measured on every Next/React upgrade: 187 KB (Next 16.4.3 + React 19.3 runtime ≈ 173 KB, header and root layout ≈ 14 KB) |
| JS per route on top of the shared JS (excluding 3D) | ≤ 60 KB, so ≤ 250 KB in total; GSAP + ScrollTrigger ≤ 45 KB, only on routes with scroll choreography; Motion ≤ 20 KB if a component ever needs it (none does since WS-6) |
| 3D bundle | ≤ 300 KB, loaded only when a scene approaches the viewport, never on first paint |
| Fonts | ≤ 120 KB total, `display: swap`, self-hosted via `next/font` |
| Hero image (1920 w) | ≤ 250 KB; card images ≤ 80 KB |
| Hero video | ≤ 3 MB, loaded after LCP, poster is the LCP element |
| Lighthouse (mobile) | Performance ≥ 90, Accessibility 100, Best Practices ≥ 95, SEO 100 |

The original "≤ 190 KB total per route" could not hold: the framework alone measured 173 KB in WS-0. The JS rows above were re-stated at integration and re-measured after WS-6 (2026-10-28, gzipped JS referenced by each exported page, static export of `master`):

| Route | Integration | After WS-6 | On top of shared (after) | Status |
|-------|-------------|------------|--------------------------|--------|
| shared by every route | 187.0 KB | 187.1 KB | — | not budgeted |
| `/` | 238.9 KB | 239.9 KB | 52.8 KB (GSAP + ScrollTrigger + SplitText) | within |
| `/about/` | 237.3 KB | 235.0 KB | 47.9 KB (GSAP + ScrollTrigger for the process scrub) | within |
| `/services/` | 235.1 KB | 189.5 KB | 2.4 KB | within |
| `/services/<slug>/` (×4) | 279.7 KB | 194.8 KB | 7.7 KB (no GSAP, no Motion) | within (was over) |
| `/projects/` | 190.9 KB | 191.1 KB | 4.0 KB | within |
| `/contact/` | 194.5 KB | 194.7 KB | 7.6 KB | within |
| 3D, on demand only | three + R3F + Drei 233.3 KB, canvas 6 KB, each scene 7.5–9.1 KB | unchanged | | within 300 KB |

WS-6 changes behind the numbers: the FAQ accordion became native `<details>` with CSS (Motion, 39 KB, left the bundle entirely); `Reveal` moved from GSAP to IntersectionObserver + the Web Animations API, so pages whose only scroll motion is reveals ship no GSAP (~44 KB); SplitText is registered only by Home's line reveal (−2.6 KB on About). Home grew 0.9 KB because it keeps GSAP for its choreography and also carries the native reveal.

Lab measurements (no field data exists before launch; every figure below is a lab measurement, not real-user Core Web Vitals):
- Lighthouse 13.6.0, mobile preset with simulated throttling, on a gzip-serving static server: Performance 100 on About, Services, a service page, Projects and Contact; Home 96–100 over three runs (one earlier run scored 88 when the hero lede's opacity entrance delayed LCP; the lede now rises without fading). Accessibility, Best Practices and SEO 100 on every audited route. Desktop preset: 100 in all four categories on Home, a service page, Projects and Contact. Simulated LCP 0.76–1.53 s, TBT 16–196 ms, CLS ≤ 0.003.
- Headless Chrome with DevTools throttling (390 px, 4× CPU, 150 ms RTT, 1.6 Mbps, gzip; two runs each, integration → WS-6): LCP Home 1.10 → 1.07–1.14 s, inner pages 1.56–1.70 s on both builds (network-bound); TBT on a service page 72–108 → 18–25 ms, Services overview 36–40 → 6–13 ms, Home 437–648 → 355–503 ms; CLS ≤ 0.004 everywhere. Interaction latency (Event Timing, the data INP uses) stayed below 200 ms for every control: FAQ 16–40 ms (was 48–104 ms), Services menu 72 ms, mobile menu 136–184 ms.

Third-party scripts: none by default. Analytics only through `next/script` with `afterInteractive` behind `NEXT_PUBLIC_ANALYTICS_ID`.

## 9. Image, video and 3D strategy

Tiers (each tier degrades to the one below):
1. **Images (always)** — responsive WebP generated by `scripts/optimize-images.mjs`, served through `next/image` with a custom loader (ARCHITECTURE.md §11). Fixed aspect ratios, no CLS.
2. **Video (enhancement)** — hero background and optional project videos. Muted, looped, `playsInline`, poster always present, loaded only when in view and only when `prefers-reduced-motion: no-preference`.
3. **3D (enhancement)** — three procedural scenes (tower, bollard, building) built with React Three Fiber + Drei, code-split per scene, gated by device tier, reduced-motion preference and WebGL support; poster image fallback in every case.

Rules
- One 3D canvas mounted per page at most. Home uses the tower scene only; service pages use their own scene.
- Every scene has an equivalent still image and a text alternative; nothing is communicated only by motion.
- Placeholder media during development: neutral in-repo SVG/gradient placeholders flagged `placeholder: true`. No stock imagery presented as FMECC work. Licensed generic imagery is acceptable for service illustration only, and is tracked in the content checklist (§13).
- Authoring specs (dimensions, codecs, grading) are in DESIGN.md §12.

## 10. Language and localisation

English-only for v1. The logo contains Arabic and is displayed as supplied; this does not imply a bilingual site. To keep the door open: no user-facing strings hard-coded inside components (content lives in entity data and page modules), `site.locale` drives `<html lang>`, and layouts avoid directional assumptions where cheap (logical CSS properties). Adding `/ar/` later is a content and routing task, not a rewrite.

## 11. Implementation phases

| Phase | Scope | Exit criteria |
|-------|-------|---------------|
| **0 — Setup** | Install approved packages; switch config to static export; tokens, fonts, global CSS; FSD folder skeleton with `index.ts` stubs; `site.ts` with null placeholders; scripts (`lint`, `typecheck`, `check`, `images`) | `npm run check` passes on an empty site; `out/` produced |
| **1 — Foundation** | `shared/ui` primitives, animation utilities, `SiteHeader`, `SiteFooter`, `PageHero`, `CtaBand`, root layout, 404, metadata base, image loader + script, `LazyScene` stub (poster only) | Contracts in ARCHITECTURE.md implemented and frozen; all workstreams can start |
| **2 — Pages** | Home, About, Services overview, four service pages, Projects listing and detail, Contact with working form; GSAP reveals; SEO files | All routes static-exported; content placeholders flagged; Lighthouse accessibility 100 |
| **3 — Enhancement** | Hero video, sticky services switcher, horizontal projects gallery, three 3D scenes, coverage diagram, view transitions | Budgets in §8 still met with enhancements on; graceful fallbacks verified |
| **4 — Hardening and launch** | Real content and media replacement, cross-browser and device QA, accessibility audit, performance audit, static deployment test on the target host | §12 acceptance criteria all pass |

Parallel workstreams within Phases 2–3 are defined in ARCHITECTURE.md §12.

## 12. Acceptance criteria

Functional
- [ ] All routes in §3 render from `out/` on a plain static server (folder `index.html` files, `404.html`).
- [ ] Header, footer, CTA band and breadcrumbs identical in behaviour on every page.
- [ ] Quotation form submits to the configured endpoint; `mailto:` fallback works when unset; preselection via `?service=` works.
- [ ] Project filter updates the grid and the URL; deep links restore the filter.
- [ ] No placeholder entries (`placeholder: true`) or `TODO(content)` markers remain in production data.

Quality
- [ ] Lighthouse mobile: Performance ≥ 90, Accessibility 100, Best Practices ≥ 95, SEO 100 on Home, one service page, Projects, Contact.
- [ ] Core Web Vitals within §8 budgets in a throttled run.
- [ ] Keyboard-only navigation of menu, accordion, carousel and form; visible focus; skip link.
- [ ] `prefers-reduced-motion: reduce` disables scroll-driven motion, video autoplay and 3D; content remains complete.
- [ ] No WebGL → poster fallback; low-tier device → poster fallback; no console errors.
- [ ] Responsive at 360, 390, 768, 1024, 1280, 1536, 1920 px with no horizontal overflow.
- [ ] `npm run check` (lint, typecheck, build) passes.

Content and brand
- [ ] Logo used as supplied; tokens contain only the approved palette (Deep Navy, White, Royal Blue, Cyan, Purple — DESIGN.md §2); no gold, amber or magenta anywhere.
- [ ] No invented clients, statistics, certifications, awards, team members or project facts.
- [ ] Every image has meaningful alt text; videos have no audio; 3D has a text alternative.

## 13. Content replacement checklist

Items FMECC must supply before launch; each maps to a single file so replacement is mechanical.

| Item | Where it lives |
|------|----------------|
| Logo SVG master and inverse (white wordmark) variant; transparent `logo.png` already received (its wordmarks disappear on dark surfaces, DESIGN.md §2.1) | `public/images/brand/` |
| Company description, values, process wording | `src/entities/company/data/company.ts` |
| Phone, WhatsApp, email, address, hours, social links, website URL | `src/shared/config/site.ts` |
| Service copy, scope, FAQs | `src/entities/service/data/<slug>.ts` |
| Projects (facts, narrative, media) | `src/entities/project/data/projects.ts` |
| Hero video and poster | `public/videos/`, `media-src/` |
| Photography per service and project | `media-src/` → `npm run images` |
| Leadership, registrations, certifications (optional) | `src/entities/company/data/company.ts` |
| Form endpoint, analytics ID | `.env.production` (`NEXT_PUBLIC_FORM_ENDPOINT`, `NEXT_PUBLIC_ANALYTICS_ID`) |
| Privacy policy text (optional) | `src/app/privacy/page.tsx` |
