/**
 * Client mushaf search — Lunr over verses + EN/MS (#7).
 * Pagefind remains for docs; Arabic is diacritic-normalized (no lunr-ar stemmer).
 */
import { useEffect, useId, useRef, useState } from "react";
import { normalizeSearchQuery } from "../lib/arabic-normalize";
import { registerQurescentLunrPipeline } from "../lib/lunr-pipeline";

type VerseDoc = {
  chapter: number;
  verse: number;
  surah: string;
  url: string;
  excerpt: string;
  arabic: string;
};

type SearchPayload = {
  version: number;
  count: number;
  index: object;
  docs: Record<string, VerseDoc>;
};

type Hit = {
  id: string;
  score: number;
  doc: VerseDoc;
};

type LunrIndex = {
  search: (q: string) => Array<{ ref: string; score: number }>;
};

type Cache = { index: LunrIndex; docs: Record<string, VerseDoc> };

let cached: Cache | null = null;
let loadPromise: Promise<Cache> | null = null;

async function loadVerseIndex(): Promise<Cache> {
  if (cached) return cached;
  if (loadPromise) return loadPromise;

  loadPromise = (async (): Promise<Cache> => {
    const lunr = (await import("lunr")).default;
    // Must register before Index.load (pipeline names in serialized index).
    registerQurescentLunrPipeline(lunr);

    const res = await fetch("/search/verses.json");
    if (!res.ok) throw new Error(`Failed to load verse index (${res.status})`);
    const payload = (await res.json()) as SearchPayload;
    const index = lunr.Index.load(payload.index) as LunrIndex;
    const next: Cache = { index, docs: payload.docs };
    cached = next;
    return next;
  })();

  try {
    return await loadPromise;
  } catch (err) {
    loadPromise = null;
    throw err;
  }
}

function runSearch(
  index: LunrIndex,
  docs: Record<string, VerseDoc>,
  raw: string,
): Hit[] {
  const q = normalizeSearchQuery(raw);
  if (!q) return [];

  let results: Array<{ ref: string; score: number }>;
  try {
    results = index.search(q);
  } catch {
    results = index.search(
      q
        .split(/\s+/)
        .filter(Boolean)
        .map((t) => `${t}*`)
        .join(" "),
    );
  }

  if (results.length === 0 && !/\*/.test(q)) {
    try {
      results = index.search(
        q
          .split(/\s+/)
          .filter(Boolean)
          .map((t) => `${t}*`)
          .join(" "),
      );
    } catch {
      results = [];
    }
  }

  return results.slice(0, 25).flatMap((r) => {
    const doc = docs[r.ref];
    return doc ? [{ id: r.ref, score: r.score, doc }] : [];
  });
}

export default function VerseSearch() {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [active, setActive] = useState(false);
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<Hit[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">(
    "idle",
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const panel = document.getElementById("qurescent__verse-search");
    if (!panel) return;
    const sync = () => setActive(!panel.hasAttribute("hidden"));
    sync();
    const obs = new MutationObserver(sync);
    obs.observe(panel, { attributes: true, attributeFilter: ["hidden"] });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!active) return;
    let cancelled = false;
    setStatus("loading");
    void loadVerseIndex()
      .then(() => {
        if (!cancelled) {
          setStatus("ready");
          setError(null);
          inputRef.current?.focus();
        }
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          setStatus("error");
          setError(e instanceof Error ? e.message : "Index load failed");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [active]);

  useEffect(() => {
    if (!active || status !== "ready" || !cached) {
      if (!active) setHits([]);
      return;
    }
    const handle = window.setTimeout(() => {
      try {
        setHits(runSearch(cached!.index, cached!.docs, query));
        setError(null);
      } catch (e: unknown) {
        setHits([]);
        setError(e instanceof Error ? e.message : "Search failed");
      }
    }, 120);
    return () => window.clearTimeout(handle);
  }, [query, status, active]);

  if (!active) return null;

  return (
    <div className="verse-search" dir="ltr">
      <label className="sr-only" htmlFor={inputId}>
        Search mushaf verses
      </label>
      <input
        ref={inputRef}
        id={inputId}
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search Arabic, English, or Melayu…"
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        disabled={status !== "ready"}
        className="verse-search__input"
      />

      {status === "loading" && (
        <p className="verse-search__meta">Loading verse index…</p>
      )}
      {(status === "error" || error) && (
        <p className="verse-search__meta verse-search__meta--error" role="alert">
          {error}
        </p>
      )}
      {status === "ready" && !error && query.trim() && (
        <p className="verse-search__meta" aria-live="polite">
          {hits.length === 0
            ? "No verses matched."
            : `${hits.length} result${hits.length === 1 ? "" : "s"}`}
        </p>
      )}

      <ul className="verse-search__results">
        {hits.map(({ id, doc }) => (
          <li key={id}>
            <a href={doc.url} className="verse-search__hit">
              <span className="verse-search__ref">
                {doc.surah}{" "}
                <span className="tabular-nums">
                  {doc.chapter}:{doc.verse}
                </span>
              </span>
              <span className="verse-search__ar" dir="rtl" lang="ar">
                {doc.arabic}
              </span>
              <span className="verse-search__excerpt">{doc.excerpt}</span>
            </a>
          </li>
        ))}
      </ul>

      <style>{`
        .verse-search {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          padding: 0.75rem 1rem 1rem;
          min-height: 12rem;
        }
        .verse-search__input {
          width: 100%;
          border: 1px solid var(--sl-color-gray-5);
          border-radius: 0.375rem;
          background: var(--sl-color-black);
          color: var(--sl-color-white);
          padding: 0.65rem 0.85rem;
          font: inherit;
          font-size: 1rem;
        }
        .verse-search__input:focus {
          outline: 2px solid var(--sl-color-accent);
          outline-offset: 1px;
          border-color: var(--sl-color-accent);
        }
        .verse-search__input:disabled {
          opacity: 0.6;
        }
        .verse-search__meta {
          margin: 0;
          font-size: 0.8125rem;
          color: var(--sl-color-gray-2);
        }
        .verse-search__meta--error {
          color: var(--sl-color-red-high, #f87171);
        }
        .verse-search__results {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          max-height: min(50vh, 22rem);
          overflow: auto;
        }
        .verse-search__hit {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
          padding: 0.65rem 0.75rem;
          border-radius: 0.375rem;
          border: 1px solid var(--sl-color-gray-5);
          text-decoration: none;
          color: inherit;
          cursor: pointer;
        }
        .verse-search__hit:hover,
        .verse-search__hit:focus-visible {
          border-color: var(--sl-color-accent);
          background: color-mix(in oklab, var(--sl-color-accent-low) 45%, transparent);
        }
        .verse-search__ref {
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--sl-color-white);
        }
        .verse-search__ar {
          font-size: 1.125rem;
          line-height: 1.7;
          color: var(--sl-color-white);
        }
        .verse-search__excerpt {
          font-size: 0.8125rem;
          color: var(--sl-color-gray-2);
          line-height: 1.4;
        }
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
      `}</style>
    </div>
  );
}
