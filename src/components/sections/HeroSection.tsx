import type { HeroData } from '@/types/portfolio'
import styles from './HeroSection.module.scss'

interface HeroSectionProps {
  data: HeroData
}

export function HeroSection({ data }: Readonly<HeroSectionProps>) {
  return (
    <section className={styles.hero} aria-label="Introduction">
      <div className={styles.heroInner}>
        <h1 className={styles.heroHeadline}>
          <span className={styles.heroHeadlineNormal}>{data.headlineNormal}</span>
          <span className={styles.heroHeadlineBold}>{data.headlineBold}</span>
        </h1>

        <hr className={styles.heroDivider} />

        <p className={styles.heroSubheadline}>{data.subheadline}</p>

        <div className={styles.heroActions}>
          <a href={data.ctaPrimary.href} className={styles.heroActionPrimary}>
            {data.ctaPrimary.label}
          </a>
          <a href={data.ctaSecondary.href} className={styles.heroActionSecondary}>
            {data.ctaSecondary.label}
          </a>
        </div>
      </div>
    </section>
  )
}
