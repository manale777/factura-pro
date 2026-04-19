import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcryptjs'
const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
async function main() {
  console.log('DATABASE_URL detectada:', process.env.DATABASE_URL ? 'Sí' : 'No')
  console.log('Sembrando datos...')

  // Limpiar tablas
  await prisma.itemFactura.deleteMany()
  await prisma.movimientoInventario.deleteMany()
  await prisma.factura.deleteMany()
  await prisma.cliente.deleteMany()
  await prisma.producto.deleteMany()

  // Clientes
  const c1 = await prisma.cliente.create({ data: { nombre: 'Comercial López', nit: '7890123', telefono: '+591 72340012', email: 'lopez@comercial.bo', ciudad: 'La Paz', direccion: 'Av. Mcal. Santa Cruz 1230' } })
  const c2 = await prisma.cliente.create({ data: { nombre: 'TechSol Bolivia', nit: '4561239', telefono: '+591 69871234', email: 'info@techsol.bo', ciudad: 'Cochabamba', direccion: 'Calle Heroínas 450' } })
  const c3 = await prisma.cliente.create({ data: { nombre: 'Distrib. Norte', nit: '3217654', telefono: '+591 78450011', email: 'dnorte@gmail.com', ciudad: 'El Alto', direccion: 'Av. 6 de Marzo 789' } })
  const c4 = await prisma.cliente.create({ data: { nombre: 'Muebles Andino', nit: '9870011', telefono: '+591 71230098', email: 'ventas@andino.bo', ciudad: 'La Paz', direccion: 'Calle Comercio 301' } })
  const c5 = await prisma.cliente.create({ data: { nombre: 'Farma Sucre', nit: '6540987', telefono: '+591 67890023', email: 'farmasucre@salud.bo', ciudad: 'Sucre', direccion: 'Calle Arenales 120' } })

  // Productos
  const p1 = await prisma.producto.create({ data: { codigo: 'PRD-001', descripcion: 'Servicio de consultoría TI', categoria: 'Servicio', precio: 1500, iva: 13, stock: null, unidad: 'hora' } })
  const p2 = await prisma.producto.create({ data: { codigo: 'PRD-002', descripcion: 'Licencia software anual', categoria: 'Software', precio: 800, iva: 13, stock: null, unidad: 'unidad' } })
  const p3 = await prisma.producto.create({ data: { codigo: 'PRD-003', descripcion: 'Laptop HP 15"', categoria: 'Hardware', precio: 950, iva: 13, stock: 12, unidad: 'unidad' } })
  const p4 = await prisma.producto.create({ data: { codigo: 'PRD-004', descripcion: 'Mouse inalámbrico', categoria: 'Periférico', precio: 45, iva: 13, stock: 80, unidad: 'unidad' } })
  const p5 = await prisma.producto.create({ data: { codigo: 'PRD-005', descripcion: 'Capacitación por hora', categoria: 'Servicio', precio: 120, iva: 13, stock: null, unidad: 'hora' } })
  const p6 = await prisma.producto.create({ data: { codigo: 'PRD-006', descripcion: 'Teclado mecánico', categoria: 'Periférico', precio: 75, iva: 13, stock: 5, unidad: 'unidad' } })
  const p7 = await prisma.producto.create({ data: { codigo: 'PRD-007', descripcion: 'Monitor 24" FHD', categoria: 'Hardware', precio: 320, iva: 13, stock: 0, unidad: 'unidad' } })
  const p8 = await prisma.producto.create({ data: { codigo: 'PRD-008', descripcion: 'Cable HDMI 2m', categoria: 'Periférico', precio: 12, iva: 13, stock: 14, unidad: 'unidad' } })

  // Facturas
  const f1 = await prisma.factura.create({
    data: {
      numero: 'FAC-0089', clienteId: c1.id,
      emision: new Date('2026-04-18'), vencimiento: new Date('2026-05-02'),
      subtotal: 3720, totalIva: 480, total: 4200, estado: 'Pagada',
      items: {
        create: [
          { productoId: p1.id, descripcion: 'Consultoría TI (2 hrs)', cantidad: 2, precioUnitario: 1500, descuento: 0, subtotal: 3000, iva: 390, total: 3390 },
          { productoId: p5.id, descripcion: 'Capacitación (6 hrs)', cantidad: 6, precioUnitario: 120, descuento: 0, subtotal: 720, iva: 93.6, total: 813.6 },
        ]
      },
    },
  })

  const f2 = await prisma.factura.create({
    data: {
      numero: 'FAC-0088', clienteId: c2.id,
      emision: new Date('2026-04-17'), vencimiento: new Date('2026-05-01'),
      subtotal: 7543, totalIva: 981, total: 8750, estado: 'Pendiente',
      items: {
        create: [
          { productoId: p3.id, descripcion: 'Laptop HP 15"', cantidad: 5, precioUnitario: 950, descuento: 5, subtotal: 4512.5, iva: 586.6, total: 5099.1 },
          { productoId: p2.id, descripcion: 'Licencia software anual', cantidad: 3, precioUnitario: 800, descuento: 0, subtotal: 2400, iva: 312, total: 2712 },
        ]
      },
    },
  })

  await prisma.factura.create({
    data: {
      numero: 'FAC-0087', clienteId: c3.id,
      emision: new Date('2026-04-15'), vencimiento: new Date('2026-04-29'),
      subtotal: 1707, totalIva: 273, total: 1980, estado: 'Vencida',
      items: {
        create: [
          { productoId: p4.id, descripcion: 'Mouse inalámbrico x20', cantidad: 20, precioUnitario: 45, descuento: 0, subtotal: 900, iva: 117, total: 1017 },
          { productoId: p6.id, descripcion: 'Teclado mecánico x5', cantidad: 5, precioUnitario: 75, descuento: 0, subtotal: 375, iva: 48.75, total: 423.75 },
        ]
      },
    },
  })

  await prisma.factura.create({
    data: {
      numero: 'FAC-0086', clienteId: c4.id,
      emision: new Date('2026-04-14'), vencimiento: new Date('2026-04-28'),
      subtotal: 2931, totalIva: 469, total: 3400, estado: 'Pagada',
      items: {
        create: [
          { productoId: p3.id, descripcion: 'Laptop HP 15" x2', cantidad: 2, precioUnitario: 950, descuento: 0, subtotal: 1900, iva: 247, total: 2147 },
          { productoId: p7.id, descripcion: 'Monitor 24" FHD x2', cantidad: 2, precioUnitario: 320, descuento: 0, subtotal: 640, iva: 83.2, total: 723.2 },
        ]
      },
    },
  })

  await prisma.factura.create({
    data: {
      numero: 'FAC-0085', clienteId: c5.id,
      emision: new Date('2026-04-12'), vencimiento: new Date('2026-04-26'),
      subtotal: 5172, totalIva: 828, total: 6000, estado: 'Borrador',
      items: {
        create: [
          { productoId: p1.id, descripcion: 'Consultoría TI (3 hrs)', cantidad: 3, precioUnitario: 1500, descuento: 0, subtotal: 4500, iva: 585, total: 5085 },
          { productoId: p5.id, descripcion: 'Capacitación (5 hrs)', cantidad: 5, precioUnitario: 120, descuento: 0, subtotal: 600, iva: 78, total: 678 },
        ]
      },
    },
  })

  // Movimientos de inventario
  await prisma.movimientoInventario.createMany({
    data: [
      { productoId: p3.id, tipo: 'Entrada', cantidad: 10, stockAnterior: 2, stockActual: 12, usuario: 'jruiz' },
      { productoId: p4.id, tipo: 'Entrada', cantidad: 50, stockAnterior: 30, stockActual: 80, usuario: 'jruiz' },
      { productoId: p6.id, tipo: 'Salida', cantidad: 3, stockAnterior: 8, stockActual: 5, usuario: 'mlopez' },
      { productoId: p7.id, tipo: 'Salida', cantidad: 2, stockAnterior: 2, stockActual: 0, usuario: 'mlopez' },
      { productoId: p8.id, tipo: 'Ajuste', cantidad: 1, stockAnterior: 15, stockActual: 14, usuario: 'admin' },
    ],
  })

  // Dentro de main(), al final:
  const passwordHash = await bcrypt.hash('admin123', 10)
  await prisma.usuario.upsert({
    where: { email: 'admin@facturapro.bo' },
    update: {},
    create: {
      nombre: 'Juan Ruiz',
      email: 'admin@facturapro.bo',
      password: passwordHash,
      rol: 'admin',
    },
  })

  console.log('✅ Datos sembrados correctamente')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())

