import { createContext, useCallback, useEffect, useState } from 'react'
import type { Terapeuta } from '../tipos'

interface TerapeutaContextType {
  terapeutas: Terapeuta[]
  addTerapeuta: (terapeuta: Terapeuta) => void
  editTerapeuta: (terapeuta: Terapeuta) => void
  fetchTerapeutas: () => Promise<void>
}

interface TerapeutaProviderProps {
  children: React.ReactNode
}

export const TerapeutasContext = createContext({} as TerapeutaContextType)

export function TerapeutaProvider({ children }: TerapeutaProviderProps) {
  const [terapeutas, setTerapeutas] = useState<Terapeuta[]>([])

  const fetchTerapeutas = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:3000/terapeutas')
      const data = await response.json()
      setTerapeutas(data)
    } catch (error) {
      console.error('Erro ao buscar terapeutas:', error)
    }
  }, [])

  useEffect(() => {
    fetchTerapeutas()
  }, [fetchTerapeutas])

  function addTerapeuta(terapeuta: Terapeuta) {
    setTerapeutas((prevTerapeutas) => [...prevTerapeutas, terapeuta])
  }

  async function editTerapeuta(terapeuta: Terapeuta) {
    try {
      await fetch(`http://localhost:3000/terapeutas/${terapeuta.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(terapeuta),
      })
      fetchTerapeutas()
    } catch (error) {
      console.error('Erro ao editar terapeuta:', error)
    }
  }

  return (
    <TerapeutasContext.Provider
      value={{ terapeutas, fetchTerapeutas, addTerapeuta, editTerapeuta }}
    >
      {children}
    </TerapeutasContext.Provider>
  )
}
