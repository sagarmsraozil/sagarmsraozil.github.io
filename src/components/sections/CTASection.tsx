import type { CTAData } from '@/types/portfolio'
import { SectionLabel } from '@/components/ui/SectionLabel'
import styles from './CTASection.module.scss'

interface CTASectionProps {
  data: CTAData
}

export function CTASection({ data }: Readonly<CTASectionProps>) {
  return (
    <section id="contact" className={styles.cta} aria-label="Contact">
      <div className={styles.ctaInner}>
        <SectionLabel text={data.label} className={styles.ctaLabel} />

        <h2 className={styles.ctaHeading}>{data.heading}</h2>

        <div className={styles.ctaBody}>
          {data.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <address className={styles.ctaContact}>
          <a href={`mailto:${data.email}`} className={styles.ctaEmailLink}>
            Write to me → {data.email}
          </a>

          <nav className={styles.ctaSocialLinks} aria-label="Social links">
            {data.links.map((link, index) => (
              <span key={link.href} className={styles.ctaSocialItem}>
                {index > 0 && <span className={styles.ctaSeparator} aria-hidden="true">·</span>}
                <a
                  href={link.href}
                  className={styles.ctaSocialLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.label}
                </a>
              </span>
            ))}
          </nav>
        </address>
      </div>
    </section>
  )
}
