export function brl(valor: number): string {
  return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function tempoRelativo(dataIso: string, agora: number = Date.now()): string {
  const minutos = Math.floor((agora - new Date(dataIso).getTime()) / 60000);
  if (minutos < 1) return 'agora';
  if (minutos < 60) return `há ${minutos} min`;
  const horas = Math.floor(minutos / 60);
  return `há ${horas} h`;
}
