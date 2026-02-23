import { useTranslation } from 'react-i18next'
import { Check } from 'lucide-react'
import { Link } from 'react-router-dom'

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    period: '/forever',
    features: ['3 free removals', 'High quality PNG', 'No watermark'],
    cta: 'Get Started',
    ctaLink: '/',
    highlighted: false,
  },
  {
    id: 'starter',
    name: 'Starter',
    price: '$3',
    period: '/one-time',
    features: ['30 background removals', 'High quality PNG', 'Priority processing', 'No expiration'],
    cta: 'Buy Now',
    ctaLink: '#', // TODO: Creem checkout
    highlighted: true,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$9',
    period: '/one-time',
    features: ['150 background removals', 'High quality PNG', 'Priority processing', 'Batch upload', 'No expiration'],
    cta: 'Buy Now',
    ctaLink: '#',
    highlighted: false,
  },
]

export default function PricingPage() {
  const { t } = useTranslation()
  
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="font-display text-4xl font-bold mb-4">{t('pricing.title')}</h1>
        <p className="text-surface-200 text-lg">{t('pricing.subtitle')}</p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div 
            key={plan.id}
            className={`glass-card rounded-2xl p-6 ${
              plan.highlighted 
                ? 'ring-2 ring-primary-500 relative' 
                : ''
            }`}
          >
            {plan.highlighted && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                {t('pricing.popular')}
              </div>
            )}
            
            <h3 className="font-display text-xl font-semibold mb-2">{plan.name}</h3>
            <div className="mb-4">
              <span className="text-3xl font-bold">{plan.price}</span>
              <span className="text-surface-200">{plan.period}</span>
            </div>
            
            <ul className="space-y-3 mb-6">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-primary-400" />
                  <span className="text-surface-200">{feature}</span>
                </li>
              ))}
            </ul>
            
            {plan.id === 'free' ? (
              <Link 
                to={plan.ctaLink}
                className={`block text-center w-full py-3 rounded-xl font-semibold transition-colors ${
                  plan.highlighted
                    ? 'btn-primary'
                    : 'border border-surface-800 hover:bg-surface-800'
                }`}
              >
                {plan.cta}
              </Link>
            ) : (
              <button 
                className={`w-full py-3 rounded-xl font-semibold transition-colors ${
                  plan.highlighted
                    ? 'btn-primary'
                    : 'border border-surface-800 hover:bg-surface-800'
                }`}
              >
                {plan.cta}
              </button>
            )}
          </div>
        ))}
      </div>
      
      {/* Comparison with Photoroom */}
      <section className="mt-16 glass-card rounded-2xl p-8">
        <h2 className="font-display text-2xl font-bold mb-6 text-center">
          {t('pricing.comparison.title')}
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-800">
                <th className="text-left py-3 px-4">{t('pricing.comparison.feature')}</th>
                <th className="text-center py-3 px-4 text-primary-400">BgGone</th>
                <th className="text-center py-3 px-4 text-surface-200">Photoroom</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-surface-800/50">
                <td className="py-3 px-4">{t('pricing.comparison.freeUses')}</td>
                <td className="text-center py-3 px-4 text-primary-400">3/day</td>
                <td className="text-center py-3 px-4 text-surface-200">250/month</td>
              </tr>
              <tr className="border-b border-surface-800/50">
                <td className="py-3 px-4">{t('pricing.comparison.signup')}</td>
                <td className="text-center py-3 px-4 text-primary-400">{t('pricing.comparison.no')}</td>
                <td className="text-center py-3 px-4 text-surface-200">{t('pricing.comparison.yes')}</td>
              </tr>
              <tr className="border-b border-surface-800/50">
                <td className="py-3 px-4">{t('pricing.comparison.watermark')}</td>
                <td className="text-center py-3 px-4 text-primary-400">{t('pricing.comparison.no')}</td>
                <td className="text-center py-3 px-4 text-surface-200">{t('pricing.comparison.freeTierYes')}</td>
              </tr>
              <tr>
                <td className="py-3 px-4">{t('pricing.comparison.paidPrice')}</td>
                <td className="text-center py-3 px-4 text-primary-400">$0.10/image</td>
                <td className="text-center py-3 px-4 text-surface-200">$9.99/month</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
