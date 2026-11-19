import { useState } from 'react';
import type { Producto } from '../types';

const STORAGE_KEY = 'eventos-jk:catalogo';

export const catalogoDefault: Producto[] = [
  { id: 'carpa-abierta', nombre: 'Carpa 3x6m Abierta', precio: 700, descripcion: '' },
  { id: 'carpa-cerrada', nombre: 'Carpa 3x6m Cerrada', precio: 800, descripcion: '' },
  { id: 'calenton', nombre: 'Calentón de Exterior', precio: 700, descripcion: 'Tanque lleno' },
  { id: 'tetris-xl', nombre: 'Tetris XL', precio: 400, descripcion: '20 piezas, base y dado' },
  { id: 'jenga', nombre: 'Jenga Gigante', precio: 400, descripcion: '54 piezas' },
  { id: 'conecta-4', nombre: 'Conecta 4', precio: 400, descripcion: '21 fichas rojas y 21 fichas amarillas' },
  { id: 'adivina-quien', nombre: '¿Adivina Quién?', precio: 400, descripcion: '' },
  { id: 'kerplunk', nombre: 'Kerplunk', precio: 400, descripcion: '' },
  { id: 'tiro-al-blanco', nombre: 'Tiro al Blanco', precio: 400, descripcion: '8 hachas y 4 dardos' },
];

function cargar(): Producto[] {
  try {
    const guardado = localStorage.getItem(STORAGE_KEY);
    if (guardado) return JSON.parse(guardado);
  } catch {
    // Sin acceso a localStorage: se usa el catálogo por defecto
  }
  return catalogoDefault;
}

// El catálogo se guarda en el navegador (localStorage), no en un servidor.
export function useCatalogo() {
  const [catalogo, setCatalogoState] = useState<Producto[]>(cargar);

  const setCatalogo = (nuevo: Producto[]) => {
    setCatalogoState(nuevo);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nuevo));
    } catch {
      // Si no se puede guardar, el cambio solo dura en esta sesión
    }
  };

  return { catalogo, setCatalogo };
}

// Texto que se usa en contratos: nombre + detalle de piezas
export function descripcionContrato(producto: Producto) {
  return producto.descripcion ? `${producto.nombre} (${producto.descripcion})` : producto.nombre;
}
