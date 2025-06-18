'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FormattedInput } from '@/components/ui/patternFormatComp';
import { ClientePayload } from '@/types/Cliente';
import { apiCriarCliente } from './api/apiCriarCliente';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { Input } from '@/components/ui/input';

const formSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  telefone: z.string().min(1, 'Telefone é obrigatório'),
  endereco: z.string().optional(),
});

export default function ClienteFormMini() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: '',
      telefone: '',
      endereco: '',
    },
  });

  const queryClient = useQueryClient();

  const onSubmit = async (values: ClientePayload) => {
    try {
      await apiCriarCliente({
        nome: values.nome,
        telefone: values.telefone,
        endereco: values.endereco,
      });

      toast.success('Cliente criado com sucesso!');
      form.reset();
      await queryClient.refetchQueries({ queryKey: ['clientes'] });
    } catch {
      toast.error('Erro ao criar cliente');
    }
  };

  return (
    <Card className='w-full max-w-md mx-auto mt-8'>
      <CardContent className='p-6'>
        <h2 className='text-xl font-semibold mb-6 text-center'>Novo Cliente</h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='nome'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <input
                      className='input input-bordered w-full'
                      {...field}
                      placeholder='Ex: João Silva'
                    />
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
              name='endereco'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Endereço</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Rua Exemplo, 123 - Bairro' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type='submit' className='w-full cursor-pointer'>
              Cadastrar Cliente
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
