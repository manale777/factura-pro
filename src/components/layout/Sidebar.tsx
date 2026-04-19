'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, FileText, FilePlus2,
  Users, Package, Warehouse, BarChart3,
} from 'lucide-react'

const navItems = [
  {
    section: 'Principal',
    items: [{ href: '/', label: 'Dashboard', icon: LayoutDashboard }],
  },
  {
    section: 'Ventas',
    items: [
      { href: '/facturas', label: 'Facturas', icon: FileText },
      { href: '/facturas/nueva', label: 'Nueva factura', icon: FilePlus2 },
    ],
  },
  {
    section: 'Catálogos',
    items: [
      { href: '/clientes', label: 'Clientes', icon: Users },
      { href: '/productos', label: 'Productos', icon: Package },
      { href: '/inventario', label: 'Inventario', icon: Warehouse },
    ],
  },
  {
    section: 'Análisis',
    items: [{ href: '/reportes', label: 'Reportes', icon: BarChart3 }],
  },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex flex-col w-52 flex-shrink-0"
      style={{ backgroundColor: 'var(--sidebar-bg)' }}>

      {/* Logo */}
      <div className="px-4 py-4 border-b" style={{ borderColor: '#243552' }}>
        <p className="text-base font-medium" style={{ color: 'var(--accent)' }}>
          FacturaPro
        </p>
        <p className="text-xs mt-0.5" style={{ color: '#7a91b0' }}>
          Sistema de facturación
        </p>
      </div>

      {/* Navegación */}
      <nav className="flex-1 overflow-y-auto sidebar-nav py-2">
        {navItems.map((group) => (
          <div key={group.section}>
            <p className="px-4 pt-3 pb-1 text-xs uppercase tracking-widest"
              style={{ color: '#7a91b0' }}>
              {group.section}
            </p>
            {group.items.map(({ href, label, icon: Icon }) => {
              const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href)
              return (
                <Link key={href} href={href}
                  className="flex items-center gap-2.5 px-4 py-2 text-sm transition-colors duration-150"
                  style={{
                    color: isActive ? '#fff' : '#7a91b0',
                    backgroundColor: isActive ? 'var(--sidebar-hover)' : 'transparent',
                    borderLeft: isActive ? '2px solid var(--accent)' : '2px solid transparent',
                  }}>
                  <Icon size={15} />
                  {label}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      {/* Usuario */}
      <div className="px-4 py-3 border-t flex items-center gap-2"
        style={{ borderColor: '#243552' }}>
        <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium text-white flex-shrink-0"
          style={{ backgroundColor: 'var(--accent)' }}>
          JR
        </div>
        <div>
          <p className="text-xs font-medium text-white">Juan Ruiz</p>
          <p className="text-xs" style={{ color: '#7a91b0' }}>Administrador</p>
        </div>
      </div>
    </aside>
  )
}