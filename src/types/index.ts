export interface Producto {
  id: string;
  nombre: string;
  precio: number;
  descripcion: string;
}

export interface ItemLinea {
  productoId?: string;
  descripcion: string;
  cantidad: number;
  dias: number;
  precioUnitario: number;
}

export interface DatosCotizacion {
  cliente: string;
  fechaEvento: string;
  fechaEventoFin?: string;
  lugar: string;
  fechaCotizacion: string;
  items: ItemLinea[];
  descuentoDescripcion?: string;
  descuentoMonto: number;
  incluirIva?: boolean;
  notas: string[];
  mostrarNotas: boolean;
}

export interface ItemContrato {
  productoId?: string;
  cantidad: number;
  descripcion: string;
  // Solo se usa en el formulario para calcular el costo total; no se imprime
  precioUnitario?: number;
}

export interface DatosContrato {
  nombreCliente: string;
  identificacion: string;
  domicilioEvento: string;
  fechaEntrega: string;
  fechaRecoleccion: string;
  horaRecoleccion: string;
  items: ItemContrato[];
  descuentoMonto?: number;
  costoTotal: number;
  anticipo: number;
  restante: number;
  mostrarClausulas: boolean;
}

export interface ItemRecibo {
  productoId?: string;
  cantidad: number;
  descripcion: string;
  importe: number;
}

export interface DatosRecibo {
  fecha: string;
  nombreCliente: string;
  direccion: string;
  telefono: string;
  items: ItemRecibo[];
  costoTotal: number;
  anticipo: number;
  restante: number;
  metodoPago: 'efectivo' | 'transferencia' | 'otro';
  otroMetodo?: string;
}

export type TipoDocumento = 'cotizacion' | 'contrato' | 'recibo';
