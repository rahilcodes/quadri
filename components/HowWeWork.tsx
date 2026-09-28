import Hairline from './Hairline';
import styles from './HowWeWork.module.css';
import { site } from '@/lib/site';

export default function HowWeWork() {
  const { process } = site;

  return (
    <section className={`${styles.section} on-ivory`} aria-labelledby="process-title">
      <div className={`container ${styles.inner}`}>
        <header className={styles.header} data-reveal="">
          <p className="label">{process.label}</p>
          <h2 id="process-title" className={`h2 ${styles.heading}`}>
            {process.heading}
          </h2>
        </header>

        <ol className={styles.steps}>
          {process.steps.map((step, i) => (
            <li key={step.n} className={styles.step}>
              <Hairline index={i} />
              <div className={styles.content} data-reveal="" style={{ '--i': i } as React.CSSProperties}>
                <span className={styles.ordinal} aria-hidden="true">
                  {step.n}
                </span>
                <h3 className={styles.title}>{step.title}</h3>
                <p className={styles.text}>{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
