import { BrowserRouter } from 'react-router-dom'
import { Router } from './Router'
import { TransacaoProvider } from './contexts/TransacoesContext'
import { PacienteProvider } from './contexts/PacientesContext'
import { TerapeutaProvider } from './contexts/TerapeutasContext'
import { SessaoProvider } from './contexts/SessoesContext'

export function App() {
  return (
    <BrowserRouter>
      <TransacaoProvider>
        <PacienteProvider>
          <TerapeutaProvider>
            <SessaoProvider>
              <Router />
            </SessaoProvider>
          </TerapeutaProvider>
        </PacienteProvider>
      </TransacaoProvider>
    </BrowserRouter>
  )
}
