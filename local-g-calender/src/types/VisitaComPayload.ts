import { Tag } from './Tag';

export type VisitaComAnexoPayload = {
  id?: number;
  cliente_id?: number;
  data_visita: string;
  preco: number;
  descricao: string;
  status: 'pendente_visita' | 'pendente_recebimento' | 'pago' | 'cancelado';
  anexos?: FileList | null;
  tags?: Tag[];
  recorrencia?: {
    freq?: string;
    intervalo?: number;
    dias_semana?: string[];
    fim_tipo?: string;
    fim_data?: string;
    fim_qtd?: number;
  };
};
