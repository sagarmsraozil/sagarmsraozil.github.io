import type { AiEngineeringBlock, AiEngineeringData } from '@/types/portfolio'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { StackTag } from '@/components/ui/StackTag'
import styles from './AiEngineeringSection.module.scss'

interface AiEngineeringSectionProps {
  data: AiEngineeringData
}

export function AiEngineeringSection({ data }: Readonly<AiEngineeringSectionProps>) {
  return (
    <section id="ai-engineering" className={styles.ai} aria-label="Agentic engineering">
      <div className={styles.aiInner}>
        <SectionLabel text={data.label} as="h2" className={styles.aiLabel} />
        <p className={styles.aiHeading}>{data.heading}</p>

        <div className={styles.aiBody}>
          {data.intro.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        {data.blocks.map((block) => (
          <AiBlock key={block.id} block={block} />
        ))}
      </div>
    </section>
  )
}

interface AiBlockProps {
  block: AiEngineeringBlock
}

function AiBlock({ block }: Readonly<AiBlockProps>) {
  return (
    <article className={styles.block} aria-labelledby={`ai-${block.id}`}>
      <header className={styles.blockHeader}>
        <h3 id={`ai-${block.id}`} className={styles.blockHeading}>
          {block.heading}
        </h3>
        {block.meta && <p className={styles.blockMeta}>{block.meta}</p>}
      </header>

      <div className={styles.aiBody}>
        {block.body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      {block.items && (
        <dl className={styles.items}>
          {block.items.map((item) => (
            <div key={item.name} className={styles.item}>
              <dt className={styles.itemName}>{item.name}</dt>
              <dd className={styles.itemText}>{item.text}</dd>
            </div>
          ))}
        </dl>
      )}

      {block.notes && (
        <div className={styles.notes}>
          {block.notes.map((note) => (
            <p key={note}>{note}</p>
          ))}
        </div>
      )}

      {block.stack && (
        <div className={styles.stack}>
          {block.stack.map((item) => (
            <StackTag key={item} label={item} />
          ))}
        </div>
      )}

      {block.codeNote && (
        <p className={styles.codeNote}>
          {block.codeNote.text}
          {block.codeNote.linkHref && block.codeNote.linkLabel && (
            <>
              {' '}
              <a href={block.codeNote.linkHref} className={styles.codeNoteLink}>
                {block.codeNote.linkLabel}
              </a>
            </>
          )}
        </p>
      )}
    </article>
  )
}
