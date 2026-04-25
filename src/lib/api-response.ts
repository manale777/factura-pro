import { NextResponse } from 'next/server'
import { ZodError } from 'zod'

export function okResponse<T>(data: T, status = 200) {
  return NextResponse.json(data, { status })
}

export function errorResponse(message: string, status = 500) {
  return NextResponse.json({ error: message }, { status })
}

export function validationError(error: ZodError) {
  const messages = error.issues.map(
    (e) => `${e.path.join('.')}: ${e.message}`
  )

  return NextResponse.json(
    { error: 'Error de validación', detalles: messages },
    { status: 400 }
  )
}

export function notFoundError(resource = 'Recurso') {
  return NextResponse.json(
    { error: `${resource} no encontrado` },
    { status: 404 }
  )
}