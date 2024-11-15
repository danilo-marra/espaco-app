import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { LineChart, Line, XAxis, CartesianGrid } from 'recharts'
import { format, subMonths } from 'date-fns'
import { ptBR } from 'date-fns/locale'

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { Minus, PiggyBank, Plus } from '@phosphor-icons/react'
import { selectTransacoesSummary, type RootState } from '@/store/store'
import { priceFormatter } from '@/utils/formatter'

export function LucroPorMesChart() {
  // Generate an array of the last 6 months
  const monthsArray = useMemo(() => {
    const months = []
    const now = new Date()
    for (let i = 5; i >= 0; i--) {
      months.push(subMonths(now, i))
    }
    return months
  }, [])

  // Create a selector to get summaries for each month
  const summaries = useSelector((state: RootState) =>
    monthsArray.map((date) => {
      const month = date.getMonth()
      const year = date.getFullYear()
      const summary = selectTransacoesSummary(month, year)(state)
      return { date, summary }
    }),
  )

  // Prepare the chart data
  const chartData = summaries.map(({ date, summary }) => ({
    month: format(date, 'MMM', { locale: ptBR }).toUpperCase(),
    lucro: summary.total || 0,
  }))

  // Get the profit of the last month
  const lastMonthLucro = chartData[chartData.length - 1]?.lucro || 0

  const ProfitIcon = lastMonthLucro < 0 ? Minus : Plus

  // Determine if the profit is negative
  const lucroClass = lastMonthLucro < 0 ? 'text-red-500' : 'text-green-500'

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-rosa">
          <PiggyBank className="mr-4" size={16} />
          <p className="font-semibold">Lucro</p>
        </CardTitle>
        <CardDescription>
          {format(monthsArray[0], 'MMMM', { locale: ptBR })} -{' '}
          {format(monthsArray[5], 'MMMM', { locale: ptBR })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className={`flex items-center space-x-2 justify-center my-6 text-center ${lucroClass}`}
        >
          <ProfitIcon size={22} weight="bold" />
          <p className="text-4xl font-bold">
            {priceFormatter.format(Math.abs(lastMonthLucro))}
          </p>
        </div>
        <ChartContainer
          config={{
            lucro: {
              label: 'Lucro',
              color: '#3395AE',
            },
          }}
        >
          <LineChart
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
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="lucro"
              type="natural"
              stroke="var(--color-lucro)"
              strokeWidth={2}
              dot={{
                fill: 'var(--color-lucro)',
              }}
              activeDot={{
                r: 6,
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
