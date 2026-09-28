import Arch from './Arch';
import styles from './Nav.module.css';
import { site } from '@/lib/site';

/**
 * Markup only. Behaviour (ivory after scroll, opening the menu) is in
 * src/scripts/site.ts, which toggles data-scrolled on the header and calls
 * showModal() on the menu: a modal <dialog> supplies the focus trap, Escape
 * to close, and makes the page behind inert.
 */
export default function Nav() {
  const { nav, contact } = site;

  return (
    <header className={styles.header} data-nav="">
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
          aria-expanded="false"
          data-menu-open=""
        >
          <span />
          <span />
        </button>
      </div>

      <dialog className={`${styles.menu} on-ink`} aria-label="Menu" data-menu="">
        <div className={`container ${styles.menuInner}`}>
          <div className={styles.menuBar}>
            <span className={styles.brand}>
              <Arch className={styles.mark} size="var(--mark-width)" stroke="var(--mark-stroke)" />
              <span>{site.shortName}</span>
            </span>
            <button type="button" className={styles.close} aria-label="Close menu" data-menu-close="">
              <span />
              <span />
            </button>
          </div>

          <nav aria-label="Menu">
            <ul className={styles.menuLinks}>
              {nav.links.map((link, i) => (
                <li key={link.href} style={{ '--i': i } as React.CSSProperties}>
                  <a href={link.href} data-menu-close="">
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
            <a className={`button ${styles.menuCta}`} href={nav.cta.href} data-menu-close="">
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
