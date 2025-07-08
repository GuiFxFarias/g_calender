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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const formSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  telefone: z.string().min(1, 'Telefone é obrigatório'),
  email: z.string().min(1, 'Email é obrigatório'),
  endereco: z.string().optional(),
});

export default function ClienteFormMini() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: '',
      email: '',
      telefone: '',
      endereco: '',
    },
  });

  const queryClient = useQueryClient();

  const onSubmit = async (values: ClientePayload) => {
    try {
      await apiCriarCliente({
        nome: values.nome,
        email: values.email,
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
    <Dialog>
      <DialogTrigger asChild>
        <Button className='w-full cursor-pointer'>Novo Cliente</Button>
      </DialogTrigger>

      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle className='text-center text-xl'>
            Novo Cliente
          </DialogTitle>
        </DialogHeader>

        <Card className='shadow-none border-none'>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-4'
              >
                <FormField
                  control={form.control}
                  name='nome'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input
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
                  name='email'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-mail</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder='seuemail@email.com'
                          type='email'
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
                        <Input
                          {...field}
                          placeholder='Rua Exemplo, 123 - Bairro'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter className='flex justify-between pt-4'>
                  <DialogClose asChild>
                    <Button
                      type='button'
                      variant='outline'
                      className='w-1/2 cursor-pointer'
                    >
                      Cancelar
                    </Button>
                  </DialogClose>
                  <Button type='submit' className='w-1/2 cursor-pointer'>
                    Cadastrar
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
