'use client'

import { useState } from 'react'
import EditarClienteModal from './EditarClienteModal'
import { Pencil } from 'lucide-react'

export default function ClienteDetalleClient({ cliente }: { cliente: any }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium text-white disabled:opacity-50"
        style={{ backgroundColor: 'var(--accent-yellow)' }}>
        <Pencil size={13} />
        Editar
      </button>

      {open && (
        <EditarClienteModal
          cliente={cliente}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  )
}