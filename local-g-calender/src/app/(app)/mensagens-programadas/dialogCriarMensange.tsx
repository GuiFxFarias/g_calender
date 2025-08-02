'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import FormAgendarMensagem from './formAgendarMensagem';
import { MessageCircle } from 'lucide-react';

export default function DialogAgendarMensagem() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='outline'>
          <MessageCircle className='mr-2 w-4 h-4' /> Agendar Mensagem
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-2xl'>
        <DialogHeader>
          <DialogTitle>Programar Mensagem</DialogTitle>
          <DialogDescription>
            Preencha os dados para programar o envio automático de mensagens via
            WhatsApp.
          </DialogDescription>
        </DialogHeader>
        <FormAgendarMensagem />
      </DialogContent>
    </Dialog>
  );
}
