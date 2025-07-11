'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { ClientePayload } from '@/types/Cliente';
import { FormattedInput } from '@/components/ui/patternFormatComp';
import { Pen } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiBuscarClientePorId } from '../calendar/api/apiBuscaClienteId';
import { apiEditarCliente } from './api/apiEditarCliente';

const formSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  telefone: z.string().min(1, 'Telefone é obrigatório'),
  endereco: z.string().optional(),
  email: z.string(),
});

interface EditarClienteDialogProps {
  clienteId: number;
}

export function EditarClienteDialog({ clienteId }: EditarClienteDialogProps) {
  const form = useForm<ClientePayload>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: '',
      telefone: '',
      endereco: '',
      email: '',
    },
  });

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['cliente', clienteId],
    queryFn: () => apiBuscarClientePorId(clienteId),
  });

  useEffect(() => {
    if (data) {
      form.reset({
        nome: data.nome,
        telefone: data.telefone,
        endereco: data.endereco || '',
        email: data.email,
      });
    }
  }, [data, form]);

  const { mutate: editarCliente, isPending } = useMutation({
    mutationFn: (dados: ClientePayload) => apiEditarCliente(clienteId, dados),
    onSuccess: () => {
      toast.success('Cliente atualizado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
    },
    onError: (error) => {
      const msg = error?.message || 'Erro ao atualizar cliente';
      toast.error(msg);
    },
  });

  const onSubmit = (values: ClientePayload) => {
    editarCliente(values);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Pen className='size-7 cursor-pointer hover:bg-zinc-200 p-1 rounded-md transition-all' />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Cliente</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <p>Carregando dados do cliente...</p>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              <FormField
                control={form.control}
                name='nome'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder='Ex: João Silva' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='telefone'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <FormattedInput
                        {...field}
                        format='(##) #####-####'
                        onValueChange={(values: { value: unknown }) => {
                          field.onChange(values.value);
                        }}
                        placeholder='(11) 91234-5678'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder='email@exemplo.com' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='endereco'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Endereço</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder='Rua Exemplo, 123 - Bairro'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type='submit'
                className='w-full cursor-pointer'
                disabled={isPending}
              >
                Salvar Alterações
              </Button>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
