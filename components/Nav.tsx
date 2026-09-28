'use client';

import { useEffect, useRef, useState } from 'react';
import Arch from './Arch';
import styles from './Nav.module.css';
import { site } from '@/lib/site';

const SCROLL_THRESHOLD = 8; // px of scroll before the bar turns ivory

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menu = useRef<HTMLDialogElement>(null);
  const { nav, contact } = site;

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setScrolled(window.scrollY > SCROLL_THRESHOLD);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  // The overlay only exists below 1024. If the window grows past that while it is open, close it.
  useEffect(() => {
    const wide = window.matchMedia('(min-width: 1024px)');
    const onChange = () => wide.matches && menu.current?.close();
    wide.addEventListener('change', onChange);
    return () => wide.removeEventListener('change', onChange);
  }, []);

  // <dialog>.showModal() supplies the focus trap, Escape to close, and makes the page behind inert.
  const openMenu = () => {
    menu.current?.showModal();
    document.documentElement.classList.add('dialog-open');
    setOpen(true);
  };
  const closeMenu = () => menu.current?.close();

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={`container ${styles.bar}`}>
        <a className={styles.brand} href="#main" aria-label={`${site.name}, home`}>
          <Arch className={`${styles.mark} arch-draw`} size="var(--mark-width)" stroke="var(--mark-stroke)" />
          <span className={styles.nameShort} aria-hidden="true">
            {site.shortName}
          </span>
          <span className={styles.nameFull} aria-hidden="true">
            {site.name}
          </span>
        </a>

        <nav className={styles.links} aria-label="Primary">
          <ul>
            {nav.links.map((link) => (
              <li key={link.href}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
          <a className="button button--sm" href={nav.cta.href}>
            {nav.cta.label}
          </a>
        </nav>

        <button
          type="button"
          className={styles.burger}
          aria-label="Open menu"
          aria-haspopup="dialog"
          aria-expanded={open}
          onClick={openMenu}
        >
          <span />
          <span />
        </button>
      </div>

      <dialog ref={menu} className={`${styles.menu} on-ink`} aria-label="Menu" onClose={() => {
          document.documentElement.classList.remove('dialog-open');
          setOpen(false);
        }}>
        <div className={`container ${styles.menuInner}`}>
          <div className={styles.menuBar}>
            <span className={styles.brand}>
              <Arch className={styles.mark} size="var(--mark-width)" stroke="var(--mark-stroke)" />
              <span>{site.shortName}</span>
            </span>
            <button type="button" className={styles.close} aria-label="Close menu" onClick={closeMenu}>
              <span />
              <span />
            </button>
          </div>

          <nav aria-label="Menu">
            <ul className={styles.menuLinks}>
              {nav.links.map((link, i) => (
                <li key={link.href} style={{ '--i': i } as React.CSSProperties}>
                  <a href={link.href} onClick={closeMenu}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.menuFoot}>
            <div className={styles.divider} aria-hidden="true">
              <Arch size={20} stroke={2} />
            </div>
            <a className={`button ${styles.menuCta}`} href={nav.cta.href} onClick={closeMenu}>
              {nav.cta.label}
            </a>
            <p className="label">{site.lockup}</p>
            <a className={styles.menuPhone} href={`tel:${contact.phones[0].tel}`}>
              {contact.phones[0].display}
            </a>
          </div>
        </div>
      </dialog>
    </header>
  );
}
