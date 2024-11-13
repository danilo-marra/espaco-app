import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { fetchSessoes } from '@/store/sessoesSlice'
import {
  selectTransacoesSummary,
  type AppDispatch,
  type RootState,
} from '@/store/store'
import { fetchTransacoes } from '@/store/transacoesSlice'
import { priceFormatter } from '@/utils/formatter'
import { CaretLeft, CaretRight, ChartBar } from '@phosphor-icons/react'
import { createSelector } from '@reduxjs/toolkit'
import { addMonths, format, startOfMonth, subMonths } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Button } from '@/components/ui/button'

type Totals = {
  faturamento: number
  despesa: number
  lucro: number
}

function isTotalKey(key: string): key is keyof Totals {
  return ['faturamento', 'despesa', 'lucro'].includes(key)
}

export function Home() {
  const dispatch = useDispatch<AppDispatch>()
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  useEffect(() => {
    dispatch(fetchTransacoes())
    dispatch(fetchSessoes())
  }, [dispatch])

  const monthsArray = useMemo(() => {
    const months = []
    for (let i = 5; i >= 0; i--) {
      const date = subMonths(startOfMonth(selectedDate), i)
      months.push(date)
    }
    return months
  }, [selectedDate])

  const selectMonthlySummaries = useMemo(
    () =>
      createSelector(
        [(state: RootState) => state, () => monthsArray],
        (state, months) =>
          months.map((date) => {
            const month = date.getMonth()
            const year = date.getFullYear()
            const summarySelector = selectTransacoesSummary(month, year)
            return { date, summary: summarySelector(state) }
          }),
      ),
    [monthsArray],
  )

  const summaries = useSelector(selectMonthlySummaries)

  const chartData = summaries.map(({ date, summary }) => ({
    month: format(date, 'MMM', { locale: ptBR }),
    faturamento: summary.entrada,
    despesa: summary.saida,
    lucro: summary.total,
  }))

  const chartConfig = {
    faturamento: {
      label: 'Faturamento',
      color: '#3b82f6',
    },
    despesa: {
      label: 'Despesa',
      color: '#ef4444',
    },
    lucro: {
      label: 'Lucro',
      color: '#10b981',
    },
  }

  const handlePreviousMonth = () => {
    setSelectedDate((prevDate) => subMonths(prevDate, 1))
  }

  const handleNextMonth = () => {
    setSelectedDate((prevDate) => addMonths(prevDate, 1))
  }

  // Calculate totals for the last 6 months
  const totals = useMemo(() => {
    return chartData.reduce(
      (acc, curr) => ({
        faturamento: acc.faturamento + curr.faturamento,
        despesa: acc.despesa + curr.despesa,
        lucro: acc.lucro + curr.lucro,
      }),
      { faturamento: 0, despesa: 0, lucro: 0 },
    )
  }, [chartData])

  return (
    <div className="flex min-h-screen">
      <main className="flex-1 bg-gray-100 p-8">
        <div className="bg-blue-50 p-4">
          <Card className="w-full max-w-3xl">
            <CardHeader>
              <CardTitle className="text-rosa flex items-center mb-6">
                <ChartBar size={20} className="mr-2" />
                <span>Faturamento Semestral</span>
              </CardTitle>
              <div className="flex justify-between w-full items-center">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handlePreviousMonth}
                  aria-label="Mês anterior"
                >
                  <CaretLeft className="h-4 w-4" />
                </Button>
                <div className="text-center font-medium uppercase text-azul">
                  {format(monthsArray[0], 'MMMM yyyy', { locale: ptBR })} -{' '}
                  {format(monthsArray[5], 'MMMM yyyy', { locale: ptBR })}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleNextMonth}
                  aria-label="Próximo mês"
                >
                  <CaretRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <BarChart width={600} height={300} data={chartData}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} />
                  <YAxis />
                  <Tooltip
                    formatter={(value: number) => priceFormatter.format(value)}
                  />
                  <Legend
                    content={({ payload }) => (
                      <div className="flex justify-center items-center space-x-4 mt-4">
                        {payload?.map((entry) => {
                          const key = entry.value.toLowerCase()
                          const total = isTotalKey(key) ? totals[key] : 0

                          return (
                            <div
                              key={entry.value}
                              className="flex items-center"
                            >
                              <div
                                className="w-3 h-3 mr-2"
                                style={{ backgroundColor: entry.color }}
                              />
                              <span
                                style={{ color: entry.color }}
                                className="text-sm"
                              >
                                {entry.value}:{' '}
                                <span className="font-semibold">
                                  {priceFormatter.format(total)}
                                </span>
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  />
                  <Bar
                    dataKey="faturamento"
                    fill={chartConfig.faturamento.color}
                    name={chartConfig.faturamento.label}
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="despesa"
                    fill={chartConfig.despesa.color}
                    name={chartConfig.despesa.label}
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="lucro"
                    fill={chartConfig.lucro.color}
                    name={chartConfig.lucro.label}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </div>
            </CardContent>
          </Card>
        </div>
        <div>teste</div>
      </main>
    </div>
  )
}
