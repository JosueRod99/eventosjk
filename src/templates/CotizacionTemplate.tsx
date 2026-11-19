import { forwardRef } from 'react';
import type { DatosCotizacion } from '../types';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

interface Props {
  data: DatosCotizacion;
}

function formatFecha(fecha: string) {
  return format(parseISO(fecha), "dd-MMM-yyyy", { locale: es });
}

function formatFechaLarga(fecha: string) {
  return format(parseISO(fecha), "dd/MMMM/yyyy", { locale: es });
}

export const CotizacionTemplate = forwardRef<HTMLDivElement, Props>(({ data }, ref) => {
  const subtotal = data.items.reduce(
    (sum, item) => sum + item.cantidad * item.dias * item.precioUnitario,
    0
  );
  const subtotalConDescuento = subtotal - data.descuentoMonto;
  const iva = data.incluirIva ? subtotalConDescuento * 0.16 : 0;
  const total = subtotalConDescuento + iva;

  const fechaEvento = data.fechaEventoFin
    ? `${formatFecha(data.fechaEvento)} al ${formatFecha(data.fechaEventoFin)}`
    : formatFecha(data.fechaEvento);

  return (
    <div ref={ref} className="bg-white p-8 max-w-[800px] mx-auto font-sans text-gray-800" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
      {/* Título */}
      <h1 className="text-3xl font-bold text-center mb-8 tracking-wide border-b-2 border-gray-800 pb-4">
        COTIZACIÓN DE SERVICIOS
      </h1>

      {/* Header con datos */}
      <div className="flex justify-between mb-8 border border-gray-300 rounded overflow-hidden">
        <div className="p-4 flex-1 border-r border-gray-300">
          <p className="mb-1"><span className="font-semibold text-xs uppercase">Cliente:</span> <span className="italic">{data.cliente}</span></p>
          <p className="mb-1 text-xs uppercase font-semibold">Fecha del Evento:</p>
          <p className="mb-1 italic">{fechaEvento}</p>
          <p><span className="font-semibold text-xs uppercase">Lugar:</span> <span className="italic">{data.lugar}</span></p>
        </div>
        <div className="p-4 text-right">
          <p className="font-bold text-lg">EVENTOS J&K</p>
          <p className="text-sm">Ciudad Juárez, Chih.</p>
          <p className="text-sm">Tel: (656) 358 4995</p>
          <p className="text-sm mt-2">Fecha de Cotización: <span className="underline">{formatFechaLarga(data.fechaCotizacion)}</span></p>
        </div>
      </div>

      {/* Tabla de items */}
      <div className="mb-6">
        <h2 className="text-sm font-bold uppercase tracking-wider mb-3 text-gray-700">Detalle del Mobiliario y Equipo</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b-2 border-gray-300">
              <th className="text-left p-3 text-sm font-semibold">DESCRIPCIÓN</th>
              <th className="text-center p-3 text-sm font-semibold w-20">CANT.</th>
              <th className="text-center p-3 text-sm font-semibold w-20">DÍAS</th>
              <th className="text-right p-3 text-sm font-semibold w-32">PRECIO UNITARIO</th>
              <th className="text-right p-3 text-sm font-semibold w-28">TOTAL</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="p-3">{item.descripcion}</td>
                <td className="text-center p-3">{item.cantidad}</td>
                <td className="text-center p-3">{item.dias}</td>
                <td className="text-right p-3">${item.precioUnitario.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
                <td className="text-right p-3">${(item.cantidad * item.dias * item.precioUnitario).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totales */}
      <div className="flex flex-col items-end mb-8">
        <div className="w-80 border-t-2 border-gray-300 pt-3">
          <div className="flex justify-between py-1">
            <span className="font-semibold">SUBTOTAL:</span>
            <span>$ {subtotal.toLocaleString('es-MX', { minimumFractionDigits: 0 })}</span>
          </div>
          {data.descuentoMonto > 0 && (
            <div className="flex justify-between py-1 text-gray-600">
              <span className="font-semibold">DESCUENTO:</span>
              <div className="text-right">
                {data.descuentoDescripcion && (
                  <span className="text-xs mr-2">{data.descuentoDescripcion}</span>
                )}
                <span>-${data.descuentoMonto.toLocaleString('es-MX', { minimumFractionDigits: 0 })}</span>
              </div>
            </div>
          )}
          {data.incluirIva && (
            <div className="flex justify-between py-1">
              <span className="font-semibold">IVA (16%):</span>
              <span>$ {iva.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          )}
          <div className="flex justify-between py-2 border-t border-gray-300 mt-2">
            <span className="text-2xl font-bold">TOTAL:</span>
            <span className="text-2xl font-bold">$ {total.toLocaleString('es-MX', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</span>
          </div>
        </div>
      </div>

      {/* Página 2: Notas y condiciones */}
      {data.mostrarNotas && data.notas.length > 0 && (
        <div className="print-page pt-8 border-t-2 border-gray-200 mt-8">
          <h2 className="text-sm font-bold uppercase tracking-wider mb-4 underline">Notas y Condiciones</h2>
          <ul className="space-y-2">
            {data.notas.map((nota, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-lg">•</span>
                <span className={index === 0 ? 'font-semibold' : ''}>{nota}</span>
              </li>
            ))}
          </ul>

          {/* Logo y slogan */}
          <div className="mt-16 text-center">
            <img src="/logo.png" alt="Eventos J&K" className="h-24 mx-auto mb-4" />
            <p className="italic text-gray-600">"Transformamos tu espacio en el escenario ideal para celebrar"</p>
          </div>
        </div>
      )}
    </div>
  );
});

CotizacionTemplate.displayName = 'CotizacionTemplate';
