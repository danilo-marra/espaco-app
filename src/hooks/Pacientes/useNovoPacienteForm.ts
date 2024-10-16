import { useState } from 'react'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { v4 as uuidv4 } from 'uuid'
import { useDispatch, useSelector } from 'react-redux'
import { addPaciente } from '../../store/pacientesSlice'
import {
  NovoPacienteFormSchema,
  type NovoPacienteFormInputs,
} from './validationSchemasPaciente'
import type { AppDispatch, RootState } from '../../store/store'

export function useNovoPacienteForm() {
  const dispatch = useDispatch<AppDispatch>()
  const terapeutas = useSelector((state: RootState) => state.terapeutas.data)
  const [mensagemSucesso, setMensagemSucesso] = useState('')
  const [mensagemErro, setMensagemErro] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { isSubmitting, errors },
  } = useForm<NovoPacienteFormInputs>({
    resolver: zodResolver(NovoPacienteFormSchema),
  })

  async function handleCreateNewPaciente(data: NovoPacienteFormInputs) {
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const terapeutaSelecionado = terapeutas.find(
        (terapeuta) => terapeuta.nomeTerapeuta === data.nomeTerapeuta,
      )

      if (!terapeutaSelecionado) {
        throw new Error('Terapeuta não encontrado')
      }

      const novoPaciente = {
        id: uuidv4(),
        nomePaciente: data.nomePaciente,
        dtNascimento: new Date(data.dtNascimento).toISOString(),
        terapeutaInfo: terapeutaSelecionado,
        nomeResponsavel: data.nomeResponsavel,
        telefoneResponsavel: data.telefoneResponsavel,
        emailResponsavel: data.emailResponsavel,
        cpfResponsavel: data.cpfResponsavel,
        enderecoResponsavel: data.enderecoResponsavel,
        origem: data.origem,
      }

      await axios.post('http://localhost:3000/pacientes', novoPaciente)

      dispatch(addPaciente(novoPaciente))

      reset()
      setMensagemSucesso('Paciente cadastrado com sucesso!')
      setMensagemErro('')
    } catch (error) {
      console.error('Erro ao cadastrar Paciente:', error)
      setMensagemErro('Erro ao cadastrar Paciente. Tente novamente.')
      setMensagemSucesso('')
    }
  }

  function handleFocus() {
    setMensagemSucesso('')
    setMensagemErro('')
  }

  return {
    register,
    errors,
    handleSubmit,
    handleCreateNewPaciente,
    isSubmitting,
    mensagemSucesso,
    mensagemErro,
    handleFocus,
    terapeutas,
    control,
  }
}
