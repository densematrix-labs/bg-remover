/**
 * API client for bg-remover backend
 */

const API_BASE = import.meta.env.VITE_API_URL || ''

export interface RemoveBackgroundResult {
  blob: Blob
  remainingTokens: number
}

export async function removeBackground(
  file: File, 
  deviceId: string,
  bgColor?: string
): Promise<RemoveBackgroundResult> {
  const formData = new FormData()
  formData.append('file', file)
  
  let url = `${API_BASE}/api/v1/remove-background`
  if (bgColor) {
    url += `?bg_color=${encodeURIComponent(bgColor)}`
  }
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'X-Device-Id': deviceId,
    },
    body: formData,
  })
  
  if (!response.ok) {
    const data = await response.json().catch(() => ({ detail: 'Request failed' }))
    
    // Handle error detail - could be string or object
    const errorMessage = typeof data.detail === 'string'
      ? data.detail
      : data.detail?.error || data.detail?.message || 'Failed to remove background'
    
    throw new Error(errorMessage)
  }
  
  const blob = await response.blob()
  const remainingTokens = parseInt(response.headers.get('X-Remaining-Tokens') || '0', 10)
  
  return { blob, remainingTokens }
}

export async function getTrialStatus(deviceId: string) {
  const response = await fetch(`${API_BASE}/api/v1/trial-status`, {
    headers: {
      'X-Device-Id': deviceId,
    },
  })
  
  if (!response.ok) {
    throw new Error('Failed to get trial status')
  }
  
  return response.json()
}
