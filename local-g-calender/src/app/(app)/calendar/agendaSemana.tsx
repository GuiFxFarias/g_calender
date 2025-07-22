'use client';

import { useState } from 'react';
import {
  format,
  eachDayOfInterval,
  startOfMonth,
  endOfMonth,
  addMonths,
  subMonths,
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
  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);

  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const inicioMes = format(monthStart, 'yyyy-MM-dd');
  const fimMes = format(monthEnd, 'yyyy-MM-dd');

  const { data: visitas = [] } = useQuery<VisitaComAnexoPayload[]>({
    queryKey: ['visitas-mensal', inicioMes, fimMes],
    queryFn: () => apiBuscarVisitasSemana(inicioMes, fimMes),
  });

  const handleDateChange = (date: Date | undefined) => {
    if (date) setSelectedDate(date);
  };

  const previousMonth = () => setSelectedDate((prev) => subMonths(prev, 1));

  const nextMonth = () => setSelectedDate((prev) => addMonths(prev, 1));

  return (
    <div className='min-h-screen max-w-7xl mx-auto px-4 py-6 space-y-6'>
      {/* Navegação mensal */}
      <div className='flex flex-wrap gap-3 justify-between items-center'>
        <Button variant='ghost' onClick={previousMonth}>
          ⟵ Mês anterior
        </Button>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant='outline'>
              {format(selectedDate, 'MMMM yyyy', { locale: ptBR })}
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

        <DialogNovoEvento />

        <Button variant='ghost' onClick={nextMonth}>
          Próximo mês ⟶
        </Button>
      </div>

      {/* Grade mensal */}
      <div className='overflow-y-auto h-[70vh]'>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-2'>
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
                    <p className='text-sm text-zinc-400'>Sem visitas</p>
                  ) : (
                    <>
                      <span className='text-sm text-zinc-400'>
                        Eventos: {visitasDoDia.length}
                      </span>
                      <ul className='space-y-2'>
                        {visitasDoDia.map((visita) => (
                          <VisitaDoDia visita={visita} key={visita.id} />
                        ))}
                      </ul>
                    </>
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
