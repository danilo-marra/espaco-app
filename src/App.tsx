import { BrowserRouter } from 'react-router-dom'
import { Router } from './Router'
import initialTerapeutas from './pages/Terapeutas'
import { useState } from 'react'
import { Paciente, Terapeuta } from './tipos'
import Pacientes from './pages/Pacientes'
import { TransacaoProvider } from './contexts/TransacoesContext'

export function App() {
  const [terapeutas, setTerapeutas] = useState<Terapeuta[]>(initialTerapeutas)
  const [pacientes, setPacientes] = useState<Paciente[]>(Pacientes)

  return (
    <BrowserRouter>
      <TransacaoProvider>
        <Router
          terapeutas={terapeutas}
          setTerapeutas={setTerapeutas}
          pacientes={pacientes}
          setPacientes={setPacientes}
        />
      </TransacaoProvider>
    </BrowserRouter>
  )
}
