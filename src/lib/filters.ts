/**
 * Generic client-side filter controller used by Case Studies and Resources.
 * - Reads/writes filter state to the URL query (?industry=…&service=…) so results are shareable.
 * - Announces result counts via a polite live region.
 * - Shows the empty state when nothing matches; "Clear filters" resets everything.
 */
type Filters = Record<string, string>;
interface Opts { bar: string; results: string; empty: string; noun: [string, string]; match: (el: HTMLElement, f: Filters) => boolean; itemSelector?: string }

export function initFilters(o: Opts) {
  const bar = document.querySelector<HTMLFormElement>(o.bar)!;
  const results = document.querySelector<HTMLElement>(o.results)!;
  const empty = document.querySelector<HTMLElement>(o.empty)!;
  const selects = Array.from(bar.querySelectorAll<HTMLSelectElement>('[data-filter]'));
  const chipGroups = Array.from(bar.querySelectorAll<HTMLElement>('[data-chip-filter]'));
  const clearBtn = bar.querySelector<HTMLButtonElement>('[data-filter-clear]')!;
  const count = bar.querySelector<HTMLElement>('[data-filter-count]')!;
  const items = () => Array.from(results.querySelectorAll<HTMLElement>(o.itemSelector ?? ':scope > *'));

  const read = (): Filters => {
    const f: Filters = {};
    selects.forEach((s) => { if (s.value) f[s.dataset.filter!] = s.value; });
    chipGroups.forEach((g) => { const on = g.querySelector<HTMLButtonElement>('[aria-pressed="true"]'); if (on?.dataset.value) f[g.dataset.chipFilter!] = on.dataset.value; });
    return f;
  };
  const announce = (msg: string) => { count.textContent = msg; };
  function apply(push = true) {
    const f = read();
    let n = 0;
    items().forEach((el) => { const show = o.match(el, f); el.hidden = !show; if (show) n++; });
    empty.hidden = n !== 0;
    results.hidden = n === 0;
    const active = Object.keys(f).length;
    clearBtn.disabled = active === 0;
    announce(`Showing ${n} ${n === 1 ? o.noun[0] : o.noun[1]}${active ? ` (${active} filter${active > 1 ? 's' : ''} applied)` : ''}`);
    if (push) {
      const url = new URL(location.href);
      [...selects.map((s) => s.dataset.filter!), ...chipGroups.map((g) => g.dataset.chipFilter!)].forEach((k) => (f[k] ? url.searchParams.set(k, f[k]) : url.searchParams.delete(k)));
      history.replaceState(null, '', url);
    }
  }
  function clear() {
    selects.forEach((s) => (s.value = ''));
    chipGroups.forEach((g) => g.querySelectorAll<HTMLButtonElement>('button').forEach((b, i) => b.setAttribute('aria-pressed', String(i === 0))));
    apply();
    (selects[0] ?? chipGroups[0]?.querySelector('button'))?.focus();
  }
  // Initial state from URL
  const params = new URLSearchParams(location.search);
  selects.forEach((s) => { const v = params.get(s.dataset.filter!); if (v && [...s.options].some((op) => op.value === v)) s.value = v; });
  chipGroups.forEach((g) => { const v = params.get(g.dataset.chipFilter!); if (v) g.querySelectorAll<HTMLButtonElement>('button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.value === v))); });
  selects.forEach((s) => s.addEventListener('change', () => apply()));
  chipGroups.forEach((g) => g.querySelectorAll<HTMLButtonElement>('button').forEach((b) => b.addEventListener('click', () => {
    g.querySelectorAll('button').forEach((x) => x.setAttribute('aria-pressed', String(x === b))); apply();
  })));
  clearBtn.addEventListener('click', clear);
  apply(false);
  return { apply: () => apply(false), clear, announce };
}
