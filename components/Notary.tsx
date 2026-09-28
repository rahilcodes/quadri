import styles from './Notary.module.css';
import { site } from '@/lib/site';

/** The one accent block on the page. */
export default function Notary() {
  const { notary, contact } = site;

  return (
    <section id="notary" className={`${styles.section} on-accent`} aria-labelledby="notary-title">
      <div className={`container ${styles.inner}`}>
        <header className={styles.header} data-reveal="">
          <p className="label">{notary.label}</p>
          <h2 id="notary-title" className={styles.heading}>
            {notary.headingLines.map((line) => (
              <span key={line}>{line} </span>
            ))}
          </h2>
        </header>

        <div className={styles.body}>
          <p className={styles.lead} data-reveal="">
            {notary.lead}
          </p>

          <ul className={styles.services} data-reveal="">
            {notary.services.map((service) => (
              <li key={service}>{service}</li>
            ))}
          </ul>

          <div className={styles.foot} data-reveal="">
            <div className={styles.hours}>
              <h3 className="label">{notary.hoursLabel}</h3>
              <p>
                {contact.hours.map((slot) => (
                  <span key={slot.display}>{slot.display}</span>
                ))}
              </p>
            </div>
            <a className="link" href={`tel:${contact.call.tel}`}>
              {notary.cta}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
