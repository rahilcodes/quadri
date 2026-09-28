import Image from 'next/image';
import Arch from './Arch';
import styles from './About.module.css';
import { site } from '@/lib/site';

export default function About() {
  const { about, hero } = site;

  return (
    <section id="about" className={`${styles.section} on-ink`} aria-labelledby="about-title">
      <div className={`container ${styles.inner}`}>
        <div className={styles.lead} data-reveal="">
          <h2 id="about-title" className="label">
            {about.label}
          </h2>
          {/* A statement of approach, not a promise of outcome (Rule 36). */}
          <p className={styles.quote}>{about.quote}</p>
        </div>

        <div className={styles.body}>
          <div className={styles.bio} data-reveal="">
            <div className={styles.portrait}>
              <Arch variant="mask" id="arch-small" shape="small" />
              <Image src={hero.portrait.src} alt={about.portraitAlt} fill sizes="160px" loading="lazy" />
            </div>
            {/* The 390 frame carries a condensed biography; the full text takes over from 640. */}
            <p className={styles.summary}>{about.summary}</p>
            <div className={styles.paragraphs}>
              {about.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>

          <dl className={styles.facts} data-reveal="">
            {about.facts.map((fact) => (
              <div key={fact.term}>
                <dt>{fact.term}</dt>
                <dd>{fact.detail}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
