'use client';

import { useEffect, useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Send, Loader2, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ChatbotIA() {
  const [open, setOpen] = useState(false);
  const [pergunta, setPergunta] = useState('');
  const [chat, setChat] = useState<
    { pergunta: string; resposta: string; timestamp: string }[]
  >([
    {
      pergunta: '',
      resposta:
        'Olá! Eu sou o Peri, seu assistente para prestadores de serviço. Posso ajudar com dúvidas, consultas e informações sobre suas visitas e agendamentos.',
      timestamp: new Date().toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    },
  ]);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  const mutation = useMutation({
    mutationFn: async (mensagem: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/ia/perguntar`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            pergunta: mensagem,
            tenant_id: sessionStorage.getItem('tenant_id'),
          }),
        }
      );
      const data = await res.json();
      return data.resposta;
    },
    onSuccess: (resposta) => {
      const timestamp = new Date().toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      });
      setChat((prev) => [...prev, { pergunta, resposta, timestamp }]);
      setPergunta('');
    },
  });

  const handlePerguntar = () => {
    if (!pergunta.trim()) return;
    mutation.mutate(pergunta);
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
    if (open && chat.length === 0) {
      setChat([
        {
          pergunta: '',
          resposta:
            'Olá! Eu sou o Peri, seu assistente para prestadores de serviço. Posso ajudar com dúvidas, consultas e informações sobre suas visitas e agendamentos.',
          timestamp: new Date().toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
          }),
        },
      ]);
    }
  }, [chat, mutation.isPending, open]);

  return (
    <div>
      {/* Botão flutuante */}
      <button
        onClick={() => setOpen(!open)}
        className='fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg'
      >
        <Bot />
      </button>

      {/* Janela de chat */}
      {open && (
        <div className='fixed bottom-24 right-6 z-50 w-96 bg-gray-900 text-white shadow-xl border border-gray-700 rounded-lg flex flex-col'>
          <div className='p-4 border-b border-gray-700 font-semibold text-lg flex items-center gap-2'>
            <Bot size={20} /> Peri
          </div>

          <div
            ref={chatContainerRef}
            className='p-4 space-y-4 overflow-auto max-h-80 text-sm'
          >
            {chat.map((c, i) => (
              <div key={i} className='space-y-2'>
                {/* Mensagem do usuário */}
                <div className='flex justify-end items-end gap-2'>
                  <div className='text-right space-y-1'>
                    <div className='bg-blue-600 text-white p-2 rounded-xl rounded-br-none max-w-xs'>
                      {c.pergunta}
                    </div>
                    <div className='text-xs text-gray-400'>{c.timestamp}</div>
                  </div>
                  <User size={20} className='text-blue-400' />
                </div>

                {/* Resposta do bot */}
                <div className='flex items-end gap-2'>
                  <Bot size={20} className='text-green-400' />
                  <div className='space-y-1'>
                    <div className='bg-gray-800 text-gray-100 p-2 rounded-xl rounded-bl-none max-w-xs'>
                      {c.resposta}
                    </div>
                    <div className='text-xs text-gray-400'>{c.timestamp}</div>
                  </div>
                </div>
              </div>
            ))}

            {mutation.isPending && (
              <div className='flex items-center gap-2 text-gray-400'>
                <Loader2 className='animate-spin' size={16} /> Processando...
              </div>
            )}
          </div>

          <div className='flex gap-2 p-4 border-t border-gray-700 bg-gray-800'>
            <Input
              placeholder='Pergunte algo...'
              value={pergunta}
              onChange={(e) => setPergunta(e.target.value)}
              className='flex-1 bg-gray-700 text-white placeholder-gray-400 border-none focus:ring-2 focus:ring-blue-500'
              onKeyDown={(e) => e.key === 'Enter' && handlePerguntar()}
            />
            <Button
              onClick={handlePerguntar}
              disabled={mutation.isPending}
              className='bg-blue-600 hover:bg-blue-700 text-white'
            >
              {mutation.isPending ? (
                <Loader2 className='animate-spin' size={16} />
              ) : (
                <Send size={16} />
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
