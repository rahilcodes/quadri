import type { CSSProperties, SVGProps } from 'react';

/**
 * The Deccani arch: the one visual device of the site.
 *
 *   variant="mark"     two nested arches (logo, card hover, dividers)
 *   variant="outline"  the single outer arch, stretched to its box (hero frame)
 *   variant="mask"     no visible output: defines a <clipPath> to use as
 *                      clip-path: url(#id). It is in objectBoundingBox units,
 *                      so it clips correctly at any rendered size.
 *
 * Always vector. Geometry is copied from the design export.
 */

/** Logo mark, viewBox 0 0 40 48 (export). */
const MARK_OUTER = 'M4 46V20C4 8 14 4 20 2C26 4 36 8 36 20V46';
const MARK_INNER = 'M12 46V24C12 16 17 13 20 11C23 13 28 16 28 24V46';
const MARK_RATIO = 48 / 40;

/**
 * Portrait masks, normalised to a 1 x 1 box from the export's clip-paths:
 *   tall     480 x 620  M0 620 V240 C0 70 190 26 240 0 C290 26 480 70 480 240 V620 Z
 *   compact  342 x 300  M0 300 V150 C0 50 135 18 171 0 C207 18 342 50 342 150 V300 Z
 *   small    160 x 210  M0 210 V80 C0 24 64 9 80 0 C96 9 160 24 160 80 V210 Z
 */
const SHAPES = {
  tall: 'M0 1V.3871C0 .1129 .3958 .0419 .5 0C.6042 .0419 1 .1129 1 .3871V1',
  compact: 'M0 1V.5C0 .1667 .3947 .06 .5 0C.6053 .06 1 .1667 1 .5V1',
  small: 'M0 1V.381C0 .1143 .4 .0429 .5 0C.6 .0429 1 .1143 1 .381V1',
} as const;

export type ArchShape = keyof typeof SHAPES;

type Common = {
  /** Draw the stroke on load or when a parent becomes visible (see Arch.module-free CSS in globals). */
  className?: string;
  style?: CSSProperties;
};

type MarkProps = Common & {
  variant?: 'mark';
  /** Rendered width in px, or any CSS length. Height follows the 40:48 ratio. */
  size?: number | string;
  /** Stroke width in viewBox units (the export uses 2 at 20 px, 1.5 at 26-40 px, 1 at 80 px). */
  stroke?: number | string;
  title?: string;
};

type OutlineProps = Common & {
  variant: 'outline';
  shape?: ArchShape;
  /** Stroke width in CSS px; it does not scale with the box. */
  stroke?: number | string;
};

type MaskProps = {
  variant: 'mask';
  id: string;
  shape?: ArchShape;
};

export type ArchProps = MarkProps | OutlineProps | MaskProps;

export default function Arch(props: ArchProps) {
  if (props.variant === 'mask') {
    return (
      <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: 'absolute' }}>
        <defs>
          <clipPath id={props.id} clipPathUnits="objectBoundingBox">
            <path d={`${SHAPES[props.shape ?? 'tall']}Z`} />
          </clipPath>
        </defs>
      </svg>
    );
  }

  if (props.variant === 'outline') {
    const { shape = 'tall', stroke = 1, className, style } = props;
    return (
      <svg
        className={className}
        style={style}
        viewBox="0 0 1 1"
        preserveAspectRatio="none"
        fill="none"
        stroke="currentColor"
        strokeWidth={stroke}
        aria-hidden="true"
        focusable="false"
      >
        <path d={SHAPES[shape]} pathLength={1} vectorEffect="non-scaling-stroke" data-arch-path="" />
      </svg>
    );
  }

  const { size = 26, stroke = 1.5, title, className, style } = props;
  const dimensions: SVGProps<SVGSVGElement> =
    typeof size === 'number'
      ? { width: size, height: Math.round(size * MARK_RATIO * 100) / 100 }
      : { style: { width: size, height: 'auto', aspectRatio: '40 / 48', ...style } };

  return (
    <svg
      className={className}
      style={style}
      {...dimensions}
      viewBox="0 0 40 48"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <path d={MARK_OUTER} pathLength={1} data-arch-path="" />
      <path d={MARK_INNER} pathLength={1} data-arch-path="" />
    </svg>
  );
}
