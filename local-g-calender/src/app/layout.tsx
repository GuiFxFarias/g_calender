'use client';

import './globals.css';
import Query from './layoutCliente';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LoginPage from './(auth)/login/page';
import { Menu } from 'lucide-react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import React, { useEffect, useState } from 'react';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);

  // Detectar se é mobile baseado no tamanho da tela
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Verificar inicialmente
    checkIsMobile();

    // Adicionar listener para o redimensionamento
    window.addEventListener('resize', checkIsMobile);

    // Remover listener ao desmontar
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Rotas sem barra lateral
  const noSidebarRoutes = ['/', '/login', '/register'];
  const shouldShowSidebar = !noSidebarRoutes.includes(pathname);
  const drawerCloseRef = React.useRef<HTMLButtonElement>(null);

  // Componente de navegação reutilizável
  const NavigationLinks = ({ className = '', closeDrawer = () => {} }) => (
    <nav className={`space-y-4 ${className}`}>
      <Link href='/calendar' className='w-full block ' onClick={closeDrawer}>
        <Button className='w-full justify-start cursor-pointer' variant='ghost'>
          Calendário
        </Button>
      </Link>
      <Link href='/clientes' className='w-full block ' onClick={closeDrawer}>
        <Button className='w-full justify-start cursor-pointer' variant='ghost'>
          Clientes
        </Button>
      </Link>
      <Link href='/dashboard' className='w-full block ' onClick={closeDrawer}>
        <Button className='w-full justify-start cursor-pointer' variant='ghost'>
          Dashboard
        </Button>
      </Link>
    </nav>
  );

  // Botão de logout reutilizável
  const LogoutButton = ({ className = '' }) => (
    <Button
      variant='destructive'
      className={`w-full ${className}`}
      onClick={async () => {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/logout`, {
          method: 'POST',
          credentials: 'include',
        });
        window.location.href = '/';
      }}
    >
      Logout
    </Button>
  );

  return (
    <Query>
      <html lang='en' className='overflow-y-hidden h-screen'>
        <body className='antialiased flex flex-col min-h-screen w-full'>
          {shouldShowSidebar && isMobile && (
            <header className='sticky top-0 z-40 border-b bg-background px-4 py-3 flex justify-between items-center md:hidden'>
              <h1 className='text-lg font-semibold'>G-Offer</h1>
              <Drawer>
                <DrawerTrigger asChild>
                  <Button variant='outline' size='icon'>
                    <Menu className='h-5 w-5' />
                    <span className='sr-only'>Menu</span>
                  </Button>
                </DrawerTrigger>
                <DrawerContent>
                  <div className='mx-auto w-full max-w-sm'>
                    <DrawerHeader>
                      <DrawerTitle>Painel</DrawerTitle>
                    </DrawerHeader>
                    <div className='p-6'>
                      <NavigationLinks
                        closeDrawer={() => drawerCloseRef.current?.click()}
                      />
                    </div>
                    <div className='p-6 pt-0'>
                      <DrawerClose asChild ref={drawerCloseRef}>
                        <LogoutButton />
                      </DrawerClose>
                    </div>
                  </div>
                </DrawerContent>
              </Drawer>
            </header>
          )}

          <div className='flex flex-1 overflow-hidden'>
            {/* Sidebar para desktop */}
            {shouldShowSidebar && !isMobile && (
              <aside className='w-64 bg-white shadow-lg hidden md:block'>
                <div className='flex flex-col justify-between h-full'>
                  <div className='p-6'>
                    <h2 className='text-2xl font-bold text-gray-700 mb-6'>
                      G-Calendar
                    </h2>
                    <NavigationLinks />
                  </div>
                  <div className='p-6'>
                    <LogoutButton />
                  </div>
                </div>
              </aside>
            )}

            <main className='flex-1 overflow-y-auto'>
              {pathname === '/' ? <LoginPage /> : children}
            </main>
          </div>
        </body>
      </html>
    </Query>
  );
}
