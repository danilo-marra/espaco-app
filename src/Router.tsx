import { Routes, Route } from 'react-router-dom'
import { Home } from './pages/Home'
import { Agenda } from './pages/Agenda'
import { Pacientes } from './pages/Pacientes'
import { Terapeutas } from './pages/Terapeutas'
import { DefaultLayout } from './layouts/DefaulLayout'
import { Transacoes } from './pages/Transacoes'
import { Sessoes } from './pages/Sessoes'
import { Dispatch, SetStateAction } from 'react'
import { Paciente, Terapeuta } from './tipos'

export function Router({
  terapeutas,
  setTerapeutas,
  pacientes,
  setPacientes,
}: {
  terapeutas: Terapeuta[]
  setTerapeutas: Dispatch<SetStateAction<Terapeuta[]>>
  pacientes: Paciente[]
  setPacientes: Dispatch<SetStateAction<Paciente[]>>
}) {
  return (
    <Routes>
      <Route path="/" element={<DefaultLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/agenda" element={<Agenda />} />
        <Route path="/transacoes" element={<Transacoes />} />
        <Route
          path="/pacientes"
          element={
            <Pacientes
              terapeutas={terapeutas}
              pacientes={pacientes}
              setPacientes={setPacientes}
            />
          }
        />
        <Route
          path="/sessoes"
          element={
            <Sessoes
              pacientes={pacientes}
              setPacientes={setPacientes}
              terapeutas={terapeutas}
              setTerapeutas={setTerapeutas}
            />
          }
        />
        <Route
          path="/terapeutas"
          element={
            <Terapeutas
              terapeutas={terapeutas}
              setTerapeutas={setTerapeutas}
              pacientes={pacientes}
              setPacientes={setPacientes}
            />
          }
        />
      </Route>
    </Routes>
  )
}
