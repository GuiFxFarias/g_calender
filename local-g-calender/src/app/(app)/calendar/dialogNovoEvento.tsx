import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import EventoForm from './novoEventoForm';

export default function DialogNovoEvento() {
  return (
    <div>
      {/* Botão para abrir o Dialog */}
      <Dialog>
        <DialogTrigger asChild>
          <Button className='w-full cursor-pointer' variant='default'>
            + Novo Evento
          </Button>
        </DialogTrigger>

        <DialogContent className='max-md:h-[75vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>Novo Evento</DialogTitle>
          </DialogHeader>

          <EventoForm />
        </DialogContent>
      </Dialog>
    </div>
  );
}
