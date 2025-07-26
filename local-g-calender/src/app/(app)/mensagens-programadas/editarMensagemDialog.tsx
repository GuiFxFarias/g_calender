'use client';

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Pencil } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MensagemProgramada } from '@/types/MensagemProgramada';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import * as z from 'zod';
import { apiEditarMensagemProgramada } from './api/apiEditarMensagem';
import { Switch } from '@/components/ui/switch';

const editarMensagemSchema = z.object({
  texto: z.string().min(1, 'Mensagem obrigatória'),
  proxima_data_envio: z.string().min(1, 'Data obrigatória'),
  dias_intervalo: z.coerce.number().min(1, 'Número inválido'),
  ativo: z.boolean(),
});

type EditarMensagemData = z.infer<typeof editarMensagemSchema>;

interface Props {
  mensagem: MensagemProgramada;
}

export function EditarMensagemDialog({ mensagem }: Props) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const form = useForm<EditarMensagemData>({
    resolver: zodResolver(editarMensagemSchema),
    defaultValues: {
      texto: mensagem.texto,
      proxima_data_envio: mensagem.proxima_data_envio.slice(0, 16),
      dias_intervalo: mensagem.dias_intervalo,
      ativo: !!mensagem.ativo,
    },
  });

  const { mutate: editarMensagem, isPending } = useMutation({
    mutationFn: (data: Partial<MensagemProgramada>) =>
      apiEditarMensagemProgramada(mensagem.id, {
        texto: data.texto,
        proxima_data_envio: new Date(data.proxima_data_envio!).toISOString(),
        dias_intervalo: data.dias_intervalo,
        ativo: !!data.ativo,
        cliente_id: mensagem.cliente_id,
      }),
    onSuccess: () => {
      toast.success('Mensagem editada com sucesso');
      queryClient.invalidateQueries({ queryKey: ['mensagensProgramadas'] });
      setOpen(false);
    },
    onError: () => toast.error('Erro ao editar mensagem'),
  });

  function onSubmit(data: EditarMensagemData) {
    console.log(data.proxima_data_envio);
    editarMensagem(data);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <span>
          <Pencil className='text-blue-500 hover:text-blue-700' size={20} />
        </span>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Mensagem</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='texto'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mensagem</FormLabel>
                  <FormControl>
                    <Textarea className='resize-none' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='proxima_data_envio'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de envio</FormLabel>
                  <FormControl>
                    <Input type='datetime-local' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='dias_intervalo'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dias de intervalo</FormLabel>
                  <FormControl>
                    <Input type='number' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='ativo'
              render={({ field }) => (
                <FormItem className='flex flex-row items-center justify-between'>
                  <FormLabel>Ativo</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type='submit' disabled={isPending}>
                {isPending ? 'Salvando...' : 'Salvar'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
