import styles from './FactStrip.module.css';
import { site } from '@/lib/site';

/** Verifiable facts only (Rule 36): no ratings, results or counters of matters. */
export default function FactStrip() {
  return (
    <section className={`${styles.strip} on-ivory`} aria-label="The chambers in brief">
      <dl className={`container ${styles.grid}`}>
        {site.facts.map((fact, i) => (
          <div key={fact.label} className={styles.fact} data-reveal="" style={{ '--i': i } as React.CSSProperties}>
            {/* dt/dd are reversed visually: the numeral leads, its caption follows */}
            <dt className={`label ${styles.caption}`}>{fact.label}</dt>
            <dd className={`${styles.numeral} ${fact.countTo === null ? styles.word : ''}`}>
              {fact.countTo === null ? (
                fact.value
              ) : (
                <>
                  {/* src/scripts/site.ts counts this up once; screen readers get the final value */}
                  <span aria-hidden="true" data-count-to={fact.countTo}>
                    {fact.value}
                  </span>
                  <span className="sr-only">{fact.value}</span>
                </>
              )}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
