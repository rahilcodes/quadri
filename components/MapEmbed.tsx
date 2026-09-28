'use client';

import { useState } from 'react';
import styles from './Contact.module.css';
import { site } from '@/lib/site';

/**
 * The map is a facade until the visitor asks for it. Google's embed costs
 * about 450 KB of script and sets third-party cookies, so nothing is requested
 * from Google unless "Show map" is pressed. The link works without JavaScript.
 */
export default function MapEmbed() {
  const { map } = site.contact;
  const [shown, setShown] = useState(false);

  return (
    <div className={styles.map} data-reveal="">
      {shown && <iframe src={map.embed} title={map.title} referrerPolicy="no-referrer-when-downgrade" allowFullScreen />}
      <div className={styles.mapActions}>
        {!shown && (
          <button type="button" className={styles.mapLink} onClick={() => setShown(true)}>
            {map.showLabel}
          </button>
        )}
        <a className={styles.mapLink} href={map.link} target="_blank" rel="noopener noreferrer">
          {map.linkLabel}
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </div>
    </div>
  );
}
