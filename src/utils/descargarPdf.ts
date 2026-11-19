import { toCanvas } from 'html-to-image';
import { jsPDF } from 'jspdf';

const A4_ANCHO_MM = 210;
const A4_ALTO_MM = 297;

// Genera un PDF tamaño A4 a partir del nodo y lo descarga.
// Cada elemento con clase .print-page empieza en una página nueva.
export async function descargarPdf(node: HTMLElement, nombreArchivo: string) {
  const canvas = await toCanvas(node, { pixelRatio: 2, backgroundColor: '#ffffff' });
  const escala = canvas.width / node.offsetWidth;
  const altoPaginaPx = Math.floor(canvas.width * (A4_ALTO_MM / A4_ANCHO_MM));

  const topNodo = node.getBoundingClientRect().top;
  const inicios = [
    0,
    ...Array.from(node.querySelectorAll<HTMLElement>('.print-page')).map((el) =>
      Math.round((el.getBoundingClientRect().top - topNodo) * escala)
    ),
  ];
  const segmentos = inicios.map((inicio, i) => [inicio, inicios[i + 1] ?? canvas.height]);

  const pdf = new jsPDF({ unit: 'mm', format: 'a4' });
  let primeraPagina = true;

  for (const [inicio, fin] of segmentos) {
    for (let y = inicio; y < fin; y += altoPaginaPx) {
      const alto = Math.min(altoPaginaPx, fin - y);
      const pagina = document.createElement('canvas');
      pagina.width = canvas.width;
      pagina.height = alto;
      pagina.getContext('2d')!.drawImage(canvas, 0, y, canvas.width, alto, 0, 0, canvas.width, alto);

      if (!primeraPagina) pdf.addPage();
      primeraPagina = false;
      pdf.addImage(pagina.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, A4_ANCHO_MM, (alto / canvas.width) * A4_ANCHO_MM);
    }
  }

  pdf.save(`${nombreArchivo}.pdf`);
}
