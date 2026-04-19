import FacturasClient from '@/components/modules/FacturasClient'

async function getFacturas() {
  const res = await fetch('http://localhost:3000/api/facturas', { cache: 'no-store' })
  return res.json()
}

export default async function FacturasPage() {
  const facturas = await getFacturas()
  return <FacturasClient facturas={facturas} />
}