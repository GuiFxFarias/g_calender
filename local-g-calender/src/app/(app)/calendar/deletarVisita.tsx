import { useState } from 'react';
import { apiDeletarVisita } from './api/apiDeletarVisita';
import { toast } from 'react-hot-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { DialogClose } from '@radix-ui/react-dialog';
import { Trash } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { VisitaComAnexoPayload } from '@/types/VisitaComPayload';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

export default function DeletarVisitaDialog({
  visita,
}: {
  visita: VisitaComAnexoPayload;
}) {
  const [opcao, setOpcao] = useState<'single' | 'all'>('single');
  const queryClient = useQueryClient();

  // Verificar se é série recorrente ou ocorrência virtual
  const idReal = visita.id!.toString().split('-')[0];
  const isSerieRecorrente = visita.is_recorrente === 1 || idReal;

  const deletarMutation = useMutation({
    mutationFn: ({
      visitaId,
      scope,
      dataInstancia,
    }: {
      visitaId: number;
      scope?: 'single' | 'all';
      dataInstancia?: string;
    }) => apiDeletarVisita(visitaId, scope, dataInstancia),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['visitas'] });

      const mensagem =
        variables.scope === 'all'
          ? 'Série deletada com sucesso!'
          : variables.scope === 'single'
          ? 'Ocorrência excluída com sucesso!'
          : 'Visita deletada com sucesso!';

      toast.success(mensagem);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao deletar visita');
    },
  });

  function handleDeletar() {
    const idReal = visita.id!.toString().split('-')[0];

    if (isSerieRecorrente) {
      // Para séries: usar a opção selecionada
      const dataInstancia = opcao === 'single' ? visita.data_visita : undefined;
      deletarMutation.mutate({
        visitaId: parseInt(idReal),
        scope: opcao,
        dataInstancia,
      });
    } else {
      // Para visitas normais: deletar direto
      deletarMutation.mutate({ visitaId: parseInt(idReal) });
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Trash className='mr-2 h-4 w-4 cursor-pointer hover:text-red-600' />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isSerieRecorrente
              ? 'Deletar evento recorrente'
              : 'Deletar visita?'}
          </DialogTitle>
          <DialogDescription>
            {isSerieRecorrente
              ? 'Escolha como deseja deletar este evento:'
              : 'Esta ação não pode ser desfeita.'}
          </DialogDescription>
        </DialogHeader>

        {isSerieRecorrente && (
          <RadioGroup
            value={opcao}
            onValueChange={(v) => setOpcao(v as 'single' | 'all')}
          >
            <div className='flex items-center space-x-2 p-3 border rounded hover:bg-gray-50 dark:hover:bg-gray-800'>
              <RadioGroupItem value='single' id='single' />
              <Label htmlFor='single' className='flex-1 cursor-pointer'>
                <div className='font-medium'>Apenas esta ocorrência</div>
                <div className='text-sm text-muted-foreground'>
                  Remove apenas este evento específico
                </div>
              </Label>
            </div>
            <div className='flex items-center space-x-2 p-3 border rounded hover:bg-gray-50 dark:hover:bg-gray-800'>
              <RadioGroupItem value='all' id='all' />
              <Label htmlFor='all' className='flex-1 cursor-pointer'>
                <div className='font-medium'>Toda a série</div>
                <div className='text-sm text-muted-foreground'>
                  Remove todos os eventos desta série
                </div>
              </Label>
            </div>
          </RadioGroup>
        )}

        <DialogFooter>
          <DialogClose asChild>
            <Button variant='outline' disabled={deletarMutation.isPending}>
              Cancelar
            </Button>
          </DialogClose>
          <Button
            variant='destructive'
            onClick={handleDeletar}
            disabled={deletarMutation.isPending}
          >
            {deletarMutation.isPending ? 'Deletando...' : 'Deletar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
