import { Dispatch, SetStateAction, useState } from 'react'
import {
  PencilSimple,
  Person,
  Plus,
  TrashSimple,
  User,
  UsersThree,
} from '@phosphor-icons/react'
import { Paciente, Terapeuta } from '../../tipos'
import { NovoPaciente } from '../../components/Paciente/NovoPaciente'
import Modal from 'react-modal'
import { v4 as uuidv4 } from 'uuid'
import initialTerapeutas from '../Terapeutas'

export default function initialPacientes(): Paciente[] {
  const terapeutas = initialTerapeutas()

  return [
    {
      id: uuidv4(),
      nome: 'Davi',
      responsavel: 'Pai do Davi',
      telefone: '(61)9911-9188',
      email: 'paidodavi@gmail.com',
      cpfResponsavel: '123.456.789-00',
      endereco: 'Rua A, 123',
      origem: 'Busca no Google',
      terapeuta: terapeutas[0],
    },
    {
      id: uuidv4(),
      nome: 'Maria',
      responsavel: 'Mãe da Maria',
      telefone: '(61)9999-8888',
      email: 'mariadaMaria@gmail.com',
      cpfResponsavel: '987.654.321-00',
      endereco: 'Rua B, 456',
      origem: 'Instagram',
      terapeuta: terapeutas[1],
    },
    {
      id: uuidv4(),
      nome: 'Carlos',
      responsavel: 'Pai do Carlos',
      telefone: '(61)9888-7766',
      email: 'carlos@gmail.com',
      cpfResponsavel: '111.222.333-44',
      endereco: 'Rua C, 789',
      origem: 'Indicação',
      terapeuta: terapeutas[0],
    },
  ]
}

export function Pacientes({
  terapeutas,
  pacientes,
  setPacientes,
}: {
  terapeutas: Terapeuta[]
  pacientes: Paciente[]
  setPacientes: Dispatch<SetStateAction<Paciente[]>>
}) {
  const [isMenuOpen] = useState<boolean>(false)
  const [isNovoPacienteOpen, setIsNovoPacienteOpen] = useState<boolean>(false)
  const [isEditarPacienteOpen, setIsEditarPacienteOpen] =
    useState<boolean>(false)
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState<boolean>(false)

  const [pacienteAtual, setPacienteAtual] = useState<Paciente | null>(null)
  const [pacienteADeletar, setPacienteADeletar] = useState<string | null>(null)

  const [searchQuery, setSearchQuery] = useState<string>('')

  // Filter pacientes based on search query
  const filteredPacientes = pacientes.filter((paciente) =>
    paciente.nome.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const openNovoPaciente = () => {
    setIsNovoPacienteOpen(true)
  }

  const closeNovoPaciente = () => {
    setIsNovoPacienteOpen(false)
  }

  const addNovoPaciente = (novoPaciente: Paciente) => {
    if (!novoPaciente) {
      throw new Error('Objeto Invalido para Paciente.')
    }
    setPacientes((prevPacientes) => [...prevPacientes, novoPaciente])

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

  const [selectedPaciente] = useState('Todos')

  const [currentPage, setCurrentPage] = useState(1)
  const pacientesPorPagina = 10 // Número de pacientes por página
  const totalPaginas = Math.ceil(filteredPacientes.length / pacientesPorPagina)

  const handleClickPaginaAnterior = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1))
  }

  const handleClickProximaPagina = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPaginas))
  }

  const indexOfLastPaciente = currentPage * pacientesPorPagina
  const indexOfFirstPaciente = indexOfLastPaciente - pacientesPorPagina
  const pacientesAtuais = filteredPacientes.slice(
    indexOfFirstPaciente,
    indexOfLastPaciente,
  )

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
            <div className="flex items-center space-x-4 p-4 bg-white rounded shadow ">
              <User size={24} />
              <input
                className="text-xl w-full  text-gray-800 focus:outline-none"
                type="text"
                placeholder="Buscar paciente"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
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
                Total de Terapeutas: {terapeutas.length}
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
                <th className="p-4 text-left">Origem</th>
                <th className="p-4 text-left">Terapeuta</th>
                <th className="p-4 text-left">Ações</th>
              </tr>
            </thead>
            <tbody>
              {pacientesAtuais
                .filter(
                  (paciente) =>
                    selectedPaciente === 'Todos' ||
                    paciente.nome
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase()),
                )
                .map((paciente) => (
                  <tr key={paciente.id} className="border-b">
                    <td className="p-4">{paciente.nome}</td>
                    <td className="p-4">{paciente.responsavel}</td>
                    <td className="p-4">{paciente.telefone}</td>
                    <td className="p-4">{paciente.email}</td>
                    <td className="p-4">{paciente.cpfResponsavel}</td>
                    <td className="p-4">{paciente.endereco}</td>
                    <td className="p-4">{paciente.origem}</td>

                    <td className="p-4">
                      {paciente.terapeuta ? paciente.terapeuta.nome : 'N/A'}
                    </td>
                    <td className="p-4 flex space-x-2">
                      <button
                        title="Editar Paciente"
                        className="text-green-500 hover:text-green-700"
                        onClick={() => openEditarPaciente(paciente)}
                      >
                        <PencilSimple size={20} weight="bold" />
                      </button>
                      <button
                        title="Excluir Paciente"
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
          <div className="flex justify-evenly mt-4 items-center">
            <button
              onClick={handleClickPaginaAnterior}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 cursor-pointer"
              disabled={currentPage === 1}
            >
              Página Anterior
            </button>
            <span>
              Página {currentPage} de {totalPaginas}
            </span>
            <button
              onClick={handleClickProximaPagina}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 cursor-pointer"
              disabled={currentPage === totalPaginas}
            >
              Próxima Página
            </button>
          </div>
        </div>
      </main>
      {isNovoPacienteOpen && (
        <NovoPaciente
          isOpen={isNovoPacienteOpen}
          onClose={closeNovoPaciente}
          onSave={addNovoPaciente}
          terapeutas={terapeutas}
        />
      )}
      {isEditarPacienteOpen && pacienteAtual && (
        <NovoPaciente
          isOpen={isEditarPacienteOpen}
          onClose={closeEditarPaciente}
          onSave={updatePaciente}
          paciente={pacienteAtual}
          terapeutas={terapeutas}
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
