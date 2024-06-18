// src/components/Pagination.tsx
import React from 'react'

interface PaginationProps {
  currentPage: number
  totalPaginas: number
  onPageChange: (page: number) => void
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPaginas,
  onPageChange,
}) => {
  return (
    <div className="flex justify-evenly mt-4 items-center">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 cursor-pointer"
      >
        Página Anterior
      </button>
      <span>
        Página {currentPage} de {totalPaginas}
      </span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPaginas}
        className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 cursor-pointer"
      >
        Próxima Página
      </button>
    </div>
  )
}

export default Pagination
