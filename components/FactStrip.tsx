import CountUp from './CountUp';
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
              {fact.countTo === null ? fact.value : <CountUp to={fact.countTo} value={fact.value} />}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
