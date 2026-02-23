import { useState, useCallback, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Upload, Download, Sparkles, Check, X } from 'lucide-react'
import { removeBackground } from '../lib/api'
import { getDeviceId } from '../lib/fingerprint'

export default function HomePage() {
  const { t } = useTranslation()
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [result, setResult] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)
  const [remainingTokens, setRemainingTokens] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = useCallback((selectedFile: File) => {
    if (!selectedFile.type.startsWith('image/')) {
      setError(t('errors.invalidFile'))
      return
    }
    setFile(selectedFile)
    setPreview(URL.createObjectURL(selectedFile))
    setResult(null)
    setError(null)
  }, [t])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) handleFileSelect(droppedFile)
  }, [handleFileSelect])

  const handleRemoveBackground = async () => {
    if (!file) return
    
    setLoading(true)
    setError(null)
    
    try {
      const deviceId = await getDeviceId()
      const { blob, remainingTokens: tokens } = await removeBackground(file, deviceId)
      setResult(URL.createObjectURL(blob))
      setRemainingTokens(tokens)
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : t('errors.processingFailed')
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    if (!result) return
    const link = document.createElement('a')
    link.href = result
    link.download = 'bg-removed.png'
    link.click()
  }

  const handleReset = () => {
    setFile(null)
    setPreview(null)
    setResult(null)
    setError(null)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Hero */}
      <div className="text-center mb-12">
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
          {t('hero.title')}
        </h1>
        <p className="text-xl text-surface-200 max-w-2xl mx-auto">
          {t('hero.subtitle')}
        </p>
        <div className="flex flex-wrap justify-center gap-4 mt-6">
          <span className="flex items-center gap-2 text-sm text-primary-400">
            <Check className="w-4 h-4" /> {t('hero.features.free')}
          </span>
          <span className="flex items-center gap-2 text-sm text-primary-400">
            <Check className="w-4 h-4" /> {t('hero.features.noSignup')}
          </span>
          <span className="flex items-center gap-2 text-sm text-primary-400">
            <Check className="w-4 h-4" /> {t('hero.features.noWatermark')}
          </span>
        </div>
      </div>

      {/* Upload Area */}
      {!preview ? (
        <div
          className={`drop-zone rounded-2xl p-12 text-center cursor-pointer ${dragging ? 'dragging' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          data-testid="drop-zone"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
            className="hidden"
            data-testid="file-input"
          />
          <Upload className="w-12 h-12 mx-auto mb-4 text-primary-400 animate-float" />
          <p className="text-lg font-medium mb-2">{t('upload.title')}</p>
          <p className="text-surface-200 text-sm">{t('upload.hint')}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Preview/Result Area */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Original */}
            <div className="glass-card rounded-2xl p-4">
              <p className="text-sm text-surface-200 mb-3">{t('preview.original')}</p>
              <div className="aspect-square rounded-xl overflow-hidden bg-surface-900 flex items-center justify-center">
                <img src={preview} alt="Original" className="max-w-full max-h-full object-contain" />
              </div>
            </div>
            
            {/* Result */}
            <div className="glass-card rounded-2xl p-4">
              <p className="text-sm text-surface-200 mb-3">{t('preview.result')}</p>
              <div 
                className="aspect-square rounded-xl overflow-hidden flex items-center justify-center"
                style={{ 
                  background: result 
                    ? 'repeating-conic-gradient(#27272a 0% 25%, #18181b 0% 50%) 50% / 20px 20px'
                    : '#18181b'
                }}
              >
                {result ? (
                  <img src={result} alt="Result" className="max-w-full max-h-full object-contain" data-testid="result" />
                ) : (
                  <div className="text-surface-200 text-center p-8">
                    <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>{t('preview.placeholder')}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 flex items-center gap-3">
              <X className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap justify-center gap-4">
            {!result ? (
              <button
                onClick={handleRemoveBackground}
                disabled={loading}
                className="btn-primary flex items-center gap-2"
                data-testid="generate-btn"
              >
                {loading ? (
                  <>
                    <div className="spinner" />
                    <span>{t('actions.processing')}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>{t('actions.removeBackground')}</span>
                  </>
                )}
              </button>
            ) : (
              <>
                <button onClick={handleDownload} className="btn-primary flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  <span>{t('actions.download')}</span>
                </button>
                <button 
                  onClick={handleReset}
                  className="px-6 py-3 rounded-xl font-semibold border border-surface-800 hover:bg-surface-800 transition-colors"
                >
                  {t('actions.tryAnother')}
                </button>
              </>
            )}
          </div>

          {/* Remaining tokens */}
          {remainingTokens !== null && (
            <p className="text-center text-sm text-surface-200">
              {t('status.remainingTokens', { count: remainingTokens })}
            </p>
          )}
        </div>
      )}

      {/* SEO Content */}
      <section className="mt-16 space-y-8">
        <h2 className="font-display text-2xl font-bold text-center">{t('seo.title')}</h2>
        <p className="text-surface-200 text-center max-w-2xl mx-auto">{t('seo.description')}</p>
        
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <div className="glass-card rounded-xl p-6">
            <h3 className="font-display font-semibold mb-2">{t('seo.features.instant.title')}</h3>
            <p className="text-surface-200 text-sm">{t('seo.features.instant.description')}</p>
          </div>
          <div className="glass-card rounded-xl p-6">
            <h3 className="font-display font-semibold mb-2">{t('seo.features.free.title')}</h3>
            <p className="text-surface-200 text-sm">{t('seo.features.free.description')}</p>
          </div>
          <div className="glass-card rounded-xl p-6">
            <h3 className="font-display font-semibold mb-2">{t('seo.features.quality.title')}</h3>
            <p className="text-surface-200 text-sm">{t('seo.features.quality.description')}</p>
          </div>
        </div>
      </section>
    </div>
  )
}
