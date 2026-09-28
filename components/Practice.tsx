import Arch from './Arch';
import styles from './Practice.module.css';
import { site } from '@/lib/site';

export default function Practice() {
  const { practice } = site;

  return (
    <section id="practice" className={`${styles.section} on-ivory`} aria-labelledby="practice-title">
      <div className={`container ${styles.inner}`}>
        <header className={styles.header} data-reveal="">
          <p className="label">{practice.label}</p>
          <h2 id="practice-title" className={`h2 ${styles.heading}`}>
            {practice.heading}
          </h2>
        </header>

        <ul className={styles.grid}>
          {practice.areas.map((area, i) => (
            <li key={area.n} data-reveal="" style={{ '--i': i % 3 } as React.CSSProperties}>
              <a className={styles.card} href="#contact">
                <Arch className={styles.arch} size="var(--arch-hover-width)" stroke={1} />
                <span className={styles.ordinal}>{area.n}</span>
                <h3 className={styles.title}>{area.title}</h3>
                <p className={styles.desc}>{area.desc}</p>
                <span className={styles.arrow} aria-hidden="true">
                  →
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
