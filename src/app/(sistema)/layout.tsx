import Sidebar from '@/components/layout/Sidebar'
import Topbar from '@/components/layout/Topbar'
import './../../app/globals.css'

export default function SistemaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto main-content p-5">
          {children}
        </main>
      </div>
    </div>
  )
}