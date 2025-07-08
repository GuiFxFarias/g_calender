import ListaClientes from './listaClientes';
import ClienteFormMini from './novoClienteForm';

export default function DashboardPage() {
  return (
    <div className='min-h-screen px-4 md:px-8 py-10 bg-gray-50'>
      <div className='max-w-6xl mx-auto grid grid-cols-1'>
        {/* Única coluna com tudo centralizado */}
        <div className='bg-white rounded-2xl shadow-lg p-6'>
          <h2 className='text-xl font-bold text-zinc-800 mb-4 border-b pb-2'>
            Clientes
          </h2>

          {/* Formulário inserido acima da lista */}
          <div className='mb-6'>
            <ClienteFormMini />
          </div>

          <div className='max-h-[600px] overflow-y-auto custom-scroll'>
            <ListaClientes />
          </div>
        </div>
      </div>
    </div>
  );
}
