import { Suspense } from 'react';
import LoginPageComponente from './loginPage';

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <LoginPageComponente />
    </Suspense>
  );
}
