import { BrowserRouter } from 'react-router-dom'
import { Router } from './Router'
import { TransacaoProvider } from './contexts/TransacoesContext'
import { SessaoProvider } from './contexts/SessoesContext'
import { Provider } from 'react-redux'
import { store } from './store/store'

export function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <TransacaoProvider>
          <SessaoProvider>
            <Router />
          </SessaoProvider>
        </TransacaoProvider>
      </BrowserRouter>
    </Provider>
  )
}
