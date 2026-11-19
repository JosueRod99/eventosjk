import { useState } from 'react';
import type { DatosContrato, ItemContrato, Producto } from '../types';
import { useCatalogo, descripcionContrato } from '../hooks/useCatalogo';
import { SelectorProductos } from './SelectorProductos';

const itemVacio: ItemContrato = { cantidad: 1, descripcion: '', precioUnitario: 0 };

// Recalcula costo total y restante a partir de los items y el descuento
function conTotales(data: DatosContrato): DatosContrato {
  const subtotal = data.items.reduce((sum, item) => sum + item.cantidad * (item.precioUnitario ?? 0), 0);
  const costoTotal = subtotal - (data.descuentoMonto ?? 0);
  return { ...data, costoTotal, restante: costoTotal - data.anticipo };
}

interface Props {
  onSubmit: (data: DatosContrato) => void;
  initialData?: DatosContrato;
}

export function ContratoForm({ onSubmit, initialData }: Props) {
  const [formData, setFormData] = useState<DatosContrato>(
    initialData || {
      nombreCliente: '',
      identificacion: '',
      domicilioEvento: '',
      fechaEntrega: '',
      fechaRecoleccion: '',
      horaRecoleccion: '',
      items: [itemVacio],
      descuentoMonto: 0,
      costoTotal: 0,
      anticipo: 0,
      restante: 0,
      mostrarClausulas: true,
    }
  );

  const { catalogo } = useCatalogo();

  const toggleProducto = (producto: Producto, seleccionado: boolean) => {
    const items = seleccionado
      ? [
          ...formData.items.filter((i) => i.descripcion !== '' || (i.precioUnitario ?? 0) !== 0),
          { productoId: producto.id, cantidad: 1, descripcion: descripcionContrato(producto), precioUnitario: producto.precio },
        ]
      : formData.items.filter((i) => i.productoId !== producto.id);
    setFormData(conTotales({ ...formData, items: items.length > 0 ? items : [itemVacio] }));
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, itemVacio],
    });
  };

  const removeItem = (index: number) => {
    setFormData(conTotales({
      ...formData,
      items: formData.items.filter((_, i) => i !== index),
    }));
  };

  const updateItem = (index: number, field: keyof ItemContrato, value: string | number) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData(conTotales({ ...formData, items: newItems }));
  };

  const handleDescuentoChange = (value: number) => {
    setFormData(conTotales({ ...formData, descuentoMonto: value }));
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
      {/* Datos del Cliente */}
      <div>
        <h3 className="font-semibold text-gray-800 mb-3 pb-2 border-b">1. Datos del Cliente y del Evento</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="label">Nombre Completo del Cliente</label>
            <input
              type="text"
              className="input"
              value={formData.nombreCliente}
              onChange={(e) => setFormData({ ...formData, nombreCliente: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="label">Identificación (INE/Pasaporte)</label>
            <input
              type="text"
              className="input"
              value={formData.identificacion}
              onChange={(e) => setFormData({ ...formData, identificacion: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="label">Domicilio del Evento</label>
            <input
              type="text"
              className="input"
              value={formData.domicilioEvento}
              onChange={(e) => setFormData({ ...formData, domicilioEvento: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="label">Fecha de Entrega/Evento</label>
            <input
              type="date"
              className="input"
              value={formData.fechaEntrega}
              onChange={(e) => setFormData({ ...formData, fechaEntrega: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="label">Fecha de Recolección</label>
            <input
              type="date"
              className="input"
              value={formData.fechaRecoleccion}
              onChange={(e) => setFormData({ ...formData, fechaRecoleccion: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="label">Hora de Recolección Aproximada</label>
            <input
              type="time"
              className="input"
              value={formData.horaRecoleccion}
              onChange={(e) => setFormData({ ...formData, horaRecoleccion: e.target.value })}
              required
            />
          </div>
        </div>
      </div>

      {/* Items */}
      <div>
        <div className="flex items-center justify-between mb-3 pb-2 border-b">
          <h3 className="font-semibold text-gray-800">2. Detalle del Equipo y Costos</h3>
          <button type="button" onClick={addItem} className="btn btn-secondary text-sm">
            + Agregar Item
          </button>
        </div>
        <div className="mb-3">
          <SelectorProductos
            catalogo={catalogo}
            seleccionados={formData.items.flatMap((i) => (i.productoId ? [i.productoId] : []))}
            onToggle={toggleProducto}
            mostrarPrecio={false}
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
                <label className="label text-xs">Descripción del Equipo</label>
                <input
                  type="text"
                  className="input text-sm"
                  placeholder="Carpas, Calentones, Sillas, etc."
                  value={item.descripcion}
                  onChange={(e) => updateItem(index, 'descripcion', e.target.value)}
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
                  value={item.precioUnitario ?? 0}
                  onChange={(e) => updateItem(index, 'precioUnitario', parseFloat(e.target.value) || 0)}
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

      {/* Costos */}
      <div className="bg-gray-100 p-4 rounded-lg">
        <p className="text-xs text-gray-500 mb-3">
          Los precios unitarios solo se usan para calcular el total; en el contrato se imprimen el costo total, el anticipo y el restante.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Descuento ($)</label>
            <input
              type="number"
              className="input"
              min="0"
              step="0.01"
              value={formData.descuentoMonto ?? 0}
              onChange={(e) => handleDescuentoChange(parseFloat(e.target.value) || 0)}
            />
          </div>
          <div>
            <label className="label">Costo Total del Servicio ($)</label>
            <input
              type="number"
              className="input bg-gray-200"
              value={formData.costoTotal}
              readOnly
            />
          </div>
          <div>
            <label className="label">Anticipo Recibido ($)</label>
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
            <label className="label">Restante a Pagar ($)</label>
            <input
              type="number"
              className="input bg-gray-200"
              value={formData.restante}
              readOnly
            />
          </div>
        </div>
      </div>

      {/* Cláusulas */}
      <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-lg">
        <input
          type="checkbox"
          id="mostrarClausulas"
          checked={formData.mostrarClausulas}
          onChange={(e) => setFormData({ ...formData, mostrarClausulas: e.target.checked })}
          className="w-5 h-5 rounded"
        />
        <label htmlFor="mostrarClausulas" className="font-medium">
          Incluir Cláusulas de Garantía y Responsabilidad
        </label>
      </div>

      <button type="submit" className="w-full btn btn-primary py-3 text-lg">
        Generar Vista Previa
      </button>
    </form>
  );
}
