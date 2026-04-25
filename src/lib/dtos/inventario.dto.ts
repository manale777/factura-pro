import { z } from 'zod'

// ─── Schemas de validación ────────────────────────────────────────────────────
export const TipoMovimientoEnum = z.enum(['Entrada', 'Salida', 'Ajuste'])
export type TipoMovimiento = z.infer<typeof TipoMovimientoEnum>

export const CrearMovimientoSchema = z.object({
  productoId: z.string().min(1, 'Selecciona un producto'),
  tipo:       TipoMovimientoEnum,
  cantidad:   z.number().int().positive('La cantidad debe ser mayor a 0'),
  nota:       z.string().optional(),
  usuario:    z.string().default('admin'),
})

// ─── DTOs de respuesta ────────────────────────────────────────────────────────
export interface MovimientoDTO {
  id:            string
  producto:      { id: string; codigo: string; descripcion: string }
  tipo:          TipoMovimiento
  cantidad:      number
  stockAnterior: number
  stockActual:   number
  nota:          string | null
  usuario:       string
  fecha:         string
}

// ─── Mapper ───────────────────────────────────────────────────────────────────
export function toMovimientoDTO(m: any): MovimientoDTO {
  return {
    id:            m.id,
    producto: {
      id:          m.producto?.id          ?? m.productoId,
      codigo:      m.producto?.codigo      ?? '',
      descripcion: m.producto?.descripcion ?? '',
    },
    tipo:          m.tipo,
    cantidad:      m.cantidad,
    stockAnterior: m.stockAnterior,
    stockActual:   m.stockActual,
    nota:          m.nota ?? null,
    usuario:       m.usuario,
    fecha:         m.fecha?.toISOString?.() ?? m.fecha,
  }
}