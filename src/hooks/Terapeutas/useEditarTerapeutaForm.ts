import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import type { AppDispatch, RootState } from '../../store/store'
import type { Paciente, Terapeuta } from '../../tipos'
import { fetchTerapeutas, updateTerapeuta } from '../../store/terapeutasSlice'
import { fetchPacientes, updatePaciente } from '../../store/pacientesSlice'
import {
  EditarTerapeutaFormSchema,
  type EditarTerapeutaFormInputs,
} from './validationSchemasTerapeutas'

export function useEditarTerapeutaForm(terapeutaId: string) {
  const dispatch = useDispatch<AppDispatch>()
  const terapeutas = useSelector((state: RootState) => state.terapeutas.data)
  const [mensagemSucesso, setMensagemSucesso] = useState('')
  const [mensagemErro, setMensagemErro] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting, errors },
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

  async function atualizarTerapeuta(terapeutaEditado: Terapeuta) {
    await axios.put(
      `http://localhost:3000/terapeutas/${terapeutaEditado.id}`,
      terapeutaEditado,
    )
    dispatch(updateTerapeuta(terapeutaEditado))
  }

  async function atualizarPacientesAssociados(terapeutaEditado: Terapeuta) {
    const pacientesResponse = await fetch('http://localhost:3000/pacientes')
    const pacientes: Paciente[] = await pacientesResponse.json()

    const pacientesParaAtualizar = pacientes.filter(
      (paciente: Paciente) => paciente.terapeutaInfo.id === terapeutaEditado.id,
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

    for (const paciente of pacientesParaAtualizar) {
      dispatch(
        updatePaciente({
          ...paciente,
          terapeutaInfo: terapeutaEditado,
        }),
      )
    }
  }

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

      await atualizarTerapeuta(terapeutaEditado)
      await atualizarPacientesAssociados(terapeutaEditado)

      dispatch(fetchTerapeutas())
      dispatch(fetchPacientes())

      reset()
      return 'Terapeuta editado com sucesso!'
    } catch (error) {
      console.error('Erro ao editar terapeuta:', error)
      throw new Error('Erro ao editar terapeuta. Tente novamente.')
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
    handleEditTerapeuta,
    isSubmitting,
    mensagemSucesso,
    mensagemErro,
    setMensagemSucesso,
    setMensagemErro,
    handleFocus,
  }
}
