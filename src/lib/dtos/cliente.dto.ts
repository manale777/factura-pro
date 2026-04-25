import { z } from 'zod'

// ─── Schema de validación ─────────────────────────────────────────────────────
export const CrearClienteSchema = z.object({
  nombre:    z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  nit:       z.string().min(3, 'El NIT debe tener al menos 3 caracteres'),
  telefono:  z.string().optional(),
  email:     z.string().email('Email inválido').optional().or(z.literal('')),
  ciudad:    z.string().optional(),
  direccion: z.string().optional(),
})

export const ActualizarClienteSchema = CrearClienteSchema.partial()

// ─── DTOs de respuesta ────────────────────────────────────────────────────────
export interface ClienteResumenDTO {
  id:              string
  nombre:          string
  nit:             string
  telefono:        string | null
  email:           string | null
  ciudad:          string | null
  totalFacturas:   number
  saldoPendiente:  number
}

export interface ClienteDetalleDTO extends ClienteResumenDTO {
  direccion:  string | null
  createdAt:  string
  facturas:   FacturaClienteDTO[]
}

export interface FacturaClienteDTO {
  id:          string
  numero:      string
  emision:     string
  vencimiento: string
  total:       number
  estado:      string
}

// ─── Mapper: Prisma → DTO ────────────────────────────────────────────────────
export function toClienteResumenDTO(prismaCliente: any): ClienteResumenDTO {
  return {
    id:             prismaCliente.id,
    nombre:         prismaCliente.nombre,
    nit:            prismaCliente.nit,
    telefono:       prismaCliente.telefono ?? null,
    email:          prismaCliente.email ?? null,
    ciudad:         prismaCliente.ciudad ?? null,
    totalFacturas:  prismaCliente._count?.facturas ?? 0,
    saldoPendiente: prismaCliente.facturas
      ?.filter((f: any) => f.estado === 'Pendiente' || f.estado === 'Vencida')
      .reduce((acc: number, f: any) => acc + f.total, 0) ?? 0,
  }
}

export function toClienteDetalleDTO(prismaCliente: any): ClienteDetalleDTO {
  return {
    ...toClienteResumenDTO(prismaCliente),
    direccion: prismaCliente.direccion ?? null,
    createdAt: prismaCliente.createdAt?.toISOString?.() ?? prismaCliente.createdAt,
    facturas:  prismaCliente.facturas?.map((f: any) => ({
      id:          f.id,
      numero:      f.numero,
      emision:     f.emision?.toISOString?.() ?? f.emision,
      vencimiento: f.vencimiento?.toISOString?.() ?? f.vencimiento,
      total:       f.total,
      estado:      f.estado,
    })) ?? [],
  }
}