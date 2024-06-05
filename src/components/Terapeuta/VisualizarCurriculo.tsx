import { Document, Page, pdfjs } from 'react-pdf'

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

interface VisualizarCurriculoProps {
  url: string
  onClose: () => void
}

export function VisualizarCurriculo({
  url,
  onClose,
}: VisualizarCurriculoProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded shadow-lg w-full max-w-3xl">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          Fechar
        </button>
        <Document file={url}>
          <Page pageNumber={1} />
        </Document>
      </div>
    </div>
  )
}
