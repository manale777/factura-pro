import ClientesClient from '@/components/modules/ClientesClient'

async function getClientes() {
  const res = await fetch('http://localhost:3000/api/clientes', { cache: 'no-store' })
  return res.json()
}

export default async function ClientesPage() {
  const clientes = await getClientes()
  return <ClientesClient clientes={clientes} />
}