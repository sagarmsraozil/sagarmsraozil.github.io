export interface CaseRegistryEntry {
  id: string
  label: string
}

export const CASE_REGISTRY: CaseRegistryEntry[] = [
  { id: 'jobs-ai', label: 'Jobs.ai' },
  { id: 'programiz', label: 'Programiz' },
  { id: 'nexus', label: 'Nexus' },
  { id: 'aroma', label: 'Aroma' },
]

export const TOTAL_CASES = CASE_REGISTRY.length
