import styles from './Contact.module.css';
import { site } from '@/lib/site';

/**
 * The map is a facade until the visitor asks for it. Google's embed costs
 * about 450 KB of script and sets third-party cookies, so nothing is requested
 * from Google unless "Show map" is pressed (src/scripts/site.ts then inserts
 * the frame). The link works without JavaScript.
 */
export default function MapEmbed() {
  const { map } = site.contact;

  return (
    <div className={styles.map} data-reveal="">
      <iframe
        src={map.embed}
        title={map.title}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
      <div className={styles.mapActions}>
        <a className={styles.mapLink} href={map.link} target="_blank" rel="noopener noreferrer">
          {map.linkLabel}
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </div>
    </div>
  );
}
