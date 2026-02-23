/**
 * Device fingerprint for tracking free trial usage
 */

import FingerprintJS from '@fingerprintjs/fingerprintjs'

let cachedDeviceId: string | null = null

export async function getDeviceId(): Promise<string> {
  if (cachedDeviceId) {
    return cachedDeviceId
  }
  
  try {
    const fp = await FingerprintJS.load()
    const result = await fp.get()
    cachedDeviceId = result.visitorId
    return cachedDeviceId
  } catch {
    // Fallback to random ID stored in localStorage
    const stored = localStorage.getItem('bg-device-id')
    if (stored) {
      cachedDeviceId = stored
      return stored
    }
    
    const newId = `fallback-${Math.random().toString(36).slice(2)}`
    localStorage.setItem('bg-device-id', newId)
    cachedDeviceId = newId
    return newId
  }
}
