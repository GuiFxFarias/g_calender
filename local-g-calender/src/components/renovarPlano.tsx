export default function RenovarPlano() {
  return (
    <div className='max-w-lg mx-auto mt-20 text-center'>
      <h1 className='text-2xl font-bold mb-4'>Seu plano expirou</h1>
      <p className='mb-6'>Para continuar usando o sistema, renove seu plano.</p>
      <a
        href='/pagamento'
        className='bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600'
      >
        Renovar agora
      </a>
    </div>
  );
}
