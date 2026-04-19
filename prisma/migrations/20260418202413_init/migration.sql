-- CreateEnum
CREATE TYPE "EstadoFactura" AS ENUM ('Borrador', 'Pendiente', 'Pagada', 'Vencida');

-- CreateEnum
CREATE TYPE "TipoMovimiento" AS ENUM ('Entrada', 'Salida', 'Ajuste');

-- CreateTable
CREATE TABLE "Cliente" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "nit" TEXT NOT NULL,
    "telefono" TEXT,
    "email" TEXT,
    "ciudad" TEXT,
    "direccion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Producto" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "precio" DOUBLE PRECISION NOT NULL,
    "iva" DOUBLE PRECISION NOT NULL DEFAULT 13,
    "stock" INTEGER,
    "unidad" TEXT NOT NULL DEFAULT 'unidad',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Producto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Factura" (
    "id" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "clienteId" TEXT NOT NULL,
    "emision" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "vencimiento" TIMESTAMP(3) NOT NULL,
    "subtotal" DOUBLE PRECISION NOT NULL,
    "totalIva" DOUBLE PRECISION NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "estado" "EstadoFactura" NOT NULL DEFAULT 'Borrador',
    "notas" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Factura_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemFactura" (
    "id" TEXT NOT NULL,
    "facturaId" TEXT NOT NULL,
    "productoId" TEXT,
    "descripcion" TEXT NOT NULL,
    "cantidad" DOUBLE PRECISION NOT NULL,
    "precioUnitario" DOUBLE PRECISION NOT NULL,
    "descuento" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "subtotal" DOUBLE PRECISION NOT NULL,
    "iva" DOUBLE PRECISION NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "ItemFactura_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MovimientoInventario" (
    "id" TEXT NOT NULL,
    "productoId" TEXT NOT NULL,
    "tipo" "TipoMovimiento" NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "stockAnterior" INTEGER NOT NULL,
    "stockActual" INTEGER NOT NULL,
    "nota" TEXT,
    "usuario" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MovimientoInventario_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_nit_key" ON "Cliente"("nit");

-- CreateIndex
CREATE UNIQUE INDEX "Producto_codigo_key" ON "Producto"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Factura_numero_key" ON "Factura"("numero");

-- AddForeignKey
ALTER TABLE "Factura" ADD CONSTRAINT "Factura_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemFactura" ADD CONSTRAINT "ItemFactura_facturaId_fkey" FOREIGN KEY ("facturaId") REFERENCES "Factura"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemFactura" ADD CONSTRAINT "ItemFactura_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovimientoInventario" ADD CONSTRAINT "MovimientoInventario_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
