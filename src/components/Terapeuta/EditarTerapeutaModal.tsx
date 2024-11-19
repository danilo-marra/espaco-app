import { X } from '@phosphor-icons/react'
import * as Dialog from '@radix-ui/react-dialog'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../store/store'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { updateTerapeuta } from '../../store/terapeutasSlice'
import DatePicker from 'react-datepicker'
import { ptBR } from 'date-fns/locale'
import { maskPhone } from '@/utils/formatter'
import { toast } from 'sonner'

const EditarTerapeutaFormSchema = z.object({
  id: z.string().uuid(),
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

type EditarTerapeutaFormInputs = z.infer<typeof EditarTerapeutaFormSchema>

interface EditarTerapeutaModalProps {
  terapeutaId: string
  open: boolean
  onClose: () => void
}

export function EditarTerapeutaModal({
  terapeutaId,
  open,
  onClose,
}: EditarTerapeutaModalProps) {
  const dispatch = useDispatch<AppDispatch>()
  const terapeutas = useSelector((state: RootState) => state.terapeutas.data)
  const [mensagemSucesso, setMensagemSucesso] = useState('')
  const [mensagemErro, setMensagemErro] = useState('')

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<EditarTerapeutaFormInputs>({
    resolver: zodResolver(EditarTerapeutaFormSchema),
  })

  useEffect(() => {
    const terapeuta = terapeutas.find((t) => t.id === terapeutaId)
    if (terapeuta) {
      reset({
        id: terapeuta.id,
        nomeTerapeuta: terapeuta.nomeTerapeuta,
        telefoneTerapeuta: terapeuta.telefoneTerapeuta,
        emailTerapeuta: terapeuta.emailTerapeuta,
        enderecoTerapeuta: terapeuta.enderecoTerapeuta,
        dtEntrada: new Date(terapeuta.dtEntrada),
        chavePix: terapeuta.chavePix,
      })
    }
  }, [terapeutaId, terapeutas, reset])

  async function handleEditTerapeuta(data: EditarTerapeutaFormInputs) {
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const terapeutaEditado = {
        id: data.id,
        nomeTerapeuta: data.nomeTerapeuta,
        telefoneTerapeuta: data.telefoneTerapeuta,
        emailTerapeuta: data.emailTerapeuta,
        enderecoTerapeuta: data.enderecoTerapeuta,
        dtEntrada: data.dtEntrada,
        chavePix: data.chavePix,
      }

      await dispatch(updateTerapeuta(terapeutaEditado)).unwrap()

      reset()

      toast.success('Terapeuta atualizado com sucesso!')
      console.log('Terapeuta atualizado:', data)
      setMensagemErro('')
      onClose()
    } catch (error) {
      toast.error('Erro ao atualizar Terapeuta')
      setMensagemSucesso('')
      console.error('Erro ao atualizar Terapeuta:', error)
    }
  }

  function handleFocus() {
    setMensagemSucesso('')
    setMensagemErro('')
  }

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-gray-500/25 data-[state=open]:animate-overlayShow fixed inset-0" />
        <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[768px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
          <Dialog.Title className="sr-only">Editar Terapeuta</Dialog.Title>
          <Dialog.Description>
            <VisuallyHidden>Editar Terapeuta</VisuallyHidden>
          </Dialog.Description>
          <form
            onSubmit={handleSubmit(handleEditTerapeuta)}
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
                <p className="text-red-500">
                  {errors.telefoneTerapeuta.message}
                </p>
              )}
              <input
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
    </Dialog.Root>
  )
}
