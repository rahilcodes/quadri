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
    <div className={styles.map} data-reveal="" data-map="" data-map-src={map.embed} data-map-title={map.title}>
      <div className={styles.mapActions}>
        <button type="button" className={styles.mapLink} data-map-show="" hidden>
          {map.showLabel}
        </button>
        <a className={styles.mapLink} href={map.link} target="_blank" rel="noopener noreferrer">
          {map.linkLabel}
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </div>
    </div>
  );
}
