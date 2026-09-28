/** One optimised image, as prepared by src/pages/index.astro with Astro's image service. */
export type PictureSource = {
  /** Fallback JPEG */
  src: string;
  srcSet: string;
  /** Modern formats, best first (AVIF, then WebP) */
  formats: { type: string; srcSet: string }[];
  width: number;
  height: number;
};

type Props = {
  image: PictureSource;
  alt: string;
  sizes: string;
  /** The hero portrait is the LCP element: load it first. Everything else is lazy. */
  priority?: boolean;
};

export default function Picture({ image, alt, sizes, priority = false }: Props) {
  return (
    <picture>
      {image.formats.map((format) => (
        <source key={format.type} type={format.type} srcSet={format.srcSet} sizes={sizes} />
      ))}
      <img
        src={image.src}
        srcSet={image.srcSet}
        sizes={sizes}
        width={image.width}
        height={image.height}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : 'auto'}
      />
    </picture>
  );
}
