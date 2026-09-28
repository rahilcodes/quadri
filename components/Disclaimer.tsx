import Arch from './Arch';
import styles from './Disclaimer.module.css';
import { site } from '@/lib/site';

/**
 * Bar Council of India, Rule 36: the first-visit disclaimer.
 * A modal <dialog>: the page behind is inert, focus is trapped, and it cannot
 * be dismissed with Escape or a click outside. Only "I understand" closes it.
 * src/scripts/site.ts opens it on a first visit and records acceptance in
 * localStorage. The same text is always in the footer.
 */
export default function Disclaimer() {
  const { disclaimer } = site;

  return (
    <dialog
      className={`${styles.dialog} on-ink`}
      aria-labelledby="disclaimer-title"
      aria-describedby="disclaimer-text"
      data-disclaimer=""
    >
      <div className={styles.head}>
        <Arch size={20} stroke={2} />
        <h2 id="disclaimer-title" className="label">
          {disclaimer.title}
        </h2>
      </div>
      <p id="disclaimer-text" className={styles.text}>
        {disclaimer.text}
      </p>
      <button type="button" className={`button button--sm ${styles.accept}`} data-disclaimer-accept="" autoFocus>
        {disclaimer.accept}
      </button>
    </dialog>
  );
}
