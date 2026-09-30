import Arch from './Arch';
import styles from './Footer.module.css';
import { site } from '@/lib/site';

export default function Footer() {
  const { footer, nav, disclaimer } = site;

  return (
    <footer
      className={`${styles.footer} below-fold on-ink`}
      style={{ '--estimate': 'var(--estimate-footer)' } as React.CSSProperties}
    >
      <div className={`container ${styles.inner}`}>
        <div className={styles.top}>
          <div className={styles.lockup}>
            <p className={styles.brand}>
              <Arch className={styles.mark} size="var(--mark-width)" stroke="var(--mark-stroke)" />
              <span>{site.name}</span>
            </p>
            <p className={`label ${styles.est}`}>{site.lockup}</p>
          </div>

          <nav className={styles.links} aria-label="Footer">
            <ul>
              {nav.links.map((link) => (
                <li key={link.href}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Decorative language marks */}
          <div className={styles.glyphs}>
            <span className={styles.glyphTelugu} lang="te" role="img" aria-label={footer.glyphTeluguLabel}>
              {footer.glyphTelugu}
            </span>
            <span className={styles.glyph} lang="ur" dir="rtl" role="img" aria-label={footer.glyphLabel}>
              {footer.glyph}
            </span>
          </div>
        </div>

        {/* Bar Council of India, Rule 36: the entry disclaimer, repeated in full. */}
        <p className={styles.disclaimer} id="disclaimer">
          {disclaimer.text}
        </p>

        <div className={styles.base}>
          <p>
            © {new Date().getFullYear()} {footer.copyright}
          </p>
          <p className={styles.developer}>
            Developed by{' '}
            <a href="https://creativals.com" target="_blank" rel="noopener noreferrer" className={styles.developerLink}>
              Creativals.com
            </a>
          </p>
          <p className={styles.enrolled}>{footer.enrolled}</p>
        </div>
      </div>
    </footer>
  );
}
