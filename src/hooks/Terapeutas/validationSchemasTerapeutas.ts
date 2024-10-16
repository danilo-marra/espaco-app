import { z } from 'zod'

export const NovoTerapeutaFormSchema = z.object({
  nomeTerapeuta: z.string().min(1, 'Nome do terapeuta é obrigatório'),
  telefoneTerapeuta: z.string(),
  emailTerapeuta: z.string().email('Email inválido'),
  enderecoTerapeuta: z.string(),
  curriculo: z.string(),
  chavePix: z.string(),
})

export const EditarTerapeutaFormSchema = z.object({
  id: z.string().uuid(),
  nomeTerapeuta: z.string().min(1, 'Nome do terapeuta é obrigatório'),
  telefoneTerapeuta: z.string(),
  emailTerapeuta: z.string().email('Email inválido'),
  enderecoTerapeuta: z.string(),
  curriculo: z.string(),
  chavePix: z.string(),
})

export type NovoTerapeutaFormInputs = z.infer<typeof NovoTerapeutaFormSchema>

export type EditarTerapeutaFormInputs = z.infer<
  typeof EditarTerapeutaFormSchema
>
