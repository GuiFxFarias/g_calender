/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { setCookie } from 'cookies-next';
import { Eye, EyeOff } from 'lucide-react'; // ou outro ícone que você usa
import toast from 'react-hot-toast';
import Link from 'next/link';

interface IForm {
  email: string;
  senha: string;
}

const loginSchema = z.object({
  email: z.string().email('Por favor, insira um email válido.'),
  senha: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres.'),
});

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<IForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      senha: '',
    },
  });

  async function onSubmit(values: IForm) {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
        method: 'POST',
        body: JSON.stringify(values),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const resJson = await res.json();

      if (res.ok) {
        const usuario = resJson.usuario;
        const { token, tenant_id, expiration } = resJson.value;

        setCookie('token', token, {
          expires: new Date(expiration),
          path: '/',
        });

        sessionStorage.setItem('token', token);
        sessionStorage.setItem('tenant_id', tenant_id);
        sessionStorage.setItem('usuarioEmail', usuario.email);

        toast.success('Login realizado');
        // router.push('/calendar');
      } else {
        toast.error(`Autenticação falhou: ${resJson?.erro}`);
      }
    } catch (error: any) {
      toast.error(`Autenticação falhou: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100'>
      <div className='w-full max-w-md p-8 space-y-6 bg-white shadow-lg rounded-lg'>
        <h1 className='text-2xl font-semibold text-center text-gray-700'>
          Login
        </h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            {/* Campo de Email */}
            <FormField
              name='email'
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type='email'
                      placeholder='Digite seu email'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Campo de Senha */}
            <FormField
              name='senha'
              control={form.control}
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <div className='relative'>
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder='Digite sua senha'
                          {...field}
                          className='pr-10'
                        />
                        <button
                          type='button'
                          onClick={() => setShowPassword((prev) => !prev)}
                          className='absolute right-2 top-2.5 text-gray-500'
                          tabIndex={-1}
                        >
                          {showPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            {/* Botão de Login */}
            <Button
              type='submit'
              className='w-full flex justify-center items-center'
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className='animate-spin mr-2' size={20} />
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </Button>
          </form>
        </Form>
        <div className='flex justify-between items-center'>
          <Link href={'/esqueci-senha'} className='text-blue-500 underline'>
            Redefinir Senha
          </Link>
          <Link href={'/register'} className='text-blue-500 underline'>
            Registrar-se
          </Link>
        </div>
      </div>
    </div>
  );
}
