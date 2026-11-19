import type { Producto } from '../types';

interface Props {
  catalogo: Producto[];
  seleccionados: string[];
  onToggle: (producto: Producto, seleccionado: boolean) => void;
  mostrarPrecio?: boolean;
}

export function SelectorProductos({ catalogo, seleccionados, onToggle, mostrarPrecio = true }: Props) {
  if (catalogo.length === 0) return null;

  return (
    <div className="bg-blue-50 p-4 rounded-lg">
      <h4 className="text-sm font-semibold text-gray-700 mb-3">Agregar del catálogo</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {catalogo.map((producto) => (
          <label key={producto.id} className="flex items-start gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={seleccionados.includes(producto.id)}
              onChange={(e) => onToggle(producto, e.target.checked)}
              className="w-4 h-4 rounded mt-0.5"
            />
            <span>
              {producto.nombre}
              {mostrarPrecio && <span className="text-gray-500"> · ${producto.precio.toLocaleString()}</span>}
              {producto.descripcion && (
                <span className="block text-xs text-gray-500">{producto.descripcion}</span>
              )}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
