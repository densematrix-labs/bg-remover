import { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from './LanguageSwitcher'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const { t } = useTranslation()
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-card">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">BG</span>
            </div>
            <span className="font-display font-bold text-xl">BgGone</span>
          </Link>
          
          <nav className="flex items-center gap-6">
            <Link to="/pricing" className="text-surface-200 hover:text-white transition-colors">
              {t('nav.pricing')}
            </Link>
            <LanguageSwitcher />
          </nav>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-1">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="border-t border-surface-800 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-surface-200 text-sm">
          <p>© 2026 BgGone — {t('footer.tagline')}</p>
          <p className="mt-2 text-surface-200/60">
            {t('footer.alternative')}
          </p>
        </div>
      </footer>
    </div>
  )
}
