export interface ClientePayload {
  id?: number | undefined;
  nome: string;
  email: string;
  telefone: string;
  endereco?: string;
}
