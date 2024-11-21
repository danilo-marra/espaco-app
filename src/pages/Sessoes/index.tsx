import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useEffect, useMemo, useState } from "react";
import DatePicker from "react-datepicker";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../hooks/useModal";
import { deleteSessao, fetchSessoes } from "../../store/sessoesSlice";
import type { AppDispatch, RootState } from "../../store/store";
import { fetchTerapeutas } from "../../store/terapeutasSlice";
import { dateFormatter, priceFormatter } from "../../utils/formatter";
import "react-datepicker/dist/react-datepicker.css";
import {
  Calendar,
  CaretLeft,
  CaretRight,
  HandCoins,
  Money,
  PencilSimple,
  PiggyBank,
  Plus,
  TrashSimple,
  User,
  Users,
} from "@phosphor-icons/react";
import * as Dialog from "@radix-ui/react-dialog";
import { ExcluirModal } from "../../components/ExcluirModal";
import Pagination from "../../components/Pagination";
import { EditarSessaoModal } from "../../components/Sessao/EditarSessaoModal";
import { NovaSessaoModal } from "../../components/Sessao/NovaSessaoModal";
import type { Sessao } from "../../tipos";

interface SessaoCalculations {
  totalValue: number;
  repasseValue: number;
  repassePercentage: number;
}

const countValidDates = (sessao: Sessao): number => {
  return [
    sessao.dtSessao1,
    sessao.dtSessao2,
    sessao.dtSessao3,
    sessao.dtSessao4,
    sessao.dtSessao5,
    sessao.dtSessao6,
  ].filter(Boolean).length;
};

const calculateRepasseInfo = (sessao: Sessao): SessaoCalculations => {
  const validDates = countValidDates(sessao);
  const totalValue = sessao.valorSessao * validDates;

  const dataEntrada = new Date(sessao.terapeutaInfo.dtEntrada);
  const umAnoAtras = new Date();
  umAnoAtras.setFullYear(umAnoAtras.getFullYear() - 1);

  const repassePercentage = dataEntrada <= umAnoAtras ? 0.5 : 0.45;
  const repasseValue = totalValue * repassePercentage;

  return {
    totalValue,
    repasseValue,
    repassePercentage,
  };
};

const filterSessoes = (
  sessoes: Sessao[],
  selectedTerapeuta: string,
  currentDate: Date,
  searchQuery: string,
): Sessao[] => {
  return sessoes.filter(
    (sessao) =>
      (selectedTerapeuta === "Todos" ||
        sessao.terapeutaInfo?.id === selectedTerapeuta) &&
      new Date(sessao.dtSessao1).getMonth() === currentDate.getMonth() &&
      new Date(sessao.dtSessao1).getFullYear() === currentDate.getFullYear() &&
      sessao.pacienteInfo.nomePaciente
        .toLowerCase()
        .includes(searchQuery.toLowerCase()),
  );
};

export function Sessoes() {
  const dispatch = useDispatch<AppDispatch>();
  const terapeutas = useSelector((state: RootState) => state.terapeutas.data);
  const sessoes = useSelector((state: RootState) => state.sessoes.data);
  const statusStyles: { [key: string]: string } = {
    "Pagamento Pendente": "bg-red-200 text-red-900",
    "Pagamento Realizado": "bg-orange-200 text-orange-900",
    "Nota Fiscal Emitida": "bg-yellow-200 text-yellow-900",
    "Nota Fiscal Enviada": "bg-green-200 text-green-900",
  };

  // Estados
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTerapeuta, setSelectedTerapeuta] = useState("Todos");
  const [isSuccess, setIsSuccess] = useState(false);
  const [sessaoParaExcluir, setSessaoParaExcluir] = useState<string | null>(
    null,
  );
  const [sessaoEditando, setSessaoEditando] = useState<Sessao | null>(null);

  // Constantes
  const SESSIONS_PER_PAGE = 10;

  // Modal
  const {
    isModalOpen,
    modalMessage,
    isEditModalOpen,
    openModal,
    closeModal,
    openEditModal,
    closeEditModal,
  } = useModal();

  // Handlers para mudanças de estado
  const handleTerapeutaChange = (value: string) => {
    setSelectedTerapeuta(value);
    setCurrentPage(1);
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setCurrentDate(date);
      setCurrentPage(1);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleMonthChange = (increment: number) => {
    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + increment,
      1,
    );
    setCurrentDate(newDate);
    setCurrentPage(1);
  };

  const handleDeleteSessao = async () => {
    if (!sessaoParaExcluir) return;

    try {
      await dispatch(deleteSessao(sessaoParaExcluir)).unwrap();
      openModal("Sessão excluída com sucesso!");
      setIsSuccess(true);
    } catch (error) {
      openModal("Erro ao excluir sessão!");
      console.error("Erro ao excluir sessão:", error);
    } finally {
      setSessaoParaExcluir(null);
    }
  };

  const openModalExcluir = (message: string, sessaoId: string) => {
    openModal(message);
    setSessaoParaExcluir(sessaoId);
    setIsSuccess(false);
  };

  const handleEditSessao = (sessao: Sessao) => {
    setSessaoEditando(sessao);
    openEditModal();
  };

  // Dados filtrados e cálculos usando useMemo
  const filteredSessoes = useMemo(
    () => filterSessoes(sessoes, selectedTerapeuta, currentDate, searchQuery),
    [sessoes, selectedTerapeuta, currentDate, searchQuery],
  );

  const totals = useMemo(() => {
    return filteredSessoes.reduce(
      (acc, sessao) => {
        const calculations = calculateRepasseInfo(sessao);
        return {
          totalValue: acc.totalValue + calculations.totalValue,
          totalRepasse: acc.totalRepasse + calculations.repasseValue,
        };
      },
      { totalValue: 0, totalRepasse: 0 },
    );
  }, [filteredSessoes]);

  const paginatedSessoes = useMemo(() => {
    const startIndex = (currentPage - 1) * SESSIONS_PER_PAGE;
    return filteredSessoes.slice(startIndex, startIndex + SESSIONS_PER_PAGE);
  }, [filteredSessoes, currentPage]);

  const totalPages = Math.ceil(filteredSessoes.length / SESSIONS_PER_PAGE);

  // Effect para carregar dados iniciais
  useEffect(() => {
    dispatch(fetchSessoes());
    dispatch(fetchTerapeutas());
  }, [dispatch]);

  return (
    <div className="flex min-h-screen">
      <main className="flex-1 bg-gray-100 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Sessões</h1>
          <Dialog.Root>
            <Dialog.Trigger asChild>
              <button
                type="button"
                className="flex items-center bg-azul text-white px-4 py-2 rounded hover:bg-sky-600"
              >
                <Plus size={20} weight="bold" className="mr-2" />
                Nova Sessão
              </button>
            </Dialog.Trigger>
            <NovaSessaoModal />
          </Dialog.Root>
        </div>

        {/* Filters and Summary */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
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
              id="terapeutas"
              className="text-xl"
              value={selectedTerapeuta}
              onChange={(e) => handleTerapeutaChange(e.target.value)}
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
            <Money size={24} />
            <span className="text-xl font-semibold">
              Total pacientes: {priceFormatter.format(totals.totalValue)}
            </span>
          </div>
          <div className="flex items-center space-x-4 p-4 bg-white rounded shadow">
            <HandCoins size={24} />
            <span className="text-xl font-semibold">
              Total para terapeutas:{" "}
              {priceFormatter.format(totals.totalRepasse)}
            </span>
          </div>
          <div className="flex items-center space-x-4 p-4 bg-white rounded shadow">
            <PiggyBank size={24} />
            <span className="text-xl font-semibold">
              Lucro:{" "}
              {priceFormatter.format(totals.totalValue - totals.totalRepasse)}
            </span>
          </div>
        </div>

        {/* Date Navigation */}
        <div className="flex items-center justify-between p-4 bg-white rounded shadow mb-4">
          <button
            type="button"
            onClick={() => handleMonthChange(-1)}
            aria-label="Previous month"
          >
            <CaretLeft size={24} weight="fill" />
          </button>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-semibold">
              {format(currentDate, "MMMM yyyy", { locale: ptBR }).replace(
                /^\w/,
                (c) => c.toUpperCase(),
              )}
            </h2>
            <DatePicker
              selected={currentDate}
              onChange={handleDateChange}
              showMonthYearPicker
              dateFormat="MMMM yyyy"
              locale={ptBR}
              customInput={
                <button type="button" aria-label="Select month and year">
                  <Calendar size={28} className="text-gray-500 mt-2" />
                </button>
              }
            />
          </div>
          <button
            type="button"
            onClick={() => handleMonthChange(1)}
            aria-label="Next month"
          >
            <CaretRight size={24} weight="fill" />
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-rosa text-white">
              <tr>
                <th className="p-4">Terapeuta</th>
                <th className="p-4">Paciente</th>
                <th className="p-4">Responsável</th>
                {/* TODO Incluir tipoAgendamento do componente Agendamento */}
                <th className="p-4">Status</th>
                <th className="p-4">Valor da Sessão</th>
                <th className="p-4">Sessão 1</th>
                <th className="p-4">Sessão 2</th>
                <th className="p-4">Sessão 3</th>
                <th className="p-4">Sessão 4</th>
                <th className="p-4">Sessão 5</th>
                <th className="p-4">Sessão 6</th>
                <th className="p-4">Total</th>
                <th className="p-4">Repasse</th>
                <th className="p-4">Ações</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {paginatedSessoes.map((sessao) => {
                const calculations = calculateRepasseInfo(sessao);
                return (
                  <tr key={sessao.id}>
                    <td className="p-4">
                      {sessao.terapeutaInfo.nomeTerapeuta}
                    </td>
                    <td className="p-4">{sessao.pacienteInfo.nomePaciente}</td>
                    <td className="p-4">
                      {sessao.pacienteInfo.nomeResponsavel}
                    </td>
                    <td className="p-4">
                      <span
                        className={`p-2 rounded-full text-sm ${
                          statusStyles[sessao.statusSessao ?? ""] ||
                          "bg-gray-200 text-gray-900"
                        }`}
                      >
                        {sessao.statusSessao}
                      </span>
                    </td>
                    <td className="p-4">
                      {priceFormatter.format(sessao.valorSessao)}
                    </td>
                    {[1, 2, 3, 4, 5, 6].map((num) => {
                      const dateKey = `dtSessao${num}` as keyof Sessao;
                      return (
                        <td key={num} className="p-4">
                          {sessao[dateKey]
                            ? dateFormatter.format(
                                new Date(sessao[dateKey] as string),
                              )
                            : "N/A"}
                        </td>
                      );
                    })}
                    <td className="p-4">
                      {priceFormatter.format(calculations.totalValue)}
                    </td>
                    <td className="p-4">
                      {priceFormatter.format(calculations.repasseValue)} (
                      {calculations.repassePercentage * 100}%)
                    </td>
                    <td className="p-2 space-x-2">
                      <button
                        type="button"
                        title="Editar sessão"
                        className="text-green-500 hover:text-green-700"
                        onClick={() => handleEditSessao(sessao)}
                      >
                        <PencilSimple size={20} weight="bold" />
                      </button>
                      <button
                        type="button"
                        title="Excluir sessão"
                        className="text-red-500 hover:text-red-700"
                        onClick={() =>
                          openModalExcluir(
                            "Deseja realmente excluir esta sessão?",
                            sessao.id,
                          )
                        }
                      >
                        <TrashSimple size={20} weight="bold" />
                      </button>
                    </td>
                  </tr>
                );
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
          title="Excluir Sessão"
          message={modalMessage}
          onConfirm={handleDeleteSessao}
          isSuccess={isSuccess}
        />

        {sessaoEditando && (
          <EditarSessaoModal
            sessaoId={sessaoEditando.id}
            open={isEditModalOpen}
            onClose={closeEditModal}
          />
        )}
      </main>
    </div>
  );
}
