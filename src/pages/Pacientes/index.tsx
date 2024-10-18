import {
  Cake,
  PencilSimple,
  Person,
  Plus,
  TrashSimple,
  User,
  UsersThree,
} from '@phosphor-icons/react'
import { useEffect, useState } from 'react'
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

export function Pacientes() {
  const dispatch = useDispatch<AppDispatch>()
  const pacientes = useSelector((state: RootState) => state.pacientes.data)
  const terapeutas = useSelector((state: RootState) => state.terapeutas.data)
  const [searchQuery, setSearchQuery] = useState('')
  const [totalPages, setTotalPages] = useState<number>(0)
  const [currentPage, setCurrentPage] = useState(1)
  const pacientesPerPage = 10
  const {
    isModalOpen,
    modalMessage,
    isEditModalOpen,
    openModal,
    closeModal,
    openEditModal,
    closeEditModal,
  } = useModal()
  const [pacienteEditando, setPacienteEditando] = useState<Paciente | null>(
    null,
  )
  const [pacienteParaExcluir, setPacienteParaExcluir] = useState<string | null>(
    null,
  )
  const [isSuccess, setIsSuccess] = useState(false)

  const [filteredPacientes, setFilteredPacientes] = useState<Paciente[]>([])

  useEffect(() => {
    dispatch(fetchPacientes())
    dispatch(fetchTerapeutas())
  }, [dispatch])

  useEffect(() => {
    const filtered = pacientes.filter((paciente) =>
      paciente.nomePaciente.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    setFilteredPacientes(filtered)
    setTotalPages(Math.ceil(filtered.length / pacientesPerPage))
  }, [searchQuery, pacientes])

  const [selectedTerapeuta, setSelectedTerapeuta] = useState('Todos')
  const handleTerapeutaChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const terapeutaId = event.target.value
    setSelectedTerapeuta(terapeutaId)

    if (terapeutaId === 'Todos') {
      setFilteredPacientes(pacientes)
    } else {
      const filtered = pacientes.filter(
        (paciente) => paciente.terapeutaInfo?.id === terapeutaId,
      )
      setFilteredPacientes(filtered)
    }

    setCurrentPage(1) // Resetar para a primeira página
    setTotalPages(Math.ceil(filteredPacientes.length / pacientesPerPage))
  }

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }

  const indexOfLastPaciente = currentPage * pacientesPerPage
  const indexOfFirstPaciente = indexOfLastPaciente - pacientesPerPage
  const pacientesAtuais = filteredPacientes.slice(
    indexOfFirstPaciente,
    indexOfLastPaciente,
  )

  function handleEditPaciente(paciente: Paciente) {
    setPacienteEditando(paciente)
    openEditModal()
  }

  async function handleDeletePaciente() {
    if (!pacienteParaExcluir) return

    try {
      await dispatch(deletePaciente(pacienteParaExcluir)).unwrap()
      openModal('Paciente excluído com sucesso!')
      setIsSuccess(true)
      console.log('Paciente excluído:', pacienteParaExcluir)
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

  return (
    <div className="flex min-h-screen">
      <main className="flex-1 bg-gray-100 p-8">
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
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
            <Person size={24} />
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
        <table className="w-full bg-white rounded shadow">
          <thead className="bg-rosa text-white">
            <tr>
              <th className="p-4">Paciente</th>
              <th className="p-4">Data de Nascimento</th>
              <th className="p-4">Idade</th>
              <th className="p-4">Terapeuta</th>
              <th className="p-4">Responsável</th>
              <th className="p-4">Telefone Responsável</th>
              <th className="p-4">Email Resoponsável</th>
              <th className="p-4">CPF Responsável</th>
              <th className="p-4">Endereço</th>
              <th className="p-4">Origem</th>
              <th className="p-4">Ações</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {pacientesAtuais.map((paciente) => {
              const today = new Date()
              const birthDate = new Date(paciente.dtNascimento)
              const birthdayToday = isBirthday(today, birthDate)

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
                  <td className="p-4">
                    {calcularIdade(new Date(paciente.dtNascimento))}
                  </td>
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
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </main>
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
    </div>
  )
}
