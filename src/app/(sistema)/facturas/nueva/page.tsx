import NuevaFacturaClient from '@/components/modules/NuevaFacturaClient'

async function getData() {
  const [clientes, productos] = await Promise.all([
    fetch('http://localhost:3000/api/clientes', { cache: 'no-store' }).then((r) => r.json()),
    fetch('http://localhost:3000/api/productos', { cache: 'no-store' }).then((r) => r.json()),
  ])
  return { clientes, productos }
}

export default async function NuevaFacturaPage() {
  const { clientes, productos } = await getData()
  return <NuevaFacturaClient clientes={clientes} productos={productos} />
}