import { useState } from 'react';
import type { DatosCotizacion, ItemLinea, Producto } from '../types';
import { useCatalogo } from '../hooks/useCatalogo';
import { SelectorProductos } from './SelectorProductos';

const notasDefault = [
  'En caso de requerir factura, se le agrega el 16% de I.V.A al costo total.',
  'Esta cotización tiene una vigencia de 5 días naturales.',
  'Los precios están expresados en moneda nacional MXN.',
  'La duración del servicio es de 24 horas',
  'Los precios incluyen entrega y recolección en zona estándar de Ciudad Juárez. (Zonas alejadas de la ciudad pueden tener costo extra por el envío)',
];

const IVA = 0.16;

interface Props {
  onSubmit: (data: DatosCotizacion) => void;
  initialData?: DatosCotizacion;
}

export function CotizacionForm({ onSubmit, initialData }: Props) {
  const [formData, setFormData] = useState<DatosCotizacion>(
    initialData || {
      cliente: '',
      fechaEvento: '',
      fechaEventoFin: '',
      lugar: '',
      fechaCotizacion: new Date().toISOString().split('T')[0],
      items: [{ descripcion: '', cantidad: 1, dias: 1, precioUnitario: 0 }],
      descuentoDescripcion: '',
      descuentoMonto: 0,
      incluirIva: false,
      notas: notasDefault,
      mostrarNotas: true,
    }
  );

  const { catalogo } = useCatalogo();

  const toggleProducto = (producto: Producto, seleccionado: boolean) => {
    const itemVacio = { descripcion: '', cantidad: 1, dias: 1, precioUnitario: 0 };
    const items = seleccionado
      ? [
          ...formData.items.filter((i) => i.descripcion !== '' || i.precioUnitario !== 0),
          { productoId: producto.id, descripcion: producto.nombre, cantidad: 1, dias: 1, precioUnitario: producto.precio },
        ]
      : formData.items.filter((i) => i.productoId !== producto.id);
    setFormData({ ...formData, items: items.length > 0 ? items : [itemVacio] });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { descripcion: '', cantidad: 1, dias: 1, precioUnitario: 0 }],
    });
  };

  const removeItem = (index: number) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index),
    });
  };

  const updateItem = (index: number, field: keyof ItemLinea, value: string | number) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData({ ...formData, items: newItems });
  };

  const updateNota = (index: number, value: string) => {
    const newNotas = [...formData.notas];
    newNotas[index] = value;
    setFormData({ ...formData, notas: newNotas });
  };

  const addNota = () => {
    setFormData({ ...formData, notas: [...formData.notas, ''] });
  };

  const removeNota = (index: number) => {
    setFormData({ ...formData, notas: formData.notas.filter((_, i) => i !== index) });
  };

  const subtotal = formData.items.reduce(
    (sum, item) => sum + item.cantidad * item.dias * item.precioUnitario,
    0
  );
  const subtotalConDescuento = subtotal - formData.descuentoMonto;
  const iva = formData.incluirIva ? subtotalConDescuento * IVA : 0;
  const total = subtotalConDescuento + iva;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(formData);
      }}
      className="space-y-6"
    >
      {/* Datos del Cliente */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label">Cliente</label>
          <input
            type="text"
            className="input"
            value={formData.cliente}
            onChange={(e) => setFormData({ ...formData, cliente: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="label">Fecha de Cotización</label>
          <input
            type="date"
            className="input"
            value={formData.fechaCotizacion}
            onChange={(e) => setFormData({ ...formData, fechaCotizacion: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="label">Fecha del Evento (Inicio)</label>
          <input
            type="date"
            className="input"
            value={formData.fechaEvento}
            onChange={(e) => setFormData({ ...formData, fechaEvento: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="label">Fecha del Evento (Fin) - Opcional</label>
          <input
            type="date"
            className="input"
            value={formData.fechaEventoFin || ''}
            onChange={(e) => setFormData({ ...formData, fechaEventoFin: e.target.value })}
          />
        </div>
        <div className="md:col-span-2">
          <label className="label">Lugar del Evento</label>
          <input
            type="text"
            className="input"
            value={formData.lugar}
            onChange={(e) => setFormData({ ...formData, lugar: e.target.value })}
            required
          />
        </div>
      </div>

      {/* Items */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-800">Detalle del Mobiliario y Equipo</h3>
          <button type="button" onClick={addItem} className="btn btn-secondary text-sm">
            + Agregar Item
          </button>
        </div>
        <div className="mb-3">
          <SelectorProductos
            catalogo={catalogo}
            seleccionados={formData.items.flatMap((i) => (i.productoId ? [i.productoId] : []))}
            onToggle={toggleProducto}
          />
        </div>
        <div className="space-y-3">
          {formData.items.map((item, index) => (
            <div key={index} className="flex gap-2 items-end bg-gray-50 p-3 rounded-lg">
              <div className="flex-1">
                <label className="label text-xs">Descripción</label>
                <input
                  type="text"
                  className="input text-sm"
                  value={item.descripcion}
                  onChange={(e) => updateItem(index, 'descripcion', e.target.value)}
                  required
                />
              </div>
              <div className="w-20">
                <label className="label text-xs">Cant.</label>
                <input
                  type="number"
                  className="input text-sm"
                  min="1"
                  value={item.cantidad}
                  onChange={(e) => updateItem(index, 'cantidad', parseInt(e.target.value) || 1)}
                  required
                />
              </div>
              <div className="w-20">
                <label className="label text-xs">Días</label>
                <input
                  type="number"
                  className="input text-sm"
                  min="1"
                  value={item.dias}
                  onChange={(e) => updateItem(index, 'dias', parseInt(e.target.value) || 1)}
                  required
                />
              </div>
              <div className="w-28">
                <label className="label text-xs">Precio Unit.</label>
                <input
                  type="number"
                  className="input text-sm"
                  min="0"
                  step="0.01"
                  value={item.precioUnitario}
                  onChange={(e) => updateItem(index, 'precioUnitario', parseFloat(e.target.value) || 0)}
                  required
                />
              </div>
              <div className="w-24 text-right">
                <label className="label text-xs">Total</label>
                <p className="py-2 font-medium">
                  ${(item.cantidad * item.dias * item.precioUnitario).toLocaleString()}
                </p>
              </div>
              {formData.items.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Descuento */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-yellow-50 p-4 rounded-lg">
        <div>
          <label className="label">Descripción del Descuento</label>
          <input
            type="text"
            className="input"
            placeholder="Ej: Descuento especial por paquete"
            value={formData.descuentoDescripcion || ''}
            onChange={(e) => setFormData({ ...formData, descuentoDescripcion: e.target.value })}
          />
        </div>
        <div>
          <label className="label">Monto del Descuento ($)</label>
          <input
            type="number"
            className="input"
            min="0"
            step="0.01"
            value={formData.descuentoMonto}
            onChange={(e) => setFormData({ ...formData, descuentoMonto: parseFloat(e.target.value) || 0 })}
          />
        </div>
      </div>

      {/* Totales */}
      <div className="bg-gray-100 p-4 rounded-lg">
        <label className="flex items-center gap-2 text-sm mb-3">
          <input
            type="checkbox"
            checked={formData.incluirIva ?? false}
            onChange={(e) => setFormData({ ...formData, incluirIva: e.target.checked })}
            className="w-4 h-4 rounded"
          />
          Cotizar con 16% de IVA
        </label>
        <div className="flex justify-between text-lg">
          <span>Subtotal:</span>
          <span className="font-medium">${subtotal.toLocaleString()}</span>
        </div>
        {formData.descuentoMonto > 0 && (
          <div className="flex justify-between text-lg text-red-600">
            <span>Descuento:</span>
            <span className="font-medium">-${formData.descuentoMonto.toLocaleString()}</span>
          </div>
        )}
        {formData.incluirIva && (
          <div className="flex justify-between text-lg">
            <span>IVA (16%):</span>
            <span className="font-medium">${iva.toLocaleString('es-MX', { maximumFractionDigits: 2 })}</span>
          </div>
        )}
        <div className="flex justify-between text-2xl font-bold border-t border-gray-300 pt-2 mt-2">
          <span>Total:</span>
          <span>${total.toLocaleString('es-MX', { maximumFractionDigits: 2 })}</span>
        </div>
      </div>

      {/* Notas */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <h3 className="font-semibold text-gray-800">Notas y Condiciones</h3>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={formData.mostrarNotas}
                onChange={(e) => setFormData({ ...formData, mostrarNotas: e.target.checked })}
                className="w-4 h-4 rounded"
              />
              Mostrar en documento
            </label>
          </div>
          <button type="button" onClick={addNota} className="btn btn-secondary text-sm">
            + Agregar Nota
          </button>
        </div>
        {formData.mostrarNotas && (
          <div className="space-y-2">
            {formData.notas.map((nota, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  className="input text-sm"
                  value={nota}
                  onChange={(e) => updateNota(index, e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => removeNota(index)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <button type="submit" className="w-full btn btn-primary py-3 text-lg">
        Generar Vista Previa
      </button>
    </form>
  );
}
