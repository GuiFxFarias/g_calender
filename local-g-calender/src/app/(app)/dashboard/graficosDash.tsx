'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useQuery, useQueries } from '@tanstack/react-query';
import { format } from 'date-fns';
import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { apiBuscarVisitasSemana } from '../calendar/api/apiBuscarVisitas';
import { apiBuscarClientePorId } from '../calendar/api/apiBuscaClienteId';
import { agruparPorSemana } from '@/lib/agruparPorSemana';
import { ClientePayload } from '@/types/Cliente';
import { VisitaComAnexoPayload } from '@/types/VisitaComPayload';

export default function Dashboard() {
  const [inicio, setInicio] = useState(
    format(new Date(new Date().getFullYear(), 0, 1), 'yyyy-MM-dd')
  );
  const [fim, setFim] = useState(format(new Date(), 'yyyy-MM-dd'));

  const { data: visitas = [] } = useQuery({
    queryKey: ['visitas-dashboard', inicio, fim],
    queryFn: () => apiBuscarVisitasSemana(inicio, fim),
  });

  const dadosAgrupados = agruparPorSemana(visitas);

  const visitasPendentes: VisitaComAnexoPayload[] = visitas.filter(
    (v) => v.status === 'pendente_visita'
  );
  const visitasFinalizadas: VisitaComAnexoPayload[] = visitas.filter(
    (v) => v.status === 'pago' || v.status === 'pendente_recebimento'
  );

  const clienteIds = [
    ...new Set(
      [...visitasPendentes, ...visitasFinalizadas].map((v) => v.cliente_id)
    ),
  ];

  const clientesQuery = useQueries({
    queries: clienteIds.map((id) => ({
      queryKey: ['cliente', id],
      queryFn: () => apiBuscarClientePorId(id),
    })),
  });

  const clientesMap = useMemo(() => {
    const map: Record<number, ClientePayload['nome']> = {};
    clientesQuery.forEach((q) => {
      if (q.data) map[q.data.id] = q.data.nome;
    });
    return map;
  }, [clientesQuery]);

  return (
    <>
      {/* Filtro por período */}
      <div className='flex flex-col md:flex-row items-stretch md:items-end gap-4 w-full max-w-2xl rounded-lg'>
        <div className='flex-1'>
          <Label htmlFor='inicio' className='mb-2 block'>
            Início
          </Label>
          <Input
            type='date'
            id='inicio'
            value={inicio}
            onChange={(e) => setInicio(e.target.value)}
          />
        </div>
        <div className='flex-1'>
          <Label htmlFor='fim' className='mb-2 block'>
            Fim
          </Label>
          <Input
            type='date'
            id='fim'
            value={fim}
            onChange={(e) => setFim(e.target.value)}
          />
        </div>
      </div>

      {/* Linha 1 */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <Card>
          <CardHeader>
            <CardTitle>Evolução de Visitas por Semana</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width='100%' height={200}>
              <AreaChart data={dadosAgrupados}>
                <XAxis
                  dataKey='semana'
                  tickFormatter={(v) => v.replace('S', ' Semana ')}
                />
                <YAxis />
                <Tooltip />
                <Area
                  type='monotone'
                  dataKey='visitas'
                  stroke='#8884d8'
                  fill='#8884d8'
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Valor Ganho por Semana (Somente Pago)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width='100%' height={200}>
              <AreaChart data={dadosAgrupados}>
                <XAxis dataKey='semana' />
                <YAxis />
                <Tooltip />
                <Area
                  type='monotone'
                  dataKey='valor'
                  stroke='#82ca9d'
                  fill='#82ca9d'
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Linha 2 */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <Card>
          <CardHeader>
            <CardTitle>Visitas Pendentes</CardTitle>
            <div className='font-semibold mb-2 text-xl border-b border-black'>
              Total: {visitasPendentes.length}
            </div>
          </CardHeader>
          <CardContent className='overflow-y-auto max-h-[35vh]'>
            <ul className='space-y-2'>
              {visitasPendentes.map((v, i) => (
                <li key={i} className='text-sm border-b pb-1 relative'>
                  <span
                    className={`absolute top-0 right-0 px-2 py-0.5 text-xs rounded-full ${
                      v.status === 'pendente_recebimento'
                        ? 'bg-yellow-100 text-yellow-700'
                        : v.status === 'pago'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {v.status}
                  </span>
                  <div>
                    <strong>Cliente:</strong>{' '}
                    {clientesMap[v.cliente_id!] || '...'}
                  </div>
                  <div>
                    <strong>Descrição:</strong> {v.descricao}
                  </div>
                  <div>
                    <strong>Data:</strong>{' '}
                    {format(new Date(v.data_visita), 'dd/MM/yyyy HH:mm')}
                  </div>
                  <div>
                    <strong>Valor:</strong>{' '}
                    {v.preco.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Visitas Finalizadas</CardTitle>
            <div className='font-semibold mb-2 text-xl border-b border-black'>
              Total: {visitasFinalizadas.length}
            </div>
          </CardHeader>
          <CardContent className='overflow-y-auto max-h-[35vh]'>
            <ul className='space-y-2'>
              {visitasFinalizadas.map((v, i) => (
                <li key={i} className='text-sm border-b pb-1 relative'>
                  <span
                    className={`absolute top-0 right-0 px-2 py-0.5 text-xs rounded-full ${
                      v.status === 'pendente_recebimento'
                        ? 'bg-yellow-100 text-yellow-700'
                        : v.status === 'pago'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {v.status}
                  </span>
                  <div>
                    <strong>Cliente:</strong>{' '}
                    {clientesMap[v.cliente_id!] || '...'}
                  </div>
                  <div>
                    <strong>Descrição:</strong> {v.descricao}
                  </div>
                  <div>
                    <strong>Data:</strong>{' '}
                    {format(new Date(v.data_visita), 'dd/MM/yyyy HH:mm')}
                  </div>
                  <div>
                    <strong>Valor:</strong>{' '}
                    {v.preco.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
