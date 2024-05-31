// tipos.ts
// export interface Sessao {
//   data: string
//   terapeuta: string
//   status: string
// }

// export interface Paciente {
//   nome: string
//   sessoes: Sessao[]
//   totalPago: number
//   totalDevido: number
// }

export interface Paciente {
  nome: string
  responsavel: string
  cpfResponsavel: string
  endereco: string
}

export interface SessaoDt {
  dtSessao1?: Date
  dtSessao2?: Date
  dtSessao3?: Date
  dtSessao4?: Date
  dtSessao5?: Date
  dtSessao6?: Date
}

// Interface de Sessão do Paciente
export interface SessaoPaciente {
  id: string
  pacienteInfo: Paciente
  valor: number
  notaFiscal: boolean
  sessoesDt?: SessaoDt[]
  psicologa: string
}
