import ReportesClient from '@/components/modules/ReportesClient'

async function getReportes() {
  const res = await fetch('http://localhost:3000/api/reportes', { cache: 'no-store' })
  return res.json()
}

export default async function ReportesPage() {
  const data = await getReportes()
  return <ReportesClient data={data} />
}