import {
  PencilSimple,
  Person,
  Plus,
  TrashSimple,
  User,
  UsersThree,
} from '@phosphor-icons/react'
import { useEffect, useState } from 'react'
import Pagination from '../../components/Pagination'
import * as Dialog from '@radix-ui/react-dialog'
import { NovoTerapeutaModal } from '../../components/Terapeuta/NovoTerapeutaModal'
import axios from 'axios'
import type { Terapeuta } from '../../tipos'
import { EditarTerapeutaModal } from '../../components/Terapeuta/EditarTerapeutaModal'
import { ExcluirModal } from '../../components/ExcluirModal'
import { useModal } from '../../hooks/useModal'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState, AppDispatch } from '../../store/store'
import { fetchTerapeutas } from '../../store/terapeutasSlice'
import { fetchPacientes } from '../../store/pacientesSlice'

export function Terapeutas() {
  const dispatch = useDispatch<AppDispatch>()
  const terapeutas = useSelector((state: RootState) => state.terapeutas.data)
  const pacientes = useSelector((state: RootState) => state.pacientes.data)
  const [totalPages, setTotalPages] = useState<number>(0)
  const [currentPage, setCurrentPage] = useState(1)
  const terapeutasPerPage = 10
  const {
    isModalOpen,
    modalMessage,
    isEditModalOpen,
    openModal,
    closeModal,
    openEditModal,
    closeEditModal,
  } = useModal()
  const [terapeutaEditando, setTerapeutaEditando] = useState<Terapeuta | null>(
    null,
  )
  const [selectedTerapeuta, setSelectedTerapeuta] = useState('Todos')
  const [terapeutaParaExcluir, setTerapeutaParaExcluir] = useState<
    string | null
  >(null)
  const [isSuccess, setIsSuccess] = useState(false)
  const handleTerapeutaChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setSelectedTerapeuta(event.target.value)
  }

  const [filteredTerapeutas, setFilteredTerapeutas] = useState<Terapeuta[]>([])

  useEffect(() => {
    dispatch(fetchTerapeutas())
    dispatch(fetchPacientes())
  }, [dispatch])

  useEffect(() => {
    const filtered =
      selectedTerapeuta === 'Todos'
        ? terapeutas
        : terapeutas.filter((terapeuta) => terapeuta.id === selectedTerapeuta)
    setFilteredTerapeutas(filtered)
    setTotalPages(Math.ceil(filtered.length / terapeutasPerPage))
  }, [terapeutas, selectedTerapeuta])

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }

  const indexOfLastTerapeuta = currentPage * terapeutasPerPage
  const indexOfFirstTerapeuta = indexOfLastTerapeuta - terapeutasPerPage
  const terapeutasAtuais = filteredTerapeutas.slice(
    indexOfFirstTerapeuta,
    indexOfLastTerapeuta,
  )

  function handleEditTerapeuta(terapeuta: Terapeuta) {
    setTerapeutaEditando(terapeuta)
    openEditModal()
  }

  async function handleDeleteTerapeuta() {
    if (!terapeutaParaExcluir) return

    try {
      await axios.delete(
        `http://localhost:3000/terapeutas/${terapeutaParaExcluir}`,
      )
      dispatch(fetchTerapeutas())
      openModal('Terapeuta excluído com sucesso!')
      setIsSuccess(true)
      console.log('Terapeuta excluído:', terapeutaParaExcluir)
    } catch (error) {
      openModal('Erro ao excluir terapeuta!')
      console.error('Erro ao excluir terapeuta:', error)
    } finally {
      setTerapeutaParaExcluir(null)
    }
  }

  const openModalExcluir = (message: string, terapeutaId: string) => {
    openModal(message)
    setTerapeutaParaExcluir(terapeutaId)
    setIsSuccess(false)
  }

  return (
    <div className="flex min-h-screen">
      <main className={'flex-1 bg-gray-100 p-8'}>
        <div>
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Terapeutas</h1>
            <Dialog.Root>
              <Dialog.Trigger asChild>
                <button
                  type="button"
                  className="flex items-center bg-azul text-white px-4 py-2 rounded hover:bg-sky-600 duration-150"
                >
                  <Plus size={20} weight="bold" className="mr-2" />
                  Novo Terapeuta
                </button>
              </Dialog.Trigger>
              <NovoTerapeutaModal />
            </Dialog.Root>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
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
              <UsersThree size={24} />
              <span className="text-xl font-semibold">
                Total de Terapeutas: {filteredTerapeutas.length}
              </span>
            </div>
            <div className="flex items-center space-x-4 p-4 bg-white rounded shadow">
              <Person size={24} />
              <span className="text-xl font-semibold">
                Total de Pacientes: {pacientes.length}
              </span>
            </div>
          </div>
          <table className="listaTerapeutas w-full bg-white rounded shadow">
            <thead className="bg-rosa text-white">
              <tr>
                <th className="p-4 text-left">Nome</th>
                <th className="p-4 text-left">Telefone</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">Endereço</th>
                <th className="p-4 text-left">Currículo</th>
                <th className="p-4 text-left">Chave PIX</th>
                <th className="p-4 text-left">Ações</th>
              </tr>
            </thead>
            <tbody>
              {terapeutasAtuais.map((terapeuta) => (
                <tr key={terapeuta.id}>
                  <td className="p-4">{terapeuta.nomeTerapeuta}</td>
                  <td className="p-4">{terapeuta.telefoneTerapeuta}</td>
                  <td className="p-4">{terapeuta.emailTerapeuta}</td>
                  <td className="p-4">{terapeuta.enderecoTerapeuta}</td>
                  <td className="p-4">{terapeuta.curriculo}</td>
                  <td className="p-4">{terapeuta.chavePix}</td>
                  <td className="p-2 space-x-2">
                    <button
                      type="button"
                      title="Editar Terapeuta"
                      className="text-green-500 hover:text-green-700"
                      onClick={() => handleEditTerapeuta(terapeuta)}
                    >
                      <PencilSimple size={20} weight="bold" />
                    </button>
                    <button
                      type="button"
                      title="Excluir Terapeuta"
                      className="text-red-500 hover:text-red-700"
                      onClick={() =>
                        openModalExcluir(
                          'Deseja realmente excluir este terapeuta?',
                          terapeuta.id,
                        )
                      }
                    >
                      <TrashSimple size={20} weight="bold" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </main>
      <ExcluirModal
        isOpen={isModalOpen}
        onOpenChange={closeModal}
        title="Excluir Terapeuta"
        message={modalMessage}
        onConfirm={handleDeleteTerapeuta}
        isSuccess={isSuccess}
      />
      {terapeutaEditando && (
        <EditarTerapeutaModal
          terapeutaId={terapeutaEditando.id}
          open={isEditModalOpen}
          onClose={closeEditModal}
        />
      )}
    </div>
  )
}
