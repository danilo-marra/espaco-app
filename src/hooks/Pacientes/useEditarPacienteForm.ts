import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../store/store'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { fetchTerapeutas } from '../../store/terapeutasSlice'
import { fetchPacientes, updatePaciente } from '../../store/pacientesSlice'
import {
  EditarPacienteFormSchema,
  type EditarPacienteFormInputs,
} from './validationSchemasPaciente'

export function useEditarPacienteForm(pacienteId: string) {
  const dispatch = useDispatch<AppDispatch>()
  const terapeutas = useSelector((state: RootState) => state.terapeutas.data)
  const pacientes = useSelector((state: RootState) => state.pacientes.data)
  const [mensagemSucesso, setMensagemSucesso] = useState('')
  const [mensagemErro, setMensagemErro] = useState('')
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<EditarPacienteFormInputs>({
    resolver: zodResolver(EditarPacienteFormSchema),
  })

  useEffect(() => {
    const paciente = pacientes.find((p) => p.id === pacienteId)
    if (paciente) {
      setValue('id', paciente.id)
      setValue('nomePaciente', paciente.nomePaciente)
      setValue('dtNascimento', new Date(paciente.dtNascimento).toISOString())
      setValue('nomeTerapeuta', paciente.terapeutaInfo.nomeTerapeuta)
      setValue('nomeResponsavel', paciente.nomeResponsavel)
      setValue('telefoneResponsavel', paciente.telefoneResponsavel)
      setValue('emailResponsavel', paciente.emailResponsavel)
      setValue('cpfResponsavel', paciente.cpfResponsavel)
      setValue('enderecoResponsavel', paciente.enderecoResponsavel)
      setValue('origem', paciente.origem ?? 'Indicação')
    }
  }, [pacienteId, pacientes, setValue])

  async function handleEditPaciente(data: EditarPacienteFormInputs) {
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const terapeutaInfo = terapeutas.find(
        (terapeuta) => terapeuta.nomeTerapeuta === data.nomeTerapeuta,
      )

      if (!terapeutaInfo) {
        throw new Error('Terapeuta não encontrado')
      }

      const pacienteEditado = {
        id: data.id,
        nomePaciente: data.nomePaciente,
        dtNascimento: new Date(data.dtNascimento).toISOString(),
        terapeutaInfo,
        nomeResponsavel: data.nomeResponsavel,
        telefoneResponsavel: data.telefoneResponsavel,
        emailResponsavel: data.emailResponsavel,
        cpfResponsavel: data.cpfResponsavel,
        enderecoResponsavel: data.enderecoResponsavel,
        origem: data.origem,
      }

      // Faz a requisição PUT para a API
      await axios.put(
        `http://localhost:3000/pacientes/${data.id}`,
        pacienteEditado,
      )

      // Atualiza paciente no estado do Redux
      dispatch(updatePaciente(pacienteEditado))

      // Recarrega os terapeutas e pacientes
      dispatch(fetchTerapeutas())
      dispatch(fetchPacientes())

      // Limpa os dados do formulário
      reset()

      return 'Paciente editado com sucesso!'
    } catch (error) {
      console.error('Erro ao editar paciente:', error)
      throw new Error('Erro ao editar paciente. Tente novamente.')
    }
  }

  function handleFocus() {
    setMensagemSucesso('')
    setMensagemErro('')
  }

  return {
    register,
    control,
    errors,
    handleSubmit,
    handleEditPaciente,
    isSubmitting,
    mensagemSucesso,
    mensagemErro,
    handleFocus,
    setMensagemSucesso,
    setMensagemErro,
    terapeutas,
  }
}
