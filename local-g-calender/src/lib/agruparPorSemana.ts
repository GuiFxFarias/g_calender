import { format, startOfWeek, endOfWeek } from 'date-fns';
import { VisitaComAnexoPayload } from '@/types/VisitaComPayload';

interface SemanaResumo {
  semana: string; // intervalo com datas reais
  visitas: number;
  valor: number;
}

export function agruparPorSemana(
  visitas: VisitaComAnexoPayload[]
): SemanaResumo[] {
  const semanas: Record<string, SemanaResumo> = {};

  visitas.forEach((visita) => {
    const data = new Date(visita.data_visita);
    const inicioSemana = startOfWeek(data, { weekStartsOn: 0 }); // 👈 domingo
    const fimSemana = endOfWeek(data, { weekStartsOn: 0 });

    const key = `${format(inicioSemana, 'dd/MM')} - ${format(
      fimSemana,
      'dd/MM'
    )}`;

    if (!semanas[key]) {
      semanas[key] = { semana: key, visitas: 0, valor: 0 };
    }

    semanas[key].visitas += 1;
    if (visita.status === 'pago') {
      semanas[key].valor += parseFloat(String(visita.preco));
    }
  });

  return Object.values(semanas);
}
