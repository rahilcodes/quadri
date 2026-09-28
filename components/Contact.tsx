import ContactForm from './ContactForm';
import styles from './Contact.module.css';
import { site } from '@/lib/site';

export default function Contact() {
  const { contact } = site;

  return (
    <section id="contact" className={`${styles.section} on-ivory`} aria-labelledby="contact-title">
      <div className={`container ${styles.inner}`}>
        <div className={styles.lead}>
          <p className="label">{contact.label}</p>
          <h2 id="contact-title" className="h2">
            {contact.heading}
          </h2>
          <div className={styles.map} data-reveal="">
            {/* Below the fold and lazy: no third-party request until the visitor scrolls here. */}
            <iframe
              src={contact.map.embed}
              title={contact.map.title}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
            <a className={styles.mapLink} href={contact.map.link} target="_blank" rel="noopener noreferrer">
              {contact.map.linkLabel}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
        </div>

        <div className={styles.body}>
          <div className={styles.details} data-reveal="">
            <div className={styles.group}>
              <h3 className="label">{contact.addressLabel}</h3>
              <address className={styles.address}>
                {contact.addressLines.map((line) => (
                  <span key={line}>{line} </span>
                ))}
              </address>
            </div>

            <div className={styles.group}>
              <h3 className="label">{contact.phoneLabel}</h3>
              <ul className={styles.phones}>
                {contact.phones.map((phone) => (
                  <li key={phone.tel}>
                    <a href={`tel:${phone.tel}`}>{phone.display}</a>
                  </li>
                ))}
              </ul>
              <a className={`link ${styles.whatsapp}`} href={contact.whatsapp.href} rel="noopener noreferrer">
                {contact.whatsapp.label}
              </a>
            </div>

            <div className={styles.group}>
              <h3 className="label">{contact.hoursLabel}</h3>
              <p className={styles.hours}>
                {contact.hours.map((slot) => (
                  <span key={slot.display}>{slot.display}</span>
                ))}
              </p>
            </div>
          </div>

          <ContactForm />
        </div>
      </div>
    </section>
  );
}
