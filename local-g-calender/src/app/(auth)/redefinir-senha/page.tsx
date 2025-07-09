'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { apiRedefinirSenha } from './api/apiRedefinirSenha';
import toast from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';

const formSchema = z
  .object({
    novaSenha: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
    confirmarSenha: z.string(),
  })
  .refine((data) => data.novaSenha === data.confirmarSenha, {
    message: 'As senhas não coincidem',
    path: ['confirmarSenha'],
  });

type FormValues = z.infer<typeof formSchema>;

export default function RedefinirSenhaPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const router = useRouter();

  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      novaSenha: '',
      confirmarSenha: '',
    },
  });

  const { mutate: redefinirSenha, isPending } = useMutation({
    mutationFn: apiRedefinirSenha,
    onSuccess: () => {
      toast.success('Senha redefinida com sucesso!');
      form.reset();
      setTimeout(() => router.push('/login'), 1500); // redireciona após 1.5s
    },
    onError: (error) => {
      const msg = error?.message || 'Erro ao redefinir senha';
      toast.error(msg);
    },
  });

  const onSubmit = (values: FormValues) => {
    redefinirSenha({
      token,
      novaSenha: values.novaSenha,
    });
  };

  return (
    <div className='max-w-md mx-auto mt-20 p-6 border rounded-xl shadow-md bg-white dark:bg-zinc-900'>
      <h1 className='text-2xl font-bold mb-4 text-center'>Redefinir Senha</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          <FormField
            control={form.control}
            name='novaSenha'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nova Senha</FormLabel>
                <div className='relative'>
                  <FormControl>
                    <Input
                      type={mostrarSenha ? 'text' : 'password'}
                      placeholder='Digite a nova senha'
                      {...field}
                    />
                  </FormControl>
                  <button
                    type='button'
                    onClick={() => setMostrarSenha(!mostrarSenha)}
                    className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500'
                  >
                    {mostrarSenha ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='confirmarSenha'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirmar Senha</FormLabel>
                <div className='relative'>
                  <FormControl>
                    <Input
                      type={mostrarConfirmar ? 'text' : 'password'}
                      placeholder='Confirme a nova senha'
                      {...field}
                    />
                  </FormControl>
                  <button
                    type='button'
                    onClick={() => setMostrarConfirmar(!mostrarConfirmar)}
                    className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500'
                  >
                    {mostrarConfirmar ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type='submit' className='w-full' disabled={isPending}>
            {isPending ? 'Redefinindo...' : 'Redefinir'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
