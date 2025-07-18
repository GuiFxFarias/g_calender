export function formatarDataLocalParaEnvio(dataInput: string) {
  const data = new Date(dataInput);

  // Corrige para horário local do Brasil (UTC-3)
  const dataBrasil = new Date(data.getTime() + 3 * 60 * 60 * 1000);

  const ano = dataBrasil.getFullYear();
  const mes = String(dataBrasil.getMonth() + 1).padStart(2, '0');
  const dia = String(dataBrasil.getDate()).padStart(2, '0');
  const hora = String(dataBrasil.getHours()).padStart(2, '0');
  const minuto = String(dataBrasil.getMinutes()).padStart(2, '0');

  return `${ano}-${mes}-${dia}T${hora}:${minuto}`;
}
