export interface Terapeuta {
  id: string
  nomeTerapeuta: string
  telefoneTerapeuta: string
  emailTerapeuta: string
  enderecoTerapeuta: string
  dtEntrada: Date
  chavePix: string
}
export interface Paciente {
  id: string
  nomePaciente: string
  dtNascimento: string
  terapeutaInfo: Terapeuta
  nomeResponsavel: string
  telefoneResponsavel: string
  emailResponsavel: string
  cpfResponsavel: string
  enderecoResponsavel: string
  origem: 'Indicação' | 'Instagram' | 'Busca no Google' | 'Outros' | undefined
}

export interface Sessao {
  id: string
  terapeutaInfo: Terapeuta
  pacienteInfo: Paciente
  valorSessao: number
  notaFiscal: 'Emitida' | 'Enviada' | undefined
  dtSessao1: Date
  dtSessao2?: Date
  dtSessao3?: Date
  dtSessao4?: Date
  dtSessao5?: Date
  dtSessao6?: Date
}

export interface Transacao {
  id: string
  descricao: string
  valor: number
  tipo: 'entrada' | 'saida'
  dtCriacao: Date
}

export interface Agenda {
  id: string
  terapeutaInfo: Terapeuta
}
