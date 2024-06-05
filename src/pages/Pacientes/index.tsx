import { useEffect, useState } from 'react'
import {
  Eye,
  PencilSimple,
  Person,
  Plus,
  TrashSimple,
  User,
  UsersThree,
} from '@phosphor-icons/react'
import { Paciente } from '../../tipos'
import { NovoPaciente } from '../../components/Paciente/NovoPaciente'
import Modal from 'react-modal'
import { v4 as uuidv4 } from 'uuid'

export const initialPacientes: Paciente[] = [
  {
    id: uuidv4(),
    nome: 'Davi',
    responsavel: 'Pai do Davi',
    telefone: '(61)9911-9188',
    email: 'paidodavi@gmail.com',
    cpfResponsavel: '123.456.789-00',
    endereco: 'Rua A, 123',
  },
]

export function Pacientes() {
  const [isMenuOpen] = useState<boolean>(false)
  const [isNovoPacienteOpen, setIsNovoPacienteOpen] = useState<boolean>(false)
  const [isEditarPacienteOpen, setIsEditarPacienteOpen] =
    useState<boolean>(false)
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState<boolean>(false)
  const [pacientes, setPacientes] = useState<Paciente[]>(() => {
    const savedPacientes = localStorage.getItem('pacientes')
    return savedPacientes ? JSON.parse(savedPacientes) : initialPacientes
  })
  const [pacienteAtual, setPacienteAtual] = useState<Paciente | null>(null)
  const [pacienteADeletar, setPacienteADeletar] = useState<string | null>(null)

  useEffect(() => {
    localStorage.setItem('pacientes', JSON.stringify(pacientes))
  }, [pacientes])

  const openNovoPaciente = () => {
    setIsNovoPacienteOpen(true)
  }

  const closeNovoPaciente = () => {
    setIsNovoPacienteOpen(false)
  }

  const addNovoPaciente = (novoPaciente: Paciente) => {
    setPacientes([...pacientes, novoPaciente])
    closeNovoPaciente()
  }

  const openEditarPaciente = (paciente: Paciente) => {
    setPacienteAtual(paciente)
    setIsEditarPacienteOpen(true)
  }

  const closeEditarPaciente = () => {
    setPacienteAtual(null)
    setIsEditarPacienteOpen(false)
  }

  const updatePaciente = (pacienteAtualizado: Paciente) => {
    setPacientes(
      pacientes.map((paciente) =>
        paciente.id === pacienteAtualizado.id ? pacienteAtualizado : paciente,
      ),
    )
    closeEditarPaciente()
  }

  const confirmDeletePaciente = (id: string) => {
    setPacienteADeletar(id)
    setIsConfirmDeleteOpen(true)
  }

  const deletePaciente = () => {
    if (pacienteADeletar) {
      setPacientes(
        pacientes.filter((paciente) => paciente.id !== pacienteADeletar),
      )
      closeConfirmDelete()
    }
  }

  const closeConfirmDelete = () => {
    setPacienteADeletar(null)
    setIsConfirmDeleteOpen(false)
  }

  const [selectedPaciente, setSelectedPaciente] = useState('Todos')

  const handlePacienteChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setSelectedPaciente(event.target.value)
  }

  return (
    <div className="flex min-h-screen">
      <main
        className={`flex-1 bg-gray-100 p-8 transition-all duration-300 ease-in-out ${isMenuOpen ? 'md:ml-64' : 'ml-0'}`}
      >
        <div>
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Pacientes</h1>
            <button
              type="button"
              className="flex items-center bg-azul text-white px-4 py-2 rounded hover:bg-sky-600 duration-150"
              onClick={openNovoPaciente}
            >
              <Plus size={20} weight="bold" className="mr-2" />
              Novo Paciente
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="flex items-center space-x-4 p-4 bg-white rounded shadow">
              <User size={24} />
              <label htmlFor="pacientes" className="text-xl font-semibold">
                Paciente:
              </label>
              <select
                className="text-xl"
                name="pacientes"
                id="pacientes"
                value={selectedPaciente}
                onChange={handlePacienteChange}
              >
                <option value="Todos">Todos</option>
                {pacientes.map((paciente) => (
                  <option key={paciente.id} value={paciente.nome}>
                    {paciente.nome}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-4 p-4 bg-white rounded shadow">
              <Person size={24} />
              <span className="text-xl font-semibold">
                Total de Pacientes: {pacientes.length}
              </span>
            </div>
            <div className="flex items-center space-x-4 p-4 bg-white rounded shadow">
              <UsersThree size={24} />
              <span className="text-xl font-semibold">
                Total de Terapeutas: 8
              </span>
            </div>
          </div>
          <table className="listaPacientes w-full bg-white rounded shadow">
            <thead className="bg-rosa text-white">
              <tr>
                <th className="p-4 text-left">Paciente</th>
                <th className="p-4 text-left">Responsável</th>
                <th className="p-4 text-left">Telefone</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">CPF Responsável</th>
                <th className="p-4 text-left">Endereço</th>
                <th className="p-4 text-left">Ações</th>
              </tr>
            </thead>
            <tbody>
              {pacientes
                .filter(
                  (paciente) =>
                    selectedPaciente === 'Todos' ||
                    paciente.nome === selectedPaciente,
                )
                .map((paciente) => (
                  <tr key={paciente.id} className="border-b">
                    <td className="p-4">{paciente.nome}</td>
                    <td className="p-4">{paciente.responsavel}</td>
                    <td className="p-4">{paciente.telefone}</td>
                    <td className="p-4">{paciente.email}</td>
                    <td className="p-4">{paciente.cpfResponsavel}</td>
                    <td className="p-4">{paciente.endereco}</td>
                    <td className="p-4 flex space-x-2">
                      <button className="text-blue-500 hover:text-blue-700">
                        <Eye size={20} weight="bold" />
                      </button>
                      <button
                        className="text-green-500 hover:text-green-700"
                        onClick={() => openEditarPaciente(paciente)}
                      >
                        <PencilSimple size={20} weight="bold" />
                      </button>
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => confirmDeletePaciente(paciente.id)}
                      >
                        <TrashSimple size={20} weight="bold" />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </main>
      {isNovoPacienteOpen && (
        <NovoPaciente
          isOpen={isNovoPacienteOpen}
          onClose={closeNovoPaciente}
          onSave={addNovoPaciente}
        />
      )}
      {isEditarPacienteOpen && pacienteAtual && (
        <NovoPaciente
          isOpen={isEditarPacienteOpen}
          onClose={closeEditarPaciente}
          onSave={updatePaciente}
          paciente={pacienteAtual}
        />
      )}
      <Modal
        isOpen={isConfirmDeleteOpen}
        onRequestClose={closeConfirmDelete}
        contentLabel="Confirmação de Exclusão"
        className="fixed inset-0 flex items-center justify-center z-50"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <div className="bg-white p-8 rounded shadow-lg w-96">
          <h2 className="text-2xl font-bold mb-4">Confirmação de Exclusão</h2>
          <p className="mb-6">Tem certeza que deseja excluir este paciente?</p>
          <div className="flex justify-end space-x-4">
            <button
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              onClick={closeConfirmDelete}
            >
              Não
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              onClick={deletePaciente}
            >
              Sim
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
