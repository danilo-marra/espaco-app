import type { Sessao } from "../tipos";

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

export function calculateRepasseInfo(sessao: Sessao): SessaoCalculations {
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
}
