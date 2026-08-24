# Astro 2 → Starlight-compatible upgrade path

Research for [#10](https://github.com/kihonq/qurescent/issues/10), child of the wayfinder map [#1](https://github.com/kihonq/qurescent/issues/1). Research date: 2026-08-24.

Scope: qurescent is pinned to `astro ^2.0.2` (`package.json`). `docs/research/starlight-capabilities.md` already established that the latest Starlight (`@astrojs/starlight@0.41.7`) requires `astro: ^7.0.2` — a five-major-version gap. This doc investigates, against Astro's own per-major upgrade guides and each integration's own npm/GitHub metadata, what breaks at each hop (2→3→4→5→6→7), whether qurescent's three integrations (`@astrojs/solid-js`, `@astrojs/tailwind`, `@astrojs/netlify`) survive the jump, and whether an adapter is even needed once the map's static-output decision lands.

Current pins, from `package.json` and `astro.config.ts`:

- `astro: ^2.0.2`
- `@astrojs/solid-js: ^2.0.0`, `solid-js: ^1.6.9`
- `@astrojs/tailwind: ^3.0.0`, `tailwindcss: ^3.2.4`
- `@astrojs/netlify: ^2.0.0` (`netlifyEdgeFunctions()` adapter), `output: "server"`

Latest published versions as of this research (`npm view <pkg> version`): `astro@7.2.4`, `@astrojs/solid-js@7.0.2`, `@astrojs/tailwind@6.0.2` (deprecated — see §7), `@astrojs/netlify@8.2.4`.

---

## 1. Astro 2 → 3: breaking changes relevant to qurescent

Source: [Astro docs, Upgrade to Astro v3](https://docs.astro.build/en/guides/upgrade-to/v3/).

- **Node 16 dropped, Node ≥18.14.1 required.** Qurescent's dev/CI environment must be bumped before this step even starts.
- **`@astrojs/image` removed**, replaced by built-in `astro:assets`. Not applicable — qurescent has no `@astrojs/image` usage or `<Image />`/`<Picture />` components in its current pages.
- **Multiple JSX framework config (`include`/`exclude`)**: only required "if you are using multiple JSX frameworks in the same project." Qurescent uses only Solid, so no action needed here, but this is the version where Astro *introduced* the requirement that would bite if a second framework were ever added.
- **Default port changes from 3000 → 4321**, `compressHTML` defaults to `true`, `scopedStyleStrategy` defaults to `"attribute"`, `image.service` defaults to Sharp instead of Squoosh. All cosmetic/behavioral defaults, not blocking, but worth a visual regression pass on the tajwid-colored Arabic spans (`scopedStyleStrategy` changing to attribute-based scoping can occasionally shift specificity).
- **`astro check` moved out of core** into `@astrojs/check` + requires `typescript` installed directly. Qurescent's `prebuild` script already runs `astro check && tsc --noEmit`, so `@astrojs/check` will need to be added as a devDependency.
- **Lowercase HTTP method endpoint exports (`get`, `post`, …) removed** — not applicable, qurescent has no API endpoints under `src/pages/` today.
- Nothing here touches `src/pages/[id].astro`, `Astro.redirect`, or the `output: "server"` + Netlify Edge Functions adapter directly.

## 2. Astro 3 → 4: breaking changes relevant to qurescent

Source: [Astro docs, Upgrade to Astro v4](https://docs.astro.build/en/guides/upgrade-to/v4/).

- **Vite 4 → 5**, **unified/remark/rehype v10 → v11**: no direct impact — qurescent doesn't ship custom remark/rehype plugins or Vite-specific config in `astro.config.ts`.
- **Adapters must specify `supportedAstroFeatures{}`** — this is an adapter-author concern (relevant to whoever maintains `@astrojs/netlify`, not to qurescent's own config).
- **`ViewTransitions handleForms` deprecated** — not applicable, qurescent doesn't use `<ViewTransitions />`.
- **`Astro.request.params` removed** (already deprecated since 3.0 in favor of `Astro.params`) — qurescent's `[id].astro` already uses `Astro.params.id` (`src/pages/chapter/[id].astro:6`), so this is already compliant.
- No breaking change in this guide touches content collections, `output` mode, or redirects.

## 3. Astro 4 → 5: breaking changes relevant to qurescent

Source: [Astro docs, Upgrade to Astro v5](https://docs.astro.build/en/guides/upgrade-to/v5/).

- **Content Collections rewritten around the new Content Layer API.** Not applicable today — qurescent has no `src/content/` directory (`Glob` search found zero matches). This *would* matter the moment content collections are introduced (e.g. for the docs-sidebar Starlight content), but there is nothing to migrate yet.
- **`output: 'hybrid'` merged into `output: 'static'`.** Qurescent uses `output: "server"`, not `'hybrid'`, so this specific merge doesn't apply, but it's the first version where "static site with some server-rendered pages via `export const prerender = false`" becomes the *single* recommended static-first model — directly relevant once the map's static-output decision is implemented (§8).
- **`getStaticPaths()` `params` are no longer auto-decoded** with `decodeURIComponent`. If qurescent's `[id].astro` gains a `getStaticPaths()` (required once `output` becomes `"static"`, see §8), any percent-encoded chapter IDs would need manual `decodeURI()` — not currently an issue since chapter IDs are plain integers 1–114.
- **`@astrojs/mdx` internal JSX handling moved to the integration itself** — not applicable, qurescent has no MDX integration installed.
- **Route priority order changed** (`experimental.globalRoutePriority` becomes default): redirects and injected routes are now prioritized the same as file-based routes. Qurescent has no `redirects` config or injected routes today, so no observable effect, but worth re-checking if Starlight injects routes later (Starlight's own routes already assume this priority order per the v5 guide's note: "this was already the default behavior in Starlight").

## 4. Astro 5 → 6: breaking changes relevant to qurescent

Source: [Astro docs, Upgrade to Astro v6](https://docs.astro.build/en/guides/upgrade-to/v6/).

- **Node 18 and 20 dropped — Node ≥22.12.0 required.** A second Node floor bump after the v3 one; deployment target must support Node 22.
- **Vite 6 → 7** and the internal **Vite Environments API refactor** — flagged in the guide as mainly an integration/adapter-author concern ("Integration and adapter maintainers should pay special attention"), not an app-code concern for qurescent directly, but it's exactly the kind of change that determines whether `@astrojs/solid-js`/`@astrojs/netlify` need a major bump in lockstep (they do — see §6/§8).
- **Legacy content-collections backwards compatibility fully removed** (the `legacy.collections` flag and un-flagged fallback support both disappear). Still not applicable — no content collections exist in qurescent yet — but this closes the door on ever using the pre-Content-Layer-API shape once collections are eventually added for the Starlight docs.
- **`Astro` object deprecated inside `getStaticPaths()`** (`Astro.site`/`Astro.generator` access there now warns/errors) — relevant only once `[id].astro` gains a `getStaticPaths()` function (§8); that function should not reach for `Astro.site`, using `import.meta.env.SITE` instead if needed.
- **Adapter API changes** (`NodeApp` deprecated, `createExports()`/`start()` deprecated in favor of `entrypointResolution: "auto"`): again an adapter-author concern for `@astrojs/netlify`'s own code, not qurescent's `astro.config.ts`.

## 5. Astro 6 → 7: breaking changes relevant to qurescent

Source: [Astro docs, Upgrade to Astro v7](https://docs.astro.build/en/guides/upgrade-to/v7/).

- **Vite 7 → 8.** Described as "primarily a breaking change for Astro integrations and plugins that depend on Vite internals" — not qurescent's own config.
- **New Rust-based compiler, replacing the Go compiler, is now the only option.** It is *stricter about invalid HTML*: unclosed non-void tags now error at build (previously silently tolerated), and invalid nesting (e.g. a `<div>` inside a `<p>`) is no longer silently auto-corrected. **This is worth a real audit pass** on qurescent's `.astro` templates (`src/pages/chapter/[id].astro`, `src/layouts/Layout.astro`, and any Solid/Astro component markup) before landing Astro 7 — a build that passed under the Go compiler on Astro ≤6 can fail outright under the Rust compiler if there's any unclosed tag or invalid nesting, and CSS color/`url()` serialization can shift too (cosmetic only).
- **`src/fetch.ts` becomes a reserved filename** (advanced routing config). Not applicable — no such file exists in qurescent.
- **New default Markdown processor "Sätteri"** replaces the remark/rehype pipeline by default; `@astrojs/markdown-remark` is no longer installed automatically. Only matters if/when qurescent adopts custom remark/rehype plugins for Markdown/MDX docs content (relevant to the future Starlight docs-sidebar content, not today's app code).
- **`compressHTML` default changes from `true` to `'jsx'`** (JSX-style whitespace stripping between inline elements, e.g. `<span>hello</span> <em>world</em>` can collapse to `helloworld` without an explicit space). **Worth flagging for the tajwid-colored inline `<span>` word-by-word rendering** — if word spans currently rely on incidental whitespace between tags rather than explicit `{" "}` or CSS margins, Arabic word spacing could visibly collapse after this bump and needs a visual check.
- **`@astrojs/db` removed entirely** — not applicable, qurescent doesn't use it.

## 6. Is `@astrojs/solid-js` still maintained and compatible with the latest Astro major?

Yes. `@astrojs/solid-js` is a first-party package that lives inside the `withastro/astro` monorepo itself (`npm view @astrojs/solid-js repository.url` → `git+https://github.com/withastro/astro.git`), so it's released in lockstep with Astro core rather than trailing it.

- Latest published version: `7.0.2`, published **2026-08-06** (`npm view @astrojs/solid-js time`) — under three weeks before this research, confirming active maintenance.
- Its `peerDependencies` are `{ "solid-js": "^1.9.13", "solid-devtools": "^0.34.5" }` (`npm view @astrojs/solid-js peerDependencies`) — no `astro` peer listed at all (again consistent with it being versioned alongside Astro core in the same monorepo/release train rather than declaring a separate peer range).
- **Knock-on effect for qurescent:** the integration's `solid-js` peer floor is `^1.9.13`, well above qurescent's current `solid-js: ^1.6.9` pin — `solid-js` itself will need a bump as part of this migration, independent of the Astro major-version work.

## 7. Is `@astrojs/tailwind` still maintained, or has Astro moved to `@tailwindcss/vite`?

`@astrojs/tailwind` is **officially deprecated** and does not support the Astro version this migration is targeting at all.

- Astro's own integration doc page for it now reads, verbatim: "**Deprecated** — Tailwind CSS now offers a Vite plugin which is the preferred way to use Tailwind 4 in Astro. To use Tailwind in Astro, follow the [styling guide for Tailwind](https://docs.astro.build/en/guides/styling/#tailwind)." — [Astro docs: `@astrojs/tailwind`](https://docs.astro.build/en/guides/integrations-guide/tailwind/)
- The deprecation was introduced in **Astro 5.2**: "As a result, the `@astrojs/tailwind` integration is now deprecated but will continue to work for older versions of Tailwind. To upgrade to Tailwind 4, please uninstall the integration and either use the updated `astro add tailwind` command or follow the Tailwind documentation for manual installation." — [Astro 5.2 blog post](https://astro.build/blog/astro-520/); the corresponding source PR was [`feat(tailwind): support v4` (#13049)](https://github.com/withastro/astro/compare/astro@5.1.10...astro@5.2.0).
- Astro's styling guide confirms the version boundary precisely: "Astro supports both Tailwind 3 and 4. You can add Tailwind 4 support through a Vite plugin to your project with a CLI command, or install legacy dependencies manually to add Tailwind 3 support through an Astro integration. ... In Astro `>=5.2.0`, use the `astro add tailwind` command ... to install the official Vite Tailwind plugin." — [Astro docs: Styles and CSS, "Tailwind"](https://docs.astro.build/en/guides/styling/#tailwind)
- **Confirmed via npm registry that the deprecated integration is hard-incompatible with the target Astro version:** `npm view @astrojs/tailwind peerDependencies` → `{ "astro": "^3.0.0 || ^4.0.0 || ^5.0.0", "tailwindcss": "^3.0.24" }` — it does not declare support for Astro 6 or 7 at all, and its last publish was **2025-03-26** (`6.0.2`, per `npm view @astrojs/tailwind time`), so it isn't being updated to catch up either.
- **What qurescent would need to change:** uninstall `@astrojs/tailwind`, remove it from the `integrations` array in `astro.config.ts`, install `tailwindcss` (v4) + `@tailwindcss/vite`, register `@tailwindcss/vite` under `vite.plugins` instead of `integrations`, delete the Tailwind 3 `tailwind.config.*` file (v4 uses CSS-first `@import "tailwindcss";` config in a global stylesheet instead), and migrate any custom theme values via [Tailwind's own v4 upgrade guide](https://tailwindcss.com/docs/upgrade-guide) — Astro's styling guide's exact migration steps are: "Uninstall the `@astrojs/tailwind` integration... Remove the `@astrojs/tailwind` integration from your `astro.config.mjs`... Then, upgrade your project according to Tailwind's v4 upgrade guide." — [Astro docs: Styles and CSS, "Upgrade from Tailwind 3"](https://docs.astro.build/en/guides/styling/#upgrade-from-tailwind-3)
- Qurescent's Tailwind usage is presently plain utility classes (`container mx-auto`, `flex flex-col`, etc. in `src/pages/chapter/[id].astro`) plus `@tailwindcss/typography` (`prose`/`prose-invert`/`prose-2xl` classes, same file) — no custom `tailwind.config.*` theme extensions were found to need porting beyond what's in `tailwind.config` (not read in this pass; a full audit of `tailwind.config.cjs`/`.js` for custom `theme.extend` values is a follow-up task for whoever implements this).

## 8. Does a static Starlight site still need `@astrojs/netlify` or any adapter?

No adapter is required for a fully static build; adapters exist specifically for on-demand (server) rendering.

- Astro's own on-demand-rendering guide states the requirement precisely: "**To render any page on demand, you need to add an adapter.** Each adapter allows Astro to output a script that runs your project on a specific runtime." — [Astro docs: On-demand rendering, "Server adapters"](https://docs.astro.build/en/guides/on-demand-rendering/)
- The same page notes an adapter *can* still be optionally useful even for an all-static site for unrelated platform features: "You may also wish to add an adapter even if your site is entirely static and you are not rendering any pages on demand. For example, the Netlify adapter enables Netlify's Image CDN, and server islands require an adapter installed to use `server:defer` on a component." — same source. Qurescent uses neither Netlify's Image CDN nor server islands today, so this optional case doesn't apply.
- Astro's general deploy guide describes the plain static path with no adapter mentioned at all: "Build Command: `astro build` or `npm run build`; Publish directory: `dist`" — [Astro docs: Deploy your Astro Site](https://docs.astro.build/en/guides/deploy/) — i.e. the `dist/` output can be deployed directly (to Netlify's static-site hosting, or anywhere else) once `output: "static"` is set and the Netlify Edge Functions adapter is removed.
- **What qurescent would need to change:** remove `adapter: netlifyEdgeFunctions()` and the `@astrojs/netlify` + `@netlify/edge-functions` dependencies entirely, and change `output: "server"` to `output: "static"` (or simply delete the `output` line, since `'static'` is Astro's default) in `astro.config.ts`.
- Note for completeness (not currently applicable, since qurescent has no on-demand pages planned per the map's static-output decision): if a page ever *did* need on-demand rendering later, `@astrojs/netlify` is itself still actively maintained and Astro-7-compatible — `npm view @astrojs/netlify peerDependencies` → `{ "astro": "^7.0.0" }`, last published **2026-08-24** (today, per `npm view @astrojs/netlify time`) — so it isn't a maintenance risk if the static-only decision were ever revisited.

## 9. Does Starlight have an official "add to an existing Astro project" guide?

Yes — Starlight's Manual Setup guide is written specifically for this case, distinct from the `create astro` quickstart.

- "The quickest way to create a new Starlight site is using `create astro` as shown in the Getting Started guide. **If you want to add Starlight to an existing Astro project, this guide will explain how.**" — [Starlight: Manual Setup](https://starlight.astro.build/manual-setup/)
- The guide's steps: run `npx astro add starlight` (installs the integration and adds it to the `integrations` array), configure `starlight({ title: ... })` in `astro.config.mjs`, then create `src/content.config.ts` with `docs: defineCollection({ loader: docsLoader(), schema: docsSchema() })` from `@astrojs/starlight/loaders` and `@astrojs/starlight/schema`, and finally add content under `src/content/docs/`. — same source.
- It also documents the exact scenario in §8 above from Starlight's side: "Documentation pages generated by Starlight are pre-rendered by default regardless of your project's output mode... To enable SSR, follow the 'On-demand Rendering Adapters' guide in Astro's docs to add a server adapter." — [Starlight: Manual Setup, "Use Starlight with SSR"](https://starlight.astro.build/manual-setup/) — confirming again that no adapter is needed unless SSR is explicitly wanted.

## 10. Repo-specific structural finding: `[id].astro` needs `getStaticPaths()` under `output: "static"`

This is the single change most specific to qurescent's own code, and it's a direct, mechanical consequence of the map's already-decided switch from `output: "server"` to `output: "static"` — not something flagged in any Astro major-version upgrade guide, because it isn't a *version* breaking change, it's a routing-mode requirement that has been true since Astro 1.0.

- Astro's routing guide is explicit about the split: "In Astro's default static output mode, these pages are generated at build time, and so you must predetermine the list of `author`s that get a corresponding file. In SSR mode, a page will be generated on request for any route that matches." — [Astro docs: Routing, "Dynamic routes"](https://docs.astro.build/en/guides/routing/) — and further: "Because all routes must be determined at build time, a dynamic route must export a `getStaticPaths()` that returns an array of objects with a `params` property." — same source.
- Qurescent's current `src/pages/chapter/[id].astro` has **no `getStaticPaths()`** — it reads `Astro.params.id` directly and conditionally calls `Astro.redirect("/404")` if the chapter lookup fails (`src/pages/chapter/[id].astro:6-11`). This is exactly Astro's documented **on-demand (SSR)** dynamic-route pattern, which only works today because `output: "server"` is set. Astro's own docs show this same shape as the canonical SSR-mode example: "Because SSR pages can't use `getStaticPaths()`, they can't receive props... If the value doesn't exist in the object, we redirect to a 404 page," followed by `if (!page) return Astro.redirect("/404");` — [Astro docs: Routing, "Modifying the [...slug] example for SSR"](https://docs.astro.build/en/guides/routing/)
- **What qurescent would need to change:** once `output` becomes `"static"`, `src/pages/chapter/[id].astro` must add a `getStaticPaths()` that returns one `{ params: { id: <chapterId> } }` entry per surah (114 total, presumably `1` through `114` as strings/numbers) so all chapter pages are pre-rendered at build time. The "chapter not found" `Astro.redirect("/404")` branch becomes dead code for statically-known-valid IDs (any ID with a page will exist by construction), though it's harmless to keep as a defensive fallback — a build-time redirect via `Astro.redirect()` on a prerendered page generates a static HTML page with a `meta http-equiv="refresh"` redirect rather than an HTTP 301, per Astro's on-demand-rendering guide's general behavior for `Astro.redirect()` outside of on-demand contexts.

## 11. Option landscape: incremental in-repo upgrade vs. fresh Starlight scaffold + port

Not a final decision — presented as an options landscape per the ticket's request, informed by how disruptive each step actually is per the findings above.

**Option A — incremental, version-by-version upgrade inside this repo (2→3→4→5→6→7), then add Starlight:**

- Astro itself provides exactly this path via `npx @astrojs/upgrade`, which is documented as the standard method at the top of every single one of the five upgrade guides consulted (v3 through v7): "Update your project's version of Astro and all official integrations to the latest versions using your package manager... `npx @astrojs/upgrade`."
- Per §1–§5, the actual *app-code* breaking changes qurescent would hit across all five majors are narrow: a Node floor bump (twice: v3 → 18.14.1, v6 → 22.12.0), an `@astrojs/check` devDependency add, a Rust-compiler HTML-strictness audit at v7, a possible whitespace/`compressHTML` visual check at v7, and (independent of any single major) the Tailwind-integration swap and the static-output/`getStaticPaths()` change described in §7/§8/§10. None of the five major-version guides individually surfaces a change that would force a full rewrite of `[id].astro`, `Layout.astro`, or the Solid islands.
- This path lets each step be verified (`npm run build` + visual check) before moving to the next major, which is valuable given the Rust-compiler strictness change (§5) and the `compressHTML` whitespace change (§5) are exactly the kind of silent-breakage risks that are easiest to catch one version at a time rather than after a 5-major jump in one shot.
- Total dependency churn is still real: `@astrojs/tailwind` → `@tailwindcss/vite` + Tailwind 4, `solid-js` `^1.6.9` → `^1.9.13`+, `@astrojs/netlify`/`output: "server"` removed entirely, `@astrojs/check` added, two Node floor bumps, then `npx astro add starlight` (§9) on top.

**Option B — scaffold a fresh Starlight project (`npm create astro@latest -- --template starlight`) and port qurescent's logic over:**

- Starts from Astro 7 + Starlight already wired correctly (per Starlight's own quickstart, distinct from the Manual Setup guide referenced in §9), so none of the five majors' breaking changes need to be individually walked through — they're already resolved in whatever template ships today.
- The actual porting work is concentrated in: moving `src/pages/chapter/[id].astro`, `Verse` (Solid component), `fetchChapter`, and the tajwid-coloring/RTL logic into the new project, wiring `@astrojs/solid-js` (still needed either way, per §6) and Tailwind 4 (needed either way, per §7) fresh rather than migrated, and adding `getStaticPaths()` to `[id].astro` from scratch rather than as a delta (this is needed either way, per §10, so it isn't extra work unique to this option).
- Risk shape is different, not obviously smaller: instead of five bounded, individually-verifiable diffs, this is one larger "does everything still work" pass after the port, with the benefit that there is no intermediate broken state and no risk of missing a subtler behavioral change (e.g. the `compressHTML` whitespace default) that a step-by-step upgrade could paper over by fixing symptoms without noticing the root cause.
- Given the answer in §10 (the SSR→static routing change is required either way, and is arguably the single riskiest content-correctness change — silently generating fewer/wrong chapter pages), and §6–§8 (both remaining integrations need the same swap either way), the *integration-specific* work is identical in both options. The dependency-upgrade-guide breaking changes in §1–§5 are the only actual work that Option B skips.

**Given the two options are close in scope** (the Tailwind swap, the Solid peer bump, the adapter removal, and the `getStaticPaths()` addition are unavoidable either way), the deciding factor is whether qurescent's current `src/` surface is small enough that a fresh-scaffold port is faster than five sequential `npx @astrojs/upgrade` passes with a build+visual check after each. Based on the `Glob` search in this research (3 `.astro` page files, 1 layout, Solid islands, no content collections yet), the surface area is small — but that same smallness also makes the incremental path cheap and lower-risk, since it doesn't discard the ability to bisect "which major broke this" while walking through 2→3→4→5→6→7 checkpoints. Both options are viable; this doc does not pick one.

---

## Summary of primary sources consulted

- Astro upgrade guides: [v3](https://docs.astro.build/en/guides/upgrade-to/v3/), [v4](https://docs.astro.build/en/guides/upgrade-to/v4/), [v5](https://docs.astro.build/en/guides/upgrade-to/v5/), [v6](https://docs.astro.build/en/guides/upgrade-to/v6/), [v7](https://docs.astro.build/en/guides/upgrade-to/v7/)
- Astro docs: [Routing](https://docs.astro.build/en/guides/routing/), [On-demand rendering](https://docs.astro.build/en/guides/on-demand-rendering/), [Deploy your Astro Site](https://docs.astro.build/en/guides/deploy/), [Styles and CSS](https://docs.astro.build/en/guides/styling/), [`@astrojs/tailwind`](https://docs.astro.build/en/guides/integrations-guide/tailwind/)
- Astro blog: [Astro 5.2](https://astro.build/blog/astro-520/)
- Astro GitHub: [`astro@5.1.10...astro@5.2.0` compare (Tailwind 4 support PR #13049)](https://github.com/withastro/astro/compare/astro@5.1.10...astro@5.2.0)
- Starlight docs: [Manual Setup](https://starlight.astro.build/manual-setup/)
- Tailwind CSS docs: [Install Tailwind CSS with Astro](https://tailwindcss.com/docs/installation/framework-guides/astro), [Upgrade guide](https://tailwindcss.com/docs/upgrade-guide)
- npm registry, queried live via `npm view <pkg>[@<version>] <field>`: `astro` (`versions`, `dist-tags`), `@astrojs/solid-js` (`version`, `peerDependencies`, `time`, `repository.url`), `@astrojs/tailwind` (`version`, `peerDependencies`, `time`), `@astrojs/netlify` (`version`, `peerDependencies`, `time`, `versions`)
- qurescent's own `package.json`, `astro.config.ts`, and `src/pages/chapter/[id].astro` (for the current dependency pins and the repo-specific dynamic-route/redirect pattern analyzed in §10)
- `docs/research/starlight-capabilities.md` (already-established Astro `^7.0.2` peer requirement for latest Starlight, not re-derived here)
