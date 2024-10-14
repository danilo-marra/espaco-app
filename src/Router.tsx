import { Routes, Route } from 'react-router-dom'
import { Home } from './pages/Home'
import { Agendas } from './pages/Agendas'
import { Terapeutas } from './pages/Terapeutas'
import { DefaultLayout } from './layouts/DefaulLayout'
import { Transacoes } from './pages/Transacoes'
import { Sessoes } from './pages/Sessoes'
import { Pacientes } from './pages/Pacientes'

export function Router() {
  return (
    <Routes>
      <Route path="/" element={<DefaultLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/agenda" element={<Agendas />} />
        <Route path="/transacoes" element={<Transacoes />} />
        <Route path="/pacientes" element={<Pacientes />} />
        <Route path="/terapeutas" element={<Terapeutas />} />
        <Route path="/sessoes" element={<Sessoes />} />
      </Route>
    </Routes>
  )
}
