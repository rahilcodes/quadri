'use client';

import { useRef, useState } from 'react';
import styles from './ContactForm.module.css';
import { LIMITS, matterTypes, validateContact, type ContactErrors, type ContactFields } from '@/lib/contact';
import { site } from '@/lib/site';

type Status = 'idle' | 'sending' | 'success' | 'error' | 'rate-limited';

export default function ContactForm() {
  const copy = site.contact.form;
  const form = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<Status>('idle');
  const [matter, setMatter] = useState('');

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const fields: ContactFields = {
      name: String(data.get('name') ?? ''),
      phone: String(data.get('phone') ?? ''),
      matter: String(data.get('matter') ?? ''),
      message: String(data.get('message') ?? ''),
    };

    const found = validateContact(fields);
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      setStatus('idle');
      form.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    setStatus('sending');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // "company" is the honeypot: people never see it, scripts fill it in
        body: JSON.stringify({ ...fields, company: String(data.get('company') ?? '') }),
      });
      if (response.ok) {
        setStatus('success');
        setMatter('');
        form.current?.reset();
        return;
      }
      if (response.status === 422) {
        const body = (await response.json()) as { errors?: ContactErrors };
        setErrors(body.errors ?? {});
        setStatus('idle');
        return;
      }
      setStatus(response.status === 429 ? 'rate-limited' : 'error');
    } catch {
      setStatus('error');
    }
  }

  const clear = (field: keyof ContactFields) => () => {
    if (errors[field]) setErrors(({ [field]: _removed, ...rest }) => rest);
  };

  const describe = (field: keyof ContactFields) =>
    errors[field] ? { 'aria-invalid': true, 'aria-describedby': `contact-${field}-error` } : {};

  const error = (field: keyof ContactFields) =>
    errors[field] ? (
      <p className={styles.error} id={`contact-${field}-error`}>
        {errors[field]}
      </p>
    ) : null;

  return (
    <form ref={form} className={styles.form} onSubmit={onSubmit} noValidate data-reveal="" aria-labelledby="contact-title">
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
          onInput={clear('name')}
          {...describe('name')}
        />
        {error('name')}
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
          onInput={clear('phone')}
          {...describe('phone')}
        />
        {error('phone')}
      </div>

      <div className={`${styles.field} ${styles.select}`}>
        <label className="sr-only" htmlFor="contact-matter">
          {copy.matter}
        </label>
        <select
          id="contact-matter"
          name="matter"
          value={matter}
          required
          data-empty={matter === '' ? '' : undefined}
          onChange={(event) => {
            setMatter(event.target.value);
            clear('matter')();
          }}
          {...describe('matter')}
        >
          <option value="" disabled>
            {copy.matter}
          </option>
          {matterTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        {error('matter')}
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
          onInput={clear('message')}
          {...describe('message')}
        />
        {error('message')}
      </div>

      {/* Honeypot: hidden from people and assistive technology, left in the tab order of scripts only. */}
      <div className={styles.trap} aria-hidden="true">
        <label htmlFor="contact-company">Company</label>
        <input id="contact-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <button className={`button ${styles.submit}`} type="submit" disabled={status === 'sending'}>
        {status === 'sending' ? copy.sending : copy.submit}
      </button>

      <div className={styles.status} role="status" aria-live="polite">
        {status === 'success' && <p className={styles.success}>{copy.success}</p>}
        {status === 'error' && <p className={styles.failure}>{copy.error}</p>}
        {status === 'rate-limited' && <p className={styles.failure}>{copy.rateLimited}</p>}
      </div>
    </form>
  );
}
