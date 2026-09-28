import styles from './Hairline.module.css';

/** A 1 px rule that draws itself (stroke-dashoffset) the first time it scrolls into view. */
export default function Hairline({ index = 0 }: { index?: number }) {
  return (
    <svg
      className={styles.hairline}
      viewBox="0 0 1 1"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
      data-draw=""
      style={{ '--i': index } as React.CSSProperties}
    >
      <line x1="0" y1="0.5" x2="1" y2="0.5" pathLength={1} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
