import InventarioClient from '@/components/modules/InventarioClient'
import NuevoMovimiento from '@/components/modules/NuevoMovimiento'

async function getData() {
  const [productos, movimientos] = await Promise.all([
    fetch('http://localhost:3000/api/productos', { cache: 'no-store' }).then((r) => r.json()),
    fetch('http://localhost:3000/api/inventario', { cache: 'no-store' }).then((r) => r.json()),
  ])
  return { productos, movimientos }
}

export default async function InventarioPage() {
  const { productos, movimientos } = await getData()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-400">Inicio / Inventario</p>
          <h1 className="text-lg font-semibold text-gray-800 mt-0.5">Inventario</h1>
        </div>
        <NuevoMovimiento productos={productos} />
      </div>
      <InventarioClient productos={productos} movimientos={movimientos} />
    </div>
  )
}