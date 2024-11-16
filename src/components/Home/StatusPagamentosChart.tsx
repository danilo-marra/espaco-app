import { Label, Pie, PieChart } from 'recharts'

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
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { useMemo } from 'react'
import { CalendarCheck, TrendDown, TrendUp } from '@phosphor-icons/react'
import { format, subMonths } from 'date-fns'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store/store'
import { ptBR } from 'date-fns/locale'

const chartConfig = {
  sessoes: {
    label: 'Sessões',
  },
  pagamentoPendente: {
    label: 'Pagamento Pendente',
    color: '#b91c1c',
  },
  pagamentoRealizado: {
    label: 'Pagamento Realizado',
    color: '#f97316',
  },
  notaFiscalEmitida: {
    label: 'Nota Fiscal Emitida',
    color: '#eab308',
  },
  notaFiscalEnviada: {
    label: 'Nota Fiscal Enviada',
    color: '#22c55e',
  },
} satisfies ChartConfig

export function StatusPagamentosChart() {
  // Generate an array of the last 6 months
  const monthsArray = useMemo(() => {
    const months = []
    const now = new Date()
    for (let i = 5; i >= 0; i--) {
      months.push(subMonths(now, i))
    }
    return months
  }, [])

  // Get all sessions from redux store
  const sessoes = useSelector((state: RootState) => state.sessoes.data)

  // Filter and count sessions by status for the last 6 months
  const statusCounts = useMemo(() => {
    const filteredSessions = sessoes.filter((sessao) => {
      const sessaoDate = new Date(sessao.dtSessao1)
      const sixMonthsAgo = subMonths(new Date(), 6)
      return sessaoDate >= sixMonthsAgo
    })

    return filteredSessions.reduce<Record<string, number>>((acc, sessao) => {
      const status = sessao.statusSessao || 'Não Definido'
      acc[status] = (acc[status] || 0) + 1
      return acc
    }, {})
  }, [sessoes])

  // Prepare chart data
  const chartData = useMemo(() => {
    return [
      {
        statusSessao: 'Pagamento Pendente',
        sessoes: statusCounts['Pagamento Pendente'] || 0,
        fill: chartConfig.pagamentoPendente.color,
      },
      {
        statusSessao: 'Pagamento Realizado',
        sessoes: statusCounts['Pagamento Realizado'] || 0,
        fill: chartConfig.pagamentoRealizado.color,
      },
      {
        statusSessao: 'Nota Fiscal Emitida',
        sessoes: statusCounts['Nota Fiscal Emitida'] || 0,
        fill: chartConfig.notaFiscalEmitida.color,
      },
      {
        statusSessao: 'Nota Fiscal Enviada',
        sessoes: statusCounts['Nota Fiscal Enviada'] || 0,
        fill: chartConfig.notaFiscalEnviada.color,
      },
    ]
  }, [statusCounts])

  // Calculate total sessoes
  const totalSessoes = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.sessoes, 0)
  }, [chartData])

  // Calculate percentage change from previous month
  const percentageChange = useMemo(() => {
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()

    const thisMonth = sessoes.filter((sessao) => {
      const date = new Date(sessao.dtSessao1)
      return (
        date.getMonth() === currentMonth && date.getFullYear() === currentYear
      )
    }).length

    const lastMonth = sessoes.filter((sessao) => {
      const date = new Date(sessao.dtSessao1)
      const lastMonthDate = subMonths(new Date(), 1)
      return (
        date.getMonth() === lastMonthDate.getMonth() &&
        date.getFullYear() === lastMonthDate.getFullYear()
      )
    }).length

    if (lastMonth === 0) return 100
    return Math.round(((thisMonth - lastMonth) / lastMonth) * 100)
  }, [sessoes])

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-0">
        <CardTitle className="text-rosa flex items-center">
          <CalendarCheck size={16} className="mr-2" />
          <p className="font-semibold">Sessões Realizadas</p>
        </CardTitle>
        <CardDescription>
          {' '}
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
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="sessoes"
              nameKey="statusSessao"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-rosa text-3xl font-bold"
                        >
                          {totalSessoes.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-rosa font-semibold"
                        >
                          {totalSessoes === 1 ? 'Sessão' : 'Sessões'}
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          {percentageChange > 0 ? 'Aumento' : 'Redução'} de{' '}
          {Math.abs(percentageChange)}% neste mês
          {percentageChange > 0 ? (
            <TrendUp className="h-4 w-4" />
          ) : (
            <TrendDown className="h-4 w-4" />
          )}
        </div>
        <div className="leading-none text-muted-foreground">
          Sessões realizadas nos últimos 6 meses
        </div>
      </CardFooter>
    </Card>
  )
}
