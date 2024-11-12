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
  dtNascimento: Date
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
  statusSessao:
    | 'Pagamento Pendente'
    | 'Pagamento Realizado'
    | 'Nota Fiscal Emitida'
    | 'Nota Fiscal Enviada'
    | undefined
  valorSessao: number
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

export interface Agendamento {
  id: string
  recurrenceId?: string
  terapeutaInfo: Terapeuta
  pacienteInfo: Paciente
  dataAgendamento: Date
  horarioAgendamento: string
  localAgendamento: 'Sala Verde' | 'Sala Azul' | 'Não Precisa de Sala'
  modalidadeAgendamento: 'Presencial' | 'Online'
  tipoAgendamento:
    | 'Sessão'
    | 'Orientação Parental'
    | 'Visita Escolar'
    | 'Reunião Escolar'
    | 'Supervisão'
    | 'Outros'
  statusAgendamento: 'Confirmado' | 'Remarcado' | 'Cancelado'
  observacoesAgendamento: string
}
