import { z } from 'zod'

export const NovoPacienteFormSchema = z.object({
  nomePaciente: z.string().min(1, 'Nome do paciente é obrigatório'),
  dtNascimento: z.string().min(1, 'Data de nascimento é obrigatória'),
  nomeTerapeuta: z.string().min(1, 'Selecione um(a) terapeuta'),
  nomeResponsavel: z.string(),
  telefoneResponsavel: z.string(),
  emailResponsavel: z.string(),
  cpfResponsavel: z.string(),
  enderecoResponsavel: z.string(),
  origem: z.enum(['Indicação', 'Instagram', 'Busca no Google', 'Outros']),
})

export const EditarPacienteFormSchema = z.object({
  id: z.string(),
  nomePaciente: z.string().min(1, 'Nome do paciente é obrigatório'),
  dtNascimento: z.string().min(1, 'Data de nascimento é obrigatória'),
  nomeTerapeuta: z.string().min(1, 'Selecione um(a) terapeuta'),
  nomeResponsavel: z.string(),
  telefoneResponsavel: z.string(),
  emailResponsavel: z.string(),
  cpfResponsavel: z.string(),
  enderecoResponsavel: z.string(),
  origem: z.enum(['Indicação', 'Instagram', 'Busca no Google', 'Outros']),
})

export type NovoPacienteFormInputs = z.infer<typeof NovoPacienteFormSchema>

export type EditarPacienteFormInputs = z.infer<typeof EditarPacienteFormSchema>
