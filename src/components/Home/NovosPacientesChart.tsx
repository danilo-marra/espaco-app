import { Plus, TrendUp, Users } from '@phosphor-icons/react'
import { Card, CardContent, CardFooter } from '../ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../ui/chart'
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'
import { useMemo } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store/store'

export function NovosPacientesChart() {
  const estatisticas = useSelector(
    (state: RootState) => state.pacientes.estatisticas,
  )
  // console.log('Estatísticas:', estatisticas)
  // console.log('Pacientes por Mês:', estatisticas.pacientesPorMes)

  const monthsArray = useMemo(() => {
    const year = new Date().getFullYear()
    const months = []
    for (let i = 0; i < 12; i++) {
      const date = new Date(year, i, 1)
      months.push(date)
    }
    return months
  }, [])

  const chartData = useMemo(() => {
    if (
      !estatisticas.pacientesPorMes ||
      estatisticas.pacientesPorMes.length < 12
    ) {
      return monthsArray.map((date) => ({
        month: format(date, 'MMM', { locale: ptBR }).toUpperCase(),
        pacientes: 0,
      }))
    }

    return monthsArray.map((date) => ({
      month: format(date, 'MMM', { locale: ptBR }).toUpperCase(),
      pacientes: estatisticas.pacientesPorMes[date.getMonth()] || 0,
    }))
  }, [estatisticas, monthsArray])

  const chartConfig = {
    pacientes: {
      label: 'Pacientes',
      color: '#3395AE',
    },
  }

  // const formatDateRange = () => {
  //   const currentYear = new Date().getFullYear()
  //   return `${currentYear} - ${format(new Date(currentYear, 0), 'MMMM', {
  //     locale: ptBR,
  //   })} - ${format(new Date(currentYear, 11), 'MMMM', {
  //     locale: ptBR,
  //   })}`
  //     .split(' ')
  //     .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
  //     .join(' ')
  // }

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow p-4">
      <div className="flex items-center text-rosa">
        <Users className="mr-4" size={16} />
        <p className="font-semibold">Novos Pacientes</p>
      </div>
      <div className="flex items-center space-x-2 justify-center my-6 text-center text-rosa">
        <Plus size={22} weight="bold" />
        <p className="text-4xl font-bold">{estatisticas.novosPacientes}</p>
      </div>
      <div>
        <Card className="shadow-none border-0">
          <CardContent>
            <ChartContainer config={chartConfig}>
              <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar
                  dataKey="pacientes"
                  fill={chartConfig.pacientes.color}
                  name={chartConfig.pacientes.label}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="flex gap-2 font-medium leading-none">
              {estatisticas.percentualCrescimento > 0 ? '+' : ''}
              {estatisticas.percentualCrescimento}% em relação ao último mês{' '}
              <TrendUp className="h-4 w-4" />
            </div>
            <div className="leading-none text-muted-foreground">
              Total de pacientes cadastrados no último ano
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
