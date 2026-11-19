import { forwardRef } from 'react';
import type { DatosRecibo } from '../types';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

interface Props {
  data: DatosRecibo;
}

function formatFecha(fecha: string) {
  return format(parseISO(fecha), "dd/MMMM/yyyy", { locale: es });
}

export const ReciboTemplate = forwardRef<HTMLDivElement, Props>(({ data }, ref) => {
  return (
    <div ref={ref} className="bg-white p-8 max-w-[800px] mx-auto font-sans text-gray-800" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
      {/* Título */}
      <h1 className="text-2xl font-bold text-center mb-4">
        RECIBO DE PAGO - EVENTOS J&K
      </h1>

      {/* Subtítulo y fecha */}
      <div className="text-center mb-6">
        <p className="text-sm">Ciudad Juárez, Chihuahua. Contacto: (656) 358 4995</p>
        <p className="mt-2">Fecha: <span className="border-b border-gray-400 px-4">{formatFecha(data.fecha)}</span></p>
      </div>

      {/* Sección 1: Datos del Cliente */}
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-3">1. DATOS DEL CLIENTE</h2>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold min-w-[80px]">Nombre:</span>
            <span className="flex-1 border-b border-gray-400 pb-1">{data.nombreCliente}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold min-w-[80px]">Dirección:</span>
            <span className="flex-1 border-b border-gray-400 pb-1">{data.direccion}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold min-w-[80px]">Teléfono:</span>
            <span className="flex-1 border-b border-gray-400 pb-1">{data.telefono}</span>
          </div>
        </div>
      </div>

      {/* Sección 2: Detalle del Mobiliario */}
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-3">2. DETALLE DEL MOBILIARIO Y EQUIPO</h2>
        <table className="w-full border-collapse border border-gray-400">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-400 p-2 text-center w-24">CANTIDAD</th>
              <th className="border border-gray-400 p-2 text-center">DESCRIPCIÓN</th>
              <th className="border border-gray-400 p-2 text-right w-28">IMPORTE</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item, index) => (
              <tr key={index}>
                <td className="border border-gray-400 p-2 text-center">{item.cantidad}</td>
                <td className="border border-gray-400 p-2">{item.descripcion}</td>
                <td className="border border-gray-400 p-2 text-right">${item.importe.toLocaleString('es-MX', { minimumFractionDigits: 0 })}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Sección 3: Resumen de Pago */}
      <div className="mb-8">
        <h2 className="text-lg font-bold mb-3">3. RESUMEN DE PAGO</h2>
        <table className="border-collapse border border-gray-400">
          <tbody>
            <tr>
              <td className="border border-gray-400 p-2 font-semibold bg-gray-50 w-40">COSTO TOTAL:</td>
              <td className="border border-gray-400 p-2 w-32 text-right">$ {data.costoTotal.toLocaleString('es-MX', { minimumFractionDigits: 0 })}</td>
            </tr>
            <tr>
              <td className="border border-gray-400 p-2 font-semibold bg-gray-50">ANTICIPO:</td>
              <td className="border border-gray-400 p-2 text-right">$ {data.anticipo.toLocaleString('es-MX', { minimumFractionDigits: 0 })}</td>
            </tr>
            <tr>
              <td className="border border-gray-400 p-2 font-semibold bg-gray-50">RESTANTE:</td>
              <td className="border border-gray-400 p-2 text-right">$ {data.restante.toLocaleString('es-MX', { minimumFractionDigits: 0 })}</td>
            </tr>
          </tbody>
        </table>

        <div className="mt-4">
          <span className="font-semibold">MÉTODO DE PAGO: </span>
          <span className="inline-flex items-center gap-4">
            <span>[ {data.metodoPago === 'efectivo' ? 'x' : ' '} ] Efectivo</span>
            <span>[ {data.metodoPago === 'transferencia' ? 'x' : ' '} ] Transferencia</span>
            <span>[ {data.metodoPago === 'otro' ? 'x' : ' '} ] Otro: {data.metodoPago === 'otro' ? data.otroMetodo : '_________'}</span>
          </span>
        </div>
      </div>

      {/* Firmas */}
      <div className="mt-8">
        <table className="w-full border-collapse border border-gray-400">
          <thead>
            <tr>
              <th className="border border-gray-400 p-2 w-1/2">EVENTOS J&K</th>
              <th className="border border-gray-400 p-2 w-1/2">CLIENTE</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-400 p-8 h-24 align-bottom">
                {/* Espacio para firma */}
              </td>
              <td className="border border-gray-400 p-8 h-24 align-bottom">
                {/* Espacio para firma */}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Logo */}
      <div className="mt-8 text-center">
        <img src="/logo.png" alt="Eventos J&K" className="h-20 mx-auto" />
      </div>
    </div>
  );
});

ReciboTemplate.displayName = 'ReciboTemplate';
