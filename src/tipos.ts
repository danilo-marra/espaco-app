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
  nomePaciente: string
  dtNascimento: Date
  nomeResponsavel: string
  telefoneResponsavel: string
  emailResponsavel: string
  cpfResponsavel: string
  enderecoResponsavel: string
  origem: 'Indicação' | 'Instagram' | 'Busca no Google' | undefined
  nomeTerapeuta: string
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

// tipos.ts
export interface Transacao {
  id: string
  descricao: string
  valor: number
  tipo: 'entrada' | 'saida'
  dtCriacao: Date
}
