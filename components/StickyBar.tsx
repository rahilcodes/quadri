import styles from './StickyBar.module.css';
import { site } from '@/lib/site';

/** Call and WhatsApp, fixed to the bottom of the screen below 768 only. */
export default function StickyBar() {
  const { call, whatsapp } = site.contact;

  return (
    <nav className={styles.bar} aria-label="Quick contact">
      <a href={`tel:${call.tel}`}>{call.label}</a>
      <a href={whatsapp.href} rel="noopener noreferrer">
        {whatsapp.label}
      </a>
    </nav>
  );
}
