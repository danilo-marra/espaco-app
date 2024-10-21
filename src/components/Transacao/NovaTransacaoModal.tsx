import { X } from '@phosphor-icons/react'
import * as Dialog from '@radix-ui/react-dialog'
import * as RadioGroup from '@radix-ui/react-radio-group'
import { Controller, useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { ptBR } from 'date-fns/locale'
import { v4 as uuidv4 } from 'uuid'
import { useDispatch } from 'react-redux'
import { addTransacao } from '../../store/transacoesSlice'
import type { AppDispatch } from '../../store/store'

const NovaTransacaoFormSchema = z.object({
  descricao: z.string(),
  valor: z.number(),
  tipo: z.enum(['entrada', 'saida']),
  data: z.date(),
})

type NovaTransacaoFormInputs = z.infer<typeof NovaTransacaoFormSchema>

export function NovaTransacaoModal() {
  const dispatch = useDispatch<AppDispatch>()
  const [mensagemSucesso, setMensagemSucesso] = useState('')
  const [mensagemErro, setMensagemErro] = useState('')
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<NovaTransacaoFormInputs>({
    resolver: zodResolver(NovaTransacaoFormSchema),
  })

  async function handleCreateNewTransacao(data: NovaTransacaoFormInputs) {
    try {
      // Simula um atraso de 2 segundos
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const novaTransacao = {
        id: uuidv4(),
        descricao: data.descricao,
        tipo: data.tipo,
        valor: data.valor,
        dtCriacao: data.data,
      }

      // Faz o dispatch do thunk addTransacao
      await dispatch(addTransacao(novaTransacao)).unwrap()

      // Limpa os dados do formulário
      reset()

      // Define a mensagem de sucesso
      setMensagemSucesso('Transação criada com sucesso!')
      setMensagemErro('') // Limpa a mensagem de erro, se houver

      console.log('Transação criada:', data)
    } catch (error) {
      console.error('Erro ao criar transação:', error)
      setMensagemErro('Erro ao criar transação. Tente novamente.')
      setMensagemSucesso('') // Limpa a mensagem de sucesso, se houver
    }
  }

  function handleFocus() {
    setMensagemSucesso('')
    setMensagemErro('')
  }

  return (
    <Dialog.Portal>
      <Dialog.Overlay className="bg-gray-500/25 data-[state=open]:animate-overlayShow fixed inset-0" />
      <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
        <Dialog.Title className="text-rosa m-0 text-xl font-medium text-center mb-4">
          Cadastrar Nova Transação
        </Dialog.Title>
        <Dialog.Description>
          <VisuallyHidden>Cadastrar Nova Transação</VisuallyHidden>
        </Dialog.Description>
        <form onSubmit={handleSubmit(handleCreateNewTransacao)}>
          <fieldset className="mb-4 flex items-center gap-5">
            <input
              type="text"
              className="text-rosa shadow-rosa/50 focus:shadow-rosa inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
              id="descricao"
              placeholder="Descrição"
              required
              {...register('descricao')}
              onFocus={handleFocus}
            />
            <input
              type="number"
              className="text-rosa shadow-rosa/50 focus:shadow-rosa inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
              id="valor"
              placeholder="Valor"
              required
              {...register('valor', { valueAsNumber: true })}
              onFocus={handleFocus}
            />
            <Controller
              control={control}
              name="data"
              render={({ field }) => (
                <DatePicker
                  className="text-rosa shadow-rosa/50 focus:shadow-rosa inline-flex h-[35px]  flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px] max-w-36"
                  id="data"
                  placeholderText="Data"
                  selected={field.value}
                  onChange={(date) => field.onChange(date)}
                  dateFormat="dd/MM/yyyy"
                  locale={ptBR}
                  onFocus={handleFocus}
                  autoComplete="off"
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                />
              )}
            />
          </fieldset>

          <Controller
            control={control}
            name="tipo"
            render={({ field }) => (
              <RadioGroup.Root
                className="flex items-center justify-evenly"
                onValueChange={(value) => {
                  field.onChange(value)
                  handleFocus()
                }}
                value={field.value}
              >
                <div className="flex items-center gap-2">
                  <RadioGroup.Item
                    className="w-[20px] h-[20px] border border-rosa rounded-full flex items-center justify-center"
                    value="entrada"
                    id="entrada"
                  >
                    <RadioGroup.Indicator className="w-[10px] h-[10px] bg-green-500 rounded-full" />
                  </RadioGroup.Item>
                  <label
                    className="text-black text-[17px] leading-none"
                    htmlFor="entrada"
                  >
                    Entrada
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <RadioGroup.Item
                    className="w-[20px] h-[20px] border border-rosa rounded-full flex items-center justify-center"
                    value="saida"
                    id="saida"
                  >
                    <RadioGroup.Indicator className="w-[10px] h-[10px] bg-red-500 rounded-full" />
                  </RadioGroup.Item>
                  <label
                    className="text-black text-[17px] leading-none"
                    htmlFor="saida"
                  >
                    Saída
                  </label>
                </div>
              </RadioGroup.Root>
            )}
          />

          <div className="mt-[25px] flex justify-end">
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
