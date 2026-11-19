import { useState } from 'react';
import type { DatosRecibo, ItemRecibo, Producto } from '../types';
import { useCatalogo, descripcionContrato } from '../hooks/useCatalogo';
import { SelectorProductos } from './SelectorProductos';

interface Props {
  onSubmit: (data: DatosRecibo) => void;
  initialData?: DatosRecibo;
}

export function ReciboForm({ onSubmit, initialData }: Props) {
  const [formData, setFormData] = useState<DatosRecibo>(
    initialData || {
      fecha: new Date().toISOString().split('T')[0],
      nombreCliente: '',
      direccion: '',
      telefono: '',
      items: [{ cantidad: 1, descripcion: '', importe: 0 }],
      costoTotal: 0,
      anticipo: 0,
      restante: 0,
      metodoPago: 'efectivo',
      otroMetodo: '',
    }
  );

  const { catalogo } = useCatalogo();

  const toggleProducto = (producto: Producto, seleccionado: boolean) => {
    const filtrados = seleccionado
      ? [
          ...formData.items.filter((i) => i.descripcion !== '' || i.importe !== 0),
          { productoId: producto.id, cantidad: 1, descripcion: descripcionContrato(producto), importe: producto.precio },
        ]
      : formData.items.filter((i) => i.productoId !== producto.id);
    const newItems = filtrados.length > 0 ? filtrados : [{ cantidad: 1, descripcion: '', importe: 0 }];
    const newTotal = newItems.reduce((sum, item) => sum + item.importe, 0);
    setFormData({
      ...formData,
      items: newItems,
      costoTotal: newTotal,
      restante: newTotal - formData.anticipo,
    });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { cantidad: 1, descripcion: '', importe: 0 }],
    });
  };

  const removeItem = (index: number) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    const newTotal = newItems.reduce((sum, item) => sum + item.importe, 0);
    setFormData({
      ...formData,
      items: newItems,
      costoTotal: newTotal,
      restante: newTotal - formData.anticipo,
    });
  };

  const updateItem = (index: number, field: keyof ItemRecibo, value: string | number) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };

    const newTotal = newItems.reduce((sum, item) => sum + item.importe, 0);
    setFormData({
      ...formData,
      items: newItems,
      costoTotal: newTotal,
      restante: newTotal - formData.anticipo,
    });
  };

  const handleAnticipoChange = (value: number) => {
    setFormData({
      ...formData,
      anticipo: value,
      restante: formData.costoTotal - value,
    });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(formData);
      }}
      className="space-y-6"
    >
      {/* Fecha */}
      <div className="w-48">
        <label className="label">Fecha del Recibo</label>
        <input
          type="date"
          className="input"
          value={formData.fecha}
          onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
          required
        />
      </div>

      {/* Datos del Cliente */}
      <div>
        <h3 className="font-semibold text-gray-800 mb-3 pb-2 border-b">1. Datos del Cliente</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="label">Nombre del Cliente</label>
            <input
              type="text"
              className="input"
              value={formData.nombreCliente}
              onChange={(e) => setFormData({ ...formData, nombreCliente: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="label">Dirección</label>
            <input
              type="text"
              className="input"
              value={formData.direccion}
              onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="label">Teléfono</label>
            <input
              type="tel"
              className="input"
              value={formData.telefono}
              onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
              required
            />
          </div>
        </div>
      </div>

      {/* Items */}
      <div>
        <div className="flex items-center justify-between mb-3 pb-2 border-b">
          <h3 className="font-semibold text-gray-800">2. Detalle del Mobiliario y Equipo</h3>
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
              <div className="w-24">
                <label className="label text-xs">Cantidad</label>
                <input
                  type="number"
                  className="input text-sm"
                  min="1"
                  value={item.cantidad}
                  onChange={(e) => updateItem(index, 'cantidad', parseInt(e.target.value) || 1)}
                  required
                />
              </div>
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
              <div className="w-32">
                <label className="label text-xs">Importe ($)</label>
                <input
                  type="number"
                  className="input text-sm"
                  min="0"
                  step="0.01"
                  value={item.importe}
                  onChange={(e) => updateItem(index, 'importe', parseFloat(e.target.value) || 0)}
                  required
                />
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

      {/* Resumen de Pago */}
      <div>
        <h3 className="font-semibold text-gray-800 mb-3 pb-2 border-b">3. Resumen de Pago</h3>
        <div className="bg-gray-100 p-4 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="label">Costo Total ($)</label>
              <input
                type="number"
                className="input bg-gray-200"
                value={formData.costoTotal}
                readOnly
              />
            </div>
            <div>
              <label className="label">Anticipo ($)</label>
              <input
                type="number"
                className="input"
                min="0"
                step="0.01"
                value={formData.anticipo}
                onChange={(e) => handleAnticipoChange(parseFloat(e.target.value) || 0)}
              />
            </div>
            <div>
              <label className="label">Restante ($)</label>
              <input
                type="number"
                className="input bg-gray-200"
                value={formData.restante}
                readOnly
              />
            </div>
          </div>

          <div>
            <label className="label">Método de Pago</label>
            <div className="flex flex-wrap gap-4 mt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="metodoPago"
                  checked={formData.metodoPago === 'efectivo'}
                  onChange={() => setFormData({ ...formData, metodoPago: 'efectivo' })}
                  className="w-4 h-4"
                />
                <span>Efectivo</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="metodoPago"
                  checked={formData.metodoPago === 'transferencia'}
                  onChange={() => setFormData({ ...formData, metodoPago: 'transferencia' })}
                  className="w-4 h-4"
                />
                <span>Transferencia</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="metodoPago"
                  checked={formData.metodoPago === 'otro'}
                  onChange={() => setFormData({ ...formData, metodoPago: 'otro' })}
                  className="w-4 h-4"
                />
                <span>Otro</span>
              </label>
              {formData.metodoPago === 'otro' && (
                <input
                  type="text"
                  className="input w-40"
                  placeholder="Especificar"
                  value={formData.otroMetodo || ''}
                  onChange={(e) => setFormData({ ...formData, otroMetodo: e.target.value })}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <button type="submit" className="w-full btn btn-primary py-3 text-lg">
        Generar Vista Previa
      </button>
    </form>
  );
}
