import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useEffect, useMemo, useState } from "react";
import DatePicker from "react-datepicker";
import { useDispatch, useSelector } from "react-redux";
import "react-datepicker/dist/react-datepicker.css";
import {
  ArrowCircleDown,
  ArrowCircleUp,
  Calendar,
  CaretLeft,
  CaretRight,
  CashRegister,
  CurrencyDollar,
  PencilSimple,
  Plus,
  TrashSimple,
} from "@phosphor-icons/react";
import * as Dialog from "@radix-ui/react-dialog";

import { ExcluirModal } from "../../components/ExcluirModal";
import Pagination from "../../components/Pagination";
import { EditarTransacaoModal } from "../../components/Transacao/EditarTransacaoModal";
import { NovaTransacaoModal } from "../../components/Transacao/NovaTransacaoModal";
import { useModal } from "../../hooks/useModal";
import { fetchSessoes } from "../../store/sessoesSlice";
import {
  type AppDispatch,
  selectEnhancedTransacoes,
  selectTransacoesSummary,
} from "../../store/store";
import { calculateTotals } from "../../store/totalsSlice";
import { deleteTransacao, fetchTransacoes } from "../../store/transacoesSlice";
import type { Transacao } from "../../tipos";
import { dateFormatter, priceFormatter } from "../../utils/formatter";

export function Transacoes() {
  const dispatch = useDispatch<AppDispatch>();
  const [dataAtual, setDataAtual] = useState<Date>(new Date());
  const month = dataAtual.getMonth();
  const year = dataAtual.getFullYear();
  const [searchValue, setSearchValue] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const transacoesPorPagina = 10;
  const {
    isModalOpen,
    modalMessage,
    isEditModalOpen,
    openModal,
    closeModal,
    openEditModal,
    closeEditModal,
  } = useModal();
  const [transacaoEditando, setTransacaoEditando] = useState<Transacao | null>(
    null,
  );
  const [transacaoParaExcluir, setTransacaoParaExcluir] = useState<
    string | null
  >(null);
  const [isSuccess, setIsSuccess] = useState(false);
  // Memoizar o seletor de resumo
  const transacoesSummarySelector = useMemo(
    () => selectTransacoesSummary(month, year),
    [month, year],
  );
  const summary = useSelector(transacoesSummarySelector);

  const enhancedTransacoesSelector = useMemo(
    () => selectEnhancedTransacoes(month, year, searchValue),
    [month, year, searchValue],
  );
  const enhancedTransacoes = useSelector(enhancedTransacoesSelector);

  // const enhancedTransacoes = useMemo(() => {
  //   const sessoesDoMes = sessoes.filter((sessao) => {
  //     const dataSessao = new Date(sessao.dtSessao1)
  //     return (
  //       dataSessao.getMonth() === dataAtual.getMonth() &&
  //       dataSessao.getFullYear() === dataAtual.getFullYear()
  //     )
  //   })

  //   const totaisMesAtual = sessoesDoMes.reduce(
  //     (acc, sessao) => {
  //       const calculations = calculateRepasseInfo(sessao)
  //       return {
  //         totalValue: acc.totalValue + calculations.totalValue,
  //         totalRepasse: acc.totalRepasse + calculations.repasseValue,
  //       }
  //     },
  //     { totalValue: 0, totalRepasse: 0 },
  //   )

  //   const mesAtual = format(dataAtual, 'MMMM', { locale: ptBR }).replace(
  //     /^\w/,
  //     (c) => c.toUpperCase(),
  //   )

  //   const totalSessoes: Transacao = {
  //     id: 'total-sessoes',
  //     descricao: `Sessões (${mesAtual})`,
  //     tipo: 'entrada',
  //     valor: totaisMesAtual.totalValue,
  //     dtCriacao: new Date(),
  //   }

  //   const totalRepasse: Transacao = {
  //     id: 'total-repasses',
  //     descricao: `Repasses (${mesAtual})`,
  //     tipo: 'saida',
  //     valor: totaisMesAtual.totalRepasse,
  //     dtCriacao: new Date(),
  //   }

  //   return [...transacoes, totalSessoes, totalRepasse]
  // }, [transacoes, sessoes, dataAtual])

  useEffect(() => {
    dispatch(fetchTransacoes());
    dispatch(fetchSessoes()).then(() => {
      dispatch(calculateTotals());
    });
  }, [dispatch]);

  const totalPages = Math.ceil(enhancedTransacoes.length / transacoesPorPagina);

  // useEffect(() => {
  //   if (loading || error) return

  //   const filteredTransacoes = enhancedTransacoes.filter((transacao) => {
  //     if (transacao.id.startsWith('total-')) return true
  //     const dataTransacao = new Date(transacao.dtCriacao)
  //     return (
  //       dataTransacao.getMonth() === dataAtual.getMonth() &&
  //       dataTransacao.getFullYear() === dataAtual.getFullYear() &&
  //       transacao.descricao.toLowerCase().includes(searchValue.toLowerCase())
  //     )
  //   })

  //   const newSummary = filteredTransacoes.reduce(
  //     (acc, transacao) => {
  //       if (transacao.tipo === 'entrada') {
  //         acc.entrada += transacao.valor
  //         acc.total += transacao.valor
  //       } else {
  //         acc.saida += transacao.valor
  //         acc.total -= transacao.valor
  //       }
  //       return acc
  //     },
  //     { entrada: 0, saida: 0, total: 0 },
  //   )

  //   setSummary(newSummary)
  //   setTotalPages(Math.ceil(filteredTransacoes.length / transacoesPorPagina))
  // }, [enhancedTransacoes, searchValue, dataAtual, loading, error])

  const handleMonthChange = (increment: number) => {
    setDataAtual(
      new Date(dataAtual.getFullYear(), dataAtual.getMonth() + increment, 1),
    );
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleEditTransacao = (transacao: Transacao) => {
    setTransacaoEditando(transacao);
    openEditModal();
  };

  const handleDeleteTransacao = async () => {
    if (!transacaoParaExcluir) return;

    try {
      await dispatch(deleteTransacao(transacaoParaExcluir)).unwrap();
      openModal("Transação excluída com sucesso!");
      setIsSuccess(true);
    } catch (error) {
      openModal("Erro ao excluir transação!");
      console.error("Erro ao excluir transação:", error);
    } finally {
      setTransacaoParaExcluir(null);
    }
  };

  const openModalExcluir = (message: string, transacaoId: string) => {
    openModal(message);
    setTransacaoParaExcluir(transacaoId);
    setIsSuccess(false);
  };

  const paginatedTransacoes = useMemo(() => {
    const startIndex = (currentPage - 1) * transacoesPorPagina;
    return enhancedTransacoes.slice(
      startIndex,
      startIndex + transacoesPorPagina,
    );
  }, [enhancedTransacoes, currentPage]);

  return (
    <div className="flex min-h-screen">
      <main className="flex-1 bg-gray-100 p-8">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Transações</h1>
            <Dialog.Root>
              <Dialog.Trigger asChild>
                <button
                  type="button"
                  className="flex items-center bg-azul text-white px-4 py-2 rounded hover:bg-sky-600 duration-150"
                >
                  <Plus size={20} weight="bold" className="mr-2" />
                  Nova Transação
                </button>
              </Dialog.Trigger>
              <NovaTransacaoModal />
            </Dialog.Root>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="flex items-center space-x-4 p-4 bg-white rounded shadow">
              <CashRegister size={24} />
              <input
                className="text-xl w-full text-gray-800 focus:outline-none"
                type="text"
                placeholder="Buscar transações..."
                value={searchValue}
                onChange={handleSearchChange}
              />
            </div>
            <div className="flex items-center space-x-1 p-4 bg-white rounded text-green-500">
              <ArrowCircleUp size={24} weight="fill" />
              <span className="text-xl">
                Entradas: <span>{priceFormatter.format(summary.entrada)}</span>
              </span>
            </div>
            <div className="flex items-center space-x-1 p-4 bg-white rounded shadow text-red-500">
              <ArrowCircleDown size={24} weight="fill" />
              <span className="text-xl">
                Saídas: <span>{priceFormatter.format(summary.saida)}</span>
              </span>
            </div>
            <div
              className={`flex items-center space-x-1 p-4 bg-white rounded shadow font-bold ${
                summary.total >= 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              <CurrencyDollar size={24} />
              <span className="text-xl">
                Total: <span>{priceFormatter.format(summary.total)}</span>
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 bg-white rounded shadow mb-4">
            <button
              type="button"
              onClick={() => handleMonthChange(-1)}
              aria-label="Mês anterior"
            >
              <CaretLeft size={24} weight="fill" />
            </button>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-semibold">
                {format(dataAtual, "MMMM yyyy", { locale: ptBR }).replace(
                  /^\w/,
                  (c) => c.toUpperCase(),
                )}
              </h2>
              <DatePicker
                selected={dataAtual}
                onChange={(date) => date && setDataAtual(date)}
                showMonthYearPicker
                dateFormat="MMMM yyyy"
                locale={ptBR}
                customInput={
                  <button type="button" aria-label="Selecionar mês e ano">
                    <Calendar size={28} className="text-gray-500 mt-2" />
                  </button>
                }
              />
            </div>
            <button
              type="button"
              onClick={() => handleMonthChange(1)}
              aria-label="Próximo mês"
            >
              <CaretRight size={24} weight="fill" />
            </button>
          </div>
          <div className="bg-white rounded shadow overflow-x-auto">
            <table className="w-full">
              <thead className="bg-rosa text-white">
                <tr>
                  <th className="p-4 text-left">Descrição</th>
                  <th className="p-4 text-left">Valor</th>
                  <th className="p-4 text-left">Data</th>
                  <th className="p-4 text-left">Ações</th>
                </tr>
              </thead>
              <tbody>
                {paginatedTransacoes.map((transacao) => {
                  const isTotal = transacao.id.startsWith("total-");
                  return (
                    <tr
                      key={transacao.id}
                      className={isTotal ? "bg-gray-100" : ""}
                    >
                      <td className="p-4">{transacao.descricao}</td>
                      <td
                        className={`p-4 ${transacao.tipo === "entrada" ? "text-green-500" : "text-red-500"}`}
                      >
                        <div className="flex items-center space-x-1">
                          {transacao.tipo === "entrada" ? (
                            <ArrowCircleUp
                              size={24}
                              color="rgb(34 197 94)"
                              weight="fill"
                            />
                          ) : (
                            <ArrowCircleDown
                              size={24}
                              color="rgb(239 68 68)"
                              weight="fill"
                            />
                          )}
                          <span>{priceFormatter.format(transacao.valor)}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        {isTotal
                          ? "-"
                          : dateFormatter.format(new Date(transacao.dtCriacao))}
                      </td>
                      <td className="p-2 space-x-2">
                        {!isTotal && (
                          <>
                            <button
                              type="button"
                              title="Editar Transação"
                              className="text-green-500 hover:text-green-700"
                              onClick={() => handleEditTransacao(transacao)}
                            >
                              <PencilSimple size={20} weight="bold" />
                            </button>
                            <button
                              type="button"
                              title="Excluir Transação"
                              className="text-red-500 hover:text-red-700"
                              onClick={() =>
                                openModalExcluir(
                                  "Deseja realmente excluir esta transação?",
                                  transacao.id,
                                )
                              }
                            >
                              <TrashSimple size={20} weight="bold" />
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
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
        title="Excluir  Transação"
        message={modalMessage}
        onConfirm={handleDeleteTransacao}
        isSuccess={isSuccess}
      />
      {transacaoEditando && (
        <EditarTransacaoModal
          transacaoId={transacaoEditando.id}
          open={isEditModalOpen}
          onClose={closeEditModal}
        />
      )}
    </div>
  );
}
