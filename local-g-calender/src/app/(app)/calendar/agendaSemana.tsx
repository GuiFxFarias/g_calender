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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import DialogNovoEvento from './dialogNovoEvento';

type Visita = {
  data: string; // formato: yyyy-MM-dd
  hora: string;
  cliente: string;
  servico: string;
};

export default function AgendaSemana() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentWeekStart, setCurrentWeekStart] = useState(
    startOfWeek(new Date(), { weekStartsOn: 0 })
  );

  // Simulando visitas criadas manualmente
  const [visitas] = useState<Visita[]>([
    {
      data: format(new Date(), 'yyyy-MM-dd'),
      hora: '10:00',
      cliente: 'João da Silva',
      servico: 'Manutenção preventiva',
    },
  ]);

  const days = eachDayOfInterval({
    start: currentWeekStart,
    end: addWeeks(currentWeekStart, 1),
  }).slice(0, 7);

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setCurrentWeekStart(startOfWeek(date, { weekStartsOn: 0 }));
    }
  };

  const previousWeek = () => setCurrentWeekStart((prev) => addWeeks(prev, -1));
  const nextWeek = () => setCurrentWeekStart((prev) => addWeeks(prev, 1));

  return (
    <div className='h-screen flex flex-col p-4 gap-4'>
      {/* Navegação */}
      <div className='flex justify-start items-center gap-2'>
        <Button variant='outline' onClick={previousWeek}>
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

        <Button variant='outline' onClick={nextWeek}>
          Semana seguinte ⟶
        </Button>
      </div>

      {/* Acordeon com dias e visitas */}
      <Accordion type='single' collapsible className='w-full overflow-y-auto'>
        {days.map((day, index) => {
          const dataStr = format(day, 'yyyy-MM-dd');
          const visitasDoDia = visitas.filter((v) => v.data === dataStr);

          return (
            <AccordionItem key={index} value={`dia-${index}`}>
              <AccordionTrigger>
                <div className='flex justify-between w-full text-left'>
                  <span className='font-semibold'>
                    {format(day, 'EEEE', { locale: ptBR })} –{' '}
                    {format(day, 'dd/MM/yyyy')}
                  </span>
                  <span className='text-muted-foreground'>
                    {visitasDoDia.length} visita(s)
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                {visitasDoDia.length === 0 ? (
                  <p className='text-sm text-muted-foreground pl-2'>
                    Nenhuma visita agendada.
                  </p>
                ) : (
                  <ul className='pl-4 space-y-2'>
                    {visitasDoDia.map((visita, i) => (
                      <li key={i} className='border rounded p-2'>
                        <p>
                          <strong>Cliente:</strong> {visita.cliente}
                        </p>
                        <p>
                          <strong>Horário:</strong> {visita.hora}
                        </p>
                        <p>
                          <strong>Serviço:</strong> {visita.servico}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
