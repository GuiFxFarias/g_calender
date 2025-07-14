import { Suspense } from 'react';
import RedefinirSenhaPage from './redefineSenha';

export default function Page() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <RedefinirSenhaPage />
    </Suspense>
  );
}
