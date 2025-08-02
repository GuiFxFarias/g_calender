import { Tag } from './Tag';

export type VisitaComAnexoPayload = {
  id?: number;
  cliente_id?: number;
  data_visita: string; // formato ISO completo: '2025-06-15T10:00'
  preco: number;
  descricao: string;
  status: 'pendente_visita' | 'pendente_recebimento' | 'pago' | 'cancelado';
  anexos?: FileList | null;
  tags?: Tag[];
};
