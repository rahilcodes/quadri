import Arch from './Arch';
import Picture, { type PictureSource } from './Picture';
import styles from './Hero.module.css';
import { site } from '@/lib/site';

export default function Hero({ portrait }: { portrait: PictureSource }) {
  const { hero } = site;
  const rise = (i: number) => ({ '--i': i }) as React.CSSProperties;

  return (
    <section className={`${styles.hero} on-ink`} aria-labelledby="hero-title">
      <div className={`container ${styles.inner}`}>
        <div className={styles.copy}>
          {/* The H1 is not faded in: it must paint in the first frame. */}
          <h1 id="hero-title" className={styles.title}>
            {hero.headline}
          </h1>
          <p className={`${styles.sub} rise`} style={rise(1)}>
            {hero.sub}
          </p>
          <div className={`${styles.actions} rise`} style={rise(2)}>
            <a className="button" href={hero.primary.href}>
              {hero.primary.label}
            </a>
            <a className="link link--draw" href={hero.secondary.href}>
              {hero.secondary.label}
            </a>
          </div>
        </div>

        <div className={styles.figure}>
          <Arch variant="mask" id="arch-tall" shape="tall" />
          <Arch variant="mask" id="arch-compact" shape="compact" />
          <div className={styles.portrait}>
            <Picture
              image={portrait}
              alt={hero.portrait.alt}
              priority
              sizes="(min-width: 1440px) 480px, (min-width: 1024px) 34vw, (min-width: 640px) 420px, 100vw"
            />
          </div>
          {/* The arch opens on load: its outline draws around the portrait, then recedes. */}
          <Arch variant="outline" shape="compact" className={`${styles.outline} ${styles.outlineCompact} arch-draw`} />
          <Arch variant="outline" shape="tall" className={`${styles.outline} ${styles.outlineTall} arch-draw`} />
        </div>

        <p className={`label ${styles.lockup}`}>{site.lockup}</p>
        <span className={styles.cue} aria-hidden="true" />
      </div>
    </section>
  );
}
