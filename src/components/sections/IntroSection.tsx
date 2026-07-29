import type { HeaderData } from '@/types/portfolio'
import styles from './IntroSection.module.scss'

interface IntroSectionProps {
  data: HeaderData
}

export function IntroSection({ data }: Readonly<IntroSectionProps>) {
  const { contact } = data

  return (
    <section className={styles.intro} aria-label="Introduction">
      <div className={styles.introInner}>
        <div className={styles.introMain}>
          <h1 className={styles.introName}>{data.name}</h1>
          <p className={styles.introTitle}>{data.title}</p>
          <p className={styles.introStack}>{data.titleStack}</p>

          <address className={styles.introContact}>
            <span className={styles.introContactItem}>{contact.location}</span>
            <span className={styles.introSeparator} aria-hidden="true">·</span>
            <a className={styles.introContactLink} href={contact.phoneHref}>
              {contact.phone}
            </a>
            <span className={styles.introSeparator} aria-hidden="true">·</span>
            <a className={styles.introContactLink} href={`mailto:${contact.email}`}>
              {contact.email}
            </a>
            {contact.links.map((link) => (
              <span key={link.href} className={styles.introContactGroup}>
                <span className={styles.introSeparator} aria-hidden="true">·</span>
                <a
                  className={styles.introContactLink}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.label}
                </a>
              </span>
            ))}
          </address>

          <p className={styles.introWorkRights}>{data.workRights}</p>

          <div className={styles.introActions}>
            <a href={data.ctaPrimary.href} className={styles.introActionPrimary}>
              {data.ctaPrimary.label}
            </a>
            <a
              href={data.ctaSecondary.href}
              className={styles.introActionSecondary}
              download
            >
              {data.ctaSecondary.label} ↓
            </a>
          </div>
        </div>

        <div className={styles.introPhotoCol}>
          <img
            src={data.photoSrc}
            alt={data.photoAlt}
            className={styles.introPhoto}
            width={180}
            height={180}
          />
        </div>
      </div>
    </section>
  )
}
