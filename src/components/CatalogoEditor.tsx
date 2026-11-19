import { useCatalogo } from '../hooks/useCatalogo';
import type { Producto } from '../types';

export function CatalogoEditor() {
  const { catalogo, setCatalogo } = useCatalogo();

  const updateProducto = (index: number, field: keyof Producto, value: string | number) => {
    const nuevo = [...catalogo];
    nuevo[index] = { ...nuevo[index], [field]: value };
    setCatalogo(nuevo);
  };

  const addProducto = () => {
    setCatalogo([...catalogo, { id: crypto.randomUUID(), nombre: '', precio: 0, descripcion: '' }]);
  };

  const removeProducto = (index: number) => {
    setCatalogo(catalogo.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Los cambios se guardan automáticamente en este navegador.
        </p>
        <button type="button" onClick={addProducto} className="btn btn-secondary text-sm">
          + Agregar Producto
        </button>
      </div>
      <div className="space-y-3">
        {catalogo.map((producto, index) => (
          <div key={producto.id} className="flex gap-2 items-end bg-gray-50 p-3 rounded-lg">
            <div className="flex-1">
              <label className="label text-xs">Nombre</label>
              <input
                type="text"
                className="input text-sm"
                value={producto.nombre}
                onChange={(e) => updateProducto(index, 'nombre', e.target.value)}
              />
            </div>
            <div className="w-28">
              <label className="label text-xs">Precio</label>
              <input
                type="number"
                className="input text-sm"
                min="0"
                step="0.01"
                value={producto.precio}
                onChange={(e) => updateProducto(index, 'precio', parseFloat(e.target.value) || 0)}
              />
            </div>
            <div className="flex-1">
              <label className="label text-xs">Detalle (piezas, contenido)</label>
              <input
                type="text"
                className="input text-sm"
                placeholder="Ej: 54 piezas"
                value={producto.descripcion}
                onChange={(e) => updateProducto(index, 'descripcion', e.target.value)}
              />
            </div>
            <button
              type="button"
              onClick={() => removeProducto(index)}
              className="p-2 text-red-500 hover:bg-red-50 rounded"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
