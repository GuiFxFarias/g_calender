'use client';

import { Calendar } from '@/components/ui/calendar';

export default function DashboardPage() {
  return (
    <main className='min-h-screen p-8 bg-white'>
      <h1 className='text-2xl font-bold mb-4'>Calendário de Visitas</h1>
      <div className='flex justify-center'>
        <Calendar mode='single' className='rounded-md border shadow p-4' />
      </div>
    </main>
  );
}
