import { useState, useRef, useCallback } from 'react';
import { Modal } from './components/Modal';
import { CotizacionForm } from './components/CotizacionForm';
import { ContratoForm } from './components/ContratoForm';
import { ReciboForm } from './components/ReciboForm';
import { CatalogoEditor } from './components/CatalogoEditor';
import { CotizacionTemplate } from './templates/CotizacionTemplate';
import { ContratoTemplate } from './templates/ContratoTemplate';
import { ReciboTemplate } from './templates/ReciboTemplate';
import { descargarPdf } from './utils/descargarPdf';
import type { TipoDocumento, DatosCotizacion, DatosContrato, DatosRecibo } from './types';

type DocumentData = DatosCotizacion | DatosContrato | DatosRecibo;

function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [catalogoOpen, setCatalogoOpen] = useState(false);
  // Estable para que el Modal cerrado no reinicie el scroll del body en cada render
  const cerrarCatalogo = useCallback(() => setCatalogoOpen(false), []);
  const [tipoDocumento, setTipoDocumento] = useState<TipoDocumento>('cotizacion');
  const [vistaPrevia, setVistaPrevia] = useState(false);
  const [documentData, setDocumentData] = useState<DocumentData | null>(null);

  const printRef = useRef<HTMLDivElement>(null);

  const [descargando, setDescargando] = useState(false);

  const handleDescargar = async () => {
    if (!printRef.current) return;
    setDescargando(true);
    try {
      await descargarPdf(printRef.current, `${tipoDocumento}_${new Date().toISOString().split('T')[0]}`);
    } finally {
      setDescargando(false);
    }
  };

  const openModal = (tipo: TipoDocumento) => {
    setTipoDocumento(tipo);
    setModalOpen(true);
    setVistaPrevia(false);
    setDocumentData(null);
  };

  const handleFormSubmit = (data: DocumentData) => {
    setDocumentData(data);
    setVistaPrevia(true);
  };

  const handleBack = () => {
    setVistaPrevia(false);
  };

  const handleClose = () => {
    setModalOpen(false);
    setVistaPrevia(false);
    setDocumentData(null);
  };

  const getTitle = () => {
    switch (tipoDocumento) {
      case 'cotizacion':
        return vistaPrevia ? 'Vista Previa - Cotización' : 'Nueva Cotización';
      case 'contrato':
        return vistaPrevia ? 'Vista Previa - Contrato' : 'Nuevo Contrato';
      case 'recibo':
        return vistaPrevia ? 'Vista Previa - Recibo' : 'Nuevo Recibo de Pago';
    }
  };

  const renderForm = () => {
    switch (tipoDocumento) {
      case 'cotizacion':
        return <CotizacionForm onSubmit={handleFormSubmit} initialData={documentData as DatosCotizacion} />;
      case 'contrato':
        return <ContratoForm onSubmit={handleFormSubmit} initialData={documentData as DatosContrato} />;
      case 'recibo':
        return <ReciboForm onSubmit={handleFormSubmit} initialData={documentData as DatosRecibo} />;
    }
  };

  const renderTemplate = () => {
    if (!documentData) return null;

    switch (tipoDocumento) {
      case 'cotizacion':
        return <CotizacionTemplate ref={printRef} data={documentData as DatosCotizacion} />;
      case 'contrato':
        return <ContratoTemplate ref={printRef} data={documentData as DatosContrato} />;
      case 'recibo':
        return <ReciboTemplate ref={printRef} data={documentData as DatosRecibo} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Eventos J&K" className="h-12" />
            <div>
              <h1 className="text-xl font-bold text-gray-800">Eventos J&K</h1>
              <p className="text-sm text-gray-500">Generador de Documentos</p>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            Tel: (656) 358 4995
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Genera tus documentos rápidamente
          </h2>
          <p className="text-gray-600">
            Selecciona el tipo de documento que deseas crear
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Cotización */}
          <button
            onClick={() => openModal('cotizacion')}
            className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all p-6 text-left border-2 border-transparent hover:border-blue-500"
          >
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-500 transition-colors">
              <svg className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Cotización</h3>
            <p className="text-gray-500 text-sm">
              Crea cotizaciones profesionales con tabla de items, descuentos y notas.
            </p>
          </button>

          {/* Contrato */}
          <button
            onClick={() => openModal('contrato')}
            className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all p-6 text-left border-2 border-transparent hover:border-green-500"
          >
            <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-500 transition-colors">
              <svg className="w-7 h-7 text-green-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Contrato</h3>
            <p className="text-gray-500 text-sm">
              Genera contratos de arrendamiento con cláusulas de garantía.
            </p>
          </button>

          {/* Recibo */}
          <button
            onClick={() => openModal('recibo')}
            className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all p-6 text-left border-2 border-transparent hover:border-purple-500"
          >
            <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-500 transition-colors">
              <svg className="w-7 h-7 text-purple-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Recibo de Pago</h3>
            <p className="text-gray-500 text-sm">
              Emite recibos de pago con detalle de mobiliario y método de pago.
            </p>
          </button>

          {/* Catálogo */}
          <button
            onClick={() => setCatalogoOpen(true)}
            className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all p-6 text-left border-2 border-transparent hover:border-orange-500"
          >
            <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-orange-500 transition-colors">
              <svg className="w-7 h-7 text-orange-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Catálogo</h3>
            <p className="text-gray-500 text-sm">
              Administra productos, precios y piezas para agregarlos rápido a tus documentos.
            </p>
          </button>
        </div>

        {/* Footer info */}
        <div className="mt-16 text-center text-gray-500 text-sm">
          <p className="italic">"Transformamos tu espacio en el escenario ideal para celebrar"</p>
        </div>
      </main>

      <Modal
        isOpen={catalogoOpen}
        onClose={cerrarCatalogo}
        title="Catálogo de Productos"
        maxWidth="max-w-3xl"
      >
        <CatalogoEditor />
      </Modal>

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={handleClose}
        title={getTitle()}
        maxWidth={vistaPrevia ? 'max-w-4xl' : 'max-w-2xl'}
      >
        {vistaPrevia ? (
          <div>
            {/* Acciones */}
            <div className="flex gap-3 mb-4 no-print">
              <button
                onClick={handleBack}
                className="btn btn-secondary flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Editar
              </button>
              <button
                onClick={handleDescargar}
                disabled={descargando}
                className="btn btn-success flex items-center gap-2 disabled:opacity-60"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                {descargando ? 'Generando PDF...' : 'Descargar PDF'}
              </button>
            </div>

            {/* Vista previa del documento */}
            <div className="border border-gray-300 rounded-lg overflow-hidden bg-white shadow-inner max-h-[70vh] overflow-y-auto">
              {renderTemplate()}
            </div>
          </div>
        ) : (
          renderForm()
        )}
      </Modal>
    </div>
  );
}

export default App;
