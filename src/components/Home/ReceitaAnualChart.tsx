import { CaretLeft, CaretRight, ChartBar } from "@phosphor-icons/react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { addYears, format, subYears } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Bar, BarChart, CartesianGrid, Legend, XAxis, YAxis } from "recharts";
import { priceFormatter } from "@/utils/formatter";
import { useSelector } from "react-redux";
import { selectTransacoesSummary, type RootState } from "@/store/store";
import { useMemo, useState } from "react";
import { createSelector } from "@reduxjs/toolkit";
import { Button } from "../ui/button";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";

type Totals = {
  faturamento: number;
  despesa: number;
  lucro: number;
};

function isTotalKey(key: string): key is keyof Totals {
  return ["faturamento", "despesa", "lucro"].includes(key);
}

export default function ReceitaAnualChart() {
  const [selectedYear, setSelectedYear] = useState<Date>(new Date());

  const monthsArray = useMemo(() => {
    const year = selectedYear.getFullYear();
    const months = [];
    for (let i = 0; i < 12; i++) {
      const date = new Date(year, i, 1);
      months.push(date);
    }
    return months;
  }, [selectedYear]);

  const selectMonthlySummaries = useMemo(
    () =>
      createSelector(
        [(state: RootState) => state, () => monthsArray],
        (state, months) =>
          months.map((date) => {
            const month = date.getMonth();
            const year = date.getFullYear();
            const summarySelector = selectTransacoesSummary(month, year);
            return { date, summary: summarySelector(state) };
          }),
      ),
    [monthsArray],
  );

  const summaries = useSelector(selectMonthlySummaries);

  const chartData = summaries.map(({ date, summary }) => ({
    month: format(date, "MMM", { locale: ptBR }).toUpperCase(),
    faturamento: summary.entrada || 0,
    despesa: summary.saida || 0,
    lucro: summary.total || 0,
  }));

  const chartConfig = {
    faturamento: {
      label: "Faturamento",
      color: "#3395AE",
    },
    despesa: {
      label: "Despesa",
      color: "#ef4444",
    },
    lucro: {
      label: "Lucro",
      color: "#10b981",
    },
  };

  const totals = useMemo(() => {
    return chartData.reduce(
      (acc, curr) => ({
        faturamento: acc.faturamento + curr.faturamento,
        despesa: acc.despesa + curr.despesa,
        lucro: acc.lucro + curr.lucro,
      }),
      { faturamento: 0, despesa: 0, lucro: 0 },
    );
  }, [chartData]);

  const handlePreviousYear = () => {
    setSelectedYear((prevDate) => subYears(prevDate, 1));
  };

  const handleNextYear = () => {
    setSelectedYear((prevDate) => addYears(prevDate, 1));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-rosa flex items-center mb-6">
          <ChartBar size={20} className="mr-2" />
          <span>Receita Anual</span>
        </CardTitle>
        <div className="text-azul">
          <div className="flex justify-between items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePreviousYear}
              aria-label="Ano anterior"
            >
              <CaretLeft className="h-4 w-4" />
            </Button>
            <div className="w-[120px] text-center font-medium">
              {format(selectedYear, "yyyy", { locale: ptBR })}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={handleNextYear}
              aria-label="Próximo ano"
            >
              <CaretRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              interval={0}
              tickMargin={10}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Legend
              content={({ payload }) => (
                <div className="flex justify-center items-center space-x-4 mt-4">
                  {payload?.map((entry) => {
                    const key = entry.value.toLowerCase();
                    const total = isTotalKey(key) ? totals[key] : 0;

                    return (
                      <div key={entry.value} className="flex items-center">
                        <div
                          className="w-3 h-3 mr-2"
                          style={{ backgroundColor: entry.color }}
                        />
                        <span
                          style={{ color: entry.color }}
                          className="text-sm"
                        >
                          {entry.value}:{" "}
                          <span className="font-semibold">
                            {priceFormatter.format(total)}
                          </span>
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            />
            <Bar
              dataKey="faturamento"
              fill={chartConfig.faturamento.color}
              name={chartConfig.faturamento.label}
              radius={[4, 4, 0, 0]}
              barSize={40}
            />
            <Bar
              dataKey="despesa"
              fill={chartConfig.despesa.color}
              name={chartConfig.despesa.label}
              radius={[4, 4, 0, 0]}
              barSize={40}
            />
            <Bar
              dataKey="lucro"
              fill={chartConfig.lucro.color}
              name={chartConfig.lucro.label}
              radius={[4, 4, 0, 0]}
              barSize={40}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
