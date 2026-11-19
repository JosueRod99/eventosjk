import { forwardRef } from 'react';
import type { DatosContrato } from '../types';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

interface Props {
  data: DatosContrato;
}

function formatFechaContrato(fecha: string) {
  const parsed = parseISO(fecha);
  const dia = format(parsed, 'd');
  const mes = format(parsed, 'MMMM', { locale: es });
  return { dia, mes };
}

export const ContratoTemplate = forwardRef<HTMLDivElement, Props>(({ data }, ref) => {
  const fechaRecoleccion = data.fechaRecoleccion ? formatFechaContrato(data.fechaRecoleccion) : { dia: '', mes: '' };

  return (
    <div ref={ref} className="bg-white p-8 max-w-[800px] mx-auto font-sans text-gray-800" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
      {/* Título */}
      <h1 className="text-2xl font-bold mb-6">
        CONTRATO DE ARRENDAMIENTO DE MOBILIARIO Y EQUIPO
      </h1>

      {/* Datos del Arrendador */}
      <div className="mb-6 text-sm">
        <p><span className="font-semibold">ARRENDADOR:</span> Eventos J&K</p>
        <p><span className="font-semibold">TELÉFONO:</span> 656 358 4995</p>
        <p><span className="font-semibold">CIUDAD:</span> Ciudad Juárez, Chihuahua.</p>
      </div>

      {/* Sección 1: Datos del Cliente */}
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-4">1. DATOS DEL CLIENTE Y DEL EVENTO</h2>
        <div className="space-y-3 ml-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold min-w-[180px]">□ Nombre completo:</span>
            <span className="flex-1 border-b border-gray-400 pb-1">{data.nombreCliente}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold min-w-[180px]">□ Identificación (INE/Pasaporte):</span>
            <span className="flex-1 border-b border-gray-400 pb-1">{data.identificacion}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold min-w-[180px]">□ Domicilio del evento:</span>
            <span className="flex-1 border-b border-gray-400 pb-1">{data.domicilioEvento}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold min-w-[180px]">□ Fecha de entrega/evento:</span>
            <span className="border-b border-gray-400 pb-1 px-2">{data.fechaEntrega}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold min-w-[180px]">□ Fecha de recolección:</span>
            <span>DÍA SIGUIENTE (<span className="border-b border-gray-400 px-2">{fechaRecoleccion.dia}</span> de <span className="border-b border-gray-400 px-2">{fechaRecoleccion.mes}</span> de 2026)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold min-w-[180px]">□ Hora de recolección aproximada:</span>
            <span className="border-b border-gray-400 pb-1 px-2">{data.horaRecoleccion}</span>
          </div>
        </div>
      </div>

      {/* Sección 2: Detalle del Equipo */}
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-2">2. DETALLE DEL EQUIPO Y COSTOS</h2>
        <p className="text-sm mb-4">El Arrendador entrega en arrendamiento el siguiente equipo en óptimas condiciones:</p>

        <table className="w-full border-collapse border border-gray-400 mb-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-400 p-2 text-left w-24">Cantidad</th>
              <th className="border border-gray-400 p-2 text-left">Descripción del Equipo (Carpas, Calentones, Sillas, etc.)</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item, index) => (
              <tr key={index}>
                <td className="border border-gray-400 p-2 text-center">{item.cantidad}</td>
                <td className="border border-gray-400 p-2">{item.descripcion}</td>
              </tr>
            ))}
            {/* Filas vacías para completar */}
            {Array.from({ length: Math.max(0, 4 - data.items.length) }).map((_, i) => (
              <tr key={`empty-${i}`}>
                <td className="border border-gray-400 p-2 h-8"></td>
                <td className="border border-gray-400 p-2"></td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="space-y-2 ml-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold">□ COSTO TOTAL DEL SERVICIO:</span>
            <span>$<span className="border-b border-gray-400 px-2 min-w-[80px] inline-block">{data.costoTotal.toLocaleString()}</span> MXN</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">□ ANTICIPO RECIBIDO:</span>
            <span>$<span className="border-b border-gray-400 px-2 min-w-[80px] inline-block">{data.anticipo.toLocaleString()}</span> MXN</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">□ RESTANTE A PAGAR (Al entregar):</span>
            <span>$<span className="border-b border-gray-400 px-2 min-w-[80px] inline-block">{data.restante.toLocaleString()}</span> MXN</span>
          </div>
        </div>
      </div>

      {/* Sección 3: Cláusulas */}
      {data.mostrarClausulas && (
        <div className="mb-6 print-page pt-6">
          <h2 className="text-lg font-bold mb-4">3. CLÁUSULAS DE GARANTÍA Y RESPONSABILIDAD</h2>

          <div className="space-y-4 text-sm">
            <div>
              <p><span className="font-bold">PRIMERA. GARANTÍA:</span> Como garantía de seguridad y cuidado del equipo, el Arrendatario hace entrega de una <span className="font-bold">VISA LÁSER ORIGINAL</span> al Arrendador. Este documento quedará bajo resguardo y será devuelto al Arrendatario únicamente al momento de la recolección, tras confirmar que el equipo no presenta daños.</p>
            </div>

            <div>
              <p><span className="font-bold">SEGUNDA. DAÑOS Y REPOSICIÓN:</span> El Arrendatario es responsable absoluto del equipo mientras esté en su posesión.</p>
              <ul className="list-none ml-4 mt-2 space-y-1">
                <li>□ En caso de <span className="font-bold">daño parcial</span> (quemaduras, manchas, piezas rotas), el Arrendatario pagará la reparación.</li>
                <li>□ En caso de <span className="font-bold">daño total o pérdida</span>, el Arrendatario deberá pagar el valor de reposición de un equipo <span className="font-bold">NUEVO</span>.</li>
              </ul>
            </div>

            <div>
              <p><span className="font-bold">TERCERA. SEGURIDAD:</span> Por seguridad, queda estrictamente prohibido mover o manipular las carpas y calentones una vez instalados por el personal de <span className="font-bold">Eventos J&K</span>.</p>
            </div>

            <div>
              <p><span className="font-bold">CUARTA. RECOLECCIÓN:</span> La recolección se realizará al día siguiente de la fecha del evento en el horario pactado. El cliente se compromete a permitir el acceso al personal para retirar el equipo.</p>
            </div>
          </div>
        </div>
      )}

      {/* Sección 4: Firmas */}
      <div className="mt-8">
        <h2 className="text-lg font-bold mb-8">4. FIRMAS DE CONFORMIDAD</h2>

        <div className="flex justify-between mt-16">
          <div className="text-center">
            <div className="border-t border-gray-800 w-48 pt-2">
              FIRMA DEL ARRENDADOR
            </div>
          </div>
          <div className="text-center">
            <div className="border-t border-gray-800 w-48 pt-2">
              FIRMA DEL CLIENTE
            </div>
          </div>
        </div>

        {/* Logo y slogan */}
        <div className="mt-12 text-center">
          <img src="/logo.png" alt="Eventos J&K" className="h-20 mx-auto mb-3" />
          <p className="italic text-gray-600 text-sm">"Transformamos tu espacio en el escenario ideal para celebrar"</p>
        </div>
      </div>
    </div>
  );
});

ContratoTemplate.displayName = 'ContratoTemplate';
