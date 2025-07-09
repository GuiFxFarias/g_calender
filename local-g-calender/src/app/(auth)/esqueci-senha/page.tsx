'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { apiEsqueciSenha } from './api/apiEsqueciSenha';

const formSchema = z.object({
  email: z.string().email('E-mail inválido'),
});

type FormValues = z.infer<typeof formSchema>;

export default function EsqueciSenhaPage() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '' },
  });

  const { mutate: enviarEmail, isPending } = useMutation({
    mutationFn: apiEsqueciSenha,
    onSuccess: () => {
      toast.success('Enviamos um link de redefinição para o seu e-mail!');
      form.reset();
    },
    onError: (error) => {
      const msg = error?.message || 'Erro ao enviar e-mail';
      toast.error(msg);
    },
  });

  const onSubmit = (data: FormValues) => {
    enviarEmail(data);
  };

  return (
    <div className='max-w-md mx-auto mt-20 p-6 border rounded-xl shadow-md bg-white dark:bg-zinc-900'>
      <h1 className='text-2xl font-bold mb-4 text-center'>
        Esqueci minha senha
      </h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <Input
                    type='email'
                    placeholder='Digite seu e-mail'
                    {...field}
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
            {isPending ? 'Enviando...' : 'Enviar link de redefinição'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
