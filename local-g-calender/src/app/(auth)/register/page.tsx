'use client';

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { apiCadastrarUsuario } from './api/apiCadastrarUsuario';
import { FormattedInput } from '@/components/ui/patternFormatComp';
import Link from 'next/link';

const formSchema = z.object({
  nome: z.string().min(3, 'Informe um nome válido'),
  email: z.string().email('E-mail inválido'),
  telefone: z.string().min(8, 'Informe um telefone válido'),
  senha: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

type FormValues = z.infer<typeof formSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: '',
      email: '',
      telefone: '',
      senha: '',
    },
  });

  const { mutate: cadastrar, isPending } = useMutation({
    mutationFn: apiCadastrarUsuario,
    onSuccess: () => {
      toast.success('Usuário cadastrado com sucesso!');
      toast.success('Redirecionando para o login');
      setTimeout(() => router.push('/login'), 1500);
    },
    onError: (error) => {
      toast.error(error?.message || 'Erro ao cadastrar usuário');
    },
  });

  const onSubmit = (values: FormValues) => {
    const agora = new Date();
    const inicioTesteFormatado = agora
      .toISOString()
      .slice(0, 19)
      .replace('T', ' ');

    cadastrar({
      ...values,
      inicio_teste_gratis: inicioTesteFormatado,
    });
  };

  return (
    <div className='max-w-md mx-auto mt-20 p-6 border rounded-xl shadow-md bg-white dark:bg-zinc-900'>
      <h1 className='text-2xl font-bold mb-4 text-center'>Criar Conta</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          <FormField
            control={form.control}
            name='nome'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder='Digite seu nome' {...field} />
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
                    type='email'
                    placeholder='exemplo@email.com'
                    {...field}
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
            name='senha'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Senha</FormLabel>
                <div className='relative'>
                  <FormControl>
                    <Input
                      type={mostrarSenha ? 'text' : 'password'}
                      placeholder='Crie uma senha'
                      {...field}
                    />
                  </FormControl>
                  <button
                    type='button'
                    onClick={() => setMostrarSenha((prev) => !prev)}
                    className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500'
                  >
                    {mostrarSenha ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type='submit' className='w-full' disabled={isPending}>
            {isPending ? 'Cadastrando...' : 'Cadastrar'}
          </Button>
        </form>
      </Form>
      <div className='justify-between flex mt-2'>
        <Link
          href='/'
          className='hover:underline text-blue-600 text-sm dark:text-blue-400'
        >
          Página inicial
        </Link>
        <Link
          href='/login'
          className='hover:underline text-blue-600 text-sm dark:text-blue-400'
        >
          Login
        </Link>
      </div>
    </div>
  );
}
