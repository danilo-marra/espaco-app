import { X } from '@phosphor-icons/react'
import axios from 'axios'
import * as Dialog from '@radix-ui/react-dialog'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { useEffect, useState } from 'react'
import 'react-datepicker/dist/react-datepicker.css'
import { useDispatch, useSelector } from 'react-redux'
import { updatePaciente, fetchPacientes } from '../../store/pacientesSlice'
import { updateTerapeuta, fetchTerapeutas } from '../../store/terapeutasSlice'
import type { Paciente } from '../../tipos'
import type { AppDispatch, RootState } from '../../store/store'

const EditarTerapeutaFormSchema = z.object({
  id: z.string(),
  nomeTerapeuta: z.string(),
  telefoneTerapeuta: z.string(),
  emailTerapeuta: z.string(),
  enderecoTerapeuta: z.string(),
  curriculo: z.string(),
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
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting },
  } = useForm<EditarTerapeutaFormInputs>({
    resolver: zodResolver(EditarTerapeutaFormSchema),
  })

  useEffect(() => {
    const terapeuta = terapeutas.find((t) => t.id === terapeutaId)
    if (terapeuta) {
      setValue('id', terapeuta.id)
      setValue('nomeTerapeuta', terapeuta.nomeTerapeuta)
      setValue('telefoneTerapeuta', terapeuta.telefoneTerapeuta)
      setValue('emailTerapeuta', terapeuta.emailTerapeuta)
      setValue('enderecoTerapeuta', terapeuta.enderecoTerapeuta)
      setValue('curriculo', terapeuta.curriculo)
      setValue('chavePix', terapeuta.chavePix)
    }
  }, [terapeutaId, terapeutas, setValue])

  async function handleEditTerapeuta(data: EditarTerapeutaFormInputs) {
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const terapeutaEditado = {
        id: data.id,
        nomeTerapeuta: data.nomeTerapeuta,
        telefoneTerapeuta: data.telefoneTerapeuta,
        emailTerapeuta: data.emailTerapeuta,
        enderecoTerapeuta: data.enderecoTerapeuta,
        curriculo: data.curriculo,
        chavePix: data.chavePix,
      }

      // Atualiza terapeuta no backend
      await axios.put(
        `http://localhost:3000/terapeutas/${data.id}`,
        terapeutaEditado,
      )

      // Atualiza terapeuta no estado do Redux
      dispatch(updateTerapeuta(terapeutaEditado))

      // Atualiza pacientes associados no backend
      const pacientesResponse = await fetch('http://localhost:3000/pacientes')
      const pacientes: Paciente[] = await pacientesResponse.json()

      const pacientesParaAtualizar = pacientes.filter(
        (paciente: Paciente) =>
          paciente.terapeutaInfo.id === terapeutaEditado.id,
      )

      await Promise.all(
        pacientesParaAtualizar.map((paciente: Paciente) =>
          fetch(`http://localhost:3000/pacientes/${paciente.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              ...paciente,
              terapeutaInfo: {
                ...paciente.terapeutaInfo,
                nomeTerapeuta: terapeutaEditado.nomeTerapeuta,
              },
            }),
          }),
        ),
      )

      // Atualiza pacientes no estado do Redux
      for (const paciente of pacientesParaAtualizar) {
        dispatch(
          updatePaciente({
            ...paciente,
            terapeutaInfo: terapeutaEditado,
          }),
        )
      }

      // Recarrega os terapeutas e pacientes
      dispatch(fetchTerapeutas())
      dispatch(fetchPacientes())

      reset()
      setMensagemSucesso('Terapeuta editado com sucesso!')
      setMensagemErro('')

      onClose()
    } catch (error) {
      console.error('Erro ao editar terapeuta:', error)
      setMensagemErro('Erro ao editar terapeuta. Tente novamente.')
      setMensagemSucesso('')
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
          <Dialog.Title className="text-azul m-0 text-xl font-medium mb-4">
            Editar Terapeuta
          </Dialog.Title>
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
                required
                {...register('nomeTerapeuta')}
                onFocus={handleFocus}
              />
              <input
                type="text"
                className="shadow-rosa/50 focus:shadow-rosa block w-full h-[40px] rounded-md px-4 text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                id="telefoneTerapeuta"
                placeholder="Telefone do terapeuta"
                required
                {...register('telefoneTerapeuta')}
                onFocus={handleFocus}
              />
              <input
                type="email"
                className="shadow-rosa/50 focus:shadow-rosa block w-full h-[40px] rounded-md px-4 text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                id="emailTerapeuta"
                placeholder="Email do terapeuta"
                required
                {...register('emailTerapeuta')}
                onFocus={handleFocus}
              />
              <input
                type="text"
                className="shadow-rosa/50 focus:shadow-rosa block w-full h-[40px] rounded-md px-4 text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                id="enderecoTerapeuta"
                placeholder="Endereço do terapeuta"
                required
                {...register('enderecoTerapeuta')}
                onFocus={handleFocus}
              />
              <input
                type="text"
                className="shadow-rosa/50 focus:shadow-rosa block w-full h-[40px] rounded-md px-4 text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                id="curriculo"
                placeholder="Curriculo"
                required
                {...register('curriculo')}
                onFocus={handleFocus}
              />
              <input
                type="text"
                className="shadow-rosa/50 focus:shadow-rosa block w-full h-[40px] rounded-md px-4 text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                id="chavePix"
                placeholder="Chave PIX"
                required
                {...register('chavePix')}
                onFocus={handleFocus}
              />
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                className="bg-azul text-white px-4 py-2 rounded hover:bg-sky-600 duration-150"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Salvando...' : 'Salvar'}
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
