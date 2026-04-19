import {
  Document, Page, Text, View, StyleSheet, Font,
  DocumentProps,
} from '@react-pdf/renderer'
import { ReactElement } from 'react'

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: '#374151',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  logo: {
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
    color: '#3d8ef8',
  },
  logoSub: {
    fontSize: 9,
    color: '#9ca3af',
    marginTop: 2,
  },
  facturaNumero: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    color: '#1f2937',
    textAlign: 'right',
  },
  estadoBadge: {
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    alignSelf: 'flex-end',
  },
  partesRow: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 24,
  },
  parteBox: {
    flex: 1,
    backgroundColor: '#f9fafb',
    borderRadius: 6,
    padding: 12,
  },
  parteLabel: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  parteNombre: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: '#1f2937',
    marginBottom: 2,
  },
  parteDato: {
    fontSize: 9,
    color: '#6b7280',
    marginBottom: 1,
  },
  fechasRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  fechaBox: {
    flex: 1,
    borderTopWidth: 2,
    borderTopColor: '#3d8ef8',
    paddingTop: 6,
  },
  fechaLabel: {
    fontSize: 8,
    color: '#9ca3af',
    marginBottom: 2,
  },
  fechaValor: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#1f2937',
  },
  tablaHeader: {
    flexDirection: 'row',
    backgroundColor: '#1a2940',
    borderRadius: 4,
    paddingVertical: 7,
    paddingHorizontal: 8,
    marginBottom: 1,
  },
  tablaHeaderText: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: '#fff',
    textTransform: 'uppercase',
  },
  tablaFila: {
    flexDirection: 'row',
    paddingVertical: 7,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  tablaFilaAlt: {
    backgroundColor: '#f9fafb',
  },
  tablaTexto: {
    fontSize: 9,
    color: '#374151',
  },
  colDescripcion: { flex: 3 },
  colCant: { flex: 1, textAlign: 'center' },
  colPrecio: { flex: 1.5, textAlign: 'right' },
  colDesc: { flex: 1, textAlign: 'center' },
  colSubtotal: { flex: 1.5, textAlign: 'right' },
  colIva: { flex: 1.5, textAlign: 'right' },
  colTotal: { flex: 1.5, textAlign: 'right' },
  totalesBox: {
    marginTop: 16,
    alignItems: 'flex-end',
  },
  totalesInner: {
    width: 200,
  },
  totalesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  totalesLabel: {
    fontSize: 9,
    color: '#6b7280',
  },
  totalesValor: {
    fontSize: 9,
    color: '#374151',
  },
  totalFinalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    marginTop: 2,
    borderTopWidth: 2,
    borderTopColor: '#3d8ef8',
  },
  totalFinalLabel: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: '#1f2937',
  },
  totalFinalValor: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: '#3d8ef8',
  },
  notas: {
    marginTop: 24,
    padding: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#3d8ef8',
  },
  notasLabel: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: '#9ca3af',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  notasTexto: {
    fontSize: 9,
    color: '#6b7280',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 8,
  },
  footerText: {
    fontSize: 8,
    color: '#9ca3af',
  },
})

const estadoColores: Record<string, string> = {
  Pagada:   '#d1fae5',
  Pendiente:'#fef3c7',
  Vencida:  '#fee2e2',
  Borrador: '#f3f4f6',
}
const estadoTexto: Record<string, string> = {
  Pagada:   '#065f46',
  Pendiente:'#92400e',
  Vencida:  '#991b1b',
  Borrador: '#6b7280',
}

interface Props {
  factura: any
}

export default function FacturaPDF({ factura }: Props): ReactElement<DocumentProps> {
  const emision = new Date(factura.emision).toLocaleDateString('es-BO')
  const vencimiento = new Date(factura.vencimiento).toLocaleDateString('es-BO')

  return (
    <Document>
      <Page size="A4" style={styles.page}>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.logo}>FacturaPro</Text>
            <Text style={styles.logoSub}>Sistema de facturación</Text>
          </View>
          <View>
            <Text style={styles.facturaNumero}>{factura.numero}</Text>
            <View style={[
              styles.estadoBadge,
              { backgroundColor: estadoColores[factura.estado] ?? '#f3f4f6' }
            ]}>
              <Text style={{ fontSize: 8, fontFamily: 'Helvetica-Bold', color: estadoTexto[factura.estado] ?? '#6b7280' }}>
                {factura.estado}
              </Text>
            </View>
          </View>
        </View>

        {/* Emisor y Cliente */}
        <View style={styles.partesRow}>
          <View style={styles.parteBox}>
            <Text style={styles.parteLabel}>Emisor</Text>
            <Text style={styles.parteNombre}>Mi Empresa Bolivia S.R.L.</Text>
            <Text style={styles.parteDato}>NIT: 1234567890</Text>
            <Text style={styles.parteDato}>La Paz, Bolivia</Text>
            <Text style={styles.parteDato}>Av. Mcal. Santa Cruz 1200</Text>
          </View>
          <View style={styles.parteBox}>
            <Text style={styles.parteLabel}>Cliente</Text>
            <Text style={styles.parteNombre}>{factura.cliente?.nombre}</Text>
            <Text style={styles.parteDato}>NIT: {factura.cliente?.nit}</Text>
            {factura.cliente?.ciudad && (
              <Text style={styles.parteDato}>{factura.cliente.ciudad}</Text>
            )}
            {factura.cliente?.email && (
              <Text style={styles.parteDato}>{factura.cliente.email}</Text>
            )}
          </View>
        </View>

        {/* Fechas */}
        <View style={styles.fechasRow}>
          {[
            { label: 'Número de factura', valor: factura.numero },
            { label: 'Fecha de emisión', valor: emision },
            { label: 'Fecha de vencimiento', valor: vencimiento },
          ].map(({ label, valor }) => (
            <View key={label} style={styles.fechaBox}>
              <Text style={styles.fechaLabel}>{label}</Text>
              <Text style={styles.fechaValor}>{valor}</Text>
            </View>
          ))}
        </View>

        {/* Tabla de items */}
        <View style={styles.tablaHeader}>
          <Text style={[styles.tablaHeaderText, styles.colDescripcion]}>Descripción</Text>
          <Text style={[styles.tablaHeaderText, styles.colCant]}>Cant.</Text>
          <Text style={[styles.tablaHeaderText, styles.colPrecio]}>P. Unit.</Text>
          <Text style={[styles.tablaHeaderText, styles.colDesc]}>Desc.</Text>
          <Text style={[styles.tablaHeaderText, styles.colSubtotal]}>Subtotal</Text>
          <Text style={[styles.tablaHeaderText, styles.colIva]}>IVA</Text>
          <Text style={[styles.tablaHeaderText, styles.colTotal]}>Total</Text>
        </View>

        {factura.items?.map((item: any, i: number) => (
          <View key={item.id} style={[styles.tablaFila, ...(i % 2 !== 0 ? [styles.tablaFilaAlt] : [])]}>
            <Text style={[styles.tablaTexto, styles.colDescripcion]}>{item.descripcion}</Text>
            <Text style={[styles.tablaTexto, styles.colCant, { textAlign: 'center' }]}>{item.cantidad}</Text>
            <Text style={[styles.tablaTexto, styles.colPrecio, { textAlign: 'right' }]}>${item.precioUnitario.toFixed(2)}</Text>
            <Text style={[styles.tablaTexto, styles.colDesc, { textAlign: 'center' }]}>{item.descuento}%</Text>
            <Text style={[styles.tablaTexto, styles.colSubtotal, { textAlign: 'right' }]}>${item.subtotal.toFixed(2)}</Text>
            <Text style={[styles.tablaTexto, styles.colIva, { textAlign: 'right' }]}>${item.iva.toFixed(2)}</Text>
            <Text style={[styles.tablaTexto, styles.colTotal, { textAlign: 'right', fontFamily: 'Helvetica-Bold' }]}>${item.total.toFixed(2)}</Text>
          </View>
        ))}

        {/* Totales */}
        <View style={styles.totalesBox}>
          <View style={styles.totalesInner}>
            <View style={styles.totalesRow}>
              <Text style={styles.totalesLabel}>Subtotal</Text>
              <Text style={styles.totalesValor}>${factura.subtotal.toFixed(2)}</Text>
            </View>
            <View style={styles.totalesRow}>
              <Text style={styles.totalesLabel}>IVA (13%)</Text>
              <Text style={styles.totalesValor}>${factura.totalIva.toFixed(2)}</Text>
            </View>
            <View style={styles.totalFinalRow}>
              <Text style={styles.totalFinalLabel}>TOTAL</Text>
              <Text style={styles.totalFinalValor}>${factura.total.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Notas */}
        {factura.notas && (
          <View style={styles.notas}>
            <Text style={styles.notasLabel}>Notas</Text>
            <Text style={styles.notasTexto}>{factura.notas}</Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>FacturaPro — Sistema de Facturación Bolivia</Text>
          <Text style={styles.footerText}>Generado el {new Date().toLocaleDateString('es-BO')}</Text>
        </View>

      </Page>
    </Document>
  )
}