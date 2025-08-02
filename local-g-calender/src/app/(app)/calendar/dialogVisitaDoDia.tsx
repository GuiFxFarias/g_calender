'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { VisitaDetalhesForm } from './visitaDetalhesForm';
import { VisitaComAnexoPayload } from '@/types/VisitaComPayload';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { ClientePayload } from '@/types/Cliente';
import { apiBuscarClientePorId } from './api/apiBuscaClienteId';
import toast from 'react-hot-toast';
import { Label } from '@/components/ui/label';

export default function VisitaDoDia({
  visita,
}: {
  visita: VisitaComAnexoPayload;
}) {
  const [cliente, setCliente] = useState<ClientePayload>();

  useEffect(() => {
    const buscarClienteId = async () => {
      try {
        const cliente = await apiBuscarClientePorId(visita.cliente_id);
        setCliente(cliente);
      } catch {
        toast.error('Erro ao carregar telefone do cliente');
      }
    };

    buscarClienteId();
  }, [visita.cliente_id]);

  const tagsValidas = (visita.tags ?? []).filter(
    (tag) => tag && tag.id !== null && tag.nome !== null
  );

  return (
    <Dialog key={visita.id}>
      <DialogTrigger asChild>
        <li className='border border-zinc-200 rounded-md p-3 hover:shadow-md transition cursor-pointer'>
          <div className='flex justify-between items-center gap-2 flex-wrap'>
            <p className='text-sm text-zinc-700'>
              <strong>Horário:</strong>{' '}
              {format(new Date(visita.data_visita), 'HH:mm')}
            </p>
            <span
              className={`px-1 py-0.5 text-xs rounded-full truncate ${
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

          {/* Exibir tags da visita aqui */}
          <div className='mt-2 flex flex-wrap gap-1'>
            {tagsValidas.length > 0 ? (
              tagsValidas.map((tag) => (
                <span
                  key={tag.id}
                  className='text-xs px-2 py-1 rounded bg-green-100 text-green-800 border border-green-300'
                >
                  {tag.nome}
                </span>
              ))
            ) : (
              <span className='text-xs text-zinc-400 italic'>Sem tags</span>
            )}
          </div>
        </li>
      </DialogTrigger>

      <DialogContent className='sm:max-w-md w-[95%]'>
        <DialogHeader>
          <DialogTitle className='text-lg'>Detalhes da Visita</DialogTitle>
          <DialogDescription className='text-sm text-zinc-500 border-b pb-2'>
            {visita.descricao}
          </DialogDescription>
        </DialogHeader>

        <div className='flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2'>
          <Label className='text-sm'>Cliente:</Label>
          <p className='font-medium text-sm'>{cliente?.nome}</p>
        </div>

        <div className='mt-2'>
          <VisitaDetalhesForm visita={visita} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
