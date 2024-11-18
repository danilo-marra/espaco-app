import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { useMemo } from 'react'
import { format, isSameMonth, subMonths } from 'date-fns'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store/store'
import { ptBR } from 'date-fns/locale'
import { Calendar } from '@phosphor-icons/react'

const chartConfig = {
  agendamentos: {
    label: 'Agendamentos',
    color: '#C3586A',
  },
  sessoes: {
    label: 'Sessões',
    color: '#3395AE',
  },
} satisfies ChartConfig

export function SessoesAgendamentosChart() {
  // Generate last 6 months array
  const monthsArray = useMemo(() => {
    const months = []
    const now = new Date()
    for (let i = 5; i >= 0; i--) {
      months.push(subMonths(now, i))
    }
    return months
  }, [])

  const agendamentos = useSelector(
    (state: RootState) => state.agendamentos.data,
  )
  const sessoes = useSelector((state: RootState) => state.sessoes.data)

  // Calculate data for each month
  const chartData = useMemo(() => {
    return monthsArray.map((date) => {
      const agendamentosNoMes = agendamentos.filter((agendamento) =>
        isSameMonth(new Date(agendamento.dataAgendamento), date),
      ).length

      const sessoesNoMes = sessoes.filter((sessao) =>
        isSameMonth(new Date(sessao.dtSessao1), date),
      ).length

      return {
        month: format(date, 'MMM', { locale: ptBR }).toUpperCase(),
        agendamentos: agendamentosNoMes,
        sessoes: sessoesNoMes,
      }
    })
  }, [agendamentos, sessoes, monthsArray])

  // Calculate totals
  const totals = useMemo(() => {
    return chartData.reduce(
      (acc, curr) => ({
        agendamentos: acc.agendamentos + curr.agendamentos,
        sessoes: acc.sessoes + curr.sessoes,
      }),
      { agendamentos: 0, sessoes: 0 },
    )
  }, [chartData])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-rosa flex items-center">
          <Calendar size={16} className="mr-2" />
          <p className="font-semibold">Agendamentos x Sessões</p>
        </CardTitle>
        <CardDescription>
          {format(monthsArray[0], 'MMMM', { locale: ptBR })
            .charAt(0)
            .toUpperCase() +
            format(monthsArray[0], 'MMMM', { locale: ptBR }).slice(1)}{' '}
          -{' '}
          {format(monthsArray[5], 'MMMM', { locale: ptBR })
            .charAt(0)
            .toLocaleUpperCase() +
            format(monthsArray[5], 'MMMM', { locale: ptBR }).slice(1)}{' '}
          {format(monthsArray[5], 'yyyy')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2 justify-center my-6 text-center">
          <p className="text-4xl">
            <span className="text-rosa font-semibold">
              {totals.agendamentos}
            </span>{' '}
            x <span className="text-azul font-semibold">{totals.sessoes}</span>
          </p>
        </div>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="agendamentos"
              type="natural"
              fill="#C3586A"
              fillOpacity={0.4}
              stroke="#C3586A"
              stackId="a"
            />
            <Area
              dataKey="sessoes"
              type="natural"
              fill="#3395AE"
              fillOpacity={0.4}
              stroke="#3395AE"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Relação entre agendamentos e sessões realizadas
        </div>
      </CardFooter>
    </Card>
  )
}
