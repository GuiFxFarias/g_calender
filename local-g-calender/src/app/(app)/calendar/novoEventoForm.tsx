import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { z } from 'zod';

const formSchema = z.object({
  data: z.string().min(1, 'Data obrigatória'),
  hora: z.string().min(1, 'Hora obrigatória'),
  cliente: z.string().min(1, 'Cliente obrigatório'),
  servico: z.string().min(1, 'Serviço obrigatório'),
});

type FormData = z.infer<typeof formSchema>;

export default function EventoForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: FormData) => {
    console.log('Novo Evento:', data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      <div className='space-y-2'>
        <Label htmlFor='data'>Data</Label>
        <Input type='date' id='data' {...register('data')} />
        {errors.data && (
          <p className='text-sm text-red-500'>{errors.data.message}</p>
        )}
      </div>

      <div className='space-y-2'>
        <Label htmlFor='hora'>Horário</Label>
        <Input type='time' id='hora' {...register('hora')} />
        {errors.hora && (
          <p className='text-sm text-red-500'>{errors.hora.message}</p>
        )}
      </div>

      <div className='space-y-2'>
        <Label htmlFor='cliente'>Cliente</Label>
        <Input
          type='text'
          id='cliente'
          placeholder='Nome do cliente'
          {...register('cliente')}
        />
        {errors.cliente && (
          <p className='text-sm text-red-500'>{errors.cliente.message}</p>
        )}
      </div>

      <div className='space-y-2'>
        <Label htmlFor='servico'>Serviço</Label>
        <Input
          type='text'
          id='servico'
          placeholder='Tipo de serviço'
          {...register('servico')}
        />
        {errors.servico && (
          <p className='text-sm text-red-500'>{errors.servico.message}</p>
        )}
      </div>

      <Button type='submit' className='w-full'>
        Salvar Evento
      </Button>
    </form>
  );
}
