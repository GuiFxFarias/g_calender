'use client';

import { z } from 'zod';
import { toast } from 'react-hot-toast';
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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { apiCriarVisitaComAnexo } from './api/apiCriatVisita';
import { useEffect, useState } from 'react';
import { useWatch } from 'react-hook-form';
import { format } from 'date-fns';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { apiListarClientes, Cliente } from './api/apiListarClientes';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Label } from '@/components/ui/label';
// import { Paperclip } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { apiCriarClienteTemporario } from './api/apiCriarClienteSemCadastro';
import { Paperclip } from 'lucide-react';
import { FormattedInput } from '@/components/ui/patternFormatComp';
import { VisitaComAnexoPayload } from '@/types/VisitaComPayload';
import { apiBuscarTodasVisitas } from './api/apiBuscarTodasVisitas';
import { apiBuscarClientePorId } from './api/apiBuscaClienteId';
import { ClientePayload } from '@/types/Cliente';

const formSchema = z.object({
  cliente_id: z.coerce.number().min(0, 'Selecione o cliente').optional(),
  nome_cliente: z.string().optional(),
  telefone: z.string().optional(),
  data_visita: z.string().min(1),
  hora_visita: z.string().min(1),
  preco: z.coerce.number().min(0),
  descricao: z.string().min(3),
  status: z.enum([
    'pendente_visita',
    'pendente_recebimento',
    'pago',
    'cancelado',
  ]),
  anexos: z.any().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function EventoForm() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  useEffect(() => {
    apiListarClientes()
      .then(setClientes)
      .catch(() => toast.error('Erro ao carregar clientes'));
  }, []);
  const [clienteSemCadastro, setClienteSemCadastro] = useState<boolean>();
  const [arquivosSelecionados, setArquivosSelecionados] = useState<File[]>([]);
  const [clientesDasVisitas, setClientesDasVisitas] = useState<
    Record<number, ClientePayload>
  >({});

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cliente_id: 0,
      nome_cliente: '',
      data_visita: '',
      hora_visita: '',
      preco: 0,
      descricao: '',
      status: 'pendente_visita',
    },
  });

  const queryClient = useQueryClient();

  const onSubmit = async (values: FormValues) => {
    let clienteIdFinal = values.cliente_id;

    if (clienteSemCadastro && values.nome_cliente) {
      try {
        const novoCliente = await apiCriarClienteTemporario(
          values.nome_cliente,
          values.telefone
        );
        clienteIdFinal = novoCliente.id;
      } catch {
        toast.error('Erro ao criar cliente temporário');
        return;
      }
    }

    try {
      await apiCriarVisitaComAnexo({
        cliente_id: clienteIdFinal,
        data_visita: `${values.data_visita}T${values.hora_visita}`,
        preco: values.preco,
        descricao: values.descricao,
        status: values.status,
        anexos: values.anexos,
      });

      toast.success('Visita criada com sucesso!');
      form.reset();
      await queryClient.refetchQueries({ queryKey: ['visitas'] });
    } catch {
      toast.error('Erro ao criar visita');
    }
  };

  const { data: visitas = [] } = useQuery<VisitaComAnexoPayload[]>({
    queryKey: ['visitas'],
    queryFn: () => apiBuscarTodasVisitas(),
  });

  const dataSelecionada = useWatch({
    control: form.control,
    name: 'data_visita',
  });

  const visitasMesmoDiaHora = visitas.filter((v) => {
    const data = format(new Date(v.data_visita), 'yyyy-MM-dd');
    return dataSelecionada === data;
  });

  const clienteIdsDasVisitas = visitasMesmoDiaHora.map((v) => v.cliente_id);

  useEffect(() => {
    const buscarClientesDasVisitas = async () => {
      try {
        const idsUnicos = Array.from(
          new Set(
            clienteIdsDasVisitas.filter(
              (id): id is number => typeof id === 'number'
            )
          )
        );

        const idsNaoBuscados = idsUnicos.filter(
          (id) => !clientesDasVisitas[id]
        );

        if (idsNaoBuscados.length === 0) return;

        const resultados = await Promise.all(
          idsNaoBuscados.map((id) => apiBuscarClientePorId(id))
        );

        const novosMapeados = Object.fromEntries(
          resultados.map((c) => [c.id, c])
        );

        setClientesDasVisitas((prev) => ({
          ...prev,
          ...novosMapeados,
        }));
      } catch {
        toast.error('Erro ao buscar dados dos clientes das visitas');
      }
    };

    if (clienteIdsDasVisitas.length > 0) {
      buscarClientesDasVisitas();
    }
  }, [clienteIdsDasVisitas, clientesDasVisitas]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-4 max-w-2xl w-full mx-auto px-4'
      >
        <div className='flex space-x-2 items-center'>
          <Checkbox
            checked={clienteSemCadastro}
            onCheckedChange={(checked) => setClienteSemCadastro(!!checked)}
          />
          <Label>O cliente não possui cadastro ainda</Label>
        </div>

        {!clienteSemCadastro ? (
          <FormField
            control={form.control}
            name='cliente_id'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cliente</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  value={field.value ? String(field.value) : ''}
                >
                  <FormControl>
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Selecione um cliente' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {clientes.map((cliente) => (
                      <SelectItem key={cliente.id} value={String(cliente.id)}>
                        {cliente.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : (
          <>
            <FormField
              control={form.control}
              name='nome_cliente'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Cliente</FormLabel>
                  <FormControl>
                    <Input
                      className='w-full'
                      placeholder='Digite o nome do cliente'
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
                      className='w-full'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        <div className='flex flex-wrap gap-4'>
          <FormField
            control={form.control}
            name='data_visita'
            render={({ field }) => (
              <FormItem className='flex-1 min-w-[150px]'>
                <FormLabel>Data</FormLabel>
                <FormControl>
                  <Input type='date' className='w-full' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='hora_visita'
            render={({ field }) => (
              <FormItem className='flex-1 min-w-[150px]'>
                <FormLabel>Hora</FormLabel>
                <FormControl>
                  <Input type='time' className='w-full' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {dataSelecionada && (
          <div className='mt-2 flex flex-col w-full'>
            {visitasMesmoDiaHora.length > 0 ? (
              <>
                <p className='text-sm font-semibold mb-2 text-yellow-700'>
                  ⚠️ {visitasMesmoDiaHora.length} visita(s) já agendada(s) nesse
                  horário:
                </p>
                <div className='overflow-x-auto w-[100%] flex-col xl:flex-wrap flex gap-1 h-[14vh]'>
                  {visitasMesmoDiaHora.map((visita) => (
                    <div
                      key={visita.id}
                      className='border rounded-md xl:w-2/5 w-full px-2 shadow-sm bg-yellow-50 text-sm shrink-0'
                    >
                      <p
                        className='truncate font-semibold'
                        title={
                          visita.cliente_id &&
                          clientesDasVisitas[visita.cliente_id]?.nome
                            ? clientesDasVisitas[visita.cliente_id]?.nome
                            : 'Cliente não identificado'
                        }
                      >
                        {visita.cliente_id &&
                        clientesDasVisitas[visita.cliente_id]?.nome
                          ? clientesDasVisitas[visita.cliente_id]?.nome
                          : 'Cliente não identificado'}
                      </p>
                      <div>{format(new Date(visita.data_visita), 'HH:mm')}</div>
                      <div>R$ {visita.preco}</div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className='text-sm text-green-600'>
                ✅ Nenhuma visita marcada nesse dia.
              </p>
            )}
          </div>
        )}

        <FormField
          control={form.control}
          name='preco'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preço (R$)</FormLabel>
              <FormControl>
                <Input
                  type='number'
                  step='0.01'
                  className='w-full'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='descricao'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea
                  placeholder='Descreva o serviço...'
                  className='w-full resize-none'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
                const novos = e.target.files ? Array.from(e.target.files) : [];
                const atualizados = [...arquivosSelecionados, ...novos];
                setArquivosSelecionados(atualizados);
                form.setValue('anexos', atualizados);
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

          <ul className='mt-2 list-disc pl-5 text-sm text-gray-600'>
            {arquivosSelecionados.map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
        </div>

        <Button type='submit' className='w-full cursor-pointer'>
          Salvar Visita
        </Button>
      </form>
    </Form>
  );
}
