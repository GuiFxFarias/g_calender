// Exemplo de como usar no componente
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

export default function DeletarVisitaDialog({
  visita,
}: {
  visita: VisitaComAnexoPayload;
}) {
  const queryClient = useQueryClient();

  const deletarMutation = useMutation({
    mutationFn: ({ visitaId, scope }: { visitaId: number; scope?: 'all' }) =>
      apiDeletarVisita(visitaId, scope),
    onSuccess: (data, variables) => {
      // Invalidar queries para recarregar a lista
      queryClient.invalidateQueries({ queryKey: ['visitas'] });

      // Toast de sucesso
      const mensagem =
        variables.scope === 'all'
          ? 'Série deletada com sucesso!'
          : 'Visita deletada com sucesso!';
      toast.success(mensagem);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao deletar visita');
    },
  });

  function handleDeletar() {
    const idReal = visita.id!.toString().split('-')[0];

    const scope = visita.is_recorrente === 1 ? 'all' : undefined;

    deletarMutation.mutate({ visitaId: parseInt(idReal), scope });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Trash className='mr-2 h-4 w-4 cursor-pointer' />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {visita.recorrencia ? 'Deletar série completa?' : 'Deletar visita?'}
          </DialogTitle>
          <DialogDescription>
            {visita.recorrencia
              ? 'Isso vai deletar TODAS as ocorrências desta série. Esta ação não pode ser desfeita.'
              : 'Esta ação não pode ser desfeita.'}
          </DialogDescription>
        </DialogHeader>
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
