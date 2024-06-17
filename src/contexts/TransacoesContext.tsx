import { createContext, useEffect, useState } from 'react'
import { Transacao } from '../tipos'

interface TransacaoContextType {
  transacoes: Transacao[]
}

interface TransacaoProviderProps {
  children: React.ReactNode
}

export const TransacoesContext = createContext({} as TransacaoContextType)

export function TransacaoProvider({ children }: TransacaoProviderProps) {
  // Estado são a melhor e única forma de conseguir manipular o estado de um componente
  const [transacoes, setTransacoes] = useState<Transacao[]>([])

  async function loadtransacoes() {
    const response = await fetch('http://localhost:3000/transacoes')
    const data = await response.json()

    setTransacoes(data)
  }

  useEffect(() => {
    loadtransacoes()
  }, [])

  return (
    <TransacoesContext.Provider value={{ transacoes }}>
      {children}
    </TransacoesContext.Provider>
  )
}
