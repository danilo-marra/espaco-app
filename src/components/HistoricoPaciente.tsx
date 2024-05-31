import { Paciente } from '../tipos'

interface HistoricoPacienteProps {
  paciente: Paciente
  onClose: () => void
}

export function HistoricoPaciente({
  paciente,
  onClose,
}: HistoricoPacienteProps) {
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-40">
      <div className="relative bg-white p-8 rounded shadow-lg w-full max-w-2xl">
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
          onClick={onClose}
        >
          &#x2715;
        </button>
        <h2 className="text-2xl font-bold mb-4">
          Histórico do Paciente: {paciente.nome}
        </h2>
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-2">Sessões Realizadas</h3>
          <ul className="space-y-2">
            {paciente.sessoes.map((sessao, index) => (
              <li
                key={index}
                className="flex justify-between bg-gray-100 p-2 rounded"
              >
                <span>Data: {sessao.data}</span>
                <span>Terapeuta: {sessao.terapeuta}</span>
                <span>Status: {sessao.status}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">Resumo de Pagamentos</h3>
          <p>Total de Sessões: {paciente.sessoes.length}</p>
          <p>Total Pago: R${paciente.totalPago}</p>
          <p>Total Devido: R${paciente.totalDevido}</p>
        </div>
      </div>
    </div>
  )
}
