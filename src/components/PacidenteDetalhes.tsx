// PacienteDetalhes.tsx
import React from 'react'
import { SessaoPaciente } from '../tipos'

interface PacienteDetalhesProps {
  paciente: SessaoPaciente
  onClose: () => void
}

export const PacienteDetalhes: React.FC<PacienteDetalhesProps> = ({
  paciente,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded shadow-lg w-1/2">
        <h2 className="text-xl font-bold mb-4">Detalhes do Paciente</h2>
        <p>
          <strong>Nome:</strong> {paciente.pacienteInfo.nome}
        </p>
        <p>
          <strong>Responsável:</strong> {paciente.pacienteInfo.responsavel}
        </p>
        <p>
          <strong>CPF do Responsável:</strong>{' '}
          {paciente.pacienteInfo.cpfResponsavel}
        </p>
        <p>
          <strong>Endereço:</strong> {paciente.pacienteInfo.endereco}
        </p>
        <p>
          <strong>Psicóloga:</strong> {paciente.psicologa}
        </p>
        <button
          type="button"
          className="mt-4 bg-azul text-white px-4 py-2 rounded hover:bg-sky-600"
          onClick={onClose}
        >
          Fechar
        </button>
      </div>
    </div>
  )
}
