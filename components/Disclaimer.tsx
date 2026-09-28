'use client';

import { useEffect, useRef } from 'react';
import Arch from './Arch';
import styles from './Disclaimer.module.css';
import { site } from '@/lib/site';

/** Bump the suffix whenever the disclaimer wording changes, so every visitor is asked again. */
const STORAGE_KEY = 'quadri.disclaimer.accepted.v1';

/**
 * Bar Council of India, Rule 36: the first-visit disclaimer.
 * A modal <dialog>: the page behind is inert, focus is trapped, and it cannot
 * be dismissed with Escape or a click outside. Only "I understand" closes it.
 * Acceptance is remembered in localStorage. The same text is always in the footer.
 */
export default function Disclaimer() {
  const dialog = useRef<HTMLDialogElement>(null);
  const { disclaimer } = site;

  useEffect(() => {
    let accepted = false;
    try {
      accepted = window.localStorage.getItem(STORAGE_KEY) !== null;
    } catch {
      // storage blocked (private mode): ask on every visit
    }
    if (!accepted && dialog.current && !dialog.current.open) {
      dialog.current.showModal();
      document.documentElement.classList.add('dialog-open');
    }
  }, []);

  const accept = () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, new Date().toISOString());
    } catch {
      // nothing to do: the visitor is simply asked again next time
    }
    dialog.current?.close();
    document.documentElement.classList.remove('dialog-open');
  };

  return (
    <dialog
      ref={dialog}
      className={`${styles.dialog} on-ink`}
      aria-labelledby="disclaimer-title"
      aria-describedby="disclaimer-text"
      onCancel={(event) => event.preventDefault()}
    >
      <div className={styles.head}>
        <Arch size={20} stroke={2} />
        <h2 id="disclaimer-title" className="label">
          {disclaimer.title}
        </h2>
      </div>
      <p id="disclaimer-text" className={styles.text}>
        {disclaimer.text}
      </p>
      <button type="button" className={`button button--sm ${styles.accept}`} onClick={accept} autoFocus>
        {disclaimer.accept}
      </button>
    </dialog>
  );
}
