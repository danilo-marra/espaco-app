import { Routes, Route } from 'react-router-dom'
import { Home } from './pages/Home'
import { Agenda } from './pages/Agenda'
import { Pacientes } from './pages/Pacientes'
import { Terapeutas } from './pages/Terapeutas'
import { DefaultLayout } from './layouts/DefaulLayout'
import { Financeiro } from './pages/Financeiro'
import { Sessoes } from './pages/Sessoes'

export function Router() {
  return (
    <Routes>
      <Route path="/" element={<DefaultLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/agenda" element={<Agenda />} />
        <Route path="/financeiro" element={<Financeiro />} />
        <Route path="/pacientes" element={<Pacientes />} />
        <Route path="/sessoes" element={<Sessoes />} />
        <Route path="/terapeutas" element={<Terapeutas />} />
      </Route>
    </Routes>
  )
}
