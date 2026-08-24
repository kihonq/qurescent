# Starlight capabilities for the Qurescent migration

> Reconstructed note: this file was lost mid-session to a git working-tree collision between concurrent
> research agents (never committed the first time). Reconstructed from the original findings summary;
> if a claim here needs a re-check against primary sources, treat it as a starting point, not gospel.

Context: qurescent (Astro 2.0.2 + Solid.js Quran reader) is migrating to Astro Starlight. This
investigates whether Starlight can host both a conventional docs sidebar (tadabbur, tajwid-rules
docs, lineage diagrams, translated content) AND a fully custom interactive "Quran reader" section
(surah index + per-chapter verse view, tajwid-colored Arabic text, word-by-word popovers).

## 1. Custom pages alongside the docs sidebar

Starlight is built on top of ordinary Astro. `src/pages/` (standard Astro file-based routing) coexists
in the same project as `src/content/docs/` (Starlight's sidebar-driven collection). A custom page can
either:
- Wrap itself in `<StarlightPage>` to inherit the shared site shell (header, nav, search), while
  supplying its own body content and skipping the sidebar-autogeneration entirely, or
- Skip the Starlight shell entirely and be a plain Astro page.

Source: Starlight's own docs on "Custom pages" / `StarlightPage` component (starlight.astro.build).

## 2. Interactive framework islands (Solid.js) inside Starlight/MDX

Standard Astro `client:*` hydration directives work inside Starlight/MDX pages. Two caveats found:
- Components must be **directly imported** into the MDX/Astro file — passing components as props or
  resolving them dynamically breaks Astro's static analysis of island boundaries.
- `client:only="solid"` islands that use Solid's `resource`/async primitives need a **manual**
  `<Suspense>` wrapper — Astro's automatic SSR-fallback wrapping only applies to islands that are also
  server-rendered, which `client:only` explicitly is not.

## 3. RTL text and custom typography

Supported at two levels:
- **Global**: Starlight's i18n config supports `locales: { ar: { dir: 'rtl' } }` for a whole locale.
- **Per-page**: a custom page using `<StarlightPage>` can pass `dir="rtl"` and `lang="ar"` directly.

Fonts and tajwid color spans are just ordinary CSS (`customCss` config or scoped stylesheets) —
Starlight doesn't intercept or constrain this, so nothing about the existing color-coding CSS
approach needs to change for Starlight specifically.

## 4. i18n / multi-language routing

Starlight's built-in i18n is **UI/doc-language routing** (which locale's sidebar/nav strings and which
docs collection a URL maps to) — it is not a parallel-translation switcher. It's a reasonable fit for
"Arabic UI + RTL nav," but the wrong shape for "show the same verse in N different Quran translations
simultaneously." The reader will need its own translation-switcher component; Starlight's i18n system
shouldn't be bent to cover this.

## 5. Search (Pagefind)

Starlight ships Pagefind for its built-in Cmd+K search:
- Pagefind indexes **any static HTML on the site automatically**, including custom non-Starlight
  pages — controlled via `data-pagefind-body` / `data-pagefind-ignore` attributes on elements, not
  frontmatter.
- **No Arabic word-stemming support.** Pagefind's search is exact-match for Arabic script — likely
  inadequate for serious Quranic-Arabic search (see the follow-up research ticket/decision on Arabic
  search options, issue #7).

## 6. Diagrams (lineage/timeline)

No official Mermaid support in Starlight. The best-fit option found: **`astro-mermaid`**, a community
package, actively maintained (last published ~June 2026 at time of research), and listed on
Starlight's own "resources"/ecosystem page. A staler alternative exists,
`@pasqal-io/starlight-client-mermaid` (last published ~Feb 2025), less preferable given the
maintenance gap.

## 7. Astro version requirement

Latest Starlight at time of research (`0.41.7`-ish) requires `astro ^7.0.2`. qurescent is pinned to
`astro ^2.0.2` — a five-major-version gap. (See the dedicated upgrade-path research, issue #10 /
`docs/research/astro-upgrade-path.md`, for the detailed breaking-change-by-breaking-change path.)

## 8. Hybrid static+SSR

Astro supports per-page `export const prerender = false` for hybrid static+SSR even when the site's
default `output` is `"static"` — so a narrow SSR exception is technically possible for a custom page
if ever needed. However, Starlight's own doc-collection pages only expose an **all-or-nothing**
`prerender` toggle for the whole collection, and disabling it for the collection **breaks Pagefind**
for that collection (Pagefind indexes the static HTML output, which doesn't exist if prerendering is
off). This is relevant context for the "drop SSR entirely" decision already locked into the map's
Notes — the decision doesn't box us in technically, since hybrid is available if a future need arises,
but Starlight's own collection can't cherry-pick it per-page.
