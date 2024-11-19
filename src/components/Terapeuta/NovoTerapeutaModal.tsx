import { X } from '@phosphor-icons/react'
import * as Dialog from '@radix-ui/react-dialog'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import type { AppDispatch } from '../../store/store'
import { useDispatch } from 'react-redux'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { v4 as uuidv4 } from 'uuid'
import { addTerapeuta } from '../../store/terapeutasSlice'
import DatePicker from 'react-datepicker'
import { ptBR } from 'date-fns/locale'
import { maskPhone } from '@/utils/formatter'

const NovoTerapeutaFormSchema = z.object({
  nomeTerapeuta: z.string().min(1, 'Nome do terapeuta é obrigatório'),
  telefoneTerapeuta: z
    .string()
    .min(14, 'Telefone é obrigatório')
    .regex(/^\(\d{2}\) \d{4,5}-\d{4}$/),
  emailTerapeuta: z.string().email('Email inválido'),
  enderecoTerapeuta: z.string(),
  dtEntrada: z.date().refine((data) => data <= new Date(), {
    message: 'Data de entrada não pode ser maior que a data atual',
  }),
  chavePix: z.string(),
})

type NovoTerapeutaFormInputs = z.infer<typeof NovoTerapeutaFormSchema>

export function NovoTerapeutaModal() {
  const dispatch = useDispatch<AppDispatch>()
  const [mensagemSucesso, setMensagemSucesso] = useState('')
  const [mensagemErro, setMensagemErro] = useState('')
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<NovoTerapeutaFormInputs>({
    resolver: zodResolver(NovoTerapeutaFormSchema),
  })

  async function handleCreateNewTerapeuta(data: NovoTerapeutaFormInputs) {
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const novoTerapeuta = {
        id: uuidv4(),
        nomeTerapeuta: data.nomeTerapeuta,
        telefoneTerapeuta: data.telefoneTerapeuta,
        emailTerapeuta: data.emailTerapeuta,
        enderecoTerapeuta: data.enderecoTerapeuta,
        dtEntrada: data.dtEntrada,
        chavePix: data.chavePix,
      }

      // Faz o dispatch do thunk addTerapeuta
      await dispatch(addTerapeuta(novoTerapeuta)).unwrap()

      // Limpa os dados do formulário
      reset()

      setMensagemSucesso('Terapeuta cadastrado com sucesso!')
      setMensagemErro('') // Limpa a mensagem de erro, se houver

      console.log('Terapeuta criado:', data)
    } catch (error) {
      console.error('Erro ao cadastrar Terapeuta:', error)
      setMensagemErro('Erro ao cadastrar Terapeuta. Tente novamente.')
      setMensagemSucesso('')
    }
  }

  function handleFocus() {
    setMensagemSucesso('')
    setMensagemErro('')
  }

  return (
    <Dialog.Portal>
      <Dialog.Overlay className="bg-gray-500/25 data-[state=open]:animate-overlayShow fixed inset-0" />
      <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[768px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
        <Dialog.Title className="sr-only">
          Cadastrar Novo Terapeuta
        </Dialog.Title>
        <Dialog.Description>
          <VisuallyHidden>Cadastrar Novo Terapeuta</VisuallyHidden>
        </Dialog.Description>
        <form
          onSubmit={handleSubmit(handleCreateNewTerapeuta)}
          className="space-y-6 p-6 bg-white rounded-lg"
        >
          <h3 className="font-medium text-azul text-xl mt-6">
            Dados do Terapeuta
          </h3>
          <div className="space-y-4">
            <input
              type="text"
              className="shadow-rosa/50 focus:shadow-rosa block w-full h-[40px] rounded-md px-4 text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
              id="nomeTerapeuta"
              placeholder="Nome do terapeuta"
              {...register('nomeTerapeuta')}
              onFocus={handleFocus}
            />
            {errors.nomeTerapeuta && (
              <p className="text-red-500">{errors.nomeTerapeuta.message}</p>
            )}
            <input
              type="text"
              className="shadow-rosa/50 focus:shadow-rosa block w-full h-[40px] rounded-md px-4 text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
              id="telefoneTerapeuta"
              placeholder="Telefone do terapeuta"
              {...register('telefoneTerapeuta', {
                onChange: (e) => {
                  const masked = maskPhone(e.target.value)
                  e.target.value = masked
                },
              })}
              onFocus={handleFocus}
            />
            {errors.telefoneTerapeuta && (
              <p className="text-red-500">{errors.telefoneTerapeuta.message}</p>
            )}
            <input
              type="email"
              className="shadow-rosa/50 focus:shadow-rosa block w-full h-[40px] rounded-md px-4 text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
              id="emailTerapeuta"
              placeholder="Email do terapeuta"
              {...register('emailTerapeuta')}
              onFocus={handleFocus}
            />
            {errors.emailTerapeuta && (
              <p className="text-red-500">{errors.emailTerapeuta.message}</p>
            )}
            <input
              type="text"
              className="shadow-rosa/50 focus:shadow-rosa block w-full h-[40px] rounded-md px-4 text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
              id="enderecoTerapeuta"
              placeholder="Endereço do terapeuta"
              {...register('enderecoTerapeuta')}
              onFocus={handleFocus}
            />
            <Controller
              control={control}
              name="dtEntrada"
              render={({ field }) => (
                <DatePicker
                  className="shadow-rosa/50 focus:shadow-rosa block w-full h-[40px] rounded-md px-4 text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                  id="dtEntrada"
                  placeholderText="Data de entrada"
                  selected={field.value}
                  onChange={(date) => field.onChange(date)}
                  dateFormat={'dd/MM/yyyy'}
                  locale={ptBR}
                  onFocus={handleFocus}
                  autoComplete="off"
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                />
              )}
            />

            {errors.dtEntrada && (
              <p className="text-red-500">{errors.dtEntrada.message}</p>
            )}
            <input
              type="text"
              className="shadow-rosa/50 focus:shadow-rosa block w-full h-[40px] rounded-md px-4 text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
              id="chavePix"
              placeholder="Chave PIX"
              {...register('chavePix')}
              onFocus={handleFocus}
            />
          </div>
          <div className="mt-6 flex justify-end">
            <button
              className={`bg-azul text-branco hover:bg-azul/75 focus:shadow-azul inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none focus:shadow-[0_0_0_2px] focus:outline-none ${
                isSubmitting ? 'cursor-not-allowed' : ''
              }`}
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Carregando...' : 'Confirmar'}
            </button>
          </div>
        </form>
        {mensagemSucesso && (
          <div className="mt-4 text-green-500 text-center">
            {mensagemSucesso}
          </div>
        )}
        {mensagemErro && (
          <div className="mt-4 text-red-500 text-center">{mensagemErro}</div>
        )}
        <Dialog.Close
          className="text-rosa hover:bg-rosa/50 focus:shadow-azul absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
          aria-label="Close"
        >
          <X />
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  )
}
