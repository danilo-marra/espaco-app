import { fetchSessoes } from '@/store/sessoesSlice'
import { selectTransacoesSummary, type AppDispatch } from '@/store/store'
import { fetchTransacoes } from '@/store/transacoesSlice'
import { priceFormatter } from '@/utils/formatter'
import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Cell, Legend, Pie, PieChart, Tooltip } from 'recharts'

export function Home() {
  const dispatch = useDispatch<AppDispatch>()
  const now = new Date()
  const month = now.getMonth()
  const year = now.getFullYear()
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28']

  const summarySelector = useMemo(
    () => selectTransacoesSummary(month, year),
    [month, year],
  )
  const summary = useSelector(summarySelector)

  const data = useMemo(
    () => [
      { name: 'Faturamento Mensal', value: summary.entrada },
      { name: 'Despesas Mensais', value: summary.saida },
      { name: 'Lucro Mensal', value: summary.total },
    ],
    [summary],
  )

  useEffect(() => {
    dispatch(fetchTransacoes())
    dispatch(fetchSessoes())
  }, [dispatch])

  console.log('Dados para o gráfico:', data)
  console.log('Summary:', summary)

  if (!summary.entrada) {
    return <div>Carregando dados...</div>
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <main className="flex-1 p-8">
        <div className="p-8 bg-white rounded shadow">
          <h1 className="text-2xl font-bold mb-4 text-center">
            Dashboard Financeiro
          </h1>
          <div className="flex justify-center items-center w-full h-[500px]">
            <PieChart width={500} height={400}>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
                label={({
                  cx,
                  cy,
                  midAngle,
                  innerRadius,
                  outerRadius,
                  value,
                  name,
                }) => {
                  const RADIAN = Math.PI / 180
                  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
                  const x = cx + radius * Math.cos(-midAngle * RADIAN)
                  const y = cy + radius * Math.sin(-midAngle * RADIAN)

                  return (
                    <text
                      x={x}
                      y={y}
                      fill="white"
                      textAnchor={x > cx ? 'start' : 'end'}
                      dominantBaseline="central"
                    >
                      {`${name} ${priceFormatter.format(value)}`}
                    </text>
                  )
                }}
              >
                {data.map((entry) => (
                  <Cell
                    key={`cell-${entry.name}`}
                    fill={COLORS[data.indexOf(entry) % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => priceFormatter.format(Number(value))}
              />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </div>
        </div>
      </main>
    </div>
  )
}
