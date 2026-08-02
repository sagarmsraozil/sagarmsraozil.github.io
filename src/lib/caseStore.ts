export interface CaseAnswer {
  optionId: string
  correct: boolean
}

export type CaseAnswers = Record<string, CaseAnswer>

const STORAGE_KEY = 'sm.diagnosis.v1'
const EMPTY: CaseAnswers = {}

function readFromStorage(): CaseAnswers {
  if (typeof window === 'undefined') return EMPTY
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return EMPTY

    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return EMPTY

    const result: CaseAnswers = {}
    for (const [caseId, value] of Object.entries(parsed as Record<string, unknown>)) {
      if (
        value &&
        typeof value === 'object' &&
        typeof (value as CaseAnswer).optionId === 'string' &&
        typeof (value as CaseAnswer).correct === 'boolean'
      ) {
        result[caseId] = value as CaseAnswer
      }
    }
    return result
  } catch {
    return EMPTY
  }
}

function writeToStorage(answers: CaseAnswers): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(answers))
  } catch {
    // Storage unavailable (e.g. Safari private mode) — state stays in-memory for this tab only.
  }
}

let snapshot: CaseAnswers = readFromStorage()
const listeners = new Set<() => void>()

function emitChange(): void {
  for (const listener of listeners) listener()
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener)

  if (typeof window === 'undefined') {
    return () => listeners.delete(listener)
  }

  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      snapshot = readFromStorage()
      listener()
    }
  }
  window.addEventListener('storage', onStorage)

  return () => {
    listeners.delete(listener)
    window.removeEventListener('storage', onStorage)
  }
}

export function getSnapshot(): CaseAnswers {
  return snapshot
}

export function getServerSnapshot(): CaseAnswers {
  return EMPTY
}

export function recordAnswer(caseId: string, optionId: string, correct: boolean): void {
  snapshot = { ...snapshot, [caseId]: { optionId, correct } }
  writeToStorage(snapshot)
  emitChange()
}

export function resetAnswers(): void {
  snapshot = EMPTY
  writeToStorage(snapshot)
  emitChange()
}
