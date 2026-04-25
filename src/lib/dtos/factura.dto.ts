import { z } from 'zod'

// ─── Enums ────────────────────────────────────────────────────────────────────
export const EstadoFacturaEnum = z.enum(['Borrador', 'Pendiente', 'Pagada', 'Vencida'])
export type EstadoFactura = z.infer<typeof EstadoFacturaEnum>

// ─── Schemas de validación ────────────────────────────────────────────────────
export const ItemFacturaSchema = z.object({
  productoId:     z.string().nullable().optional(),
  descripcion:    z.string().min(1, 'La descripción es obligatoria'),
  cantidad:       z.number().positive('La cantidad debe ser mayor a 0'),
  precioUnitario: z.number().positive('El precio debe ser mayor a 0'),
  descuento:      z.number().min(0).max(100).default(0),
  subtotal:       z.number(),
  iva:            z.number(),
  total:          z.number(),
})

export const CrearFacturaSchema = z.object({
  clienteId:   z.string().min(1, 'Selecciona un cliente'),
  vencimiento: z.string().min(1, 'La fecha de vencimiento es obligatoria'),
  notas:       z.string().optional(),
  subtotal:    z.number(),
  totalIva:    z.number(),
  total:       z.number(),
  estado:      EstadoFacturaEnum.default('Borrador'),
  items:       z.array(ItemFacturaSchema).min(1, 'Agrega al menos un ítem'),
})

export const CambiarEstadoSchema = z.object({
  estado: EstadoFacturaEnum,
})

// ─── DTOs de respuesta ────────────────────────────────────────────────────────
export interface ItemFacturaDTO {
  id:             string
  descripcion:    string
  cantidad:       number
  precioUnitario: number
  descuento:      number
  subtotal:       number
  iva:            number
  total:          number
  producto:       { codigo: string; descripcion: string } | null
}

export interface FacturaResumenDTO {
  id:             string
  numero:         string
  cliente:        { id: string; nombre: string; nit: string }
  emision:        string
  vencimiento:    string
  subtotal:       number
  totalIva:       number
  total:          number
  estado:         EstadoFactura
  diasVencimiento: number
}

export interface FacturaDetalleDTO extends FacturaResumenDTO {
  notas:   string | null
  items:   ItemFacturaDTO[]
  cliente: {
    id:        string
    nombre:    string
    nit:       string
    email:     string | null
    ciudad:    string | null
    telefono:  string | null
  }
}

// ─── Mappers ──────────────────────────────────────────────────────────────────
function calcularDiasVencimiento(vencimiento: Date | string): number {
  const hoy = new Date()
  const vence = new Date(vencimiento)
  const diff = Math.ceil((vence.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24))
  return diff
}

export function toFacturaResumenDTO(f: any): FacturaResumenDTO {
  return {
    id:              f.id,
    numero:          f.numero,
    cliente: {
      id:     f.cliente?.id     ?? f.clienteId,
      nombre: f.cliente?.nombre ?? '',
      nit:    f.cliente?.nit    ?? '',
    },
    emision:         f.emision?.toISOString?.()     ?? f.emision,
    vencimiento:     f.vencimiento?.toISOString?.() ?? f.vencimiento,
    subtotal:        f.subtotal,
    totalIva:        f.totalIva,
    total:           f.total,
    estado:          f.estado,
    diasVencimiento: calcularDiasVencimiento(f.vencimiento),
  }
}

export function toFacturaDetalleDTO(f: any): FacturaDetalleDTO {
  return {
    ...toFacturaResumenDTO(f),
    notas: f.notas ?? null,
    cliente: {
      id:       f.cliente?.id       ?? f.clienteId,
      nombre:   f.cliente?.nombre   ?? '',
      nit:      f.cliente?.nit      ?? '',
      email:    f.cliente?.email    ?? null,
      ciudad:   f.cliente?.ciudad   ?? null,
      telefono: f.cliente?.telefono ?? null,
    },
    items: f.items?.map((item: any) => ({
      id:             item.id,
      descripcion:    item.descripcion,
      cantidad:       item.cantidad,
      precioUnitario: item.precioUnitario,
      descuento:      item.descuento,
      subtotal:       item.subtotal,
      iva:            item.iva,
      total:          item.total,
      producto:       item.producto
        ? { codigo: item.producto.codigo, descripcion: item.producto.descripcion }
        : null,
    })) ?? [],
  }
}