import InventarioClient from '@/components/modules/InventarioClient'

async function getData() {
  const [productos, movimientos] = await Promise.all([
    fetch('http://localhost:3000/api/productos', { cache: 'no-store' }).then((r) => r.json()),
    fetch('http://localhost:3000/api/inventario', { cache: 'no-store' }).then((r) => r.json()),
  ])
  return { productos, movimientos }
}

export default async function InventarioPage() {
  const { productos, movimientos } = await getData()
  return <InventarioClient productos={productos} movimientos={movimientos} />
}