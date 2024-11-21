import {
  PencilSimple,
  Plus,
  TrashSimple,
  User,
  Users,
  UsersThree,
} from "@phosphor-icons/react";
import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ExcluirModal } from "../../components/ExcluirModal";
import Pagination from "../../components/Pagination";
import { EditarTerapeutaModal } from "../../components/Terapeuta/EditarTerapeutaModal";
import { NovoTerapeutaModal } from "../../components/Terapeuta/NovoTerapeutaModal";
import { useModal } from "../../hooks/useModal";
import { fetchPacientes } from "../../store/pacientesSlice";
import type { AppDispatch, RootState } from "../../store/store";
import { deleteTerapeuta, fetchTerapeutas } from "../../store/terapeutasSlice";
import type { Terapeuta } from "../../tipos";
import { dateFormatter } from "../../utils/formatter";

const TERAPEUTAS_PER_PAGE = 10;

const filterTerapeutas = (
  terapeutas: Terapeuta[],
  selectedTerapeuta: string,
): Terapeuta[] => {
  return terapeutas.filter((terapeuta) => {
    const matchesTerapeuta =
      selectedTerapeuta === "Todos" || terapeuta.id === selectedTerapeuta;

    return matchesTerapeuta;
  });
};

export function Terapeutas() {
  const dispatch = useDispatch<AppDispatch>();
  const terapeutas = useSelector((state: RootState) => state.terapeutas.data);
  const pacientes = useSelector((state: RootState) => state.pacientes.data);

  // Estados
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTerapeuta, setSelectedTerapeuta] = useState("Todos");
  const [terapeutaEditando, setTerapeutaEditando] = useState<Terapeuta | null>(
    null,
  );
  const [terapeutaParaExcluir, setTerapeutaParaExcluir] = useState<
    string | null
  >(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    isModalOpen,
    modalMessage,
    isEditModalOpen,
    openModal,
    closeModal,
    openEditModal,
    closeEditModal,
  } = useModal();

  // Dados filtrados e paginação usando useMemo
  const filteredTerapeutas = useMemo(
    () => filterTerapeutas(terapeutas, selectedTerapeuta),
    [terapeutas, selectedTerapeuta],
  );

  const paginatedTerapeutas = useMemo(() => {
    const startIndex = (currentPage - 1) * TERAPEUTAS_PER_PAGE;
    return filteredTerapeutas.slice(
      startIndex,
      startIndex + TERAPEUTAS_PER_PAGE,
    );
  }, [filteredTerapeutas, currentPage]);

  const totalPages = Math.ceil(filteredTerapeutas.length / TERAPEUTAS_PER_PAGE);

  // Handlers
  const handleTerapeutaChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setSelectedTerapeuta(event.target.value);
    setCurrentPage(1);
  };

  const handleEditTerapeuta = (terapeuta: Terapeuta) => {
    setTerapeutaEditando(terapeuta);
    openEditModal();
  };

  const handleDeleteTerapeuta = async () => {
    if (!terapeutaParaExcluir) return;

    try {
      await dispatch(deleteTerapeuta(terapeutaParaExcluir)).unwrap();
      openModal("Terapeuta excluído com sucesso!");
      setIsSuccess(true);
    } catch (error) {
      openModal("Erro ao excluir terapeuta!");
      console.error("Erro ao excluir terapeuta:", error);
    } finally {
      setTerapeutaParaExcluir(null);
    }
  };

  const openModalExcluir = (message: string, terapeutaId: string) => {
    openModal(message);
    setTerapeutaParaExcluir(terapeutaId);
    setIsSuccess(false);
  };

  // Effect para carregar dados iniciais
  useEffect(() => {
    dispatch(fetchTerapeutas());
    dispatch(fetchPacientes());
  }, [dispatch]);

  return (
    <div className="flex min-h-screen">
      <main className="flex-1 bg-gray-100 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold">Terapeutas</h1>
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

        {/* Filters and Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="flex items-center space-x-4 p-4 bg-white rounded shadow">
            <User size={24} />
            <label htmlFor="terapeutas" className="text-xl font-semibold">
              Terapeuta
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
              Total de Terapeutas: {terapeutas.length}
            </span>
          </div>
          <div className="flex items-center space-x-4 p-4 bg-white rounded shadow">
            <Users size={24} />
            <span className="text-xl font-semibold">
              Total de Pacientes: {pacientes.length}
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-rosa text-white">
              <tr>
                <th className="p-4 text-left">Nome</th>
                <th className="p-4 text-left">Foto</th>
                <th className="p-4 text-left">Telefone</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">Endereço</th>
                <th className="p-4 text-left">Data de Entrada</th>
                <th className="p-4 text-left">Chave PIX</th>
                <th className="p-4 text-left">Ações</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTerapeutas.map((terapeuta) => (
                <tr key={terapeuta.id}>
                  <td className="p-4">{terapeuta.nomeTerapeuta}</td>
                  <td className="p-4">
                    {terapeuta.foto ? (
                      <img
                        src={terapeuta.foto}
                        alt={terapeuta.nomeTerapeuta}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                        <User size={24} className="text-white" />
                      </div>
                    )}
                  </td>
                  <td className="p-4">{terapeuta.telefoneTerapeuta}</td>
                  <td className="p-4">{terapeuta.emailTerapeuta}</td>
                  <td className="p-4">{terapeuta.enderecoTerapeuta}</td>
                  <td className="p-4">
                    {dateFormatter.format(new Date(terapeuta.dtEntrada))}
                  </td>
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
                          "Deseja realmente excluir este terapeuta?",
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
      </main>
    </div>
  );
}
