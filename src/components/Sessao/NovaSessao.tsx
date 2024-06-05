import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { SessaoPaciente, SessaoDt } from '../../tipos'
import Modal from 'react-modal'

// Configuração do modal
Modal.setAppElement('#root')

interface NovaSessaoProps {
  isOpen: boolean
  onAddSessao: (novaSessao: SessaoPaciente) => void
  onClose: () => void
}

export function NovaSessao({ isOpen, onAddSessao, onClose }: NovaSessaoProps) {
  const [nome, setNome] = useState('')
  const [responsavel, setResponsavel] = useState('')
  const [cpfResponsavel, setCpfResponsavel] = useState('')
  const [endereco, setEndereco] = useState('')
  const [valor, setValor] = useState(0)
  const [planoSaude, setPlanoSaude] = useState(false)
  const [notaFiscalEmitida, setNotaFiscalEmitida] = useState(false)
  const [notaFiscalEnviada, setNotaFiscalEnviada] = useState(false)
  const [psicologa, setPsicologa] = useState('')
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
      },
      valor,
      planoSaude,
      notaFiscalEmitida,
      notaFiscalEnviada,
      psicologa,
      sessoesDt: [datas],
    }

    onAddSessao(novaSessao)
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Adicionar Nova Sessão"
    >
      <h2>Adicionar Nova Sessão</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label className="text-2xl">Nome do Paciente:</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Responsável:</label>
          <input
            type="text"
            value={responsavel}
            onChange={(e) => setResponsavel(e.target.value)}
            required
          />
        </div>
        <div>
          <label>CPF do Responsável:</label>
          <input
            type="text"
            value={cpfResponsavel}
            onChange={(e) => setCpfResponsavel(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Endereço:</label>
          <input
            type="text"
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Valor da Sessão:</label>
          <input
            type="number"
            value={valor}
            onChange={(e) => setValor(Number(e.target.value))}
            required
          />
        </div>
        <div>
          <label>Plano de Saúde?</label>
          <input
            type="checkbox"
            checked={planoSaude}
            onChange={(e) => setPlanoSaude(e.target.checked)}
          />
        </div>
        <div>
          <label>Nota Fiscal Emitida?</label>
          <input
            type="checkbox"
            checked={notaFiscalEmitida}
            onChange={(e) => setNotaFiscalEmitida(e.target.checked)}
          />
        </div>
        <div>
          <label>Nota Fiscal Enviada?</label>
          <input
            type="checkbox"
            checked={notaFiscalEnviada}
            onChange={(e) => setNotaFiscalEnviada(e.target.checked)}
          />
        </div>
        <div>
          <label>Psicóloga:</label>
          <input
            type="text"
            value={psicologa}
            onChange={(e) => setPsicologa(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Data Sessão 1:</label>
          <input
            type="date"
            onChange={(e) =>
              setDatas({ ...datas, dtSessao1: new Date(e.target.value) })
            }
          />
        </div>
        <div>
          <label>Data Sessão 2:</label>
          <input
            type="date"
            onChange={(e) =>
              setDatas({ ...datas, dtSessao2: new Date(e.target.value) })
            }
          />
        </div>
        <div>
          <label>Data Sessão 3:</label>
          <input
            type="date"
            onChange={(e) =>
              setDatas({ ...datas, dtSessao3: new Date(e.target.value) })
            }
          />
        </div>
        <div>
          <label>Data Sessão 4:</label>
          <input
            type="date"
            onChange={(e) =>
              setDatas({ ...datas, dtSessao4: new Date(e.target.value) })
            }
          />
        </div>
        <div>
          <label>Data Sessão 5:</label>
          <input
            type="date"
            onChange={(e) =>
              setDatas({ ...datas, dtSessao5: new Date(e.target.value) })
            }
          />
        </div>
        <div>
          <label>Data Sessão 6:</label>
          <input
            type="date"
            onChange={(e) =>
              setDatas({ ...datas, dtSessao6: new Date(e.target.value) })
            }
          />
        </div>
        <div>
          <button type="submit">Adicionar Sessão</button>
          <button type="button" onClick={onClose}>
            Cancelar
          </button>
        </div>
      </form>
    </Modal>
  )
}
