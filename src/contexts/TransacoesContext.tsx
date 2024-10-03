import { createContext, useCallback, useEffect, useState } from 'react'
import type { Transacao } from '../tipos'

interface TransacaoContextType {
  transacoes: Transacao[]
  addTransacao: (transacao: Transacao) => void
  fetchTransacoes: () => Promise<void>
  editTransacao: (transacao: Transacao) => void
}

interface TransacaoProviderProps {
  children: React.ReactNode
}

export const TransacoesContext = createContext({} as TransacaoContextType)

export function TransacaoProvider({ children }: TransacaoProviderProps) {
  // Estado são a melhor e única forma de conseguir manipular o estado de um componente
  const [transacoes, setTransacoes] = useState<Transacao[]>([])

  const fetchTransacoes = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:3000/transacoes')
      const data = await response.json()
      setTransacoes(data)
      console.log('Transações:', data)
    } catch (error) {
      console.error('Erro ao buscar transações:', error)
    }
  }, [])

  useEffect(() => {
    fetchTransacoes()
  }, [fetchTransacoes])

  function addTransacao(transacao: Transacao) {
    setTransacoes((prevTransacoes) => [...prevTransacoes, transacao])
  }

  async function editTransacao(transacao: Transacao) {
    try {
      await fetch(`http://localhost:3000/transacoes/${transacao.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transacao),
      })
      fetchTransacoes()
    } catch (error) {
      console.error('Erro ao editar transação:', error)
    }
  }

  return (
    <TransacoesContext.Provider
      value={{ transacoes, addTransacao, fetchTransacoes, editTransacao }}
    >
      {children}
    </TransacoesContext.Provider>
  )
}
