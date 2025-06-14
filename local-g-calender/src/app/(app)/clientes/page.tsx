import ListaClientes from './listaClientes';
import ClienteFormMini from './novoClienteForm';

export default function DashboardPage() {
  return (
    <div className='min-h-screen px-4 md:px-10 py-10 bg-gray-50'>
      <div className='max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8'>
        {/* Coluna esquerda - Formulário */}
        <div>
          <h2 className='text-xl font-bold text-zinc-800 mb-4'>
            Cadastro de Cliente
          </h2>
          <ClienteFormMini />
        </div>

        {/* Coluna direita - Lista de Clientes */}
        <div>
          <h2 className='text-xl font-bold text-zinc-800 mb-4'>
            Clientes Cadastrados
          </h2>
          <ListaClientes />
        </div>
      </div>
    </div>
  );
}
