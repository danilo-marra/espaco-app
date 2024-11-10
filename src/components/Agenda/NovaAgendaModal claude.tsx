import React from 'react';
import { CalendarIcon } from '@radix-ui/react-icons';
import { cn } from '@/lib/utils';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { ptBR } from 'date-fns/locale';
import { useEffect, useMemo, useRef, useState } from 'react';
import { addDays, addMonths, format } from 'date-fns';
import { Label } from '../ui/label';
import * as RadioGroup from '@radix-ui/react-radio-group';
import {
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from '../ui/dialog';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/store/store';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { fetchPacientes } from '@/store/pacientesSlice';
import { v4 as uuidv4 } from 'uuid';
import { addAgendamento } from '@/store/agendamentosSlice';
import { maskTime } from '@/utils/formatter';
import type { Agendamento } from '@/tipos';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Checkbox } from '../ui/checkbox';

// Constants
const WEEK_DAYS = [
  'Domingo',
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
] as const;

const APPOINTMENT_TYPES = [
  'Sessão',
  'Orientação Parental',
  'Visita Escolar',
  'Reunião Escolar',
  'Supervisão',
  'Outros',
] as const;

const APPOINTMENT_STATUS = [
  { value: 'Confirmado', color: 'bg-green-600' },
  { value: 'Remarcado', color: 'bg-yellow-500' },
  { value: 'Cancelado', color: 'bg-red-500' },
] as const;

// Schema de validação
const NovaAgendaFormSchema = z.object({
  pacienteId: z.string().min(1, 'Selecione um paciente'),
  dataAgendamento: z.date({
    required_error: 'Selecione uma data',
    invalid_type_error: 'Selecione uma data válida',
  }),
  horarioAgendamento: z
    .string()
    .regex(/^([0-1]\d|2[0-3]):([0-5]\d)$/, 'Formato inválido (hh:mm)'),
  localAgendamento: z.enum(['Sala Verde', 'Sala Azul', 'Não Precisa de Sala'], {
    required_error: 'Selecione uma sala',
    invalid_type_error: 'Selecione uma sala válida',
  }),
  periodicidade: z
    .enum(['Não repetir', 'Diária', 'Semanal', 'Mensal'])
    .optional(),
  diasDaSemana: z.array(z.enum(WEEK_DAYS)).optional(),
  dataFimRecorrencia: z.date().optional(),
  modalidadeAgendamento: z.enum(['Presencial', 'Online'], {
    required_error: 'Selecione uma modalidade',
    invalid_type_error: 'Selecione uma modalidade válida',
  }),
  tipoAgendamento: z.enum(APPOINTMENT_TYPES, {
    required_error: 'Selecione um tipo',
    invalid_type_error: 'Selecione um tipo válido',
  }),
  statusAgendamento: z.enum(['Confirmado', 'Remarcado', 'Cancelado'], {
    required_error: 'Selecione um status',
    invalid_type_error: 'Selecione um status válido',
  }),
  observacoesAgendamento: z.string().optional(),
});

type NovaAgendaFormInputs = z.infer<typeof NovaAgendaFormSchema>;

// Custom hook para conflitos de agendamento
const useAppointmentConflicts = (
  watchDataAgendamento: Date | undefined,
  watchHorarioAgendamento: string,
  watchLocalAgendamento: string | undefined,
  agendamentos: Agendamento[],
) => {
  const [conflito, setConflito] = useState(false);
  const [mensagemConflito, setMensagemConflito] = useState('');
  const [mensagemAlerta, setMensagemAlerta] = useState('');

  useEffect(() => {
    if (!watchDataAgendamento || !watchHorarioAgendamento || !watchLocalAgendamento) {
      return;
    }

    const getMinutesDifference = (time1: string, time2: string) => {
      const [hours1, minutes1] = time1.split(':').map(Number);
      const [hours2, minutes2] = time2.split(':').map(Number);
      return Math.abs(hours1 * 60 + minutes1 - (hours2 * 60 + minutes2));
    };

    const formatDate = (date: Date) => format(date, 'yyyy-MM-dd');

    const agendamentosProximos = agendamentos.filter((agendamento) => {
      if (watchLocalAgendamento === 'Não Precisa de Sala' || 
          agendamento.localAgendamento === 'Não Precisa de Sala') {
        return false;
      }

      const mesmaData = formatDate(new Date(agendamento.dataAgendamento)) === formatDate(watchDataAgendamento);
      const mesmoLocal = agendamento.localAgendamento === watchLocalAgendamento;
      
      return mesmaData && mesmoLocal && getMinutesDifference(agendamento.horarioAgendamento, watchHorarioAgendamento) < 50;
    });

    const conflitos = agendamentosProximos.filter(
      (agendamento) => agendamento.horarioAgendamento === watchHorarioAgendamento,
    );

    if (conflitos.length > 0) {
      const conflito = conflitos[0];
      setConflito(true);
      setMensagemConflito(
        `Já existe um agendamento para ${conflito.pacienteInfo.nomePaciente} com ${conflito.pacienteInfo.terapeutaInfo.nomeTerapeuta} neste horário e local.`,
      );
      setMensagemAlerta('');
    } else {
      setConflito(false);
      setMensagemConflito('');

      const agendamentosProximosSemConflito = agendamentosProximos.filter(
        (agendamento) => agendamento.horarioAgendamento !== watchHorarioAgendamento,
      );

      if (agendamentosProximosSemConflito.length > 0) {
        const agendamentoProximo = agendamentosProximosSemConflito[0];
        setMensagemAlerta(
          `Atenção: Existe um agendamento para ${agendamentoProximo.pacienteInfo.nomePaciente} às ${agendamentoProximo.horarioAgendamento} (menos de 50 minutos de diferença)`,
        );
      } else {
        setMensagemAlerta('');
      }
    }
  }, [watchDataAgendamento, watchHorarioAgendamento, watchLocalAgendamento, agendamentos]);

  return { conflito, mensagemConflito, mensagemAlerta };
};

// Component
export function NovaAgendaModal() {
  const dispatch = useDispatch<AppDispatch>();
  const pacientes = useSelector((state: RootState) => state.pacientes.data);
  const agendamentos = useSelector((state: RootState) => state.agendamentos.data);
  const [mensagemSucesso, setMensagemSucesso] = useState('');
  const [mensagemErro, setMensagemErro] = useState('');
  const calendarTriggerRef = useRef<HTMLButtonElement>(null);

  const {
    control,
    register,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<NovaAgendaFormInputs>({
    resolver: zodResolver(NovaAgendaFormSchema),
    defaultValues: {
      pacienteId: '',
      dataAgendamento: undefined,
      horarioAgendamento: '',
      localAgendamento: undefined,
      modalidadeAgendamento: undefined,
      tipoAgendamento: undefined,
      statusAgendamento: undefined,
      observacoesAgendamento: '',
    },
  });

  const watchDataAgendamento = watch('dataAgendamento');
  const watchHorarioAgendamento = watch('horarioAgendamento');
  const watchLocalAgendamento = watch('localAgendamento');
  const periodicidade = watch('periodicidade');

  const { conflito, mensagemConflito, mensagemAlerta } = useAppointmentConflicts(
    watchDataAgendamento,
    watchHorarioAgendamento,
    watchLocalAgendamento,
    agendamentos,
  );

  const pacienteSelecionado = useMemo(
    () => pacientes.find((paciente) => paciente.id === watch('pacienteId')),
    [pacientes, watch],
  );

  const isButtonDisabled = isSubmitting || Object.keys(errors).length > 0 || conflito;

  useEffect(() => {
    dispatch(fetchPacientes());
  }, [dispatch]);

  const handleCreateNewAgendamento = async (data: NovaAgendaFormInputs) => {
    try {
      const pacienteSelecionado = pacientes.find(
        (paciente) => paciente.id === data.pacienteId,
      );

      if (!pacienteSelecionado) {
        throw new Error('Paciente não encontrado');
      }

      const agendamentosParaCriar: Agendamento[] = [];
      const baseAgendamento = {
        terapeutaInfo: pacienteSelecionado.terapeutaInfo,
        pacienteInfo: pacienteSelecionado,
        horarioAgendamento: data.horarioAgendamento,
        localAgendamento: data.localAgendamento,
        modalidadeAgendamento: data.modalidadeAgendamento,
        tipoAgendamento: data.tipoAgendamento,
        statusAgendamento: data.statusAgendamento,
        observacoesAgendamento: data.observacoesAgendamento || '',
      };

      if (data.periodicidade === 'Não repetir' || !data.periodicidade) {
        agendamentosParaCriar.push({
          id: uuidv4(),
          ...baseAgendamento,
          dataAgendamento: data.dataAgendamento,
        });
      } else {
        let dataAtual = data.dataAgendamento;
        const dataFim = data.dataFimRecorrencia!;

        while (dataAtual <= dataFim) {
          if (
            data.periodicidade !== 'Semanal' ||
            data.diasDaSemana?.includes(
              format(dataAtual, 'EEEE', { locale: ptBR }) as typeof WEEK_DAYS[number],
            )
          ) {
            agendamentosParaCriar.push({
              id: uuidv4(),
              ...baseAgendamento,
              dataAgendamento: dataAtual,
            });
          }

          dataAtual = data.periodicidade === 'Mensal'
            ? addMonths(dataAtual, 1)
            : addDays(dataAtual, 1);
        }
      }

      await Promise.all(
        agendamentosParaCriar.map((agendamento) =>
          dispatch(addAgendamento(agendamento)).unwrap(),
        ),
      );

      reset();
      setMensagemSucesso('Agendamento(s) criado(s) com sucesso!');
      setMensagemErro('');
    } catch (error) {
      console.error('Erro ao criar novo agendamento:', error);
      setMensagemErro(
        error instanceof Error
          ? error.message
          : 'Erro ao criar novo agendamento. Tente novamente.',
      );
      setMensagemSucesso('');
    }
  };

  // ... Rest of the JSX remains the same