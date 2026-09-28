import styles from './Hairline.module.css';

/** A 1 px rule that draws itself (stroke-dashoffset) the first time it scrolls into view. */
export default function Hairline({ index = 0 }: { index?: number }) {
  return (
    <svg
      className={styles.hairline}
      aria-hidden="true"
      focusable="false"
      data-draw=""
      style={{ '--i': index } as React.CSSProperties}
    >
      {/* no viewBox: the line is in CSS pixels, and pathLength normalises the dash to its full length */}
      <line x1="0" y1="0.5" x2="100%" y2="0.5" pathLength={1} />
    </svg>
  );
}
