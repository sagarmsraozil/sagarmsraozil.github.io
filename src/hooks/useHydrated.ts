'use client'

import { useSyncExternalStore } from 'react'

function subscribe(): () => void {
  return () => {}
}

/**
 * True once the client has taken over from the server-rendered HTML.
 * Server and first client render both return false (no mismatch);
 * React resyncs to true immediately after mount.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(subscribe, () => true, () => false)
}
