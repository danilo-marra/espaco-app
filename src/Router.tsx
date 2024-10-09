import { Routes, Route } from 'react-router-dom'
import { Home } from './pages/Home'
import { Agenda } from './pages/Agenda'
import { Terapeutas } from './pages/Terapeutas'
import { DefaultLayout } from './layouts/DefaulLayout'
import { Transacoes } from './pages/Transacoes'
import { Sessoes } from './pages/Sessoes'
import type { Dispatch, SetStateAction } from 'react'
import type { Paciente } from './tipos'
import { Pacientes } from './pages/Pacientes'

export function Router({
  pacientes,
  setPacientes,
}: {
  pacientes: Paciente[]
  setPacientes: Dispatch<SetStateAction<Paciente[]>>
}) {
  return (
    <Routes>
      <Route path="/" element={<DefaultLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/agenda" element={<Agenda />} />
        <Route path="/transacoes" element={<Transacoes />} />
        <Route path="/pacientes" element={<Pacientes />} />
        <Route path="/terapeutas" element={<Terapeutas />} />
        <Route
          path="/sessoes"
          element={
            <Sessoes pacientes={pacientes} setPacientes={setPacientes} />
          }
        />
      </Route>
    </Routes>
  )
}
