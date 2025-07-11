'use client';

import { useState } from 'react';
import { addWeeks, startOfWeek, format, eachDayOfInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from '@/components/ui/accordion';
import DialogNovoEvento from './dialogNovoEvento';
import { useQuery } from '@tanstack/react-query';
import { apiBuscarVisitasSemana } from './api/apiBuscarVisitas';

import { VisitaComAnexoPayload } from '@/types/VisitaComPayload';

import VisitaDoDia from './dialogVisitaDoDia';

export default function AgendaSemana() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentWeekStart, setCurrentWeekStart] = useState(
    startOfWeek(new Date(), { weekStartsOn: 0 })
  );

  const days = eachDayOfInterval({
    start: currentWeekStart,
    end: addWeeks(currentWeekStart, 1),
  }).slice(0, 7);

  const inicioSemana = format(currentWeekStart, 'yyyy-MM-dd');
  const fimSemana = format(addWeeks(currentWeekStart, 1), 'yyyy-MM-dd');

  const { data: visitas = [] } = useQuery<VisitaComAnexoPayload[]>({
    queryKey: ['visitas', inicioSemana, fimSemana],
    queryFn: () => apiBuscarVisitasSemana(inicioSemana, fimSemana),
  });

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setCurrentWeekStart(startOfWeek(date, { weekStartsOn: 0 }));
    }
  };

  const previousWeek = () => setCurrentWeekStart((prev) => addWeeks(prev, -1));
  const nextWeek = () => setCurrentWeekStart((prev) => addWeeks(prev, 1));

  return (
    <div className='min-h-screen max-w-7xl mx-auto px-4 py-6 space-y-6'>
      {/* Navegacao semanal */}
      <div className='flex flex-wrap gap-3 justify-between items-center'>
        <Button variant='ghost' onClick={previousWeek}>
          ⟵ Semana anterior
        </Button>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant='outline'>
              {format(selectedDate, 'dd MMMM yyyy', { locale: ptBR })}
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

        <Button variant='ghost' onClick={nextWeek}>
          Semana seguinte ⟶
        </Button>
      </div>

      {/* Grade da semana estilo Teams */}
      <div className='overflow-y-auto h-[60vh]'>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4 '>
          {days.map((day, index) => {
            const dataStr = format(day, 'yyyy-MM-dd');
            const visitasDoDia = visitas.filter(
              (v) => format(new Date(v.data_visita), 'yyyy-MM-dd') === dataStr
            );

            return (
              <div
                key={index}
                className='bg-white dark:bg-zinc-900 shadow-sm rounded-lg border p-4 flex flex-col justify-between'
              >
                <div>
                  <h3 className='font-semibold text-lg text-zinc-800 dark:text-white mb-1'>
                    {format(day, 'EEEE', { locale: ptBR })[0].toUpperCase() +
                      format(day, 'EEEE', { locale: ptBR }).slice(1)}
                  </h3>
                  <p className='text-sm text-zinc-500 mb-3'>
                    {format(day, 'dd/MM/yyyy')} - {visitasDoDia.length}{' '}
                    visita(s)
                  </p>
                </div>
                <div className='flex-1 overflow-auto'>
                  {visitasDoDia.length === 0 ? (
                    <p className='text-sm text-zinc-400'>
                      Nenhuma visita agendada.
                    </p>
                  ) : (
                    <ul className='space-y-2'>
                      {visitasDoDia.map((visita) => (
                        <VisitaDoDia visita={visita} key={visita.id} />
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
