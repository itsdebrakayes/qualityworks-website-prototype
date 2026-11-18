/**
 * Generic client-side filter controller used by Case Studies and Resources.
 * - Reads/writes filter state to the URL query (?industry=…&service=…) so results are shareable.
 * - Announces result counts via a polite live region.
 * - Shows the empty state when nothing matches; "Clear filters" resets everything.
 *
 * WHY: one small, dependency-free controller gives every listing page the same behaviour
 *   (combinable filters, shareable URL, announced counts, empty state, clear). It is progressive
 *   enhancement: without JavaScript every item is listed (FilterBar.astro renders all items).
 *
 * USED BY (client <script> blocks): src/pages/case-studies/index.astro, src/pages/resources/index.astro
 *   and src/pages/blog/index.astro. Exercised by QA-23 (case-study filters) and QA-25 (resource hub
 *   filters) in scripts/qa-checks.mjs.
 *
 * EXPECTED MARKUP inside the `bar` form (FilterBar.astro produces most of it):
 *   - <select data-filter="{key}"> with an empty-value "All" option first; one per select filter.
 *   - optional chip groups: an element with data-chip-filter="{key}" containing <button>s with
 *     data-value and aria-pressed; the FIRST button is treated as "All" (it should have no data-value).
 *   - <button data-filter-clear> and an aria-live element with data-filter-count.
 *   The `results` container holds the items; `empty` is the no-results message.
 *
 * HOW TO EXTEND: add another select/chip group to the markup with a new key, then make the page's
 *   `match` function honour `f[key]`. The URL sync and clear logic pick it up automatically.
 *
 * GOTCHAS: the bar, results, empty, clear-button and count elements are all asserted with `!`; if
 *   any is missing the script throws at page load. Only one value per key is supported.
 */
/** Active filters: key (data-filter / data-chip-filter name) to selected value. Keys with no selection are absent. */
type Filters = Record<string, string>;
/**
 * Options for initFilters().
 * - bar: CSS selector of the filter <form>.
 * - results: CSS selector of the container whose children are the filterable items.
 * - empty: CSS selector of the empty-state element shown when nothing matches.
 * - noun: [singular, plural] used in the announced count ("Showing 1 case study").
 * - match: page-specific predicate; return true if element `el` should be visible for filters `f`.
 *   Typically compares `f.someKey` with a data attribute on the item.
 * - itemSelector: optional selector (relative to `results`) for items; defaults to direct children.
 */
interface Opts { bar: string; results: string; empty: string; noun: [string, string]; match: (el: HTMLElement, f: Filters) => boolean; itemSelector?: string }

/**
 * Wire up a filter bar and its results list.
 * @param o see `Opts` above.
 * @returns a small API for page scripts: `apply()` re-runs filtering without touching the URL
 *   (used after a simulated reload), `clear()` resets every filter and focuses the first control,
 *   `announce(msg)` writes a custom message into the live region (e.g. "Loading case studies…").
 */
export function initFilters(o: Opts) {
  const bar = document.querySelector<HTMLFormElement>(o.bar)!;
  const results = document.querySelector<HTMLElement>(o.results)!;
  const empty = document.querySelector<HTMLElement>(o.empty)!;
  const selects = Array.from(bar.querySelectorAll<HTMLSelectElement>('[data-filter]'));
  const chipGroups = Array.from(bar.querySelectorAll<HTMLElement>('[data-chip-filter]'));
  const clearBtn = bar.querySelector<HTMLButtonElement>('[data-filter-clear]')!;
  const count = bar.querySelector<HTMLElement>('[data-filter-count]')!;
  // Items are re-queried on each call so content added after initialisation is still filtered.
  const items = () => Array.from(results.querySelectorAll<HTMLElement>(o.itemSelector ?? ':scope > *'));

  /** Collect the current selections from selects and pressed chips into a Filters object. */
  const read = (): Filters => {
    const f: Filters = {};
    selects.forEach((s) => { if (s.value) f[s.dataset.filter!] = s.value; });
    // A chip group contributes only if its pressed button carries a data-value (the "All" chip has none).
    chipGroups.forEach((g) => { const on = g.querySelector<HTMLButtonElement>('[aria-pressed="true"]'); if (on?.dataset.value) f[g.dataset.chipFilter!] = on.dataset.value; });
    return f;
  };
  /** Write a message into the polite live region (screen readers announce it without moving focus). */
  const announce = (msg: string) => { count.textContent = msg; };
  /**
   * Show/hide items for the current filters, toggle the empty state, update the count and the
   * Clear button, and (when `push` is true) mirror the filters into the URL query string.
   */
  function apply(push = true) {
    const f = read();
    let n = 0;
    // `hidden` (not CSS classes) so hidden items are also removed from the accessibility tree.
    items().forEach((el) => { const show = o.match(el, f); el.hidden = !show; if (show) n++; });
    empty.hidden = n !== 0;
    results.hidden = n === 0;
    const active = Object.keys(f).length;
    clearBtn.disabled = active === 0;
    announce(`Showing ${n} ${n === 1 ? o.noun[0] : o.noun[1]}${active ? ` (${active} filter${active > 1 ? 's' : ''} applied)` : ''}`);
    if (push) {
      const url = new URL(location.href);
      // Set each known key that has a value; delete keys that are now empty so the URL stays clean.
      [...selects.map((s) => s.dataset.filter!), ...chipGroups.map((g) => g.dataset.chipFilter!)].forEach((k) => (f[k] ? url.searchParams.set(k, f[k]) : url.searchParams.delete(k)));
      // replaceState (not pushState): filtering should not add a Back-button entry per change.
      try { history.replaceState(null, '', url); } catch { /* sandboxed viewers may refuse */ }
    }
  }
  /** Reset every select to "All", press the first chip of each group, re-filter, and move focus to the first control. */
  function clear() {
    selects.forEach((s) => (s.value = ''));
    chipGroups.forEach((g) => g.querySelectorAll<HTMLButtonElement>('button').forEach((b, i) => b.setAttribute('aria-pressed', String(i === 0))));
    apply();
    // The Clear button becomes disabled after clearing, so focus must move somewhere useful.
    (selects[0] ?? chipGroups[0]?.querySelector('button'))?.focus();
  }
  // Initial state from URL
  const params = new URLSearchParams(location.search);
  // Only accept a query value that matches a real <option>; unknown values in a hand-edited URL are ignored.
  selects.forEach((s) => { const v = params.get(s.dataset.filter!); if (v && [...s.options].some((op) => op.value === v)) s.value = v; });
  chipGroups.forEach((g) => { const v = params.get(g.dataset.chipFilter!); if (v) g.querySelectorAll<HTMLButtonElement>('button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.value === v))); });
  selects.forEach((s) => s.addEventListener('change', () => apply()));
  // Chips behave like a radio group: pressing one un-presses the others in the same group.
  chipGroups.forEach((g) => g.querySelectorAll<HTMLButtonElement>('button').forEach((b) => b.addEventListener('click', () => {
    g.querySelectorAll('button').forEach((x) => x.setAttribute('aria-pressed', String(x === b))); apply();
  })));
  clearBtn.addEventListener('click', clear);
  // First render: apply URL state without rewriting the URL.
  apply(false);
  return { apply: () => apply(false), clear, announce };
}
