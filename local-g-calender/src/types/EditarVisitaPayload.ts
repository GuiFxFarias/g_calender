export type EditarVisitaPayload = {
  id?: number;
  cliente_id?: number;
  preco: number;
  status: 'pendente_visita' | 'pendente_recebimento' | 'pago' | 'cancelado';
  novosArquivos?: FileList | null;
};
