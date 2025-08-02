'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';
import { apiListarTags } from '@/app/(app)/calendar/api/apiListarTags';
import { apiCriarTag } from '@/app/(app)/calendar/api/apiCriarTag';
import { Tag } from '@/types/Tag';

type Props = {
  value: number[]; // ids das tags selecionadas
  onChange: (tagsSelecionadas: number[]) => void;
};

export default function TagSelector({ value, onChange }: Props) {
  const [tagsDisponiveis, setTagsDisponiveis] = useState<Tag[]>([]);
  const [novaTag, setNovaTag] = useState('');

  useEffect(() => {
    async function buscarTags() {
      try {
        const tags = await apiListarTags();
        setTagsDisponiveis(tags);
      } catch {
        toast.error('Erro ao carregar tags');
      }
    }

    buscarTags();
  }, []);

  const toggleTag = (tagId: number) => {
    if (value.includes(tagId)) {
      onChange(value.filter((id) => id !== tagId));
    } else {
      onChange([...value, tagId]);
    }
  };

  const criarOuSelecionarTag = async () => {
    if (!novaTag.trim()) {
      return toast.error('Digite o nome da tag');
    }

    const tagExistente = tagsDisponiveis.find(
      (t) => t.nome.toLowerCase() === novaTag.trim().toLowerCase()
    );

    if (tagExistente) {
      if (value.includes(tagExistente.id)) {
        toast('Tag já selecionada');
      } else {
        toggleTag(tagExistente.id);
        toast.success('Tag existente selecionada');
      }
      setNovaTag('');
      return;
    }

    try {
      const novaTagId = await apiCriarTag(novaTag.trim());
      onChange([...value, novaTagId]);
      setNovaTag('');
      toast.success('Tag criada e selecionada');

      const tagsAtualizadas = await apiListarTags();
      setTagsDisponiveis(tagsAtualizadas);
    } catch {
      toast.error('Erro ao criar a tag');
    }
  };

  const tagsFiltradas =
    novaTag.trim().length >= 1
      ? tagsDisponiveis.filter((t) =>
          t.nome.toLowerCase().includes(novaTag.toLowerCase())
        )
      : [];

  return (
    <div className='space-y-2'>
      <label className='text-sm font-medium'>Tags</label>
      <div className='flex gap-2'>
        <Input
          value={novaTag}
          onChange={(e) => setNovaTag(e.target.value)}
          placeholder='Digite ou selecione uma tag'
          onFocus={async () => {
            if (tagsDisponiveis.length === 0) {
              try {
                const tags = await apiListarTags();
                setTagsDisponiveis(tags);
              } catch {
                toast.error('Erro ao buscar tags');
              }
            }
          }}
        />
        <Button type='button' onClick={criarOuSelecionarTag}>
          Criar
        </Button>
      </div>

      {tagsFiltradas.length > 0 && (
        <div className='flex flex-wrap gap-2 mt-1'>
          {tagsFiltradas.map((tag) => {
            const selecionada = value.includes(tag.id);
            return (
              <button
                key={tag.id}
                type='button'
                onClick={() => {
                  toggleTag(tag.id);
                  setNovaTag('');
                }}
                className={`px-2 py-1 rounded text-xs border transition ${
                  selecionada
                    ? 'bg-blue-200 border-blue-500 text-blue-900'
                    : 'bg-gray-100 border-gray-300 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {tag.nome}
              </button>
            );
          })}
        </div>
      )}

      {value.length > 0 && (
        <div className='mt-2 text-sm text-muted-foreground'>
          <p className='mb-1'>Tags selecionadas:</p>
          <div className='flex flex-wrap gap-2'>
            {tagsDisponiveis
              .filter((t) => value.includes(t.id))
              .map((t) => (
                <span
                  key={t.id}
                  className='bg-blue-100 text-blue-900 px-2 py-1 rounded text-xs border border-blue-400'
                >
                  {t.nome}
                </span>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
