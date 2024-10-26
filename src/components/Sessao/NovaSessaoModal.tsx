import { X } from '@phosphor-icons/react'
import * as Dialog from '@radix-ui/react-dialog'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../store/store'
import { useEffect } from 'react'
import { fetchPacientes } from '../../store/pacientesSlice'
import { fetchTerapeutas } from '../../store/terapeutasSlice'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

// Schema de validação
const novaSessaoFormSchema = z.object({
  terapeutaId: z.string().min(1, 'Selecione um terapeuta'),
  pacienteId: z.string().min(1, 'Selecione um paciente'),
})

type NovaSessaoFormInputs = z.infer<typeof novaSessaoFormSchema>

export function NovaSessaoModal() {
  const dispatch = useDispatch<AppDispatch>()
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<NovaSessaoFormInputs>({
    resolver: zodResolver(novaSessaoFormSchema),
  })

  const terapeutas = useSelector((state: RootState) => state.terapeutas.data)
  const pacientes = useSelector((state: RootState) => state.pacientes.data)

  const pacienteId = watch('pacienteId')
  const pacienteSelecionado = pacientes.find(
    (paciente) => paciente.id === pacienteId,
  )

  useEffect(() => {
    dispatch(fetchPacientes())
    dispatch(fetchTerapeutas())
  }, [dispatch])

  async function handleCreateNewSessao(data: NovaSessaoFormInputs) {
    try {
      // Aqui você implementaria a lógica de criar a sessão
      await new Promise((resolve) => setTimeout(resolve, 2000))
      reset() // Limpa o formulário após sucesso
      // Adicionar notificação de sucesso
    } catch (error) {
      console.error('Erro ao criar nova sessão:', error)
      // Adicionar notificação de erro
    }
  }

  return (
    <Dialog.Portal>
      <Dialog.Overlay className="bg-gray-500/25 data-[state=open]:animate-overlayShow fixed inset-0" />
      <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[768px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
        <Dialog.Title className="text-2xl font-bold text-azul mb-6">
          Nova Sessão
        </Dialog.Title>

        <form
          onSubmit={handleSubmit(handleCreateNewSessao)}
          className="space-y-6 bg-white rounded-lg"
        >
          <div>
            <h3 className="font-medium text-azul text-xl mb-4">
              Dados do Terapeuta
            </h3>
            <div className="space-y-2">
              <select
                className={`shadow-rosa/50 focus:shadow-rosa block w-full h-[40px] rounded-md px-4 text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px] ${
                  errors.terapeutaId ? 'border-red-500' : ''
                }`}
                {...register('terapeutaId')}
              >
                <option value="">Selecione um terapeuta</option>
                {terapeutas.map((terapeuta) => (
                  <option key={terapeuta.id} value={terapeuta.id}>
                    {terapeuta.nomeTerapeuta}
                  </option>
                ))}
              </select>
              {errors.terapeutaId && (
                <p className="text-red-500 text-sm">
                  {errors.terapeutaId.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-medium text-azul text-xl mb-4">
              Dados do Paciente
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <select
                  className={`shadow-rosa/50 focus:shadow-rosa block w-full h-[40px] rounded-md px-4 text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px] ${
                    errors.pacienteId ? 'border-red-500' : ''
                  }`}
                  {...register('pacienteId')}
                >
                  <option value="">Selecione um paciente</option>
                  {pacientes.map((paciente) => (
                    <option key={paciente.id} value={paciente.id}>
                      {paciente.nomePaciente}
                    </option>
                  ))}
                </select>
                {errors.pacienteId && (
                  <p className="text-red-500 text-sm">
                    {errors.pacienteId.message}
                  </p>
                )}
              </div>

              <input
                type="text"
                disabled
                className="shadow-rosa/50 focus:shadow-rosa block w-full h-[40px] rounded-md px-4 text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px] bg-gray-100"
                placeholder="Nome do Responsável"
                value={pacienteSelecionado?.nomeResponsavel || ''}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-rosa hover:bg-rosa/90 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Salvando...' : 'Salvar'}
          </button>
        </form>

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
