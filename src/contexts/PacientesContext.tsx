import { createContext, useCallback, useEffect, useState } from 'react'
import type { Paciente } from '../tipos'

interface PacienteContextType {
  pacientes: Paciente[]
  addPaciente: (paciente: Paciente) => void
  editPaciente: (paciente: Paciente) => void
  fetchPacientes: () => Promise<void>
}

interface PacienteProviderProps {
  children: React.ReactNode
}

export const PacientesContext = createContext({} as PacienteContextType)

export function PacienteProvider({ children }: PacienteProviderProps) {
  const [pacientes, setPacientes] = useState<Paciente[]>([])

  const fetchPacientes = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:3000/pacientes')
      const data = await response.json()
      setPacientes(data)
      console.log('Pacientes:', data)
    } catch (error) {
      console.error('Erro ao buscar Pacientes:', error)
    }
  }, [])

  useEffect(() => {
    fetchPacientes()
  }, [fetchPacientes])

  function addPaciente(paciente: Paciente) {
    setPacientes((prevPacientes) => [...prevPacientes, paciente])
  }

  async function editPaciente(paciente: Paciente) {
    try {
      await fetch(`http://localhost:3000/pacientes/${paciente.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paciente),
      })
      fetchPacientes()
    } catch (error) {
      console.error('Erro ao editar paciente:', error)
    }
  }

  return (
    <PacientesContext.Provider
      value={{ pacientes, fetchPacientes, addPaciente, editPaciente }}
    >
      {children}
    </PacientesContext.Provider>
  )
}
