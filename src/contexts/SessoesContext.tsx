import { createContext, useCallback, useEffect, useState } from 'react'
import type { Sessao } from '../tipos'

interface SessaoContextType {
  sessoes: Sessao[]
}

interface SessaoProviderProps {
  children: React.ReactNode
}

export const SessoesContext = createContext({} as SessaoContextType)

export function SessaoProvider({ children }: SessaoProviderProps) {
  const [sessoes, setSessoes] = useState<Sessao[]>([])

  const fetchSessoes = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:3000/sessoes')
      const data = await response.json()
      setSessoes(data)
      console.log('Sessoes:', data)
    } catch (error) {
      console.error('Erro ao buscar sessoes:', error)
    }
  }, [])

  useEffect(() => {
    fetchSessoes()
  }, [fetchSessoes])

  return (
    <SessoesContext.Provider value={{ sessoes }}>
      {children}
    </SessoesContext.Provider>
  )
}
