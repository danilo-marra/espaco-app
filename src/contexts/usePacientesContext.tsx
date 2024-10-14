import type React from 'react'
import {
  createContext,
  useState,
  useEffect,
  useCallback,
  useContext,
} from 'react'
import type { Paciente, Terapeuta } from '../tipos'

interface PacienteContextType {
  pacientes: Paciente[]
  addPaciente: (paciente: Paciente) => void
  editPaciente: (paciente: Paciente) => void
  fetchPacientes: () => Promise<void>
  updatePacientesWithTerapeuta: (terapeuta: Terapeuta) => void
}

const PacientesContext = createContext<PacienteContextType | undefined>(
  undefined,
)

export function PacientesProvider({ children }: { children: React.ReactNode }) {
  const [pacientes, setPacientes] = useState<Paciente[]>([])

  const fetchPacientes = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:3000/pacientes')
      const data = await response.json()
      setPacientes(data)
    } catch (error) {
      console.error('Erro ao buscar Pacientes:', error)
    }
  }, [])

  const updatePacientesWithTerapeuta = useCallback(
    (terapeutaAtualizado: Terapeuta) => {
      setPacientes((pacientes) => {
        const updatedPacientes = pacientes.map((paciente) =>
          paciente.terapeutaInfo.id === terapeutaAtualizado.id
            ? {
                ...paciente,
                terapeutaInfo: {
                  ...paciente.terapeutaInfo,
                  nomeTerapeuta: terapeutaAtualizado.nomeTerapeuta,
                },
              }
            : paciente,
        )

        console.log('Pacientes atualizados:', updatedPacientes)
        return updatedPacientes
      })
    },
    [],
  )

  const addPaciente = useCallback((novoPaciente: Paciente) => {
    setPacientes((prevPacientes) => [...prevPacientes, novoPaciente])
  }, [])

  const editPaciente = useCallback((pacienteEditado: Paciente) => {
    setPacientes((prevPacientes) =>
      prevPacientes.map((paciente) =>
        paciente.id === pacienteEditado.id ? pacienteEditado : paciente,
      ),
    )
  }, [])

  useEffect(() => {
    fetchPacientes()
  }, [fetchPacientes])

  return (
    <PacientesContext.Provider
      value={{
        pacientes,
        addPaciente,
        editPaciente,
        updatePacientesWithTerapeuta,
        fetchPacientes,
      }}
    >
      {children}
    </PacientesContext.Provider>
  )
}

export const usePacientesContext = () => {
  const context = useContext(PacientesContext)
  if (!context) {
    throw new Error(
      'usePacientesContext must be used within a PacientesProvider',
    )
  }
  return context
}
