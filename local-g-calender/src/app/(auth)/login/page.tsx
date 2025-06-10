'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const schema = z.object({
  username: z.string().min(1, 'Usuário obrigatório'),
  password: z.string().min(1, 'Senha obrigatória'),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  function onSubmit(data: FormData) {
    console.log('Login', data);
  }

  return (
    <main className='min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white p-4'>
      <Card className='w-full max-w-md shadow-xl border border-gray-200'>
        <CardHeader>
          <CardTitle className='text-center text-3xl font-bold'>
            Local G Calendar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
            <div>
              <Input
                type='text'
                placeholder='Usuário'
                {...register('username')}
              />
              {errors.username && (
                <p className='text-sm text-red-500 mt-1'>
                  {errors.username.message}
                </p>
              )}
            </div>

            <div>
              <Input
                type='password'
                placeholder='Senha'
                {...register('password')}
              />
              {errors.password && (
                <p className='text-sm text-red-500 mt-1'>
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button type='submit' className='w-full'>
              Entrar
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
