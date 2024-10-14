import { createContext, useCallback, useEffect, useState } from 'react'
import type { Paciente, Terapeuta } from '../tipos'

interface PacienteContextType {
  pacientes: Paciente[]
  fetchPacientes: () => Promise<void>
  addPaciente: (paciente: Paciente) => void
  editPaciente: (paciente: Paciente) => void
  updatePacientesWithTerapeuta: (terapeuta: Terapeuta) => Promise<void>
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
      setPacientes(data) // Atualiza o estado com pacientes recebidos
    } catch (error) {
      console.error('Erro ao buscar Pacientes:', error)
    }
  }, [])

  useEffect(() => {
    fetchPacientes() // Busca pacientes na montagem do componente
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
      await fetchPacientes() // Garante sincronia após edição
    } catch (error) {
      console.error('Erro ao editar paciente:', error)
    }
  }

  const updatePacientesWithTerapeuta = useCallback(
    async (terapeutaAtualizado: Terapeuta) => {
      try {
        const pacientesParaAtualizar = pacientes.filter(
          (paciente) => paciente.terapeutaInfo.id === terapeutaAtualizado.id,
        )

        const updatedPacientes = pacientes.map((paciente) => {
          if (paciente.terapeutaInfo.id === terapeutaAtualizado.id) {
            return {
              ...paciente,
              terapeutaInfo: {
                ...paciente.terapeutaInfo,
                nomeTerapeuta: terapeutaAtualizado.nomeTerapeuta,
              },
            }
          }
          return paciente
        })

        setPacientes(updatedPacientes) // Atualiza o estado local

        // Persistindo atualizações no backend
        await Promise.all(
          pacientesParaAtualizar.map((paciente) =>
            fetch(`http://localhost:3000/pacientes/${paciente.id}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                ...paciente,
                terapeutaInfo: {
                  ...paciente.terapeutaInfo,
                  nomeTerapeuta: terapeutaAtualizado.nomeTerapeuta,
                },
              }),
            }),
          ),
        )

        // Após a persistência, buscar pacientes atualizados
        await fetchPacientes()
      } catch (error) {
        console.error('Erro ao atualizar pacientes no backend:', error)
      }
    },
    [pacientes, fetchPacientes], // Garante uso de estado atualizado e evita closures
  )

  return (
    <PacientesContext.Provider
      value={{
        pacientes,
        fetchPacientes,
        addPaciente,
        editPaciente,
        updatePacientesWithTerapeuta,
      }}
    >
      {children}
    </PacientesContext.Provider>
  )
}
