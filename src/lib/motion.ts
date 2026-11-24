/**
 * MOTION SYSTEM — one small client-side library behind every animation and interaction on the site
 * (redesign, docs/16-redesign-system.md §3). Pages opt in with data-* attributes; no page writes its own
 * animation loop.
 *
 * PRINCIPLES
 *   - Content is complete and readable without JavaScript and with reduced motion. Every effect is an
 *     enhancement: CSS shows the final state by default and only `html.js-motion` arms the start states.
 *   - prefers-reduced-motion: reduce → nothing moves (no parallax, tilt, counters or auto-cycling);
 *     interactive controls (carousels, tabs, story steps) still work, instantly.
 *   - One rAF loop for all scroll/pointer work; passive listeners; transforms and opacity only.
 *
 * ATTRIBUTES (all optional, combine freely)
 *   data-reveal[="up|scale|mask|left|right|fade"]  animate in once when 20% visible. Children of
 *                                       [data-reveal-stagger] get --i (0,1,2…) for staggered delays.
 *   data-parallax="0.15"                translateY proportional to the element's distance from viewport
 *                                       centre (positive = slower than scroll). Off below 768px.
 *   data-pointer-scene                  container that writes --mx/--my (-1…1) from the pointer; children
 *                                       use them in CSS, e.g. transform: translate(calc(var(--mx)*12px)…).
 *   data-tilt[="8"]                     3D tilt toward the pointer, max N degrees (default 8).
 *   data-count                          the element's text is a number (e.g. "16+", "$30M", "90%"); it counts
 *                                       up from 0 when visible. The final text stays in the DOM for assistive
 *                                       tech (an aria-hidden copy animates).
 *   data-scroll-progress                writes --p (0…1) as the element travels through the viewport.
 *   data-story / data-step              scroll-driven sequence: the [data-story] element gets
 *                                       data-active="N" for the step nearest the viewport centre.
 *   data-cycle="4000" + [data-cycle-tab] auto-advancing states (demos). Writes data-state="N" on the
 *                                       container; tabs (buttons with data-cycle-tab="N") select a state and
 *                                       stop the auto-advance; [data-cycle-panel="N"] elements get .is-active
 *                                       (and `hidden` when they also carry data-cycle-hide). Pauses on
 *                                       hover/focus and when off-screen. data-cycle-count overrides N.
 *   data-carousel                       accessible slider: [data-carousel-track] of [data-slide]s,
 *                                       [data-carousel-prev]/[data-carousel-next], [data-carousel-dots].
 *                                       Arrow keys, swipe, and an aria-live status line.
 *
 * USED BY: BaseLayout (imported once on every page).
 */

const reduce = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Reveal ---------- */
function initReveal() {
  document.querySelectorAll<HTMLElement>('[data-reveal-stagger]').forEach((group) => {
    [...group.children].forEach((c, i) => (c as HTMLElement).style.setProperty('--i', String(i)));
  });
  const els = document.querySelectorAll<HTMLElement>('[data-reveal], .reveal, [data-words]');
  if (reduce() || !('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('is-visible')); return; }
  // Replays: an element that leaves the viewport entirely is reset, so its animation runs again when the
  // visitor scrolls back to it (requested 24 Nov 2026).
  const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (e.isIntersecting && e.intersectionRatio > 0.1) e.target.classList.add('is-visible');
    else if (!e.isIntersecting) e.target.classList.remove('is-visible');
  }), { rootMargin: '0px 0px -8% 0px', threshold: [0, 0.12] });
  els.forEach((e) => io.observe(e));
}

/* ---------- Counters ---------- */
function initCounters() {
  const els = document.querySelectorAll<HTMLElement>('[data-count]');
  els.forEach((el) => {
    const final = el.textContent?.trim() ?? '';
    const m = final.match(/^(\D*?)(\d+(?:\.\d+)?)(.*)$/);
    if (!m) return;
    const [, pre, num, post] = m;
    const target = parseFloat(num);
    const decimals = num.includes('.') ? num.split('.')[1].length : 0;
    // Visible animated copy (aria-hidden) + the real value for assistive tech.
    el.innerHTML = `<span aria-hidden="true" class="count__anim">${final}</span><span class="visually-hidden">${final}</span>`;
    if (reduce()) return;
    const anim = el.querySelector<HTMLElement>('.count__anim')!;
    anim.textContent = `${pre}${(0).toFixed(decimals)}${post}`;
    let running = false;
    const io = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) { if (!running) anim.textContent = `${pre}${(0).toFixed(decimals)}${post}`; return; }
      if (running) return; running = true;
      const t0 = performance.now(); const dur = 1400;
      const tick = (t: number) => {
        const k = Math.min(1, (t - t0) / dur); const e = 1 - Math.pow(1 - k, 3);
        anim.textContent = `${pre}${(target * e).toFixed(decimals)}${post}`;
        if (k < 1) requestAnimationFrame(tick); else running = false;
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    io.observe(el);
  });
}

/* ---------- Scroll + pointer loop (parallax, progress, story) ---------- */
function initScroll() {
  const parallax = [...document.querySelectorAll<HTMLElement>('[data-parallax]')];
  const progress = [...document.querySelectorAll<HTMLElement>('[data-scroll-progress]')];
  const stories = [...document.querySelectorAll<HTMLElement>('[data-story]')];
  if (!parallax.length && !progress.length && !stories.length) return;
  let queued = false;
  const update = () => {
    queued = false;
    const vh = window.innerHeight;
    const motion = !reduce() && window.innerWidth >= 768;
    for (const el of parallax) {
      if (!motion) { el.style.transform = ''; continue; }
      const r = el.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) continue;
      const speed = parseFloat(el.dataset.parallax || '0.15');
      const d = (r.top + r.height / 2 - vh / 2) * speed;
      el.style.transform = `translate3d(0, ${(-d).toFixed(1)}px, 0)`;
    }
    for (const el of progress) {
      const r = el.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
      el.style.setProperty('--p', p.toFixed(3));
    }
    for (const story of stories) {
      const steps = [...story.querySelectorAll<HTMLElement>('[data-step]')];
      let best = 0, bestD = Infinity;
      steps.forEach((s, i) => { const r = s.getBoundingClientRect(); const d = Math.abs(r.top + r.height / 2 - vh / 2); if (d < bestD) { bestD = d; best = i; } });
      if (story.dataset.active !== String(best)) {
        story.dataset.active = String(best);
        steps.forEach((s, i) => s.classList.toggle('is-active', i === best));
      }
    }
  };
  const queue = () => { if (!queued) { queued = true; requestAnimationFrame(update); } };
  window.addEventListener('scroll', queue, { passive: true });
  window.addEventListener('resize', queue, { passive: true });
  update();
}

function initPointer() {
  if (reduce() || window.matchMedia('(hover: none)').matches) return;
  document.querySelectorAll<HTMLElement>('[data-pointer-scene]').forEach((scene) => {
    let raf = 0;
    scene.addEventListener('pointermove', (e) => {
      const r = scene.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * 2 - 1; const y = ((e.clientY - r.top) / r.height) * 2 - 1;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => { scene.style.setProperty('--mx', x.toFixed(3)); scene.style.setProperty('--my', y.toFixed(3)); });
    }, { passive: true });
    scene.addEventListener('pointerleave', () => { scene.style.setProperty('--mx', '0'); scene.style.setProperty('--my', '0'); });
  });
  document.querySelectorAll<HTMLElement>('[data-tilt]').forEach((el) => {
    const max = parseFloat(el.dataset.tilt || '8') || 8;
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5; const y = (e.clientY - r.top) / r.height - 0.5;
      el.style.setProperty('--ry', `${(x * max * 2).toFixed(2)}deg`); el.style.setProperty('--rx', `${(-y * max * 2).toFixed(2)}deg`);
    }, { passive: true });
    el.addEventListener('pointerleave', () => { el.style.setProperty('--ry', '0deg'); el.style.setProperty('--rx', '0deg'); });
  });
}

/* ---------- Auto-cycling demos ---------- */
function initCycle() {
  document.querySelectorAll<HTMLElement>('[data-cycle]').forEach((box) => {
    const n = parseInt(box.dataset.cycleCount || '', 10) || box.querySelectorAll('[data-cycle-tab]').length || 3;
    const every = parseInt(box.dataset.cycle || '4000', 10);
    const tabs = [...box.querySelectorAll<HTMLButtonElement>('[data-cycle-tab]')];
    const panels = [...box.querySelectorAll<HTMLElement>('[data-cycle-panel]')];
    let i = parseInt(box.dataset.state || '0', 10); let timer = 0; let stopped = reduce(); let paused = false; let visible = false;
    const set = (k: number) => {
      i = (k + n) % n; box.dataset.state = String(i);
      tabs.forEach((t) => { const on = t.dataset.cycleTab === String(i); t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1; });
      panels.forEach((p) => { const on = p.dataset.cyclePanel === String(i); p.classList.toggle('is-active', on); p.hidden = !on && p.hasAttribute('data-cycle-hide'); });
    };
    const loop = () => { clearTimeout(timer); if (!stopped && !paused && visible) timer = window.setTimeout(() => { set(i + 1); loop(); }, every); };
    tabs.forEach((t) => {
      t.addEventListener('click', () => { stopped = true; set(parseInt(t.dataset.cycleTab!, 10)); });
      t.addEventListener('keydown', (e) => {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        e.preventDefault(); stopped = true; set(i + (e.key === 'ArrowRight' ? 1 : -1)); tabs[i]?.focus();
      });
    });
    box.addEventListener('pointerenter', () => { paused = true; loop(); });
    box.addEventListener('pointerleave', () => { paused = false; loop(); });
    box.addEventListener('focusin', () => { paused = true; loop(); });
    box.addEventListener('focusout', () => { paused = false; loop(); });
    new IntersectionObserver((en) => { visible = en[0].isIntersecting; loop(); }, { threshold: 0.3 }).observe(box);
    set(i);
  });
}

/* ---------- Carousel ---------- */
function initCarousels() {
  document.querySelectorAll<HTMLElement>('[data-carousel]').forEach((root) => {
    const track = root.querySelector<HTMLElement>('[data-carousel-track]');
    if (!track) return;
    const slides = [...track.querySelectorAll<HTMLElement>('[data-slide]')];
    const status = root.querySelector<HTMLElement>('[data-carousel-status]');
    const dotsBox = root.querySelector<HTMLElement>('[data-carousel-dots]');
    let i = 0;
    const dots = slides.map((_, k) => {
      if (!dotsBox) return null;
      const b = document.createElement('button'); b.type = 'button'; b.className = 'carousel__dot';
      b.setAttribute('aria-label', `Show item ${k + 1} of ${slides.length}`); b.addEventListener('click', () => go(k));
      dotsBox.appendChild(b); return b;
    });
    const go = (k: number) => {
      i = (k + slides.length) % slides.length;
      root.style.setProperty('--slide', String(i));
      slides.forEach((s, j) => { s.setAttribute('aria-hidden', String(j !== i)); s.toggleAttribute('inert', j !== i); s.classList.toggle('is-current', j === i); });
      dots.forEach((d, j) => d?.setAttribute('aria-current', String(j === i)));
      if (status) status.textContent = `Item ${i + 1} of ${slides.length}`;
    };
    root.querySelector('[data-carousel-prev]')?.addEventListener('click', () => go(i - 1));
    root.querySelector('[data-carousel-next]')?.addEventListener('click', () => go(i + 1));
    root.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') go(i + 1); if (e.key === 'ArrowLeft') go(i - 1); });
    let x0 = 0;
    track.addEventListener('pointerdown', (e) => { x0 = e.clientX; }, { passive: true });
    track.addEventListener('pointerup', (e) => { const dx = e.clientX - x0; if (Math.abs(dx) > 40) go(i + (dx < 0 ? 1 : -1)); }, { passive: true });
    go(0);
  });
}

export function initMotion() {
  document.documentElement.classList.add('js-motion');
  if (reduce()) document.documentElement.classList.add('reduced-motion');
  initReveal(); initCounters(); initScroll(); initPointer(); initCycle(); initCarousels();
}
