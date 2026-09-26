'use client'

import { useEffect, useState } from 'react'
import type { NavLink } from '@/types/portfolio'
import { CVModal } from '@/components/ui/CVModal'
import styles from './Header.module.scss'

interface HeaderProps {
  name: string
  links: NavLink[]
}

export function Header({ name, links }: Readonly<HeaderProps>) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [cvOpen, setCvOpen] = useState(false)

  const cvLink = links.find((l) => l.download)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function renderDesktopLink(link: NavLink) {
    if (link.download) {
      return (
        <button
          key={link.href}
          type="button"
          className={`${styles.headerNavLink} ${styles.headerNavLinkCv}`}
          onClick={() => setCvOpen(true)}
        >
          {link.label}
        </button>
      )
    }
    return (
      <a
        key={link.href}
        href={link.href}
        className={styles.headerNavLink}
        target={link.newTab ? '_blank' : undefined}
        rel={link.newTab ? 'noopener noreferrer' : undefined}
      >
        {link.label}
      </a>
    )
  }

  function renderMobileLink(link: NavLink) {
    if (link.download) {
      return (
        <button
          key={link.href}
          type="button"
          className={`${styles.headerMobileNavLink} ${styles.headerMobileNavLinkCv}`}
          onClick={() => { setMenuOpen(false); setCvOpen(true) }}
        >
          {link.label}
        </button>
      )
    }
    return (
      <a
        key={link.href}
        href={link.href}
        className={styles.headerMobileNavLink}
        onClick={() => setMenuOpen(false)}
        target={link.newTab ? '_blank' : undefined}
        rel={link.newTab ? 'noopener noreferrer' : undefined}
      >
        {link.label}
      </a>
    )
  }

  return (
    <>
      <header className={`${styles.header} ${scrolled ? styles.headerScrolled : ''}`}>
        <div className={styles.headerInner}>
          <span className={styles.headerBrand}>{name}</span>

          <nav className={styles.headerNav} aria-label="Main navigation">
            {links.map(renderDesktopLink)}
          </nav>

          <button
            className={styles.headerMenuToggle}
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            type="button"
          >
            <span
              className={`${styles.headerMenuIcon} ${menuOpen ? styles.headerMenuIconOpen : ''}`}
            />
          </button>
        </div>

        {menuOpen && (
          <nav className={styles.headerMobileNav} aria-label="Mobile navigation">
            {links.map(renderMobileLink)}
          </nav>
        )}
      </header>

      {cvLink && (
        <CVModal
          isOpen={cvOpen}
          onClose={() => setCvOpen(false)}
          pdfHref={cvLink.href}
        />
      )}
    </>
  )
}
