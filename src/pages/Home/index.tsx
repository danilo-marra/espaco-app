import { LucroPorMesChart } from '@/components/Home/LucroPorMesChart'
import { MaioresLucrosPorTerapeutasPorMesChart } from '@/components/Home/MaioresLucrosPorTerapeutasPorMesChart'
import { NovosPacientesChart } from '@/components/Home/NovosPacientesChart'
import ReceitaAnualChart from '@/components/Home/ReceitaAnualChart'
import { SessoesAgendamentosChart } from '@/components/Home/SessoesAgendamentosChart'
import { StatusPagamentosChart } from '@/components/Home/StatusPagamentosChart'
import { fetchAgendamentos } from '@/store/agendamentosSlice'
import { fetchPacientes } from '@/store/pacientesSlice'
import { fetchSessoes } from '@/store/sessoesSlice'
import { type AppDispatch } from '@/store/store'
import { fetchTerapeutas } from '@/store/terapeutasSlice'
import { fetchTransacoes } from '@/store/transacoesSlice'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

export function Home() {
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    // Fetch all necessary data when component mounts
    const fetchData = async () => {
      await Promise.all([
        dispatch(fetchPacientes()),
        dispatch(fetchTransacoes()),
        dispatch(fetchSessoes()),
        dispatch(fetchAgendamentos()),
        dispatch(fetchTerapeutas()),
      ])
    }

    fetchData()
  }, [dispatch])

  return (
    <div className="flex min-h-screen">
      <main className="flex-1 bg-gray-100 p-8 space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <LucroPorMesChart />
          <StatusPagamentosChart />
          <NovosPacientesChart />
          <SessoesAgendamentosChart />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <ReceitaAnualChart />
          <MaioresLucrosPorTerapeutasPorMesChart />
        </div>
      </main>
    </div>
  )
}
