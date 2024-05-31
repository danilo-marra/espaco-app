import { useState } from 'react'
import {
  PencilSimple,
  TrashSimple,
  Eye,
  Plus,
  UsersThree,
  Person,
} from '@phosphor-icons/react'
import { HistoricoPaciente } from '../../components/HistoricoPaciente'
import { Paciente } from '../../tipos'
import { Header } from '../../components/Header'

export function Pacientes() {
  const [isMenuOpen] = useState<boolean>(false)
  const [selectedPaciente, setSelectedPaciente] = useState<Paciente | null>(
    null,
  )

  const pacientes: Paciente[] = [
    {
      nome: 'Davi',
      sessoes: [
        { data: '01/02/2024', terapeuta: 'Juliana', status: 'Realizada' },
        { data: '08/02/2024', terapeuta: 'Juliana', status: 'Realizada' },
      ],
      totalPago: 200,
      totalDevido: 100,
    },
  ]

  const handleViewHistorico = (paciente: Paciente) => {
    setSelectedPaciente(paciente)
  }

  return (
    <div className="flex min-h-screen">
      <main
        className={`flex-1 bg-gray-100 p-8 transition-all duration-300 ease-in-out ${isMenuOpen ? 'md:ml-64' : 'ml-0'}`}
      >
        <Header />
        <div>
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Pacientes</h1>
            <button
              type="button"
              className="flex items-center bg-azul text-white px-4 py-2 rounded hover:bg-sky-600"
            >
              <Plus size={20} weight="bold" className="mr-2" />
              Novo Registro
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="flex items-center space-x-4 p-4 bg-white rounded shadow">
              <Person size={24} />
              <span className="text-xl font-semibold">
                Total de Pacientes Cadastrados: 29
              </span>
            </div>
            <div className="flex items-center space-x-4 p-4 bg-white rounded shadow">
              <UsersThree size={24} />
              <span className="text-xl font-semibold">
                Total de Terapeutas Cadastradas: 8
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-white rounded shadow">
              <span>Icone seta esquerda</span>
              <h2 className="text-xl font-semibold">
                Agenda Mês de Fevereiro/2024
              </h2>
              <span>Icone seta direita</span>
            </div>
          </div>
          <table className="listaTerapeutas w-full bg-white rounded shadow">
            <thead className="bg-rosa text-white">
              <tr>
                <th className="p-4 text-left">Paciente</th>
                <th className="p-4 text-left">Terapeuta</th>
                <th className="p-4 text-left">Data da Sessão</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Ações</th>
              </tr>
            </thead>
            <tbody>
              {pacientes.map((paciente, index) => (
                <tr key={index} className="border-b">
                  <td className="p-4">{paciente.nome}</td>
                  <td className="p-4">Juliana</td>
                  <td className="p-4">21/02/2024</td>
                  <td className="p-4">Realizada</td>
                  <td className="p-4 flex space-x-2">
                    <button
                      className="text-blue-500 hover:text-blue-700"
                      onClick={() => handleViewHistorico(paciente)}
                    >
                      <Eye size={20} weight="bold" />
                    </button>
                    <button className="text-green-500 hover:text-green-700">
                      <PencilSimple size={20} weight="bold" />
                    </button>
                    <button className="text-red-500 hover:text-red-700">
                      <TrashSimple size={20} weight="bold" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
      {selectedPaciente && (
        <HistoricoPaciente
          paciente={selectedPaciente}
          onClose={() => setSelectedPaciente(null)}
        />
      )}
    </div>
  )
}
