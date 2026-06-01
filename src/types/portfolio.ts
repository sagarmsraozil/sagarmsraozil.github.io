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

export interface HeroCTA {
  label: string
  href: string
}

export interface HeroData {
  headlineNormal: string
  headlineBold: string
  subheadline: string
  ctaPrimary: HeroCTA
  ctaSecondary: HeroCTA
}

export interface ProblemData {
  label: string
  heading: string
  body: string[]
}

export interface CaseStudy {
  id: string
  tags: string[]
  title: string
  body: string[]
  stack: string[]
  github: string | null
}

export interface GithubLink {
  label: string
  href: string
}

export interface AdditionalProject {
  id: string
  name: string
  period: string
  tags: string[]
  summary: string
  stack: string[]
  githubLinks: GithubLink[]
}

export interface WorkData {
  label: string
  heading: string
  intro: string
  caseStudies: CaseStudy[]
  additionalLabel: string
  additionalProjects: AdditionalProject[]
}

export interface Language {
  name: string
  level: string
}

export interface AboutData {
  label: string
  headingLines: string[]
  photoSrc: string | null
  body: string[]
  languages: Language[]
}

export interface ExperienceEntry {
  id: string
  company: string
  product: string
  role: string
  period: string
  location: string
  tags: string[]
  body: string[]
  websiteUrl: string | null
  stack?: string[]
  githubLinks?: GithubLink[]
}

export interface ExperienceData {
  label: string
  heading: string
  entries: ExperienceEntry[]
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

export interface CTALink {
  label: string
  href: string
}

export interface CTAData {
  label: string
  heading: string
  body: string[]
  email: string
  links: CTALink[]
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

export interface MetaData {
  title: string
  description: string
  social: {
    linkedin: string
    github: string
  }
}

export interface PortfolioData {
  meta: MetaData
  navigation: NavData
  hero: HeroData
  problem: ProblemData
  work: WorkData
  experience: ExperienceData
  about: AboutData
  education: EducationData
  skills: SkillsData
  references: ReferencesData
  cta: CTAData
}
