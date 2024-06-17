// Terapeutas.tsx
import { Dispatch, SetStateAction, useState } from 'react'
import { Paciente, Terapeuta } from '../../tipos'
import { NovoTerapeuta } from '../../components/Terapeuta/NovoTerapeuta'

import Modal from 'react-modal'
import { v4 as uuidv4 } from 'uuid'
import {
  Eye,
  PencilSimple,
  Person,
  Plus,
  TrashSimple,
  User,
  UsersThree,
} from '@phosphor-icons/react'
import { VisualizarCurriculo } from '../../components/Terapeuta/VisualizarCurriculo'

// const file = new File(['teste'], 'curriculo.txt', { type: 'text/plain' })

export default function initialTerapeutas(): Terapeuta[] {
  return [
    {
      id: uuidv4(),
      nome: 'Juliana Barbosa',
      telefone: '(61)9571-3244',
      email: 'jujupsi@gmail.com',
      endereco: 'SHCES 301, B, 201 ',
      curriculo: 'https://www.linkedin.com/in/danilomarra/',
      chavePix: '9999110',
    },
    {
      id: uuidv4(),
      nome: 'Rebbeca Alves',
      telefone: '(61)97001-1234',
      email: 'rebalves@gmail.com',
      endereco: 'SHCES 101, B, 201 ',
      curriculo: 'https://www.linkedin.com/in/danilomarra/',
      chavePix: '89888899',
    },
  ]
}

export function Terapeutas({
  terapeutas,
  pacientes,
  setTerapeutas,
}: {
  terapeutas: Terapeuta[]
  setTerapeutas: Dispatch<SetStateAction<Terapeuta[]>>
  pacientes: Paciente[]
  setPacientes: Dispatch<SetStateAction<Paciente[]>>
}) {
  const [isMenuOpen] = useState<boolean>(false)
  const [isNovoTerapeutaOpen, setIsNovoTerapeutaOpen] = useState<boolean>(false)
  const [isEditarTerapeutaOpen, setIsEditarTerapeutaOpen] =
    useState<boolean>(false)
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState<boolean>(false)
  const [terapeutaAtual, setTerapeutaAtual] = useState<Terapeuta | null>(null)
  const [terapeutaADeletar, setTerapeutaADeletar] = useState<string | null>(
    null,
  )
  const [isVisualizarCurriculoOpen, setIsVisualizarCurriculoOpen] =
    useState<boolean>(false)
  const [curriculoUrl, setCurriculoUrl] = useState<string>('')

  const openEditarTerapeuta = (terapeuta: Terapeuta) => {
    setTerapeutaAtual(terapeuta)
    setIsEditarTerapeutaOpen(true)
  }

  const closeEditarTerapeuta = () => {
    setTerapeutaAtual(null)
    setIsEditarTerapeutaOpen(false)
  }

  const confirmDeleteTerapeuta = (id: string) => {
    setTerapeutaADeletar(id)
    setIsConfirmDeleteOpen(true)
  }

  const closeConfirmDelete = () => {
    setTerapeutaADeletar(null)
    setIsConfirmDeleteOpen(false)
  }

  const deleteTerapeuta = () => {
    if (terapeutaADeletar) {
      const updatedTerapeutas = terapeutas.filter(
        (terapeuta) => terapeuta.id !== terapeutaADeletar,
      )
      setTerapeutas(updatedTerapeutas)
      localStorage.setItem('terapeutas', JSON.stringify(updatedTerapeutas))
      closeConfirmDelete()
    }
  }

  const openNovoTerapeuta = () => {
    setIsNovoTerapeutaOpen(true)
  }

  const closeNovoTerapeuta = () => {
    setIsNovoTerapeutaOpen(false)
  }

  const addNovoTerapeuta = (novoTerapeuta: Terapeuta) => {
    const updatedTerapeutas = [...terapeutas, novoTerapeuta]
    setTerapeutas(updatedTerapeutas)
    localStorage.setItem('terapeutas', JSON.stringify(updatedTerapeutas))
    closeNovoTerapeuta()
  }

  const updateTerapeuta = (updatedTerapeuta: Terapeuta) => {
    const updatedTerapeutas = terapeutas.map((terapeuta) =>
      terapeuta.id === updatedTerapeuta.id ? updatedTerapeuta : terapeuta,
    )
    setTerapeutas(updatedTerapeutas)
    localStorage.setItem('terapeutas', JSON.stringify(updatedTerapeutas))
    closeEditarTerapeuta()
  }

  const [selectedTerapeuta, setSelectedTerapeuta] = useState('Todos')

  const handleTerapeutaChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setSelectedTerapeuta(event.target.value)
  }

  const [currentPage, setCurrentPage] = useState(1)
  const terapeutasPorPagina = 10 // Número de terapeutas por página
  const totalPaginas = Math.ceil(terapeutas.length / terapeutasPorPagina)

  const handleClickPaginaAnterior = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1))
  }

  const handleClickProximaPagina = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPaginas))
  }

  const indexOfLastTerapeuta = currentPage * terapeutasPorPagina
  const indexOfFirstTerapeuta = indexOfLastTerapeuta - terapeutasPorPagina
  const terapeutasAtuais = terapeutas.slice(
    indexOfFirstTerapeuta,
    indexOfLastTerapeuta,
  )

  return (
    <div className="flex min-h-screen">
      <main
        className={`flex-1 bg-gray-100 p-8 transition-all duration-300 ease-in-out ${isMenuOpen ? 'md:ml-64' : 'ml-0'}`}
      >
        <div>
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Terapeutas</h1>
            <button
              type="button"
              className="flex items-center bg-azul text-white px-4 py-2 rounded hover:bg-sky-600 duration-150"
              onClick={openNovoTerapeuta}
            >
              <Plus size={20} weight="bold" className="mr-2" />
              Novo Terapeuta
            </button>
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
                  <option key={terapeuta.id} value={terapeuta.nome}>
                    {terapeuta.nome}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-4 p-4 bg-white rounded shadow">
              <UsersThree size={24} />
              <span className="text-xl font-semibold">
                Total de Terapeutas: {terapeutas.length}
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
              {terapeutasAtuais
                .filter(
                  (terapeuta) =>
                    selectedTerapeuta === 'Todos' ||
                    terapeuta.nome === selectedTerapeuta,
                )
                .map((terapeuta) => (
                  <tr key={terapeuta.id} className="border-b">
                    <td className="p-4">{terapeuta.nome}</td>
                    <td className="p-4">{terapeuta.telefone}</td>
                    <td className="p-4">{terapeuta.email}</td>
                    <td className="p-4">{terapeuta.endereco}</td>
                    <td className="p-4">
                      <button
                        className="text-blue-500 hover:text-blue-700"
                        onClick={() => {
                          setCurriculoUrl(terapeuta.curriculo)
                          setIsVisualizarCurriculoOpen(true)
                        }}
                      >
                        <Eye size={20} weight="bold" />
                      </button>
                    </td>
                    <td className="p-4">{terapeuta.chavePix}</td>
                    <td className="p-4 flex space-x-2">
                      <button
                        title="Editar paciente"
                        className="text-green-500 hover:text-green-700"
                        onClick={() => openEditarTerapeuta(terapeuta)}
                      >
                        <PencilSimple size={20} weight="bold" />
                      </button>
                      <button
                        title="Excluir paciente"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => confirmDeleteTerapeuta(terapeuta.id)}
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
      {isNovoTerapeutaOpen && (
        <NovoTerapeuta
          isOpen={isNovoTerapeutaOpen}
          onClose={closeNovoTerapeuta}
          onSave={addNovoTerapeuta}
        />
      )}
      {isEditarTerapeutaOpen && terapeutaAtual && (
        <NovoTerapeuta
          isOpen={isEditarTerapeutaOpen}
          onClose={closeEditarTerapeuta}
          onSave={updateTerapeuta}
          terapeuta={terapeutaAtual}
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
          <p className="mb-6">Tem certeza que deseja excluir esta terapeuta?</p>
          <div className="flex justify-end space-x-4">
            <button
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              onClick={closeConfirmDelete}
            >
              Não
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              onClick={deleteTerapeuta}
            >
              Sim
            </button>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={isVisualizarCurriculoOpen}
        onRequestClose={() => setIsVisualizarCurriculoOpen(false)}
        contentLabel="Visualizar Currículo"
        className="fixed inset-0 flex items-center justify-center z-50"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <VisualizarCurriculo
          url={curriculoUrl}
          onClose={() => setIsVisualizarCurriculoOpen(false)}
        />
      </Modal>
    </div>
  )
}
