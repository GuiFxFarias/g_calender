'use client';

import { useState } from 'react';
import {
  format,
  eachDayOfInterval,
  startOfMonth,
  endOfMonth,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  addWeeks,
  subWeeks,
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import DialogNovoEvento from './dialogNovoEvento';
import { useQuery } from '@tanstack/react-query';
import { apiBuscarVisitasSemana } from './api/apiBuscarVisitas';
import { VisitaComAnexoPayload } from '@/types/VisitaComPayload';
import VisitaDoDia from './dialogVisitaDoDia';

export default function AgendaMensal() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [modoVisualizacao, setModoVisualizacao] = useState<
    'mensal' | 'semanal'
  >('mensal');

  const dataInicio =
    modoVisualizacao === 'mensal'
      ? startOfMonth(selectedDate)
      : startOfWeek(selectedDate, { weekStartsOn: 0 });
  const dataFim =
    modoVisualizacao === 'mensal'
      ? endOfMonth(selectedDate)
      : endOfWeek(selectedDate, { weekStartsOn: 0 });

  const days = eachDayOfInterval({ start: dataInicio, end: dataFim });

  const inicio = format(dataInicio, 'yyyy-MM-dd');
  const fim = format(dataFim, 'yyyy-MM-dd');

  const { data: visitas = [] } = useQuery<VisitaComAnexoPayload[]>({
    queryKey: ['visitas', modoVisualizacao, inicio, fim],
    queryFn: () => apiBuscarVisitasSemana(inicio, fim),
  });

  const handleDateChange = (date: Date | undefined) => {
    if (date) setSelectedDate(date);
  };

  const navegarAtras = () =>
    setSelectedDate((prev) =>
      modoVisualizacao === 'mensal' ? subMonths(prev, 1) : subWeeks(prev, 1)
    );

  const navegarFrente = () =>
    setSelectedDate((prev) =>
      modoVisualizacao === 'mensal' ? addMonths(prev, 1) : addWeeks(prev, 1)
    );

  return (
    <div className='min-h-screen max-w-7xl mx-auto px-4 py-6 space-y-6'>
      {/* Navegação */}
      <div className='flex flex-wrap gap-3 justify-between items-center'>
        <Button variant='ghost' onClick={navegarAtras}>
          ⟵ {modoVisualizacao === 'mensal' ? 'Mês anterior' : 'Semana anterior'}
        </Button>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant='outline'>
              {modoVisualizacao === 'mensal'
                ? format(selectedDate, 'MMMM yyyy', { locale: ptBR })
                : `Semana de ${format(dataInicio, 'dd/MM')} a ${format(
                    dataFim,
                    'dd/MM'
                  )}`}
            </Button>
          </PopoverTrigger>
          <PopoverContent className='p-0'>
            <Calendar
              mode='single'
              selected={selectedDate}
              onSelect={handleDateChange}
            />
          </PopoverContent>
        </Popover>

        <Button
          variant='secondary'
          onClick={() =>
            setModoVisualizacao((prev) =>
              prev === 'mensal' ? 'semanal' : 'mensal'
            )
          }
        >
          Alternar para{' '}
          {modoVisualizacao === 'mensal' ? 'visão semanal' : 'visão mensal'}
        </Button>

        <DialogNovoEvento />

        <Button variant='ghost' onClick={navegarFrente}>
          {modoVisualizacao === 'mensal' ? 'Próximo mês' : 'Próxima semana'} ⟶
        </Button>
      </div>

      {/* Grade */}
      <div className='overflow-y-auto h-[70vh]'>
        <div
          className={`grid gap-2 ${
            modoVisualizacao === 'mensal'
              ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7'
              : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7'
          }`}
        >
          {days.map((day, index) => {
            const dataStr = format(day, 'yyyy-MM-dd');
            const visitasDoDia = visitas.filter(
              (v) => format(new Date(v.data_visita), 'yyyy-MM-dd') === dataStr
            );

            return (
              <div
                key={index}
                className='bg-white dark:bg-zinc-900 max-h-[35vh] shadow-sm rounded-lg border p-3 flex flex-col justify-between'
              >
                <div>
                  <h3 className='text-xs font-medium text-zinc-500 dark:text-zinc-400'>
                    {format(day, 'EEEE', { locale: ptBR })}
                  </h3>
                  <p className='text-sm font-semibold text-zinc-800 dark:text-white'>
                    {format(day, 'dd/MM')}
                  </p>
                </div>

                <div className='mt-2 flex-1 overflow-auto'>
                  {visitasDoDia.length === 0 ? (
                    <p className='text-xs text-zinc-400 italic'>Sem Eventos</p>
                  ) : (
                    <ul className='space-y-2'>
                      {visitasDoDia.map((visita) => (
                        <li key={visita.id} className='space-y-1'>
                          <div className='flex flex-wrap gap-1 mt-1'>
                            {(visita.tags ?? []).length > 0 ? (
                              (visita.tags ?? []).map((tag) => (
                                <span
                                  key={tag.id}
                                  className='text-xs px-2 py-1 rounded bg-blue-100 text-blue-800 border border-blue-300'
                                >
                                  {tag.nome}
                                </span>
                              ))
                            ) : (
                              <span className='text-xs text-zinc-400 italic'>
                                Sem Eventos
                              </span>
                            )}
                          </div>

                          <VisitaDoDia visita={visita} />
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
