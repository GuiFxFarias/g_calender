'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { useState } from 'react';
import { InputAnexosCliente } from '@/components/inputAnexoCliente';
import toast from 'react-hot-toast';
import { UploadCloud } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

const formSchema = z.object({
  anexos: z.array(z.instanceof(File)).min(1, 'Selecione ao menos um arquivo'),
});

type FormValues = z.infer<typeof formSchema>;

interface Props {
  clienteId?: number;
}

export function UploadAnexoCliente({ clienteId }: Props) {
  const [arquivos, setArquivos] = useState<File[]>([]);
  const [isSending, setIsSending] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      anexos: [],
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSending(true);

    const formData = new FormData();
    formData.append('cliente_id', String(clienteId));

    data.anexos.forEach((file) => {
      formData.append('arquivo', file);
    });

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/anexos-cliente`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const erro = await response.json();
      toast.error('Erro ao enviar anexo: ' + erro?.erro);
    } else {
      toast.success('Anexo(s) enviado(s) com sucesso!');
      await queryClient.refetchQueries({ queryKey: ['anexosCliente'] });
      form.reset();
      setArquivos([]);
    }

    setIsSending(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col'>
        <FormField
          control={form.control}
          name='anexos'
          render={() => (
            <FormItem className='mr-2'>
              <InputAnexosCliente
                arquivosSelecionados={arquivos}
                setArquivosSelecionados={(novos) => {
                  setArquivos(novos);
                  form.setValue('anexos', novos);
                }}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type='submit'
          disabled={isSending}
          className='p-1 cursor-pointer w-[150px] mt-2'
        >
          <UploadCloud />
          {isSending ? 'Enviando...' : 'Enviar Anexos'}
        </Button>
      </form>
    </Form>
  );
}
