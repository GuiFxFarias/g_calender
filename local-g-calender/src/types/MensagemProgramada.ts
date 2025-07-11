export interface MensagemProgramada {
  id: number;
  cliente_id: number;
  nome_cliente: string;
  telefone: string;
  texto: string;
  dias_intervalo: number;
  ultima_data_envio: string;
  proxima_data_envio: string;
  ativo: boolean;
}
