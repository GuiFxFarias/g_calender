import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  id: number;
  tenant_id: string;
  email: string;
  nome: string;
  iat: number;
  exp: number;
}

interface UsuarioCompleto extends DecodedToken {
  acesso_liberado: boolean;
}

export function useUsuario(): UsuarioCompleto | null {
  if (typeof window === 'undefined') return null;

  const token = document.cookie
    .split('; ')
    .find((row) => row.startsWith('token='))
    ?.split('=')[1];

  if (!token) return null;

  try {
    const decoded = jwtDecode<DecodedToken>(token);

    const acessoLiberadoRaw = sessionStorage.getItem('acessoLiberado');
    const acesso_liberado = acessoLiberadoRaw === 'true';

    return {
      ...decoded,
      acesso_liberado,
    };
  } catch {
    return null;
  }
}
