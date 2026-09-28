import styles from './ContactForm.module.css';
import { LIMITS, type ContactFields } from '@/lib/contact';
import { site } from '@/lib/site';

/**
 * Markup only. src/scripts/site.ts validates with the same rules as the server
 * (lib/contact.ts), posts to /api/contact and fills the error and status slots.
 * All messages come from content/site.json, carried on data attributes.
 */
export default function ContactForm() {
  const copy = site.contact.form;
  const matterTypes = site.practice.areas.map((area) => area.title);

  const slot = (field: keyof ContactFields) => (
    <p className={styles.error} id={`contact-${field}-error`} data-error-for={field} hidden />
  );

  return (
    <form
      className={styles.form}
      action="/api/contact"
      method="post"
      noValidate
      data-reveal=""
      data-contact-form=""
      data-label-submit={copy.submit}
      data-label-sending={copy.sending}
      data-message-success={copy.success}
      data-message-error={copy.error}
      data-message-rate-limited={copy.rateLimited}
      data-error-name={copy.errors.name}
      data-error-phone={copy.errors.phone}
      data-error-matter={copy.errors.matter}
      data-error-message={copy.errors.message}
      aria-labelledby="contact-title"
    >
      <div className={styles.field}>
        <label className="sr-only" htmlFor="contact-name">
          {copy.name}
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          autoComplete="name"
          placeholder={copy.name}
          maxLength={LIMITS.name}
          required
        />
        {slot('name')}
      </div>

      <div className={styles.field}>
        <label className="sr-only" htmlFor="contact-phone">
          {copy.phone}
        </label>
        <input
          id="contact-phone"
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder={copy.phone}
          maxLength={LIMITS.phone}
          required
        />
        {slot('phone')}
      </div>

      <div className={`${styles.field} ${styles.select}`}>
        <label className="sr-only" htmlFor="contact-matter">
          {copy.matter}
        </label>
        <select id="contact-matter" name="matter" defaultValue="" required data-empty="">
          <option value="" disabled>
            {copy.matter}
          </option>
          {matterTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        {slot('matter')}
      </div>

      <div className={styles.field}>
        <label className="sr-only" htmlFor="contact-message">
          {copy.message}
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={4}
          placeholder={copy.message}
          maxLength={LIMITS.message}
          required
        />
        {slot('message')}
      </div>

      {/* Honeypot: hidden from people and assistive technology; only scripts fill it in. */}
      <div className={styles.trap} aria-hidden="true">
        <label htmlFor="contact-company">Company</label>
        <input id="contact-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <button className={`button ${styles.submit}`} type="submit">
        {copy.submit}
      </button>

      <div className={styles.status} role="status" aria-live="polite" data-form-status="" />
    </form>
  );
}
