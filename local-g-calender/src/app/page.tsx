'use client';

import PagamentoPage from './pagamento/pagamentoPage';
import HeroIlustracao from '@/../public/img/Hero.png';
import FluxoGrama from '@/../public/img/fLUXO.png';
import { Menu } from 'lucide-react';
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from '@/components/ui/drawer';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className='bg-white text-gray-900 font-sans h-[100vh] mx-[10vw] max-sm:m-0 max-md:bg-red-400 '>
      {/* Header */}
      <header className='flex items-center justify-between px-8 py-4 shadow-sm sticky top-0 bg-white z-50'>
        <h1 className='text-2xl font-bold text-blue-700'>G-Calendar</h1>

        {/* Desktop navigation */}
        <nav className='hidden md:flex space-x-6 text-sm font-medium'>
          <a
            href='#funcionalidades'
            className='hover:text-blue-600 transition items-center flex '
          >
            Funcionalidades
          </a>
          <a
            href='#como-funciona'
            className='hover:text-blue-600 transition items-center flex'
          >
            Como Funciona
          </a>
          <a
            href='#precos'
            className='hover:text-blue-600 transition items-center flex'
          >
            Planos
          </a>
          <Link
            href='/login'
            className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition flex items-center'
          >
            Entrar
          </Link>
        </nav>

        {/* Mobile navigation */}
        <div className='md:hidden'>
          <Drawer>
            <DrawerTrigger>
              <Menu className='text-blue-700 w-6 h-6' />
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle className='text-blue-700'>Navegação</DrawerTitle>
              </DrawerHeader>
              <div className='flex flex-col px-4 py-2 space-y-4 text-base'>
                <Link
                  href='/login'
                  className='bg-blue-600 text-white px-4 justify-center flex py-2 w-full rounded hover:bg-blue-700'
                >
                  Entrar
                </Link>
                <a href='#funcionalidades' className='hover:text-blue-600'>
                  Funcionalidades
                </a>
                <a href='#como-funciona' className='hover:text-blue-600'>
                  Como Funciona
                </a>
                <a href='#precos' className='hover:text-blue-600'>
                  Planos
                </a>

                <DrawerClose />
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </header>

      {/* Hero */}
      <section
        className='relative flex items-center h-[60vh] text-center text-white px-4 py-24 bg-blue-50'
        style={{
          backgroundImage: `url(${HeroIlustracao.src})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Overlay para escurecer a imagem */}
        <div className='absolute inset-0 bg-black  opacity-90'></div>

        {/* Conteúdo sobreposto */}
        <div className='relative z-10 max-w-4xl mx-auto'>
          <h2 className='text-4xl font-bold mb-4'>
            Organize seus agendamentos com eficiência
          </h2>
          <p className='text-lg mb-6'>
            Plataforma inteligente para prestadores de serviço gerenciarem
            visitas, clientes e lembretes
          </p>
          <div className='space-x-4'>
            <a
              href='/register'
              className='bg-white text-blue-600 px-6 py-3 rounded hover:bg-gray-200 font-medium'
            >
              Começar Grátis
            </a>
            <a
              href='#precos'
              className='border border-white text-white px-6 py-3 rounded hover:bg-white hover:text-blue-600'
            >
              Ver Planos
            </a>
          </div>
        </div>
      </section>
      {/* Funcionalidades */}
      <section id='funcionalidades' className='px-8 py-20 bg-white'>
        <h3 className='text-3xl font-bold text-center mb-12'>
          Funcionalidades
        </h3>
        <div className='grid md:grid-cols-2 items-center space-x-2 max-sm:space-x-0 max-sm:space-y-2'>
          <div className='col-span-1 space-y-2'>
            <Feature
              title='Agendamento com calendário'
              desc='Gerencie suas visitas com um calendário intuitivo e visual.'
            />
            <Feature
              title='Lembretes via WhatsApp'
              desc='Evite faltas com lembretes automáticos para seus clientes.'
            />
          </div>
          <div className='col-span-1 space-y-2'>
            <Feature
              title='Histórico de atendimentos'
              desc='Visualize fotos, valores e anotações por cliente ou visita.'
            />
            <Feature
              title='Multiusuário e seguro'
              desc='Tenha sua própria conta independente com dados protegidos.'
            />
          </div>
          {/* <Image
            src={funcionalidadeImage}
            alt='Funcionalidades do sistema'
            className='rounded-xl shadow'
          /> */}
        </div>
      </section>

      {/* Como Funciona */}
      <section
        id='como-funciona'
        className='bg-gray-50 px-8 py-20 relative'
        style={{
          backgroundImage: `url(${FluxoGrama.src})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className='absolute inset-0 bg-black  opacity-90'></div>

        <div className='relative z-10 max-w-4xl mx-auto'>
          <h3 className='text-3xl font-bold text-center mb-10 text-white'>
            Como Funciona
          </h3>
          <div className='max-w-4xl mx-auto text-lg space-y-6'>
            <Step number={1} text='Cadastre-se com seu nome e telefone' />
            <Step
              number={2}
              text='Adicione seus clientes e defina os serviços'
            />
            <Step number={3} text='Agende uma visita com poucos cliques' />
            <Step number={4} text='Deixe que o sistema cuide dos lembretes' />
          </div>
        </div>
      </section>

      {/* Planos */}
      <section id='precos' className='bg-white px-8 py-20'>
        <h3 className='text-3xl font-bold text-center mb-10'>Planos</h3>
        <PagamentoPage />
      </section>

      {/* CTA Final */}
      <section className='text-center px-8 py-20 bg-blue-700 text-white'>
        <h3 className='text-3xl font-bold mb-6'>
          Comece a organizar seus agendamentos hoje!
        </h3>
        <a
          href='/register'
          className='bg-white text-blue-700 px-6 py-3 rounded font-medium hover:bg-gray-100'
        >
          Criar Conta Grátis
        </a>
      </section>

      {/* Footer */}
      <footer className='text-center text-sm text-gray-500 bg-gray-100 py-6'>
        <p>
          © {new Date().getFullYear()} G-Calendar. Todos os direitos reservados.{' '}
          <br /> Contato:
          <span className='text-xs'>
            +55 (16) 98844-7335 | guilherme.hafarias@gmail.com
          </span>
        </p>
      </footer>
    </main>
  );
}

function Feature({ title, desc }: { title: string; desc: string }) {
  return (
    <div className='p-5 rounded-lg shadow bg-white border h-[14vh] max-xl:h-[16vh] max-md:h-[18vh]'>
      <h4 className='font-semibold text-lg mb-2 max-md:mb-0 text-blue-700'>
        {title}
      </h4>
      <p className='text-gray-600'>{desc}</p>
    </div>
  );
}

function Step({ number, text }: { number: number; text: string }) {
  return (
    <div className='flex items-start gap-4'>
      <div className='text-blue-600 font-bold text-2xl '>{number}.</div>
      <div className='text-white'>{text}</div>
    </div>
  );
}
