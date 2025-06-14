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
import { useQuery } from '@tanstack/react-query';
import { apiBuscarVisitasSemana } from './api/apiBuscarVisitas';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { VisitaDetalhesForm } from './visitaDetalhesForm';
import { VisitaComAnexoPayload } from '@/types/VisitaComPayload';
import { DialogDescription } from '@radix-ui/react-dialog';

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
    <div className='h-screen flex flex-col p-4 gap-4 '>
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
      <Accordion
        type='single'
        collapsible
        className='w-full overflow-y-auto space-y-2 py-2'
      >
        {days.map((day, index) => {
          const dataStr = format(day, 'yyyy-MM-dd');
          const visitasDoDia = visitas.filter(
            (v) => format(new Date(v.data_visita), 'yyyy-MM-dd') === dataStr
          );

          return (
            <AccordionItem
              key={index}
              value={`dia-${index}`}
              className='border border-zinc-200 rounded-lg shadow-sm'
            >
              <AccordionTrigger className='px-4 py-3 hover:bg-zinc-50 transition-colors'>
                <div className='flex justify-between items-center w-full text-left'>
                  <span className='font-semibold text-zinc-800'>
                    {format(day, 'EEEE', { locale: ptBR })[0].toUpperCase()}
                    {format(day, 'EEEE', { locale: ptBR }).slice(1)} -{' '}
                    {format(day, 'dd/MM/yyyy')}
                  </span>
                  <span className='text-sm text-zinc-500'>
                    {visitasDoDia.length} visita(s)
                  </span>
                </div>
              </AccordionTrigger>

              <AccordionContent className='bg-white border-t border-zinc-200 px-4 py-3'>
                {visitasDoDia.length === 0 ? (
                  <p className='text-sm text-zinc-400'>
                    Nenhuma visita agendada.
                  </p>
                ) : (
                  <ul className='space-y-3'>
                    {visitasDoDia.map((visita) => (
                      <Dialog key={visita.id}>
                        <DialogTrigger asChild>
                          <li className='border border-zinc-200 rounded-md p-3 hover:shadow-md transition cursor-pointer'>
                            <div className='flex justify-between'>
                              <p className='text-sm text-zinc-700'>
                                <strong>Horário:</strong>{' '}
                                {format(new Date(visita.data_visita), 'HH:mm')}
                              </p>
                              <span
                                className={`px-2 py-0.5 text-xs rounded-full ${
                                  visita.status === 'pendente_recebimento'
                                    ? 'bg-yellow-100 text-yellow-700'
                                    : visita.status === 'pago'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-blue-100 text-blue-700'
                                }`}
                              >
                                {visita.status}
                              </span>
                            </div>
                            <p className='text-sm text-zinc-700 mt-1'>
                              <strong>Valor:</strong> R$ {visita.preco}
                            </p>
                          </li>
                        </DialogTrigger>

                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Detalhes da Visita</DialogTitle>
                            <DialogDescription className='text-sm text-zinc-500 border-b pb-2'>
                              {visita.descricao}
                            </DialogDescription>
                          </DialogHeader>

                          <VisitaDetalhesForm visita={visita} />
                        </DialogContent>
                      </Dialog>
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
