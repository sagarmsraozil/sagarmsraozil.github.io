export interface NavLink {
  label: string
  href: string
  newTab?: boolean
  download?: boolean
}

export interface NavData {
  name: string
  links: NavLink[]
}

export interface ContactLink {
  label: string
  href: string
}

export interface HeaderCTA {
  label: string
  href: string
}

export interface HeaderContact {
  location: string
  phone: string
  phoneHref: string
  email: string
  links: ContactLink[]
}

export interface HeaderData {
  name: string
  title: string
  titleStack: string
  photoSrc: string
  photoAlt: string
  workRights: string
  contact: HeaderContact
  ctaPrimary: HeaderCTA
  ctaSecondary: HeaderCTA
}

export interface Language {
  name: string
  level: string
}

export interface SummaryData {
  label: string
  heading: string
  body: string[]
  languages: Language[]
}

export interface ResourceLinkData {
  label: string
  href: string
  note?: string
  kind?: 'site' | 'repo'
}

export interface CodeNote {
  text: string
  linkLabel?: string
  linkHref?: string
}

export interface ExperienceEntry {
  id: string
  company: string
  product: string
  role: string
  period: string
  location: string
  tags: string[]
  bullets: string[]
  stack?: string[]
  links?: ResourceLinkData[]
}

export interface ExperienceData {
  label: string
  heading: string
  entries: ExperienceEntry[]
}

export interface ProjectEntry {
  id: string
  name: string
  description: string
  period: string
  tags: string[]
  bullets: string[]
  stack: string[]
  links?: ResourceLinkData[]
  codeNote?: CodeNote
}

export interface EarlierProject {
  id: string
  name: string
  period: string
  tags: string[]
  summary: string
  stack: string[]
  links?: ResourceLinkData[]
}

export interface ProjectsData {
  label: string
  heading: string
  entries: ProjectEntry[]
  earlierLabel: string
  earlier: EarlierProject[]
}

export interface AiEngineeringData {
  label: string
  heading: string
  body: string[]
}

export interface EducationEntry {
  institution: string
  location: string
  period: string
  degree: string
  url: string
}

export interface EducationData {
  label: string
  entries: EducationEntry[]
}

export interface SkillCategory {
  name: string
  items: string[]
}

export interface SkillsData {
  label: string
  categories: SkillCategory[]
}

export interface ReferencePerson {
  name: string
  role: string
  company: string
  linkedinUrl: string
}

export interface ReferencesData {
  label: string
  heading: string
  people: ReferencePerson[]
  closing: string
}

export interface CTALink {
  label: string
  href: string
}

export interface CTAData {
  label: string
  heading: string
  body: string[]
  email: string
  cvHref: string
  links: CTALink[]
  copyright: string
}

export interface MetaData {
  title: string
  description: string
  phone: string
  location: string
  workRights: string
  social: {
    linkedin: string
    github: string
    x: string
  }
}

export interface PortfolioData {
  meta: MetaData
  navigation: NavData
  header: HeaderData
  summary: SummaryData
  skills: SkillsData
  experience: ExperienceData
  projects: ProjectsData
  aiEngineering: AiEngineeringData
  education: EducationData
  references: ReferencesData
  cta: CTAData
}
