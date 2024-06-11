import { BrowserRouter } from 'react-router-dom'
import { Router } from './Router'
import { initialTerapeutas } from './pages/Terapeutas'
import { useState } from 'react'
import { Paciente, Terapeuta } from './tipos'
import { initialPacientes } from './pages/Pacientes'

export function App() {
  const [terapeutas, setTerapeutas] = useState<Terapeuta[]>(initialTerapeutas)
  const [pacientes, setPacientes] = useState<Paciente[]>(initialPacientes)

  return (
    <BrowserRouter>
      <Router
        terapeutas={terapeutas}
        setTerapeutas={setTerapeutas}
        pacientes={pacientes}
        setPacientes={setPacientes}
      />
    </BrowserRouter>
  )
}
