import { LucroPorMesChart } from '@/components/Home/LucroPorMesChart'
import { MaioresLucrosPorTerapeutasPorMesChart } from '@/components/Home/MaioresLucrosPorTerapeutasPorMesChart'
import { NovosPacientesChart } from '@/components/Home/NovosPacientesChart'
import ReceitaAnualChart from '@/components/Home/ReceitaAnualChart'
import { SessoesAgendamentosChart } from '@/components/Home/SessoesAgendamentosChart'
import { StatusPagamentosChart } from '@/components/Home/StatusPagamentosChart'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { fetchPacientes } from '@/store/pacientesSlice'
import { fetchSessoes } from '@/store/sessoesSlice'
import { type AppDispatch } from '@/store/store'
import { fetchTransacoes } from '@/store/transacoesSlice'
import { CalendarBlank } from '@phosphor-icons/react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

export function Home() {
  const dispatch = useDispatch<AppDispatch>()
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  useEffect(() => {
    // Fetch all necessary data when component mounts
    const fetchData = async () => {
      await Promise.all([
        dispatch(fetchPacientes()),
        dispatch(fetchTransacoes()),
        dispatch(fetchSessoes()),
      ])
    }

    fetchData()
  }, [dispatch])

  return (
    <div className="flex min-h-screen">
      <main className="flex-1 bg-gray-100 p-8 space-y-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-[240px] justify-start text-left font-normal"
            >
              <CalendarBlank className="mr-2 h-4 w-4" />
              {format(selectedDate, 'PPP', { locale: ptBR })}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
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
