import { BrowserRouter } from 'react-router-dom'
import { Router } from './Router'
import { TransacaoProvider } from './contexts/TransacoesContext'
import { PacienteProvider } from './contexts/PacientesContext'
import { TerapeutaProvider } from './contexts/TerapeutasContext'
import { SessaoProvider } from './contexts/SessoesContext'
import { Provider } from 'react-redux'
import { store } from './store/store'

export function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <TransacaoProvider>
          <TerapeutaProvider>
            <PacienteProvider>
              <SessaoProvider>
                <Router />
              </SessaoProvider>
            </PacienteProvider>
          </TerapeutaProvider>
        </TransacaoProvider>
      </BrowserRouter>
    </Provider>
  )
}
