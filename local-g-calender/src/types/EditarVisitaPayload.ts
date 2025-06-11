export type EditarVisitaPayload = {
  id?: number;
  preco: number;
  status: 'pendente_visita' | 'pendente_recebimento' | 'pago' | 'cancelado';
  novosArquivos?: FileList | null;
};
