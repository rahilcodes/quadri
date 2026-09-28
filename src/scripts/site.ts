/**
 * All behaviour for the page, in one small module (no framework in the browser).
 * Every feature finds its markup through a data attribute and does nothing if
 * the markup is absent, so sections can be removed without touching this file.
 */
import { invalidFields, type ContactField, type ContactFields } from '../../lib/contact';

const root = document.documentElement;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = <T extends Element>(selector: string, scope: ParentNode = document) => scope.querySelector<T>(selector);
const $$ = <T extends Element>(selector: string, scope: ParentNode = document) => [
  ...scope.querySelectorAll<T>(selector),
];

/* ---------- Dialogs: no page scroll behind an open one ---------- */
function openDialog(dialog: HTMLDialogElement) {
  if (dialog.open) return;
  dialog.showModal();
  root.classList.add('dialog-open');
}
for (const dialog of $$<HTMLDialogElement>('dialog')) {
  dialog.addEventListener('close', () => {
    if (!$('dialog[open]')) root.classList.remove('dialog-open');
  });
}

/* ---------- Disclaimer (Bar Council of India, Rule 36) ---------- */
// Bump the suffix whenever the disclaimer wording changes, so every visitor is asked again.
const DISCLAIMER_KEY = 'quadri.disclaimer.accepted.v1';
const disclaimer = $<HTMLDialogElement>('[data-disclaimer]');
if (disclaimer) {
  let accepted = false;
  try {
    accepted = localStorage.getItem(DISCLAIMER_KEY) !== null;
  } catch {
    // storage blocked (private mode): ask on every visit
  }
  // Escape must not dismiss it: only the button counts as acceptance.
  disclaimer.addEventListener('cancel', (event) => event.preventDefault());
  $('[data-disclaimer-accept]', disclaimer)?.addEventListener('click', () => {
    try {
      localStorage.setItem(DISCLAIMER_KEY, new Date().toISOString());
    } catch {
      // nothing to do: the visitor is simply asked again next time
    }
    disclaimer.close();
  });
  // Opened after the first paint, so the page itself is painted without waiting on the dialog.
  if (!accepted) requestAnimationFrame(() => setTimeout(() => openDialog(disclaimer), 0));
}

/* ---------- Nav: transparent over the hero, ivory after scroll ---------- */
const SCROLL_THRESHOLD = 8; // px of scroll before the bar turns ivory
const header = $<HTMLElement>('[data-nav]');
if (header) {
  let frame = 0;
  const update = () => {
    frame = 0;
    header.toggleAttribute('data-scrolled', window.scrollY > SCROLL_THRESHOLD);
  };
  update();
  window.addEventListener(
    'scroll',
    () => {
      if (!frame) frame = requestAnimationFrame(update);
    },
    { passive: true },
  );
}

/* ---------- Overlay menu (below 1024) ---------- */
// <dialog>.showModal() supplies the focus trap, Escape to close, and an inert page behind.
const menu = $<HTMLDialogElement>('[data-menu]');
const menuButton = $<HTMLButtonElement>('[data-menu-open]');
if (menu && menuButton) {
  menuButton.addEventListener('click', () => {
    openDialog(menu);
    menuButton.setAttribute('aria-expanded', 'true');
  });
  menu.addEventListener('close', () => menuButton.setAttribute('aria-expanded', 'false'));
  for (const closer of $$('[data-menu-close]', menu)) closer.addEventListener('click', () => menu.close());
  // If the window grows past the breakpoint while the menu is open, close it.
  window.matchMedia('(min-width: 1024px)').addEventListener('change', (event) => {
    if (event.matches && menu.open) menu.close();
  });
}

/* ---------- Scroll motion: fade-and-rise and self-drawing hairlines, once ---------- */
const moving = $$<HTMLElement>('[data-reveal], [data-draw]');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -12% 0px', threshold: 0.05 },
  );
  moving.forEach((el) => observer.observe(el));
} else {
  moving.forEach((el) => el.classList.add('is-visible'));
}

/* ---------- Fact strip: numerals count up once ---------- */
// The HTML carries the final value, so it is right without scripts, for crawlers,
// and under reduced motion (where nothing counts).
const COUNT_MS = 1400;
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
if (!reducedMotion && 'IntersectionObserver' in window) {
  for (const el of $$<HTMLElement>('[data-count-to]')) {
    const to = Number(el.dataset.countTo);
    const final = el.textContent ?? String(to);
    let armed = false;
    // The observer reports positions without forcing a layout, unlike getBoundingClientRect().
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!armed) {
          armed = true;
          // Already on screen at load (very tall viewports): leave the final value alone.
          if (entry.isIntersecting) return observer.disconnect();
          el.textContent = '0';
          return;
        }
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min((now - start) / COUNT_MS, 1);
          el.textContent = progress < 1 ? String(Math.round(easeOut(progress) * to)) : final;
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
  }
}

/* ---------- Map: nothing is requested from Google until asked ---------- */
const map = $<HTMLElement>('[data-map]');
const showMap = map && $<HTMLButtonElement>('[data-map-show]', map);
if (map && showMap) {
  showMap.hidden = false;
  showMap.addEventListener('click', () => {
    const frame = document.createElement('iframe');
    frame.src = map.dataset.mapSrc ?? '';
    frame.title = map.dataset.mapTitle ?? '';
    frame.referrerPolicy = 'no-referrer-when-downgrade';
    frame.allowFullscreen = true;
    map.prepend(frame);
    showMap.remove();
    frame.focus();
  });
}

/* ---------- Contact form ---------- */
const form = $<HTMLFormElement>('[data-contact-form]');
if (form) {
  const status = $<HTMLElement>('[data-form-status]', form);
  const submit = $<HTMLButtonElement>('button[type="submit"]', form);
  const select = $<HTMLSelectElement>('select[name="matter"]', form);
  const matterTypes = select ? [...select.options].map((option) => option.value).filter(Boolean) : [];
  const fieldNames: ContactField[] = ['name', 'phone', 'matter', 'message'];
  const control = (name: string) => form.elements.namedItem(name) as HTMLInputElement | null;

  const setError = (name: ContactField, message: string | null) => {
    const input = control(name);
    const slot = $<HTMLElement>(`[data-error-for="${name}"]`, form);
    if (!input || !slot) return;
    slot.textContent = message ?? '';
    slot.hidden = !message;
    if (message) {
      input.setAttribute('aria-invalid', 'true');
      input.setAttribute('aria-describedby', slot.id);
    } else {
      input.removeAttribute('aria-invalid');
      input.removeAttribute('aria-describedby');
    }
  };

  const showErrors = (invalid: ContactField[]) => {
    for (const name of fieldNames) {
      setError(name, invalid.includes(name) ? (form.getAttribute(`data-error-${name}`) ?? '') : null);
    }
    if (invalid[0]) control(invalid[0])?.focus();
  };

  const say = (state: 'success' | 'error' | null, message = '') => {
    if (!status) return;
    status.replaceChildren();
    if (!state) return;
    const line = document.createElement('p');
    line.dataset.state = state;
    line.textContent = message;
    status.append(line);
  };

  for (const name of fieldNames) {
    control(name)?.addEventListener('input', () => setError(name, null));
  }
  // The placeholder option reads as muted text until a matter type is chosen.
  select?.addEventListener('change', () => select.toggleAttribute('data-empty', select.value === ''));

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const value = (name: string) => String(data.get(name) ?? '');
    const fields: ContactFields = {
      name: value('name'),
      phone: value('phone'),
      matter: value('matter'),
      message: value('message'),
    };

    const invalid = invalidFields(fields, matterTypes);
    showErrors(invalid);
    say(null);
    if (invalid.length > 0) return;

    if (submit) {
      submit.disabled = true;
      submit.textContent = form.dataset.labelSending ?? '';
    }
    try {
      const response = await fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // "company" is the honeypot: people never see it, scripts fill it in
        body: JSON.stringify({ ...fields, company: value('company') }),
      });
      if (response.ok) {
        form.reset();
        select?.setAttribute('data-empty', '');
        say('success', form.dataset.messageSuccess);
      } else if (response.status === 422) {
        const body = (await response.json()) as { invalid?: ContactField[] };
        showErrors(body.invalid ?? []);
      } else {
        say('error', response.status === 429 ? form.dataset.messageRateLimited : form.dataset.messageError);
      }
    } catch {
      say('error', form.dataset.messageError);
    } finally {
      if (submit) {
        submit.disabled = false;
        submit.textContent = form.dataset.labelSubmit ?? '';
      }
    }
  });
}
