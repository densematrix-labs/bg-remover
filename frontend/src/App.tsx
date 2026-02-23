import { Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import Layout from './components/Layout'

const HomePage = lazy(() => import('./pages/HomePage'))
const PricingPage = lazy(() => import('./pages/PricingPage'))
const PaymentSuccessPage = lazy(() => import('./pages/PaymentSuccessPage'))

function App() {
  return (
    <Layout>
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="spinner" /></div>}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/payment/success" element={<PaymentSuccessPage />} />
        </Routes>
      </Suspense>
    </Layout>
  )
}

export default App
