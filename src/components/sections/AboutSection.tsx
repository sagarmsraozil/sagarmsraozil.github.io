import type { AboutData } from '@/types/portfolio'
import { SectionLabel } from '@/components/ui/SectionLabel'
import styles from './AboutSection.module.scss'

interface AboutSectionProps {
  data: AboutData
}

export function AboutSection({ data }: Readonly<AboutSectionProps>) {
  return (
    <section id="about" className={styles.about} aria-label="About">
      <div className={styles.aboutInner}>
        <SectionLabel text={data.label} />

        <h2 className={styles.aboutHeading}>
          {data.headingLines.map((line) => (
            <span key={line} className={styles.aboutHeadingLine}>
              {line}
            </span>
          ))}
        </h2>

        <hr className={styles.aboutDivider} />

        <div className={styles.aboutLayout}>
          <div className={styles.aboutPhotoCol}>
            {data.photoSrc ? (
              <img
                src={data.photoSrc}
                alt="Sagar Mishra"
                className={styles.aboutPhoto}
              />
            ) : (
              <div className={styles.aboutAvatar} aria-hidden="true">
                SM
              </div>
            )}
          </div>

          <div className={styles.aboutContentCol}>
            <div className={styles.aboutBody}>
              {data.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <dl className={styles.aboutLanguages}>
              {data.languages.map((lang) => (
                <div key={lang.name} className={styles.aboutLanguage}>
                  <dt className={styles.aboutLanguageName}>{lang.name}</dt>
                  <dd className={styles.aboutLanguageLevel}>{lang.level}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  )
}
