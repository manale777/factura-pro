import ProductosClient from '@/components/modules/ProductosClient'

async function getProductos() {
  const res = await fetch('http://localhost:3000/api/productos', { cache: 'no-store' })
  return res.json()
}

export default async function ProductosPage() {
  const productos = await getProductos()
  return <ProductosClient productos={productos} />
}