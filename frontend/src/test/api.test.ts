import { describe, it, expect, vi, beforeEach } from 'vitest'
import { removeBackground } from '../lib/api'

describe('API client', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('returns blob and remaining tokens on success', async () => {
    const mockBlob = new Blob(['test'], { type: 'image/png' })
    const mockFile = new File(['test'], 'test.png', { type: 'image/png' })
    
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      blob: () => Promise.resolve(mockBlob),
      headers: new Map([['X-Remaining-Tokens', '2']]),
    })
    
    const result = await removeBackground(mockFile, 'test-device')
    expect(result.blob).toBe(mockBlob)
    expect(result.remainingTokens).toBe(2)
  })

  it('handles string error detail', async () => {
    const mockFile = new File(['test'], 'test.png', { type: 'image/png' })
    
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: () => Promise.resolve({ detail: 'Something went wrong' }),
    })
    
    await expect(removeBackground(mockFile, 'test-device'))
      .rejects.toThrow('Something went wrong')
  })

  it('handles object error detail with error field', async () => {
    const mockFile = new File(['test'], 'test.png', { type: 'image/png' })
    
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 402,
      json: () => Promise.resolve({ 
        detail: { error: 'No tokens remaining', code: 'payment_required' }
      }),
    })
    
    // Should NOT throw [object Object]
    await expect(removeBackground(mockFile, 'test-device'))
      .rejects.toThrow('No tokens remaining')
    
    // Verify no [object Object]
    try {
      await removeBackground(mockFile, 'test-device')
    } catch (e) {
      expect((e as Error).message).not.toContain('[object Object]')
      expect((e as Error).message).not.toContain('object Object')
    }
  })

  it('handles object error detail with message field', async () => {
    const mockFile = new File(['test'], 'test.png', { type: 'image/png' })
    
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      json: () => Promise.resolve({ 
        detail: { message: 'Invalid input' }
      }),
    })
    
    await expect(removeBackground(mockFile, 'test-device'))
      .rejects.toThrow('Invalid input')
  })

  it('falls back gracefully when json parsing fails', async () => {
    const mockFile = new File(['test'], 'test.png', { type: 'image/png' })
    
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: () => Promise.reject(new Error('Invalid JSON')),
    })
    
    await expect(removeBackground(mockFile, 'test-device'))
      .rejects.toThrow('Failed to remove background')
  })
})
