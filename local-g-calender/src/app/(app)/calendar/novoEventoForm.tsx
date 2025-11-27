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
import { Tag } from '@/types/Tag';
import { apiListarTags } from './api/apiListarTags';
import { apiVincularTags } from './api/apiVincularTags';
import { apiCriarTag } from './api/apiCriarTag';
import TagSelector from '@/components/tagSelector';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

const FREQS = ['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'] as const;
const ENDINGS = ['NEVER', 'UNTIL', 'COUNT'] as const;
const WEEK_DAYS = ['0', '1', '2', '3', '4', '5', '6'] as const;

const recorrenciaSchema = z.object({
  freq: z.enum(FREQS).optional(),
  intervalo: z.number().int().min(1).default(1).optional(),
  dias_semana: z.array(z.enum(WEEK_DAYS)).optional(),
  fim_tipo: z.enum(ENDINGS).default('NEVER').optional(),
  fim_data: z.string().optional().nullable(),
  fim_qtd: z.number().int().min(1).optional().nullable(),
});

export const formSchema = z.object({
  cliente_id: z.coerce.number(),
  nome_cliente: z.string().optional(),
  telefone: z.string().optional(),
  data_visita: z.string().min(1),
  hora_visita: z.string().min(1),
  preco: z.coerce.number(),
  descricao: z.string().min(1),
  status: z.enum([
    'pendente_visita',
    'pendente_recebimento',
    'pago',
    'cancelado',
  ]),
  anexos: z.any().optional(),
  recorrente: z.boolean(),
  recorrencia: recorrenciaSchema.optional().nullable(),
});

export type Freq = (typeof FREQS)[number];
export type Ending = (typeof ENDINGS)[number];
export type WeekDay = (typeof WEEK_DAYS)[number];

const isFreq = (v: string): v is Freq =>
  (FREQS as readonly string[]).includes(v);
const isEnding = (v: string): v is Ending =>
  (ENDINGS as readonly string[]).includes(v);
const isWeekDayArray = (arr: string[]): arr is WeekDay[] =>
  arr.every((d) => WEEK_DAYS.includes(d as WeekDay));

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
  const [, setTagsDisponiveis] = useState<Tag[]>([]);
  const [tagsSelecionadas, setTagsSelecionadas] = useState<number[]>([]);
  const [novaTag] = useState('');

  useEffect(() => {
    apiListarTags()
      .then(setTagsDisponiveis)
      .catch(() => toast.error('Erro ao buscar tags'));
  }, []);

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
      // novos:
      recorrente: false,
      recorrencia: null,
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
      const corpo = {
        cliente_id: clienteIdFinal,
        data_visita: `${values.data_visita}T${values.hora_visita}`,
        preco: values.preco,
        descricao: values.descricao,
        status: values.status,
        anexos: values.anexos,
        ...(values.recorrencia && {
          recorrencia: {
            freq: values.recorrencia.freq,
            intervalo: values.recorrencia.intervalo,
            dias_semana: values.recorrencia.dias_semana,
            fim_tipo: values.recorrencia.fim_tipo,
            fim_data: values.recorrencia.fim_data || undefined,
            fim_qtd: values.recorrencia.fim_qtd || undefined,
          },
        }),
      };

      const visitaId = await apiCriarVisitaComAnexo(corpo);

      // tags (seu fluxo atual)
      let novaTagId: number | null = null;
      if (novaTag.trim() !== '') {
        try {
          novaTagId = await apiCriarTag(novaTag.trim());
        } catch {
          toast.error('Erro ao criar nova tag');
        }
      }

      const todasTags = [
        ...tagsSelecionadas,
        ...(novaTagId ? [novaTagId] : []),
      ];
      if (todasTags.length > 0) {
        await apiVincularTags(visitaId, todasTags);
      }

      toast.success('Evento criado com sucesso!');
      setTimeout(
        () => toast.success('Entre no evento e programe sua mensagem!'),
        2000
      );
      form.reset();
      await queryClient.refetchQueries({ queryKey: ['visitas-mensal'] });
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
                    {clientes.length > 0 ? (
                      clientes.map((cliente) => (
                        <SelectItem key={cliente.id} value={String(cliente.id)}>
                          {cliente.nome}
                        </SelectItem>
                      ))
                    ) : (
                      <div className='px-4 py-2 text-sm text-muted-foreground'>
                        Ainda não possui um cliente cadastrado
                      </div>
                    )}
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

        {/* ====== RECORRÊNCIA (shadcn) ====== */}
        <FormField
          control={form.control}
          name='recorrente'
          render={({ field }) => (
            <FormItem className='mt-2'>
              <div className='flex items-center gap-2'>
                <Checkbox
                  checked={!!field.value}
                  onCheckedChange={(v) => {
                    const on = !!v;
                    field.onChange(on);
                    form.setValue(
                      'recorrencia',
                      on
                        ? {
                            freq: 'WEEKLY',
                            intervalo: 1,
                            dias_semana: ['1'],
                            fim_tipo: 'NEVER',
                          }
                        : null
                    );
                  }}
                />
                <FormLabel>Repetir</FormLabel>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.watch('recorrente') && (
          <div className=''>
            {/* Frequência */}
            <div className='space-y-1'>
              <FormLabel>Frequência</FormLabel>
              <Select
                value={form.watch('recorrencia')?.freq ?? 'WEEKLY'}
                onValueChange={(val) => {
                  if (isFreq(val)) form.setValue('recorrencia.freq', val); // val: Freq
                }}
              >
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Selecione' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='DAILY'>Diária</SelectItem>
                  <SelectItem value='WEEKLY'>Semanal</SelectItem>
                  <SelectItem value='MONTHLY'>Mensal</SelectItem>
                  <SelectItem value='YEARLY'>Anual</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Intervalo */}
            <div className='space-y-1'>
              <FormLabel>Intervalo</FormLabel>
              <Input
                type='number'
                min={1}
                value={form.watch('recorrencia')?.intervalo ?? 1}
                onChange={(e) =>
                  form.setValue(
                    'recorrencia.intervalo',
                    Math.max(1, Number(e.target.value) || 1)
                  )
                }
              />
              <p className='text-xs text-muted-foreground'>
                1 = toda semana, 2 = a cada 2 semanas
              </p>
            </div>

            {/* Término */}
            <div className='space-y-1'>
              <FormLabel>Término</FormLabel>
              <Select
                value={form.watch('recorrencia')?.fim_tipo ?? 'NEVER'}
                onValueChange={(val) => {
                  if (isEnding(val)) form.setValue('recorrencia.fim_tipo', val); // val: Ending
                }}
              >
                <SelectTrigger className='w-full'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='NEVER'>Nunca</SelectItem>
                  <SelectItem value='UNTIL'>Até uma data</SelectItem>
                  <SelectItem value='COUNT'>Após X ocorrências</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Dias da semana (se semanal) */}
            {form.watch('recorrencia')?.freq === 'WEEKLY' && (
              <div className='flex flex-wrap'>
                <FormLabel className='mt-2'>Dias da semana</FormLabel>
                <ToggleGroup
                  className='flex flex-wrap mt-2'
                  type='multiple'
                  value={form.watch('recorrencia')?.dias_semana ?? []}
                  onValueChange={(values) => {
                    const v = (values ?? []) as string[];
                    if (isWeekDayArray(v))
                      form.setValue('recorrencia.dias_semana', v); // v: WeekDay[]
                  }}
                >
                  {[
                    ['0', 'Dom'],
                    ['1', 'Seg'],
                    ['2', 'Ter'],
                    ['3', 'Qua'],
                    ['4', 'Qui'],
                    ['5', 'Sex'],
                    ['6', 'Sáb'],
                  ].map(([val, lab]) => (
                    <ToggleGroupItem
                      key={val}
                      value={val}
                      className='data-[state=on]:bg-foreground data-[state=on]:text-background px-3 py-1 rounded-md'
                    >
                      {lab}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </div>
            )}

            {/* UNTIL */}
            {form.watch('recorrencia')?.fim_tipo === 'UNTIL' && (
              <FormField
                control={form.control}
                name='recorrencia.fim_data'
                render={({ field }) => (
                  <FormItem className='space-y-1 mt-2'>
                    <FormLabel>Data final</FormLabel>
                    <FormControl>
                      <Input
                        type='date'
                        className='w-full'
                        {...field}
                        value={
                          field.value
                            ? new Date(field.value).toISOString().split('T')[0]
                            : ''
                        }
                        onChange={(e) =>
                          field.onChange(
                            e.target.value
                              ? new Date(e.target.value).toISOString()
                              : null
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* COUNT */}
            {form.watch('recorrencia')?.fim_tipo === 'COUNT' && (
              <div className='space-y-1'>
                <FormLabel>Quantidade</FormLabel>
                <Input
                  type='number'
                  min={1}
                  value={form.watch('recorrencia')?.fim_qtd ?? ''}
                  onChange={(e) =>
                    form.setValue(
                      'recorrencia.fim_qtd',
                      e.target.value
                        ? Math.max(1, Number(e.target.value))
                        : null
                    )
                  }
                />
              </div>
            )}
          </div>
        )}
        {/* ====== /RECORRÊNCIA ====== */}

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
        <TagSelector value={tagsSelecionadas} onChange={setTagsSelecionadas} />

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
            {arquivosSelecionados.map((file) => (
              <li key={`${file.name}-${file.size}`}>{file.name}</li>
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
