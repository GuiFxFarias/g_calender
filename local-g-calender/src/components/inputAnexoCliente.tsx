import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Paperclip } from 'lucide-react';

interface Props {
  arquivosSelecionados: File[];
  setArquivosSelecionados: (arquivos: File[]) => void;
  onFilesChange?: (arquivos: File[]) => void; // opcional, caso use com react-hook-form
}

export function InputAnexosCliente({
  arquivosSelecionados,
  setArquivosSelecionados,
  onFilesChange,
}: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const novos = e.target.files ? Array.from(e.target.files) : [];
    const atualizados = [...arquivosSelecionados, ...novos];
    setArquivosSelecionados(atualizados);
    if (onFilesChange) onFilesChange(atualizados);
  };

  return (
    <div>
      <div className='relative inline-block mt-2'>
        <Input
          id='upload-arquivos'
          type='file'
          multiple
          onChange={handleChange}
          className='absolute inset-0 opacity-0 cursor-pointer z-10'
        />
        <Button
          variant='outline'
          type='button'
          className='flex items-center gap-2 cursor-pointer'
        >
          <Paperclip className='w-4 h-4 ' />
          Selecionar arquivos
        </Button>
      </div>

      {/* Lista dos arquivos adicionados */}
      {arquivosSelecionados.length > 0 && (
        <ul className=' text-sm text-muted-foreground flex '>
          {arquivosSelecionados.map((file, index) => (
            <li key={index}>
              <span className='text-blue-400 cursor-pointer'>{file.name}</span>{' '}
              <span className='text-blue-300'> </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
