import { useEffect, useState } from 'react'
import Modal from 'react-modal'
import { useForm, SubmitHandler } from 'react-hook-form'
import { Paciente, Terapeuta } from '../../tipos'
import { v4 as uuidv4 } from 'uuid'
import InputMask from 'react-input-mask'

Modal.setAppElement('#root')

interface NovoPacienteProps {
  isOpen: boolean
  onClose: () => void
  onSave: (paciente: Paciente) => void
  paciente?: Paciente
  terapeutas: Terapeuta[]
}

type FormData = Omit<Paciente, 'id'>

export function NovoPaciente({
  isOpen,
  onClose,
  onSave,
  paciente,
  terapeutas,
}: NovoPacienteProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormData>()

  const [selectedTerapeuta, setSelectedTerapeuta] = useState<Terapeuta | null>(
    null,
  )

  useEffect(() => {
    if (paciente) {
      setValue('nome', paciente.nome)
      setValue('responsavel', paciente.responsavel)
      setValue('telefone', paciente.telefone)
      setValue('email', paciente.email)
      setValue('cpfResponsavel', paciente.cpfResponsavel)
      setValue('endereco', paciente.endereco)
      setValue('origem', paciente.origem)
      setSelectedTerapeuta(paciente.terapeuta)
    } else {
      reset()
    }
  }, [paciente, setValue, reset])

  const [error, setError] = useState<string | null>(null)

  const onSubmit: SubmitHandler<FormData> = (data) => {
    if (selectedTerapeuta !== null) {
      const novoPaciente: Paciente = {
        id: paciente ? paciente.id : uuidv4(),
        ...data,
        terapeuta: selectedTerapeuta,
      }

      onSave(novoPaciente)
    } else if (selectedTerapeuta === null) {
      setError('Selecione um(a) terapeuta antes de salvar.')
    }
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
          {paciente ? 'Editar Paciente' : 'Adicionar Novo Paciente'}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label
              htmlFor="nome"
              className="block text-sm font-medium text-gray-700"
            >
              Nome do Paciente:
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
              htmlFor="responsavel"
              className="block text-sm font-medium text-gray-700"
            >
              Responsável:
            </label>
            <input
              id="responsavel"
              type="text"
              {...register('responsavel', {
                required: 'Responsável é obrigatório',
              })}
              className="mt-1 block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-2 border-indigo-300"
            />
            {errors.responsavel && (
              <p className="text-red-500 text-xs mt-1">
                {errors.responsavel.message}
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
              className="mt-1 block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-2 border-indigo-300"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="cpfResponsavel"
              className="block text-sm font-medium text-gray-700"
            >
              CPF do Responsável:
            </label>
            <InputMask
              id="cpfResponsavel"
              mask="999.999.999-99"
              type="text"
              {...register('cpfResponsavel', {
                required: 'CPF é obrigatório',
                pattern: {
                  value: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
                  message: 'CPF inválido. Formato esperado: 123.456.789-00',
                },
              })}
              className="mt-1 block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-2 border-indigo-300"
            />
            {errors.cpfResponsavel && (
              <p className="text-red-500 text-xs mt-1">
                {errors.cpfResponsavel.message}
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
            <textarea
              id="endereco"
              {...register('endereco', {
                required: 'Endereço é obrigatório',
              })}
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
              className="block text-sm font-medium text-gray-700"
              htmlFor="origem"
            >
              Origem:
            </label>
            <select
              {...register('origem', { required: 'Selecione a origem' })}
              id="origem"
              className="mt-1 block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-2 border-indigo-300"
            >
              <option value="">Selecione</option>
              <option value="Indicação">Indicação</option>
              <option value="Instagram">Instagram</option>
              <option value="Busca no Google">Busca no Google</option>
              <option value="Outros">Outros</option>
            </select>
            {errors.origem && (
              <p className="text-red-500 text-xs mt-1">
                {errors.origem.message}
              </p>
            )}
          </div>
          <div>
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="terapeuta"
            >
              Selecionar terapeuta:
            </label>
            <select
              id="terapeuta"
              className="mt-1 block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-2 border-indigo-300"
              value={selectedTerapeuta ? selectedTerapeuta.id : ''}
              onChange={(e) => {
                const selectedId = e.target.value
                const selected = terapeutas.find(
                  (terapeuta) => terapeuta.id === selectedId,
                )
                setSelectedTerapeuta(selected || null)
              }}
            >
              <option value="" disabled>
                Selecione
              </option>
              {terapeutas.map((terapeuta) => (
                <option key={terapeuta.id} value={terapeuta.id}>
                  {terapeuta.nome}
                </option>
              ))}
            </select>
            {error && <p className="text-red-500">{error}</p>}
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
