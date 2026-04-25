import { z } from 'zod'

// ─── Schemas de validación ────────────────────────────────────────────────────
export const CrearProductoSchema = z.object({
  codigo:      z.string().min(1, 'El código es obligatorio'),
  descripcion: z.string().min(2, 'La descripción es obligatoria'),
  categoria:   z.enum(['Servicio', 'Software', 'Hardware', 'Periférico', 'Otro']),
  precio:      z.number().positive('El precio debe ser mayor a 0'),
  iva:         z.number().min(0).max(100).default(13),
  stock:       z.number().int().min(0).nullable().default(null),
  unidad:      z.string().default('unidad'),
})

export const ActualizarProductoSchema = CrearProductoSchema.partial()

// ─── DTOs de respuesta ────────────────────────────────────────────────────────
export type CategoriaProducto = 'Servicio' | 'Software' | 'Hardware' | 'Periférico' | 'Otro'

export interface ProductoDTO {
  id:             string
  codigo:         string
  descripcion:    string
  categoria:      CategoriaProducto
  precio:         number
  iva:            number
  stock:          number | null
  unidad:         string
  precioConIva:   number
  tieneStock:     boolean
  estadoStock:    'normal' | 'bajo' | 'agotado' | 'servicio'
}

// ─── Mapper ───────────────────────────────────────────────────────────────────
export function toProductoDTO(p: any): ProductoDTO {
  const tieneStock = p.stock !== null
  let estadoStock: ProductoDTO['estadoStock'] = 'servicio'
  if (tieneStock) {
    if (p.stock === 0)      estadoStock = 'agotado'
    else if (p.stock <= 5)  estadoStock = 'bajo'
    else                    estadoStock = 'normal'
  }

  return {
    id:           p.id,
    codigo:       p.codigo,
    descripcion:  p.descripcion,
    categoria:    p.categoria,
    precio:       p.precio,
    iva:          p.iva,
    stock:        p.stock,
    unidad:       p.unidad,
    precioConIva: parseFloat((p.precio * (1 + p.iva / 100)).toFixed(2)),
    tieneStock,
    estadoStock,
  }
}