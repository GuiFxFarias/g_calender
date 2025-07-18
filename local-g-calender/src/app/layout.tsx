'use client';

import './globals.css';
import Query from './layoutCliente';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
// import LoginPage from './(auth)/login/page';
import { Menu, ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Logo from '../../public/img/Gtech.png';
import {
  Calendar as CalendarIcon,
  Users as UsersIcon,
  BarChart as BarChartIcon,
} from 'lucide-react';
import LandingPage from './page';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Detectar se é mobile baseado no tamanho da tela
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const noSidebarRoutes = [
    '/',
    '/login',
    '/register',
    '/redefinir-senha',
    '/esqueci-senha',
  ];

  const shouldShowSidebar = !noSidebarRoutes.includes(pathname);
  const drawerCloseRef = React.useRef<HTMLButtonElement>(null);

  const NavigationLinks = ({
    className = '',
    closeDrawer = () => {},
    isCollapsed = false,
  }: {
    className?: string;
    closeDrawer?: () => void;
    isCollapsed?: boolean;
  }) => (
    <nav className={`space-y-2 ${className}`}>
      <Link href='/calendar' onClick={closeDrawer}>
        <Button variant='ghost' className='w-full justify-start gap-2'>
          <CalendarIcon size={20} />
          {!isCollapsed && 'Calendário'}
        </Button>
      </Link>
      <Link href='/dashboard' onClick={closeDrawer}>
        <Button variant='ghost' className='w-full justify-start gap-2'>
          <BarChartIcon size={20} />
          {!isCollapsed && 'Dashboard'}
        </Button>
      </Link>
      <Link href='/clientes' onClick={closeDrawer}>
        <Button variant='ghost' className='w-full justify-start gap-2'>
          <UsersIcon size={20} />
          {!isCollapsed && 'Clientes'}
        </Button>
      </Link>
      <Link href='/mensagens-programadas' onClick={closeDrawer}>
        <Button variant='ghost' className='w-full justify-start gap-2'>
          <MessageCircle size={20} />
          {!isCollapsed && 'Mensagens Programadas'}
        </Button>
      </Link>
    </nav>
  );

  const LogoutButton = ({ className = '' }) => (
    <Button
      variant='destructive'
      className={`w-full ${className}`}
      onClick={async () => {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/logout`, {
          method: 'POST',
          credentials: 'include',
        });
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('tenant_id');
        sessionStorage.removeItem('usuarioId');
        sessionStorage.removeItem('acessoLiberado');
        sessionStorage.removeItem('usuarioEmail');
        window.location.href = '/';
      }}
    >
      Logout
    </Button>
  );

  return (
    <Query>
      <html lang='pt-br' className='overflow-y-hidden h-screen'>
        <body className='antialiased flex flex-col min-h-screen w-full'>
          {/* Header para mobile */}
          {shouldShowSidebar && isMobile && (
            <header className='sticky top-0 z-40 border-b bg-background px-4 py-3 flex justify-between items-center md:hidden'>
              <h1 className='text-lg font-semibold'>G-Offer</h1>
              <Drawer>
                <DrawerTrigger asChild>
                  <Button variant='outline' size='icon'>
                    <Menu className='h-5 w-5 ' />
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
                      <DrawerClose
                        asChild
                        ref={drawerCloseRef}
                        className='cursor-pointer'
                      >
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
              <aside
                className={`bg-white shadow-lg transition-all duration-300 ease-in-out ${
                  sidebarOpen ? 'w-64' : 'w-20'
                } hidden md:flex flex-col`}
              >
                {/* Topo com logo e botão de colapsar */}
                <div className='flex items-center justify-between p-4 border-b'>
                  <div className='flex items-center gap-2'>
                    <Image
                      src={Logo}
                      alt='Logo G-Tech'
                      className='w-8 h-auto'
                    />
                    {sidebarOpen && (
                      <span className='text-lg font-bold text-gray-700'>
                        G-Tech
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className='text-gray-500 hover:text-gray-700 transition cursor-pointer'
                  >
                    {sidebarOpen ? (
                      <ChevronLeft size={20} />
                    ) : (
                      <ChevronRight size={20} />
                    )}
                  </button>
                </div>

                <div className='flex-1 p-4'>
                  <NavigationLinks isCollapsed={!sidebarOpen} />
                </div>

                <div className='p-4 border-t'>
                  <LogoutButton />
                </div>
              </aside>
            )}

            <main className='flex-1 overflow-y-auto'>
              {pathname === '/' ? <LandingPage /> : children}
            </main>
          </div>
        </body>
      </html>
    </Query>
  );
}
