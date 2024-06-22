export interface Terapeuta {
  id: string
  nome: string
  telefone: string
  email: string
  endereco: string
  curriculo: string
  chavePix: string
}
export interface Paciente {
  id: string
  nome: string
  responsavel: string
  telefone: string
  email: string
  cpfResponsavel: string
  endereco: string
  origem: 'Indicação' | 'Instagram' | 'Busca no Google' | undefined
  terapeuta: Terapeuta
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
}

export interface Transacao {
  id: number
  descricao: string
  tipo: 'entrada' | 'saida'
  valor: number
  dtCriacao: 'string'
}
