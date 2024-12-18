import {
  CaretLeft,
  CaretRight,
  HandCoins,
  TrendUp,
  User,
} from "@phosphor-icons/react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useMemo, useState } from "react";
import {
  ChartContainer,
  ChartTooltipContent,
  type ChartConfig,
} from "../ui/chart";
import { Bar, BarChart, LabelList, Tooltip, XAxis, YAxis } from "recharts";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { calculateRepasseInfo } from "@/utils/calculateRepasseInfo";
import { priceFormatter } from "@/utils/formatter";

export function MaioresLucrosPorTerapeutasPorMesChart() {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const sessoes = useSelector((state: RootState) => state.sessoes.data);
  const terapeutas = useSelector((state: RootState) => state.terapeutas.data);

  const handlePreviousMonth = () => {
    setSelectedMonth((prev) => new Date(prev.setMonth(prev.getMonth() - 1)));
  };

  const handleNextMonth = () => {
    setSelectedMonth((prev) => new Date(prev.setMonth(prev.getMonth() + 1)));
  };

  // Prepare chart data
  const chartData = useMemo(() => {
    // Filter sessions for the selected month
    const filteredSessoes = sessoes.filter((sessao) => {
      const sessaoDate = new Date(sessao.dtSessao1);
      return (
        sessaoDate.getMonth() === selectedMonth.getMonth() &&
        sessaoDate.getFullYear() === selectedMonth.getFullYear()
      );
    });

    // Group sessions by therapist
    const terapeutaMap: {
      [key: string]: {
        nome: string;
        atendimentos: number;
        receita: number;
        foto?: string;
      };
    } = {};

    for (const sessao of filteredSessoes) {
      const therapistId = sessao.terapeutaInfo.id;
      // Obtenha o terapeuta atualizado
      const terapeuta = terapeutas.find((t) => t.id === therapistId);
      if (!terapeuta) continue;
      const therapistName = sessao.terapeutaInfo.nomeTerapeuta;
      const therapistFoto = terapeuta.foto;

      // Calculate total value for the session
      const { totalValue } = calculateRepasseInfo(sessao);

      if (!terapeutaMap[therapistId]) {
        terapeutaMap[therapistId] = {
          nome: therapistName,
          foto: therapistFoto,
          atendimentos: 0,
          receita: 0,
        };
      }

      // Assuming each valid date in sessao counts as one atendimento
      const validDatesCount = [
        sessao.dtSessao1,
        sessao.dtSessao2,
        sessao.dtSessao3,
        sessao.dtSessao4,
        sessao.dtSessao5,
        sessao.dtSessao6,
      ].filter(Boolean).length;

      terapeutaMap[therapistId].atendimentos += validDatesCount;
      terapeutaMap[therapistId].receita += totalValue;
    }

    // Convert the map to an array
    const dataArray = Object.values(terapeutaMap);

    // Sort the data by revenue
    dataArray.sort((a, b) => b.receita - a.receita);

    return dataArray;
  }, [sessoes, selectedMonth, terapeutas]);

  const renderCustomYAxisTick = (props: {
    x: number;
    y: number;
    payload: { value: string };
  }) => {
    const { x, y, payload } = props;
    const data = chartData.find((item) => item.nome === payload.value);

    if (!data || x === undefined || y === undefined) {
      return <g />;
    }

    return (
      <g transform={`translate(${Number(x) - 160},${Number(y) - 10})`}>
        {data.foto ? (
          <image
            href={data.foto}
            x={-15}
            y={-5}
            height={30}
            width={30}
            clipPath="circle(10px at 10px, 10px)"
          />
        ) : (
          // Ícone padrão se não houver foto
          <User x={-15} y={-5} size={30} weight="fill" color="#ccc" />
        )}
        <text x={25} y={15} fill="#666">
          {data.nome}
        </text>
      </g>
    );
  };

  const totalReceita = chartData.reduce((acc, curr) => acc + curr.receita, 0);
  const totalAtendimentos = chartData.reduce(
    (acc, curr) => acc + curr.atendimentos,
    0,
  );

  const chartConfig = {
    atendimentos: {
      label: "Atendimentos",
      color: "#3395AE",
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-rosa flex items-center mb-6">
          <HandCoins size={20} className="mr-2" />
          <span>Atendimentos por Terapeuta</span>
        </CardTitle>
        <div className="text-azul">
          <div className="flex justify-between items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePreviousMonth}
              aria-label="Mês anterior"
            >
              <CaretLeft className="h-4 w-4" />
            </Button>
            <div className="w-[120px] text-center font-medium">
              {format(selectedMonth, "MMMM", { locale: ptBR })
                .charAt(0)
                .toUpperCase() +
                format(selectedMonth, "MMMM", { locale: ptBR }).slice(1)}
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
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            width={500}
            height={300}
            data={chartData}
            layout="vertical"
            margin={{
              top: 20,
              right: 60,
              left: 140,
              bottom: 5,
            }}
          >
            <XAxis type="number" hide />
            <YAxis
              dataKey="nome"
              type="category"
              tickLine={false}
              axisLine={false}
              tick={renderCustomYAxisTick}
            />
            <Tooltip
              cursor={{ fill: "transparent" }}
              content={
                <ChartTooltipContent
                  formatter={(value: string | number | (string | number)[]) =>
                    `Atendimentos: ${Array.isArray(value) ? value.join(", ") : value}`
                  }
                />
              }
            />
            <Bar
              dataKey="atendimentos"
              fill={chartConfig.atendimentos.color}
              radius={5}
            >
              <LabelList
                dataKey="receita"
                position="insideRight"
                fill="#fff"
                fontWeight="bold"
                formatter={(value: number) => `${priceFormatter.format(value)}`}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Receita total gerada neste mês: {priceFormatter.format(totalReceita)}{" "}
          <TrendUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Total de atendimentos neste mês: {totalAtendimentos}
        </div>
      </CardFooter>
    </Card>
  );
}
