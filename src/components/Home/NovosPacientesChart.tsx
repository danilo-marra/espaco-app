import type { PacienteEstatisticas } from '@/tipos'
import { Plus, Users } from '@phosphor-icons/react'

interface NovosPacientesChartProps {
  estatisticas: PacienteEstatisticas
}

export function NovosPacientesChart({
  estatisticas,
}: NovosPacientesChartProps) {
  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow p-4">
      <div className="flex items-center text-rosa">
        <Users className="mr-4" size={16} />
        <p className="font-semibold">Novos Pacientes</p>
      </div>
      <div className="flex items-center space-x-2 text-azul">
        <Plus size={22} weight="bold" />
        <p className="text-2xl font-bold">{estatisticas.novosPacientes}</p>
      </div>
      <div>
        <span className="text-xs text-slate-600">
          {estatisticas.percentualCrescimento > 0 ? '+' : ''}
          {estatisticas.percentualCrescimento}% em relação ao último mês
        </span>
      </div>
    </div>
  )
}
