'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'react-hot-toast';
import { VisitaComAnexoPayload } from '@/types/VisitaComPayload';
import { Download, Paperclip } from 'lucide-react';
import { apiEditarVisita } from './api/apiEditarVisita';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getAnexosPorVisitaId } from './api/apiBuscarAnexoPorVisita';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FormAgendamento from './formAgendamento';

const schema = z.object({
  preco: z.coerce.number().min(0),
  status: z.enum([
    'pendente_visita',
    'pendente_recebimento',
    'pago',
    'cancelado',
  ]),
  novosArquivos: z.any().optional(),
});

type FormData = z.infer<typeof schema>;

export function VisitaDetalhesForm({
  visita,
}: {
  visita: VisitaComAnexoPayload;
}) {
  const [loading, setLoading] = useState(false);
  const [arquivosSelecionados, setArquivosSelecionados] = useState<File[]>([]);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      preco: visita.preco,
      status: visita.status,
      novosArquivos: undefined,
    },
  });

  const { data: anexos } = useQuery({
    queryKey: ['anexos', visita.id],
    queryFn: () => getAnexosPorVisitaId(visita.id),
  });

  const queryClient = useQueryClient();

  const onSubmit = async (values: FormData) => {
    try {
      setLoading(true);

      await apiEditarVisita({
        id: visita.id,
        preco: values.preco,
        status: values.status,
        novosArquivos: values.novosArquivos,
      });

      toast.success('Visita atualizada com sucesso!');
      await queryClient.refetchQueries({ queryKey: ['visitas'] });
    } catch {
      toast.error('Erro ao atualizar visita');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Tabs defaultValue='visita' className='w-full space-y-4'>
      <TabsList className='w-full grid grid-cols-2'>
        <TabsTrigger value='visita' className='cursor-pointer'>
          Informações da Visita
        </TabsTrigger>
        <TabsTrigger value='programacao' className='cursor-pointer'>
          Programar Mensagem
        </TabsTrigger>
      </TabsList>
      <TabsContent value='visita' className='space-y-4'>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          <div>
            <Label className='mb-2'>Status</Label>
            <Select
              onValueChange={(val) =>
                form.setValue('status', val as FormData['status'])
              }
              value={form.watch('status')}
            >
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Selecione o status' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='pendente_visita'>Pendente Visita</SelectItem>
                <SelectItem value='pendente_recebimento'>
                  Pendente Recebimento
                </SelectItem>
                <SelectItem value='pago'>Pago</SelectItem>
                <SelectItem value='cancelado'>Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className='mb-2'>Valor (R$)</Label>
            <Input type='number' step='0.01' {...form.register('preco')} />
          </div>

          <div>
            <Label htmlFor='upload-arquivos' className='mb-2'>
              Anexos
            </Label>
            <div className='relative inline-block'>
              <Input
                id='upload-arquivos'
                type='file'
                multiple
                onChange={(e) => {
                  const novos = e.target.files
                    ? Array.from(e.target.files)
                    : [];
                  const atualizados = [...arquivosSelecionados, ...novos];
                  setArquivosSelecionados(atualizados);
                  form.setValue('novosArquivos', atualizados);
                }}
                className='absolute inset-0 opacity-0 cursor-pointer z-10'
              />
              <Button
                variant='outline'
                type='button'
                className='flex items-center gap-2 cursor-pointer'
              >
                <Paperclip className='w-4 h-4' />
                Selecionar arquivos
              </Button>
            </div>

            {/* Lista dos arquivos adicionados */}
            <ul className='mt-2 list-disc pl-5 text-sm text-gray-600'>
              {arquivosSelecionados.map((file, index) => (
                <li key={index}>{file.name}</li>
              ))}
            </ul>
            <ul className='space-y-2 mt-2'>
              {anexos?.map((anexo) => {
                const url = anexo.arquivo_url;
                const nomeArquivo = url.split('/').pop(); // extrai apenas o nome do arquivo

                return (
                  <li
                    key={anexo.id}
                    className='flex items-center justify-between gap-2 border border-zinc-200 rounded px-3 py-2'
                  >
                    <span className='text-sm text-zinc-700 truncate'>
                      {nomeArquivo}
                    </span>

                    <a
                      href={`http://localhost:3001/baixar/${nomeArquivo}`}
                      className='flex items-center gap-1 text-blue-600 hover:underline text-sm'
                    >
                      <Download className='w-4 h-4' />
                      Baixar
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
          <Button
            type='submit'
            disabled={loading}
            className='w-full cursor-pointer'
          >
            {loading ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </form>
      </TabsContent>
      <TabsContent value='programacao'>
        <FormAgendamento visita={visita} />
      </TabsContent>
    </Tabs>
  );
}
