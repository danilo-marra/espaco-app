import { BrowserRouter } from 'react-router-dom'
import { Router } from './Router'
import { TransacaoProvider } from './contexts/TransacoesContext'
import { PacienteProvider } from './contexts/PacientesContext'
import { TerapeutaProvider } from './contexts/TerapeutasContext'

export function App() {
  return (
    <BrowserRouter>
      <TransacaoProvider>
        <PacienteProvider>
          <TerapeutaProvider>
            <Router />
          </TerapeutaProvider>
        </PacienteProvider>
      </TransacaoProvider>
    </BrowserRouter>
  )
}
