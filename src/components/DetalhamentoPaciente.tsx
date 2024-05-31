import { PacienteSessao } from '../tipos'

interface DetalhamentoPacienteProps {
  paciente: PacienteSessao
  onClose: () => void
}

export function DetalhamentoPaciente({
  paciente,
  onClose,
}: DetalhamentoPacienteProps) {
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-40">
      <div className="relative bg-white p-8 rounded shadow-lg w-full max-w-2xl">
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
          onClick={onClose}
        >
          &#x2715;
        </button>
        <h2 className="text-2xl font-bold mb-4">Detalhes do Paciente</h2>
        <div className="mb-8">
          <p>Nome: {paciente.paciente}</p>
          <p>Responsável: {paciente.responsavel}</p>
          <p>CPF do Responsável: {paciente.cpfResponsavel}</p>
          <p>Endereço: {paciente.endereco}</p>
        </div>
      </div>
    </div>
  )
}
