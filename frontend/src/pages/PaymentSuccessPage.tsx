import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { CheckCircle, Sparkles } from 'lucide-react'

export default function PaymentSuccessPage() {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const [tokens, setTokens] = useState<number | null>(null)
  
  useEffect(() => {
    // In production, verify payment and fetch token count
    const tokenCount = searchParams.get('tokens')
    if (tokenCount) {
      setTokens(parseInt(tokenCount, 10))
    }
  }, [searchParams])

  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary-500/20 flex items-center justify-center">
        <CheckCircle className="w-10 h-10 text-primary-400" />
      </div>
      
      <h1 className="font-display text-3xl font-bold mb-4">{t('payment.success.title')}</h1>
      <p className="text-surface-200 mb-8">{t('payment.success.message')}</p>
      
      {tokens && (
        <div className="glass-card rounded-xl p-6 mb-8">
          <p className="text-surface-200 text-sm mb-2">{t('payment.success.tokensAdded')}</p>
          <p className="text-4xl font-bold text-primary-400">{tokens}</p>
        </div>
      )}
      
      <Link to="/" className="btn-primary inline-flex items-center gap-2">
        <Sparkles className="w-5 h-5" />
        {t('payment.success.cta')}
      </Link>
    </div>
  )
}
