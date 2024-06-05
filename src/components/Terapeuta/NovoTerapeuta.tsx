import { useEffect } from 'react'
import Modal from 'react-modal'
import { useForm, SubmitHandler } from 'react-hook-form'
import { Terapeuta } from '../../tipos'
import { v4 as uuidv4 } from 'uuid'
import InputMask from 'react-input-mask'

Modal.setAppElement('#root')

interface NovoTerapeutaProps {
  isOpen: boolean
  onClose: () => void
  onSave: (terapeuta: Terapeuta) => void
  terapeuta?: Terapeuta
}

type FormData = Omit<Terapeuta, 'id'>

export function NovoTerapeuta({
  isOpen,
  onClose,
  onSave,
  terapeuta,
}: NovoTerapeutaProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormData>()

  useEffect(() => {
    if (terapeuta) {
      setValue('nome', terapeuta.nome)
      setValue('email', terapeuta.email)
      setValue('telefone', terapeuta.telefone)
      setValue('endereco', terapeuta.endereco)
      setValue('curriculo', terapeuta.curriculo) // Adicione esta linha
      setValue('chavePix', terapeuta.chavePix) // Adicione esta linha
    } else {
      reset()
    }
  }, [terapeuta, setValue, reset])

  const onSubmit: SubmitHandler<FormData> = (data) => {
    const novoTerapeuta: Terapeuta = {
      id: terapeuta ? terapeuta.id : uuidv4(),
      ...data,
    }
    onSave(novoTerapeuta)
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="fixed inset-0 flex items-center justify-center z-50"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50"
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-azul">
          {terapeuta ? 'Editar Terapeuta' : 'Adicionar Novo Terapeuta'}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label
              htmlFor="nome"
              className="block text-sm font-medium text-gray-700"
            >
              Nome do Terapeuta:
            </label>
            <input
              id="nome"
              type="text"
              {...register('nome', { required: 'Nome é obrigatório' })}
              className="mt-1 block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-2 border-indigo-300"
            />
            {errors.nome && (
              <p className="text-red-500 text-xs mt-1">{errors.nome.message}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email:
            </label>
            <input
              id="email"
              type="email"
              {...register('email', {
                required: 'Email é obrigatório',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Email inválido',
                },
              })}
              className="mt-1 block w-full rounded-md shadow-sm focus:ring-indigo-500 focus: border-2 border-indigo-300"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="telefone"
              className="block text-sm font-medium text-gray-700"
            >
              Telefone:
            </label>
            <InputMask
              id="telefone"
              mask="(99) 99999-9999"
              type="text"
              {...register('telefone', {
                required: 'Telefone é obrigatório',
                pattern: {
                  value: /^\(\d{2}\) \d{5}-\d{4}$/,
                  message:
                    'Telefone inválido. Formato esperado: (12) 34567-8910',
                },
              })}
              className="mt-1 block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-2 border-indigo-300"
            />
            {errors.telefone && (
              <p className="text-red-500 text-xs mt-1">
                {errors.telefone.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="endereco"
              className="block text-sm font-medium text-gray-700"
            >
              Endereço:
            </label>
            <input
              id="endereco"
              type="text"
              {...register('endereco', { required: 'Endereço é obrigatório' })}
              className="mt-1 block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-2 border-indigo-300"
            />
            {errors.endereco && (
              <p className="text-red-500 text-xs mt-1">
                {errors.endereco.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="curriculo"
              className="block text-sm font-medium text-gray-700"
            >
              Currículo:
            </label>
            <input
              id="curriculo"
              type="file"
              {...register('curriculo')}
              className="mt-1 block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-2 border-indigo-300"
            />
            {errors.curriculo && (
              <p className="text-red-500 text-xs mt-1">
                {errors.curriculo.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="chavePix"
              className="block text-sm font-medium text-gray-700"
            >
              Chave Pix:
            </label>
            <input
              id="chavePix"
              type="text"
              {...register('chavePix', { required: 'Chave Pix é obrigatória' })}
              className="mt-1 block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-2 border-indigo-300"
            />
            {errors.chavePix && (
              <p className="text-red-500 text-xs mt-1">
                {errors.chavePix.message}
              </p>
            )}
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-rosa border border-transparent rounded-md shadow-sm hover:bg-pink-950 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-950"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </Modal>
  )
}
