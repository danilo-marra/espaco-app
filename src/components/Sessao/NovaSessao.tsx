import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { SessaoPaciente, SessaoDt, Paciente } from '../../tipos'
import Modal from 'react-modal'

// Configuração do modal
Modal.setAppElement('#root')

interface NovaSessaoProps {
  isOpen: boolean
  onAddSessao: (novaSessao: SessaoPaciente) => void
  onClose: () => void
  pacientes: Paciente[]
}

export function NovaSessao({
  isOpen,
  onAddSessao,
  onClose,
  pacientes,
}: NovaSessaoProps) {
  const [nome, setNome] = useState('')
  const [responsavel, setResponsavel] = useState('')
  const [cpfResponsavel, setCpfResponsavel] = useState('')
  const [endereco, setEndereco] = useState('')
  const [terapeuta, setTerapeuta] = useState('')
  const [valor, setValor] = useState(0)
  const [planoSaude, setPlanoSaude] = useState(false)
  const [notaFiscalEmitida, setNotaFiscalEmitida] = useState(false)
  const [notaFiscalEnviada, setNotaFiscalEnviada] = useState(false)
  const [datas, setDatas] = useState<SessaoDt>({
    dtSessao1: undefined,
    dtSessao2: undefined,
    dtSessao3: undefined,
    dtSessao4: undefined,
    dtSessao5: undefined,
    dtSessao6: undefined,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const novaSessao: SessaoPaciente = {
      pacienteInfo: {
        id: uuidv4(),
        nome,
        responsavel,
        cpfResponsavel,
        endereco,
        telefone: '',
        email: '',
      },
      terapeuta,
      valor,
      planoSaude,
      notaFiscalEmitida,
      notaFiscalEnviada,
      sessoesDt: [datas],
    }

    onAddSessao(novaSessao)
    onClose()
  }

  const handlePacienteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedPaciente = pacientes.find((p) => p.nome === e.target.value)
    if (selectedPaciente) {
      setNome(selectedPaciente.nome)
      setResponsavel(selectedPaciente.responsavel)
      setCpfResponsavel(selectedPaciente.cpfResponsavel)
      setEndereco(selectedPaciente.endereco)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Adicionar Nova Sessão"
      className="fixed inset-0 flex items-center justify-center z-50"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50"
    >
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full space-y-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Adicionar Nova Sessão</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="paciente"
              className="block text-sm font-medium text-gray-700"
            >
              Paciente:
            </label>
            <select
              id="paciente"
              value={nome}
              onChange={handlePacienteChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">Selecione um paciente</option>
              {pacientes.map((paciente) => (
                <option key={paciente.id} value={paciente.nome}>
                  {paciente.nome}
                </option>
              ))}
            </select>
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
              value={responsavel}
              onChange={(e) => setResponsavel(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              disabled
            />
          </div>
          <div>
            <label
              htmlFor="cpfResponsavel"
              className="block text-sm font-medium text-gray-700"
            >
              CPF do Responsável:
            </label>
            <input
              id="cpfResponsavel"
              type="text"
              value={cpfResponsavel}
              onChange={(e) => setCpfResponsavel(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              disabled
            />
          </div>
          <div>
            <label
              htmlFor="terapeuta"
              className="block text-sm font-medium text-gray-700"
            >
              Terapeuta:
            </label>
            <input
              id="terapeuta"
              type="text"
              value={terapeuta}
              onChange={(e) => setTerapeuta(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
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
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              disabled
            />
          </div>
          <div>
            <label
              htmlFor="valor"
              className="block text-sm font-medium text-gray-700"
            >
              Valor da Sessão:
            </label>
            <input
              id="valor"
              type="number"
              value={valor}
              onChange={(e) => setValor(Number(e.target.value))}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div className="flex items-center">
            <input
              id="planoSaude"
              type="checkbox"
              checked={planoSaude}
              onChange={(e) => setPlanoSaude(e.target.checked)}
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
            />
            <label
              htmlFor="planoSaude"
              className="ml-2 block text-sm font-medium text-gray-700"
            >
              Plano de Saúde?
            </label>
          </div>
          <div className="flex items-center">
            <input
              id="notaFiscalEmitida"
              type="checkbox"
              checked={notaFiscalEmitida}
              onChange={(e) => setNotaFiscalEmitida(e.target.checked)}
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
            />
            <label
              htmlFor="notaFiscalEmitida"
              className="ml-2 block text-sm font-medium text-gray-700"
            >
              Nota Fiscal Emitida?
            </label>
          </div>
          <div className="flex items-center">
            <input
              id="notaFiscalEnviada"
              type="checkbox"
              checked={notaFiscalEnviada}
              onChange={(e) => setNotaFiscalEnviada(e.target.checked)}
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
            />
            <label
              htmlFor="notaFiscalEnviada"
              className="ml-2 block text-sm font-medium text-gray-700"
            >
              Nota Fiscal Enviada?
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 6 }, (_, index) => (
              <div key={index}>
                <label
                  htmlFor={`dataSessao${index + 1}`}
                  className="block text-sm font-medium text-gray-700"
                >
                  Data Sessão {index + 1}:
                </label>
                <input
                  id={`dataSessao${index + 1}`}
                  type="date"
                  onChange={({ target: { value } }) =>
                    setDatas((prevDatas) => ({
                      ...prevDatas,
                      [`dtSessao${index + 1}`]: new Date(value),
                    }))
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            ))}
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Adicionar Sessão
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </Modal>
  )
}
