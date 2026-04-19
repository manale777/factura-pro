import LoginForm from '@/components/modules/LoginForm'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-8">
          <p className="text-2xl font-semibold" style={{ color: 'var(--accent)' }}>
            FacturaPro
          </p>
          <p className="text-sm text-gray-500 mt-1">Sistema de facturación</p>
        </div>

        <LoginForm />

        <p className="text-center text-xs text-gray-400 mt-6">
          © 2026 FacturaPro Bolivia
        </p>
      </div>
    </div>
  )
}