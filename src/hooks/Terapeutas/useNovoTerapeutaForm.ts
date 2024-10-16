import { useState } from 'react'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { v4 as uuidv4 } from 'uuid'
import {
  NovoTerapeutaFormSchema,
  type NovoTerapeutaFormInputs,
} from './validationSchemasTerapeutas'
import { useDispatch } from 'react-redux'
import type { AppDispatch } from '../../store/store'
import { addTerapeuta } from '../../store/terapeutasSlice'

export function useNovoTerapeutaForm() {
  const dispatch = useDispatch<AppDispatch>()

  const [mensagemSucesso, setMensagemSucesso] = useState('')
  const [mensagemErro, setMensagemErro] = useState('')

  const {
    register,
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
        curriculo: data.curriculo,
        chavePix: data.chavePix,
      }

      await axios.post('http://localhost:3000/terapeutas', novoTerapeuta)

      dispatch(addTerapeuta(novoTerapeuta))

      reset()
      setMensagemSucesso('Terapeuta cadastrado com sucesso!')
      setMensagemErro('')
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

  return {
    register,
    errors,
    handleSubmit,
    handleCreateNewTerapeuta,
    isSubmitting,
    mensagemSucesso,
    mensagemErro,
    handleFocus,
  }
}
