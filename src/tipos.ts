export interface Paciente {
  id: string
  nome: string
  responsavel: string
  telefone: string
  email: string
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

export interface SessaoPaciente {
  pacienteInfo: Paciente
  valor: number
  planoSaude: boolean
  notaFiscalEmitida: boolean
  notaFiscalEnviada: boolean
  sessoesDt?: SessaoDt[]
  psicologa: string
}

export interface Terapeuta {
  id: string
  nome: string
  telefone: string
  email: string
  endereco: string
  curriculo: string
  chavePix: string
}
