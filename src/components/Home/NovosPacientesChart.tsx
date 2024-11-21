import { TrendUp, TrendDown, Users } from "@phosphor-icons/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { useMemo } from "react";
import { format, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

const chartConfig = {
  pacientes: {
    label: "Pacientes",
    color: "#3395AE",
  },
};

export function NovosPacientesChart() {
  // Generate an array of the last 6 months
  const monthsArray = useMemo(() => {
    const months = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      months.push(subMonths(now, i));
    }
    return months;
  }, []);

  const pacientes = useSelector((state: RootState) => state.pacientes.data);
  const estatisticas = useSelector(
    (state: RootState) => state.pacientes.estatisticas,
  );

  const pacientesPorMes = useMemo(() => {
    return monthsArray.map((date) => {
      const pacientesNoMes = pacientes.filter((paciente) => {
        const dtEntrada = new Date(paciente.dtEntradaPaciente);
        return (
          dtEntrada.getMonth() === date.getMonth() &&
          dtEntrada.getFullYear() === date.getFullYear()
        );
      }).length;
      return {
        month: format(date, "MMM", { locale: ptBR }).toUpperCase(),
        pacientes: pacientesNoMes,
      };
    });
  }, [pacientes, monthsArray]);

  const totalPacientes = useMemo(() => {
    return pacientesPorMes.reduce((acc, curr) => acc + curr.pacientes, 0);
  }, [pacientesPorMes]);

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-0">
        <CardTitle className="flex items-center text-rosa">
          <Users className="mr-2" size={16} />
          <p className="font-semibold">Novos Pacientes</p>
        </CardTitle>
        <CardDescription>
          {format(monthsArray[0], "MMMM", { locale: ptBR })
            .charAt(0)
            .toUpperCase() +
            format(monthsArray[0], "MMMM", { locale: ptBR }).slice(1)}{" "}
          -{" "}
          {format(monthsArray[5], "MMMM", { locale: ptBR })
            .charAt(0)
            .toLocaleUpperCase() +
            format(monthsArray[5], "MMMM", { locale: ptBR }).slice(1)}{" "}
          {format(monthsArray[5], "yyyy")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2 justify-center my-6 text-center text-rosa">
          <p className="text-4xl font-semibold">+ {totalPacientes}</p>
        </div>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={pacientesPorMes}
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
            <Bar
              dataKey="pacientes"
              fill={chartConfig.pacientes.color}
              radius={[4, 4, 0, 0]}
              barSize={40}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          {estatisticas.percentualCrescimento > 0 ? "Aumento" : "Redução"} de{" "}
          {Math.abs(estatisticas.percentualCrescimento)}% neste mês
          {estatisticas.percentualCrescimento > 0 ? (
            <TrendUp className="h-4 w-4" />
          ) : (
            <TrendDown className="h-4 w-4" />
          )}
        </div>
        <div className="leading-none text-muted-foreground">
          Novos pacientes nos últimos 6 meses
        </div>
      </CardFooter>
    </Card>
  );
}
