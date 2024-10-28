import {
  Cake,
  PencilSimple,
  Plus,
  TrashSimple,
  User,
  Users,
  UsersThree,
} from '@phosphor-icons/react'
import { useEffect, useMemo, useState } from 'react'
import { dateFormatter } from '../../utils/formatter'
import { calcularIdade } from '../../utils/caculateAge'
import Pagination from '../../components/Pagination'
import * as Dialog from '@radix-ui/react-dialog'
import { NovoPacienteModal } from '../../components/Paciente/NovoPacienteModal'
import type { Paciente } from '../../tipos'
import { EditarPacienteModal } from '../../components/Paciente/EditarPacienteModal'
import { ExcluirModal } from '../../components/ExcluirModal'
import { useModal } from '../../hooks/useModal'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState, AppDispatch } from '../../store/store'
import { deletePaciente, fetchPacientes } from '../../store/pacientesSlice'
import { fetchTerapeutas } from '../../store/terapeutasSlice'
import { isBirthday } from '../../utils/dateUtils'

const PACIENTES_PER_PAGE = 10

const filterPacientes = (
  pacientes: Paciente[],
  searchQuery: string,
  selectedTerapeuta: string,
): Paciente[] => {
  return pacientes.filter((paciente) => {
    const matchesSearch = paciente.nomePaciente
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
    const matchesTerapeuta =
      selectedTerapeuta === 'Todos' ||
      paciente.terapeutaInfo.id === selectedTerapeuta

    return matchesSearch && matchesTerapeuta
  })
}

export function Pacientes() {
  const dispatch = useDispatch<AppDispatch>()
  const pacientes = useSelector((state: RootState) => state.pacientes.data)
  const terapeutas = useSelector((state: RootState) => state.terapeutas.data)

  // Estados
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedTerapeuta, setSelectedTerapeuta] = useState('Todos')
  const [pacienteEditando, setPacienteEditando] = useState<Paciente | null>(
    null,
  )
  const [pacienteParaExcluir, setPacienteParaExcluir] = useState<string | null>(
    null,
  )
  const [isSuccess, setIsSuccess] = useState(false)

  const {
    isModalOpen,
    modalMessage,
    isEditModalOpen,
    openModal,
    closeModal,
    openEditModal,
    closeEditModal,
  } = useModal()

  // Dados filtrados e paginação usando useMemo
  const filteredPacientes = useMemo(
    () => filterPacientes(pacientes, searchQuery, selectedTerapeuta),
    [pacientes, searchQuery, selectedTerapeuta],
  )

  const paginatedPacientes = useMemo(() => {
    const startIndex = (currentPage - 1) * PACIENTES_PER_PAGE
    return filteredPacientes.slice(startIndex, startIndex + PACIENTES_PER_PAGE)
  }, [filteredPacientes, currentPage])

  const totalPages = Math.ceil(filteredPacientes.length / PACIENTES_PER_PAGE)

  // Handlers
  const handleTerapeutaChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setSelectedTerapeuta(event.target.value)
    setCurrentPage(1)
  }

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setCurrentPage(1)
  }

  const handleEditPaciente = (paciente: Paciente) => {
    setPacienteEditando(paciente)
    openEditModal()
  }

  const handleDeletePaciente = async () => {
    if (!pacienteParaExcluir) return

    try {
      await dispatch(deletePaciente(pacienteParaExcluir)).unwrap()
      openModal('Paciente excluído com sucesso!')
      setIsSuccess(true)
    } catch (error) {
      openModal('Erro ao excluir paciente!')
      console.error('Erro ao excluir paciente:', error)
    } finally {
      setPacienteParaExcluir(null)
    }
  }

  const openModalExcluir = (message: string, pacienteId: string) => {
    openModal(message)
    setPacienteParaExcluir(pacienteId)
    setIsSuccess(false)
  }

  // Effect para carregar dados iniciais
  useEffect(() => {
    dispatch(fetchPacientes())
    dispatch(fetchTerapeutas())
  }, [dispatch])

  return (
    <div className="flex min-h-screen">
      <main className="flex-1 bg-gray-100 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold">Pacientes</h1>
          <Dialog.Root>
            <Dialog.Trigger asChild>
              <button
                type="button"
                className="flex items-center bg-azul text-white px-4 py-2 rounded hover:bg-sky-600 duration-150"
              >
                <Plus size={20} weight="bold" className="mr-2" />
                Novo Paciente
              </button>
            </Dialog.Trigger>
            <NovoPacienteModal />
          </Dialog.Root>
        </div>

        {/* Filters and Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="flex items-center space-x-4 p-4 bg-white rounded shadow">
            <Users size={24} />
            <input
              className="text-xl w-full text-gray-800 focus:outline-none"
              type="text"
              placeholder="Buscar paciente"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-4 p-4 bg-white rounded shadow">
            <User size={24} />
            <label htmlFor="terapeutas" className="text-xl font-semibold">
              Terapeuta:
            </label>
            <select
              className="text-xl"
              name="terapeutas"
              id="terapeutas"
              value={selectedTerapeuta}
              onChange={handleTerapeutaChange}
            >
              <option value="Todos">Todos</option>
              {terapeutas.map((terapeuta) => (
                <option key={terapeuta.id} value={terapeuta.id}>
                  {terapeuta.nomeTerapeuta}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center space-x-4 p-4 bg-white rounded shadow">
            <Users size={24} />
            <span className="text-xl font-semibold">
              Total de Pacientes: {filteredPacientes.length}
            </span>
          </div>
          <div className="flex items-center space-x-4 p-4 bg-white rounded shadow">
            <UsersThree size={24} />
            <span className="text-xl font-semibold">
              Total de Terapeutas: {terapeutas.length}
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-rosa text-white">
              <tr>
                <th className="p-4">Paciente</th>
                <th className="p-4">Data de Nascimento</th>
                <th className="p-4">Idade</th>
                <th className="p-4">Terapeuta</th>
                <th className="p-4">Responsável</th>
                <th className="p-4">Telefone Responsável</th>
                <th className="p-4">Email Responsável</th>
                <th className="p-4">CPF Responsável</th>
                <th className="p-4">Endereço</th>
                <th className="p-4">Origem</th>
                <th className="p-4">Ações</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {paginatedPacientes.map((paciente) => {
                const birthDate = new Date(paciente.dtNascimento)
                const birthdayToday = isBirthday(new Date(), birthDate)

                return (
                  <tr key={paciente.id}>
                    <td className="p-4">{paciente.nomePaciente}</td>
                    <td className="p-4">
                      {birthdayToday && (
                        <span
                          title="Aniversário hoje!"
                          className="flex justify-center items-center"
                        >
                          <Cake size={28} color="#C3586A" />
                        </span>
                      )}
                      {dateFormatter.format(birthDate)}
                    </td>
                    <td className="p-4">{calcularIdade(birthDate)}</td>
                    <td className="p-4">
                      {paciente.terapeutaInfo?.nomeTerapeuta || 'Sem Terapeuta'}
                    </td>
                    <td className="p-4">{paciente.nomeResponsavel}</td>
                    <td className="p-4">{paciente.telefoneResponsavel}</td>
                    <td className="p-4">{paciente.emailResponsavel}</td>
                    <td className="p-4">{paciente.cpfResponsavel}</td>
                    <td className="p-4">{paciente.enderecoResponsavel}</td>
                    <td className="p-4">{paciente.origem}</td>
                    <td className="p-2 space-x-2">
                      <button
                        type="button"
                        title="Editar Paciente"
                        className="text-green-500 hover:text-green-700"
                        onClick={() => handleEditPaciente(paciente)}
                      >
                        <PencilSimple size={20} weight="bold" />
                      </button>
                      <button
                        type="button"
                        title="Excluir Paciente"
                        className="text-red-500 hover:text-red-700"
                        onClick={() =>
                          openModalExcluir(
                            'Deseja realmente excluir este paciente?',
                            paciente.id,
                          )
                        }
                      >
                        <TrashSimple size={20} weight="bold" />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />

        {/* Modals */}
        <ExcluirModal
          isOpen={isModalOpen}
          onOpenChange={closeModal}
          title="Excluir Paciente"
          message={modalMessage}
          onConfirm={handleDeletePaciente}
          isSuccess={isSuccess}
        />
        {pacienteEditando && (
          <EditarPacienteModal
            pacienteId={pacienteEditando.id}
            open={isEditModalOpen}
            onClose={closeEditModal}
          />
        )}
      </main>
    </div>
  )
}
