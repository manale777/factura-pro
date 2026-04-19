import { auth, signOut } from '@/auth'
import { Bell, LogOut } from 'lucide-react'

export default async function Topbar() {
  const session = await auth()

  return (
    <header className="h-12 flex items-center justify-between px-5 flex-shrink-0"
      style={{ backgroundColor: 'var(--topbar-bg)' }}>
      <div className="flex items-center gap-2">
        <span className="text-sm" style={{ color: '#7a91b0' }}>
          Bienvenido, {session?.user?.name?.split(' ')[0]}
        </span>
      </div>
      <div className="flex items-center gap-4">
        <button className="relative" style={{ color: '#7a91b0' }}>
          <Bell size={18} />
          <span className="absolute -top-1 -right-1.5 bg-red-500 text-white rounded-full w-3.5 h-3.5 text-xs flex items-center justify-center">
            3
          </span>
        </button>

        <form action={async () => {
          'use server'
          await signOut({ redirectTo: '/login' })
        }}>
          <button type="submit"
            className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg transition-colors"
            style={{ color: '#7a91b0' }}>
            <LogOut size={14} />
            Salir
          </button>
        </form>
      </div>
    </header>
  )
}